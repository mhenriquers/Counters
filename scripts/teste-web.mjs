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
const banco = readFileSync("src/dados/banco_herois.js", "utf8");
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

// ---------------- Busca ----------------
const buscaAberta = () => nav.avaliar(`!!document.querySelector("input")`);

await caso("busca aberta: tocar num herói só fecha a busca", async () => {
  await nav.clicarSeletor('img[src*="lupa"]', 600);
  const abriu = await buscaAberta();
  await nav.clicarTexto("Aamon", 600);
  const ficouNaHome = (await nav.rota()) === "/" && !(await buscaAberta());
  await nav.clicarTexto("Aamon"); // agora, sim, abre o herói
  const entrou = (await nav.rota()) === "/heroi/1";
  await nav.avaliar("history.back()");
  await espera(1200);
  return abriu && ficouNaHome && entrou;
});

await caso("busca com texto: tocar num resultado abre direto", async () => {
  await nav.clicarSeletor('img[src*="lupa"]', 600);
  await nav.enviar("Input.insertText", { text: "aam" });
  await espera(600);
  const filtrou = !(await nav.temTexto("Akai"));
  await nav.clicarTexto("Aamon");
  const entrou = (await nav.rota()) === "/heroi/1";
  await nav.avaliar("history.back()");
  await espera(1200);
  return filtrou && entrou;
});

await caso("fechar a busca pela lupa limpa o filtro", async () => {
  await nav.clicarSeletor('img[src*="lupa"]', 600);
  await nav.enviar("Input.insertText", { text: "aam" });
  await espera(600);
  const filtrou = !(await nav.temTexto("Akai"));
  await nav.clicarSeletor('img[src*="lupa"]', 600);
  return filtrou && !(await buscaAberta()) && (await nav.temTexto("Akai"));
});

await caso("busca sem resultado mostra o capacete e 'Herói não encontrado'", async () => {
  await nav.clicarSeletor('img[src*="lupa"]', 600);
  await nav.enviar("Input.insertText", { text: "zzz" });
  await espera(600);
  const aviso = await nav.temTexto("Herói não encontrado");
  const capacete = await nav.avaliar(`!!document.querySelector('img[src*="hero."]')`);
  const semBotao = !(await nav.temTexto("Voltar para a lista"));
  await nav.clicarSeletor('img[src*="lupa"]', 600); // fecha e limpa
  return aviso && capacete && semBotao;
});

