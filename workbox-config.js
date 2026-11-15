// Gera o service worker que guarda o app inteiro para uso offline
module.exports = {
  globDirectory: "dist/",
  globPatterns: [
    "**/*.{html,js,css,json,png,jpg,jpeg,gif,webp,svg,ico,ttf,woff,woff2}",
  ],
  swDest: "dist/sw.js",
  // o bundle JS passa do limite padrão de 2 MB
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  // qualquer URL (ex.: /heroi/12) abre o app, mesmo offline
  navigateFallback: "/index.html",
  // versão nova entra sozinha na próxima abertura do app
  clientsClaim: true,
  skipWaiting: true,
};
