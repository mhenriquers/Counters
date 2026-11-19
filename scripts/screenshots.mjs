// Tira prints da versão web (pasta dist/) em 3 tamanhos:
// celular (384x832, em screenshots/), tablet (820x1180, em screenshots/tablet/)
// e computador (1440x900, em screenshots/computador/).
// Rode antes: npm run build:web
// Uso: npm run shots
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

const TAMANHOS = [
  { pasta: PASTA, largura: 384, altura: 832, celular: true },
  { pasta: `${PASTA}/tablet`, largura: 820, altura: 1180, celular: true },
  { pasta: `${PASTA}/computador`, largura: 1440, altura: 900, celular: false },
];

const servidor = await servidorEstatico("dist", PORTA);

for (const [i, { pasta, largura, altura, celular }] of TAMANHOS.entries()) {
  mkdirSync(pasta, { recursive: true });
  const nav = await abrirNavegador({ porta: 9402 + i * 10, largura, altura, celular });

  for (const [nome, rota] of TELAS) {
    await nav.abrir(BASE + rota);
    writeFileSync(`${pasta}/${nome}.png`, await nav.print());
    console.log(`${pasta}/${nome}.png`);
  }

  // Home com o menu aberto
  await nav.abrir(BASE + "/");
  await nav.clicarSeletor('img[src*="opcoes"]', 800);
  writeFileSync(`${pasta}/menu.png`, await nav.print());
  console.log(`${pasta}/menu.png`);

  // Configurações com o seletor de idioma aberto
  await nav.abrir(BASE + "/configuracoes");
  await nav.clicarTexto("Idioma", 800);
  writeFileSync(`${pasta}/configuracoes-idioma.png`, await nav.print());
  console.log(`${pasta}/configuracoes-idioma.png`);

  nav.fechar();
}

servidor.close();
process.exit(0);
