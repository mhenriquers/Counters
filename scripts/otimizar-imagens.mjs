// Reduz o tamanho das imagens de assets/ (sobrescreve os arquivos).
// Só grava se o resultado ficar MENOR que o original.
import sharp from "sharp";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PASTA = "assets";

// Ícones do app: não mexer
const IGNORAR = new Set([
  "counters.png",
  "counters-icon.png",
  "icon.png",
  "favicon.png",
  "splashicon.png",
  "iconeapp.png",
]);

// Largura máxima por arquivo (o padrão vale para o resto)
const LARGURA_PADRAO = 1080;
const LARGURAS = {
  "imortal.png": 600,
  "gloria-mitico.png": 600,
  "QRCode.png": 600,
};

const arquivos = (await readdir(PASTA)).filter(
  (f) => /\.(png|jpe?g)$/i.test(f) && !IGNORAR.has(f),
);

let antes = 0;
let depois = 0;

for (const nome of arquivos) {
  const caminho = path.join(PASTA, nome);
  const original = await readFile(caminho);
  const largura = LARGURAS[nome] ?? LARGURA_PADRAO;
  const ehRetrato = nome.startsWith("heroi_ml_") || nome.endsWith("-icon.png");

  let img = sharp(original).resize({ width: largura, withoutEnlargement: true });

  if (/\.png$/i.test(nome)) {
    img = img.png({ compressionLevel: 9, palette: ehRetrato, quality: 90 });
  } else {
    img = img.jpeg({ quality: 80, mozjpeg: true });
  }

  const novo = await img.toBuffer();
  antes += original.length;

  if (novo.length < original.length) {
    await writeFile(caminho, novo);
    depois += novo.length;
  } else {
    depois += original.length;
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
console.log(`${arquivos.length} imagens | antes: ${mb(antes)} | depois: ${mb(depois)}`);
