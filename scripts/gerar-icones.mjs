// Gera os ícones da PWA a partir do ícone do app
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const ORIGEM = "assets/counters.png"; // 1024x1024
const DESTINO = "public/icons";

await mkdir(DESTINO, { recursive: true });

await sharp(ORIGEM).resize(192, 192).png().toFile(`${DESTINO}/icon-192.png`);
await sharp(ORIGEM).resize(512, 512).png().toFile(`${DESTINO}/icon-512.png`);

await sharp(ORIGEM)
  .resize(180, 180)
  .flatten({ background: "#000000" })
  .png()
  .toFile(`${DESTINO}/apple-touch-icon.png`);

// "maskable": logo menor com borda preta, para o Android recortar em círculo
await sharp(ORIGEM)
  .resize(410, 410)
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: "#000000" })
  .flatten({ background: "#000000" })
  .png()
  .toFile(`${DESTINO}/maskable-512.png`);

console.log("Ícones gerados em public/icons/");
