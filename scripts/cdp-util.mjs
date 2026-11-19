// Utilitários compartilhados pelos scripts de teste e de screenshots.
// - servidorEstatico: serve a pasta dist/ como SPA (qualquer rota cai no index.html)
// - abrirNavegador: abre o Chrome headless e conecta via Chrome DevTools Protocol
// Sem dependências: só módulos do Node (>= 22, que já tem WebSocket e fetch).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import path from "node:path";

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

export const espera = (ms) => new Promise((r) => setTimeout(r, ms));

export async function servidorEstatico(pasta, porta) {
  const raiz = path.resolve(pasta);
  const servidor = createServer(async (req, res) => {
    const caminho = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let arquivo = path.join(raiz, caminho);
    try {
      if (!arquivo.startsWith(raiz) || !(await stat(arquivo)).isFile()) throw 0;
    } catch {
      arquivo = path.join(raiz, "index.html"); // SPA: rota desconhecida -> app
    }
    try {
      const conteudo = await readFile(arquivo);
      res.writeHead(200, { "Content-Type": TIPOS[path.extname(arquivo)] || "application/octet-stream" });
      res.end(conteudo);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((ok) => servidor.listen(porta, ok));
  return servidor;
}

const CHROME =
  process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

// Abre o Chrome e devolve funções para controlar a página.
// `idioma` é o idioma do "celular" (navigator.language), que decide o idioma
// inicial do app. Fixo em pt-BR para o resultado não depender da máquina.
// `celular: false` simula um computador (sem toque, viewport de desktop).
export async function abrirNavegador({ porta = 9400, largura = 384, altura = 832, idioma = "pt-BR", celular = true } = {}) {
  const perfil = mkdtempSync(path.join(tmpdir(), "counters-cdp-"));
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${porta}`,
    `--user-data-dir=${perfil}`,
    "about:blank",
  ]);

  let alvo;
  for (let i = 0; i < 60 && !alvo; i++) {
    await espera(250);
    try {
      const lista = await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json();
      alvo = lista.find((t) => t.type === "page");
    } catch {}
  }
  if (!alvo) throw new Error(`Não consegui abrir o Chrome em ${CHROME}. Defina CHROME_PATH.`);

  const ws = new WebSocket(alvo.webSocketDebuggerUrl);
  await new Promise((ok) => ws.addEventListener("open", ok));

  let seq = 0;
  const pendentes = new Map();
  const ouvintes = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pendentes.has(msg.id)) {
      pendentes.get(msg.id)(msg);
      pendentes.delete(msg.id);
    }
    if (msg.method) ouvintes.forEach((f) => f(msg));
  });

  const enviar = (method, params = {}) => {
    const id = ++seq;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((ok) => pendentes.set(id, ok));
  };
  const avaliar = async (expressao) =>
    (await enviar("Runtime.evaluate", { expression: expressao, returnByValue: true, awaitPromise: true }))
      .result?.result?.value;

  await enviar("Emulation.setDeviceMetricsOverride", {
    width: largura,
    height: altura,
    deviceScaleFactor: 1,
    mobile: celular,
  });
  // Muda o navigator.language (o setLocaleOverride não muda, só o Intl)
  const agente = await avaliar("navigator.userAgent");
  await enviar("Emulation.setUserAgentOverride", { userAgent: agente, acceptLanguage: idioma });
  await enviar("Runtime.enable");
  await enviar("Log.enable");
  await enviar("Page.enable");

  const clicarXY = async (x, y) => {
    for (const type of ["mousePressed", "mouseReleased"])
      await enviar("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 });
  };

  // Pega o ÚLTIMO elemento encontrado (telas empilhadas continuam no DOM),
  // rola até ele e devolve o centro. `busca` é código JS que retorna uma lista.
  const centroDe = (busca) =>
    avaliar(`(() => {
      const lista = ${busca};
      const e = lista[lista.length - 1];
      if (!e) return null;
      e.scrollIntoView({ block: "center" });
      const r = e.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    })()`);

  const nav = {
    enviar,
    avaliar,
    aoEvento: (f) => ouvintes.push(f),
    abrir: async (url, ms = 3500) => {
      await enviar("Page.navigate", { url });
      await espera(ms);
    },
    rota: () => avaliar("location.pathname"),
    temTexto: (t) =>
      avaliar(`document.body.innerText.toLowerCase().includes(${JSON.stringify(t.toLowerCase())})`),
    // clica no menor elemento visível cujo texto é exatamente `texto` (sem diferenciar maiúsculas)
    clicarTexto: async (texto, ms = 1200) => {
      const pos = await centroDe(
        `[...document.querySelectorAll("div,span")].filter(e => e.offsetParent && e.textContent.trim().toLowerCase() === ${JSON.stringify(texto.toLowerCase())})`,
      );
      if (!pos) throw new Error("texto não encontrado: " + texto);
      await clicarXY(pos.x, pos.y);
      await espera(ms);
    },
    clicarSeletor: async (seletor, ms = 1200) => {
      const pos = await centroDe(`document.querySelectorAll(${JSON.stringify(seletor)})`);
      if (!pos) throw new Error("seletor não encontrado: " + seletor);
      await clicarXY(pos.x, pos.y);
      await espera(ms);
    },
    clicarXY: async (x, y, ms = 1200) => {
      await clicarXY(x, y);
      await espera(ms);
    },
    print: async () =>
      Buffer.from((await enviar("Page.captureScreenshot", { format: "png" })).result.data, "base64"),
    fechar: () => {
      try { ws.close(); } catch {}
      chrome.kill();
      setTimeout(() => { try { rmSync(perfil, { recursive: true, force: true }); } catch {} }, 1000);
    },
  };
  return nav;
}
