// Gera os ícones da PWA a partir do SVG do ícone. A aba do navegador usa o
// icon-192.png (public/index.html); trocou o ícone? Suba o ?v= de lá.
// O ícone do APK continua sendo o assets/counters.png (app.json).
import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";

const ORIGEM = "assets/icone-pwa.svg"; // quadro de 1024x1024
const DESTINO = "public/icons";

await mkdir(DESTINO, { recursive: true });

const svg = await readFile(ORIGEM, "utf8");
const base = await sharp(Buffer.from(svg)).png().toBuffer(); // 1024x1024

await sharp(base).resize(192, 192).png().toFile(`${DESTINO}/icon-192.png`);
await sharp(base).resize(512, 512).png().toFile(`${DESTINO}/icon-512.png`);
await sharp(base).resize(180, 180).png().toFile(`${DESTINO}/apple-touch-icon.png`);
// "maskable": o Android recorta em círculo, então o desenho (grupo "desenho"
// do SVG) encolhe para 82%, centralizado, e o fundo continua ocupando tudo
const MARCADOR = '<g id="desenho">';
if (!svg.includes(MARCADOR)) throw new Error(`${ORIGEM} precisa ter ${MARCADOR}`);
const svgMaskable = svg.replace(
  MARCADOR,
  '<g id="desenho" transform="translate(92 92) scale(0.82)">'
);
await sharp(Buffer.from(svgMaskable))
  .resize(512, 512)
  .png()
  .toFile(`${DESTINO}/maskable-512.png`);

console.log("Ícones gerados em public/icons/");
