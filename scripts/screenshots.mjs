// Tira prints da versão web (pasta dist/) em tamanho de celular (384x832).
// Rode antes: npm run build:web
// Uso: npm run shots  (salva em screenshots/)
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { servidorEstatico, abrirNavegador } from "./cdp-util.mjs";

const PORTA = 3101;
const BASE = `http://localhost:${PORTA}`;
const PASTA = "screenshots";

if (!existsSync("dist/index.html")) {
  console.error("dist/ não existe. Rode antes: npm run build:web");
  process.exit(1);
}

const TELAS = [
  ["home", "/"],
  ["heroi-1", "/heroi/1"],
  ["heroi-67", "/heroi/67"],
  ["heroi-999", "/heroi/999"],
  ["apoiar", "/apoiar"],
  ["sobre", "/sobre"],
  ["feedback", "/feedback"],
  ["configuracoes", "/configuracoes"],
];

mkdirSync(PASTA, { recursive: true });
const servidor = await servidorEstatico("dist", PORTA);
const nav = await abrirNavegador({ porta: 9402 });

for (const [nome, rota] of TELAS) {
  await nav.abrir(BASE + rota);
  writeFileSync(`${PASTA}/${nome}.png`, await nav.print());
  console.log(`${PASTA}/${nome}.png`);
}

// Home com o menu aberto
await nav.abrir(BASE + "/");
await nav.clicarSeletor('img[src*="opcoes"]', 800);
writeFileSync(`${PASTA}/menu.png`, await nav.print());
console.log(`${PASTA}/menu.png`);

// Configurações com o seletor de idioma aberto
await nav.abrir(BASE + "/configuracoes");
await nav.clicarTexto("Idioma", 800);
writeFileSync(`${PASTA}/configuracoes-idioma.png`, await nav.print());
console.log(`${PASTA}/configuracoes-idioma.png`);

nav.fechar();
servidor.close();
process.exit(0);