await caso("busca aberta: botão do menu só fecha a busca", async () => {
  await nav.clicarSeletor('img[src*="lupa"]', 600);
  const abriu = await buscaAberta();
  await nav.clicarSeletor('img[src*="opcoes"]', 600);
  return abriu && !(await buscaAberta()) && !(await gavetaNoDom());
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

// ---------------- Idioma ----------------
await caso("Configurações: escolher English troca o idioma", async () => {
  await nav.abrir(BASE + "/configuracoes");
  await nav.clicarTexto("Idioma", 500);
  await nav.clicarTexto("English", 500);
  return (await nav.temTexto("Language")) && !(await nav.temTexto("Idioma"));
});

await caso("a escolha continua depois de recarregar", async () => {
  await nav.abrir(BASE + "/configuracoes");
  return nav.temTexto("Language");
});

await caso("voltar para Português (e continua ao recarregar)", async () => {
  await nav.clicarTexto("Language", 500);
  await nav.clicarTexto("Português", 500);
  const trocou = await nav.temTexto("Idioma");
  await nav.abrir(BASE + "/configuracoes");
  return trocou && (await nav.temTexto("Idioma"));
});

// Um segundo Chrome com o "celular" em inglês: cada tela traduzida ganha um caso aqui
const navIngles = await abrirNavegador({ porta: 9404, idioma: "en-US" });

await caso("celular em inglês abre o app em inglês", async () => {
  await navIngles.abrir(BASE + "/configuracoes");
  return navIngles.temTexto("Language");
});

await caso("inglês: Home (busca e herói não encontrado)", async () => {
  await navIngles.abrir(BASE + "/", 4500);
  await navIngles.clicarSeletor('img[src*="lupa"]', 600);
  const placeholder = await navIngles.avaliar(`document.querySelector("input").placeholder`);
  await navIngles.enviar("Input.insertText", { text: "zzz" });
  await espera(600);
  return placeholder === "Search hero..." && (await navIngles.temTexto("Hero not found"));
});

await caso("inglês: menu lateral", async () => {
  await navIngles.abrir(BASE + "/", 4500);
  await navIngles.clicarSeletor('img[src*="opcoes"]', 600);
  const textos = ["Become a supporter", "Settings", "Feedback", "About", "Version 1.0.0", "Data: official MLBB website"];
  for (const texto of textos) if (!(await navIngles.temTexto(texto))) throw new Error("faltou: " + texto);
  await navIngles.clicarTexto("Settings");
  return (await navIngles.rota()) === "/configuracoes";
});

await caso("inglês: Details (seções, classes e rodapé)", async () => {
  await navIngles.abrir(BASE + "/heroi/1"); // Aamon, Assassino
  const textos = [
    "Strong against",
    "Aamon has the advantage against these heroes",
    "Weak against",
    "These heroes have the advantage against Aamon",
    "Assassin",
    "Data collected from the official MLBB website",
  ];
  for (const texto of textos) if (!(await navIngles.temTexto(texto))) throw new Error("faltou: " + texto);
  return !(await navIngles.temTexto("Assassino"));
});

await caso("inglês: /heroi/999", async () => {
  await navIngles.abrir(BASE + "/heroi/999");
  return (
    (await navIngles.temTexto("Hero not found")) &&
    (await navIngles.temTexto("This link doesn't match any hero in the database.")) &&
    (await navIngles.temTexto("Back to the list"))
  );
});

// Confere vários textos de uma tela em inglês e que nenhum texto em português sobrou
async function telaEmIngles(rota, textos, semPortugues = []) {
  await navIngles.abrir(BASE + rota);
  for (const texto of textos) if (!(await navIngles.temTexto(texto))) throw new Error("faltou: " + texto);
  for (const texto of semPortugues) if (await navIngles.temTexto(texto)) throw new Error("sobrou: " + texto);
  return true;
}

await caso("inglês: Doações", () =>
  telaEmIngles(
    "/apoiar",
    ["Support the project", "Become a Legendary Supporter!", "Why support", "MVP of this journey", "Pix key", "Copy key", "Pix donations are voluntary"],
    ["Apoiar o projeto", "Chave Pix"],
  ),
);

await caso("inglês: contatos e botão de copiar (ui.js)", async () => {
  await telaEmIngles("/feedback", ["Send email", "Open GitHub", "Copy", "By using our contact channels"], ["Enviar e-mail"]);
  await navIngles.clicarTexto("Copy", 500);
  return navIngles.temTexto("Copied ✓");
});

await caso("inglês: Feedback", () =>
  telaEmIngles(
    "/feedback",
    ["Suggestions or bugs?", "This app was built to be a useful tool", "Contact", "Updates", "I set aside this space"],
    ["Sugestões ou erros?", "Contato", "Retorno"],
  ),
);

await caso("inglês: Sobre", () =>
  telaEmIngles(
    "/sobre",
    ["About", "Early Game", "Thanks to my friends", "It all started", "Mythical Glory", "Contact", "Legal notice", "not affiliated with", "Version 1.0.0"],
    ["Aviso legal", "Tudo começou"],
  ),
);

await caso("inglês: Configurações", () =>
  telaEmIngles(
    "/configuracoes",
    ["Settings", "Preferences", "Language", "Theme", "Default", "Privacy and usage", "Privacy policy", "Use of images and copyright", "External links"],
    ["Preferências", "Política de privacidade"],
  ),
);

await caso("inglês: e-mail de contato com o texto em inglês", async () => {
  await navIngles.abrir(BASE + "/feedback");
  // troca o window.open por um "espião" que só guarda a URL (não abre nada)
  await navIngles.avaliar(`window.__urls = []; window.open = (url) => { window.__urls.push(url); return null; }`);
  await navIngles.clicarTexto("Send email", 800);
  const url = decodeURIComponent((await navIngles.avaliar("window.__urls[0]")) || "");
  return url.startsWith("mailto:") && url.includes("Hi! I'd like to suggest...");
});

navIngles.fechar();

// ---------------- Resultado ----------------
const unicos = [...new Set(avisos)];
console.log("\nErros/avisos no console:", unicos.length ? "\n  " + unicos.join("\n  ") : "nenhum");
console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTUDO OK");

nav.fechar();
servidor.close();
process.exit(falhas || unicos.length ? 1 : 0);
