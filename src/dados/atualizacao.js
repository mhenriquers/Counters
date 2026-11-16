// Confere no GitHub Releases se existe um APK mais novo que o instalado.
// Só dados: quem mostra o aviso é o componente AvisoAtualizacao.
//
// Para publicar uma versão nova:
//   1. suba a "version" no app.json (ex.: "1.1.0")
//   2. gere o APK (eas build -p android --profile preview)
//   3. crie uma release no GitHub com a tag "v1.1.0" e o .apk anexado
import Constants from "expo-constants";
import { GITHUB_USUARIO } from "./contatos";

const ULTIMA_RELEASE = `https://api.github.com/repos/${GITHUB_USUARIO}/Counters/releases/latest`;

// Versão deste app, lida do app.json no momento do build (ex.: "1.0.0")
export const VERSAO_ATUAL = Constants.expoConfig?.version ?? "0.0.0";

// "v1.10.0" > "v1.9.2"? Compara número por número (como texto, "10" < "9").
export function versaoMaisNova(nova, atual) {
  const partes = (v) => v.replace(/^v/i, "").split(".").map((n) => parseInt(n, 10) || 0);
  const a = partes(nova);
  const b = partes(atual);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diferenca = (a[i] ?? 0) - (b[i] ?? 0);
    if (diferenca !== 0) return diferenca > 0;
  }
  return false;
}

// Devolve { versao, link } se houver versão nova, ou null se não houver
// (ou se não deu para saber: sem internet, GitHub fora do ar etc.).
export async function buscarAtualizacao() {
  try {
    const resposta = await fetch(ULTIMA_RELEASE, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!resposta.ok) return null;

    const release = await resposta.json();
    if (!release.tag_name || !versaoMaisNova(release.tag_name, VERSAO_ATUAL)) {
      return null;
    }

    // Link direto do .apk; se a release não tiver um, abre a página dela
    const apk = release.assets?.find((a) => a.name?.toLowerCase().endsWith(".apk"));
    return {
      versao: release.tag_name.replace(/^v/i, ""),
      link: apk?.browser_download_url ?? release.html_url,
    };
  } catch {
    return null;
  }
}
