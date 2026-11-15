// Teste E2E da versão web (pasta dist/). Rode antes: npm run build:web
// Uso: npm run test:web
import { existsSync, readFileSync } from "node:fs";
import { servidorEstatico, abrirNavegador, espera } from "./cdp-util.mjs";

const PORTA = 3100;
const BASE = `http://localhost:${PORTA}`;

if (!existsSync("dist/index.html")) {
  console.error("dist/ não existe. Rode antes: npm run build:web");
  process.exit(1);
}

// Dados do banco (sem executar o arquivo, que tem require de imagens)
const banco = readFileSync("banco_herois.js", "utf8");
const nomes = {};
for (const m of banco.matchAll(/id: "(\d+)",\s*nome: "([^"]+)"/g)) nomes[m[1]] = m[2];
const idCounterAamon = banco.match(/nome: "Aamon"[\s\S]*?counters: \["(\d+)"/)[1];
const nomeCounterAamon = nomes[idCounterAamon];

// Itens do menu: [texto visível, rota esperada]
const ITENS_MENU = [
  ["Torne-se um apoiador", "/apoiar"],
  ["Configurações", "/configuracoes"],
  ["Feedback", "/feedback"],
  ["Sobre", "/sobre"],
];

const servidor = await servidorEstatico("dist", PORTA);
const nav = await abrirNavegador({ porta: 9401 });

const avisos = [];
const dialogos = [];
nav.aoEvento((msg) => {
  if (msg.method === "Runtime.exceptionThrown") {
    const d = msg.params.exceptionDetails;
    avisos.push("EXCEÇÃO: " + (d.exception?.description || d.text));
  }
  if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
    avisos.push(`console.${msg.params.type}: ` + msg.params.args.map((a) => a.value ?? a.description).join(" "));
  }
  if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") {
    avisos.push("LOG: " + msg.params.entry.text + " " + (msg.params.entry.url || ""));
  }
  if (msg.method === "Page.javascriptDialogOpening") {
    dialogos.push(msg.params.message);
    nav.enviar("Page.handleJavaScriptDialog", { accept: true });
  }
});

let falhas = 0;
async function caso(descricao, fn) {
  let ok = false;
  let detalhe = "";
  try {
    ok = await fn();
  } catch (e) {
    detalhe = e.message;
  }
  if (!ok) {
    falhas++;
    detalhe ||= `rota=${await nav.rota()}`;
  }
  console.log((ok ? "PASS " : "FAIL ") + descricao + (ok ? "" : `  (${detalhe})`));
}

// a gaveta do menu é a única div com fundo #121212
const gavetaNoDom = () =>
  nav.avaliar(`!![...document.querySelectorAll("div")].find(d => getComputedStyle(d).backgroundColor === "rgb(18, 18, 18)")`);

// ---------------- Navegação ----------------
await nav.abrir(BASE + "/", 4500);
await caso("home carrega a grade", async () => (await nav.rota()) === "/" && (await nav.temTexto("Aamon")));

await caso("clicar em Aamon -> /heroi/1", async () => {
  await nav.clicarTexto("Aamon");
  return (await nav.rota()) === "/heroi/1" && (await nav.temTexto("é forte contra"));
});

await caso(`clicar no counter ${nomeCounterAamon} -> /heroi/${idCounterAamon}`, async () => {
  await nav.clicarTexto(nomeCounterAamon);
  return (await nav.rota()) === `/heroi/${idCounterAamon}`;
});

await caso("voltar 2x -> /", async () => {
  await nav.avaliar("history.back()");
  await espera(1200);
  const primeira = await nav.rota();
  await nav.avaliar("history.back()");
  await espera(1200);
  return primeira === "/heroi/1" && (await nav.rota()) === "/";
});

await caso("✕ depois de 2 heróis -> /", async () => {
  await nav.clicarTexto("Aamon");
  await nav.clicarTexto(nomeCounterAamon);
  await nav.clicarSeletor('img[src*="botao-fechar"]');
  return (await nav.rota()) === "/" && (await nav.temTexto("Aamon"));
});

// ---------------- Menu lateral ----------------
for (const [texto, rota] of ITENS_MENU) {
  await caso(`menu "${texto}" -> ${rota}`, async () => {
    await nav.clicarSeletor('img[src*="opcoes"]');
    await nav.clicarTexto(texto);
    const chegou = (await nav.rota()) === rota;
    await nav.avaliar("history.back()");
    await espera(1200);
    return chegou && (await nav.rota()) === "/";
  });
}

await caso("tocar fora da gaveta fecha o menu", async () => {
  await nav.clicarSeletor('img[src*="opcoes"]', 600);
  const abriu = await gavetaNoDom();
  const largura = await nav.avaliar("window.innerWidth");
  await nav.clicarXY(largura - 20, 400, 600);
  return abriu && !(await gavetaNoDom());
});

// ---------------- Outras rotas ----------------
await caso("/heroi/999 mostra 'Herói não encontrado'", async () => {
  await nav.abrir(BASE + "/heroi/999");
  return nav.temTexto("Herói não encontrado");
});

// ---------------- Copiar ----------------
// Todas as telas usam o BotaoCopiar: tem que confirmar na tela, sem window.alert
async function copiadoNaTela(rota, rotulo) {
  await nav.abrir(BASE + rota);
  const antes = dialogos.length;
  await nav.clicarTexto(rotulo, 500);
  return dialogos.length === antes && (await nav.temTexto("Copiado ✓"));
}
await caso("copiar em /apoiar mostra 'Copiado ✓'", () => copiadoNaTela("/apoiar", "Copiar chave"));
await caso("copiar em /sobre mostra 'Copiado ✓'", () => copiadoNaTela("/sobre", "Copiar"));
await caso("copiar em /feedback mostra 'Copiado ✓'", () => copiadoNaTela("/feedback", "Copiar"));

// ---------------- Resultado ----------------
const unicos = [...new Set(avisos)];
console.log("\nErros/avisos no console:", unicos.length ? "\n  " + unicos.join("\n  ") : "nenhum");
console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTUDO OK");

nav.fechar();
servidor.close();
process.exit(falhas || unicos.length ? 1 : 0);
