# CLAUDE.md

Contexto do projeto para o Claude Code. Escrito em português, assim como o código.

## Visão geral

**Counters MLBB**: mostra, para cada herói do Mobile Legends: Bang Bang, contra quem ele é forte (`counters`) e contra quem é fraco (`counteradoPor`). Sai como APK (Android) e como PWA na Vercel (https://counters-peach-one.vercel.app). Funciona 100% offline: sem backend, dados num arquivo JS estático, e só a escolha de idioma fica salva no aparelho. Única consulta à internet: ao abrir, o APK confere no GitHub Releases se há versão nova (`atualizacao.js`).

- Expo SDK 58, RN 0.88, React 19, React Navigation 7 (`native-stack` + `linking`: cada tela tem uma URL na web). JavaScript puro (há um `tsconfig.json`, mas nenhum `.ts`). Versões exatas: `package.json`.
- O Expo Go do celular precisa ser 58.x. Node 22.13+ ou 24.3+ (na Vercel: Settings → General).
- Bibliotecas de RN: **sempre** `npx expo install <pacote>`, nunca `npm install`. Exceção: `@react-navigation/*` fica fora da lista do Expo; atualize à mão, conferindo os `peerDependencies`.
- O idioma fica no `AsyncStorage` (na web, `localStorage`, chave `idioma`). Identificador: `app.counters.mlbb`. Licença: 0BSD.

## Comandos

```bash
npx expo start -c       # dev server (Expo Go / QR code). -c limpa o cache do Metro
npm run android         # expo run:android (build nativo local)
npm run web             # dev server web (localhost:8081, service worker desligado)
npm run build:web       # expo export -p web + workbox (gera dist/ com sw.js)
npm run preview:web     # serve dist/ em localhost:3000 (testar PWA/offline)
npm run test:web        # teste E2E da web (rode antes npm run build:web)
npm run shots           # prints 384x832 de todas as telas em screenshots/
eas build -p android --profile preview      # gera o APK
eas build -p android --profile production   # autoIncrement de versão
node scripts/gerar-icones.mjs       # regera public/icons/ (PWA) a partir de assets/icone-pwa.svg
node scripts/otimizar-imagens.mjs   # recomprime assets/ (só grava se ficar menor)
npx expo-doctor                     # checa compatibilidade (deve passar em todas)
npx expo install --check            # lista libs fora da versão esperada pelo SDK
```

Não há lint nem formatter. `/android`, `/ios`, `dist/`, `screenshots/` e `screenshots-antes/` são gerados (estão no `.gitignore`).

### PWA e deploy

- Tudo em `public/` é copiado para `dist/`: `index.html` (template, `"web.output": "single"`; registra o `/sw.js`, menos na porta 8081), `manifest.json` e `icons/`.
- `workbox-config.js` gera `dist/sw.js`: precache de todo o build e `navigateFallback` para `/index.html` (qualquer URL abre offline).
- Vercel (`vercel.json`): roda `build:web`, publica `dist/`, `rewrites` para `/index.html` e `no-cache` no `sw.js`. O `"framework": null` é obrigatório: o build padrão do Expo não roda o workbox (sem `sw.js`, sem offline). Cada `git push` na `main` publica.
- A PWA instalada recebe a versão nova na **segunda** abertura.
- Na web, o app é uma coluna de até 480px (`App.js`), e `Alert.alert` não funciona: use `window.alert` quando `Platform.OS === "web"`.

## Estrutura

```
App.js              entrada + providers + rotas (fica na raiz: o expo/AppEntry.js importa daqui)
assets/             imagens (fica na raiz: app.json e scripts/ apontam para cá)
src/
  telas/            uma tela por arquivo (tem rota no App.js)
  componentes/      tudo que desenha algo e não é tela
  dados/            dados e acesso a eles
  idioma/           textos em pt e en + IdiomaProvider/useIdioma
  tema.js           tokens visuais: cores, espaco, raio, fonte
scripts/            build, testes e prints
```

- **Rotas** (`App.js`, Stack com `headerShown: false` e `component=`): `Home` (`/`), `Details` (`/heroi/:id`), `Doacoes` (`/apoiar`), `Sobre` (`/sobre`), `Feedback` (`/feedback`), `Configuracoes` (`/configuracoes`). Tela nova: registre também em `linking.config.screens`. Parâmetros de rota simples (strings/números), pois viram URL.
- **Telas:** `Details` é a **referência visual do app** (heróis empilham com `navigation.push`; o ✕ usa `popTo("Home")`). `Doacoes` é o **modelo das telas secundárias** (`CabecalhoTela`, `Cartao`, `Paragrafo`, `Rodape`).
- **`componentes/ui.js`:** peças compartilhadas: `Fundo`, `TituloSecao`, `BarraStatus`, `CabecalhoTela` (já inclui a `BarraStatus`), `Cartao`, `Paragrafo` (já justifica e recua a primeira linha: não recue com espaços), `LinhaAcao`, `BotaoCopiar` (mostra "Copiado ✓", sem `Alert`), `ListaContatos` e `Rodape`. Os outros componentes têm um arquivo cada.
- **`dados/herois.js`:** única porta para os heróis: `buscarHeroi(id)` (ou `null`), `buscarHerois(ids)` e `listarHerois()` (ordem alfabética, lista congelada).
- **`dados/atualizacao.js`:** `buscarAtualizacao()` → `{ versao, link }` ou `null`, e `VERSAO_ATUAL`. **Publicar um APK novo:** subir a `version` do `app.json`, gerar no EAS e criar a release no GitHub com a tag `v<versão>` e o `.apk` anexado. Sem subir a `version`, o aviso não aparece.
- **`dados/contatos.js`:** `EMAIL`, `GITHUB_USUARIO`, `ID_JOGO`, `abrirGit`, `enviarEmail`.
- **`idioma/`:** `textos.js` (todos os textos, chave `"tela.texto"`, `pt` e `en` lado a lado, partes variáveis com `{nome}`; classes em `classe.Assassino` etc.) e `idioma.js` (`IdiomaProvider`, `useIdioma()` → `{ idioma, mudarIdioma, t }`, `IDIOMAS`). Idioma inicial: o salvo; se não houver, o do celular (`pt` → português, o resto → inglês).
- **Arquivos do dono:** `task.md` (plano em andamento; a seção "Estado atual" no topo diz o próximo passo), `explicaCode.md` (estudo, com comparações com C#: quando ele pedir para explicar uma mudança de arquitetura, acrescente uma seção lá) e `atualizar-sdk.md`.

## Modelo de dados (`src/dados/banco_herois.js`)

```js
{
  id: "1",                      // string. Chave das referências e do keyExtractor
  nome: "Aamon",
  classe: "Assassino",          // uma ou duas, separadas por "/", ex.: "Lutador/Tanque"
  foto: require("../../assets/heroi_ml_49.png"),
  counters: ["27", "51", ...],      // 5 ids contra os quais ele é FORTE
  counteradoPor: ["44", "98", ...], // 5 ids contra os quais ele é FRACO
}
```

- As telas não veem esse formato: o `herois.js` troca `classe` por `classes: [...]`.
- Cada lista de ids tem um comentário com os nomes (`// Guinevere, Eudora, ...`): mantenha-o atualizado.
- Fonte: site oficial do MLBB. `counters` = "MOST COUNTERED BY" do site e `counteradoPor` = "BEST COUNTERS" (anotado em Marcel).
- O arquivo `heroi_ml_N.png` **não** corresponde ao `id`: confira o `require` existente.
- Classes válidas = chaves do mapa `icones` em `IconeClasse.js`: `Assassino`, `Mago`, `Tanque`, `Suporte`, `Lutador`, `Atirador`.
- Herói novo: `id` novo (o maior hoje é `"133"`) e imagem em `assets/` (PNG de verdade, ver Armadilhas). A posição no array não importa.

## Armadilhas do SDK 58 / RN 0.88 / React Navigation 7

Valem para qualquer código novo. Várias só aparecem no celular.

- `StyleSheet.absoluteFillObject` não existe mais: use `absoluteFill`. Na web ainda funciona, então o erro só aparece no celular (a View fica com altura 0 e "some").
- `ImageBackground` está descontinuado: use o `Fundo` de `ui.js`.
- **Imagem com `require` sem `width`/`height` fica com o tamanho do arquivo** (no celular e na web); `absoluteFill` não basta. E um filho `position: absolute` com `width: "100%"` num pai com padding fica mais curto no Android. Por isso, imagem de fundo = `View` com `absoluteFill` (sem padding) + imagem com `width`/`height` em `"100%"`. É o que o `Fundo` faz: use sempre ele.
- `navigate("Tela")` não volta para uma tela que já está na pilha: empilha outra. Para voltar, use `navigation.popTo("Tela")`.
- `app.json`: `newArchEnabled`, `android.edgeToEdgeEnabled` e `splash` (na raiz) foram removidas. A splash é configurada no plugin `expo-splash-screen` e não aparece no Expo Go, só no APK.
- Edge-to-edge é obrigatório no Android: use `useSafeAreaInsets`/`SafeAreaView`, não margens fixas. **Decisão do dono:** nada aparece atrás da hora; toda tela tem no topo a `BarraStatus` de `ui.js` (o `CabecalhoTela` já tem). Na web, a faixa tem altura 0.
- **`.png` tem que ser PNG de verdade.** Um JPEG renomeado funciona na web e no Expo Go, mas quebra o APK (`AAPT: error: file failed to compile`). Confira com `file assets/x.png` (Git Bash); converta com `sharp(...).png()`.
- **Mudou o `app.json`? Limpe o cache do Metro**, senão o `build:web` sai com o `app.json` antigo: `npx expo export -p web --clear` (ou `npx expo start -c` no celular). A Vercel e o EAS compilam do zero.

## Verificação e depuração

- **Teste automático:** `npm run build:web && npm run test:web` (E2E da web: navegação, menu, busca, `/heroi/999`, copiar, idioma e, num Chrome em `en-US`, cada tela em inglês com `telaEmIngles`). Sai com código 1 se algo falhar. Mudou um texto que o teste procura? Atualize `scripts/teste-web.mjs` no mesmo commit.
- `teste-web.mjs` e `screenshots.mjs` usam o `cdp-util.mjs` (servidor de `dist/` + Chrome headless via DevTools Protocol; Chrome em `CHROME_PATH` ou no caminho padrão do Windows). O `abrirNavegador({ idioma })` fixa o `navigator.language` (padrão `pt-BR`) via `acceptLanguage`: o `setLocaleOverride` não muda o `navigator.language`.
- **Comparação visual:** antes de mexer numa tela, copie `screenshots/` para `screenshots-antes/`; depois rode `npm run shots` e compare.
- **Web manual:** `npm run preview:web`. Teste o offline (F12 → Network → Offline).
- **Celular:** sempre teste também no Expo Go. O `console.log` aparece no terminal do `npx expo start`; para um elemento que "não aparece", logue o `onLayout` (`e.nativeEvent.layout`). Remova os logs antes do commit.

## Convenções

- Nomes, componentes e comentários em **português** (`busca`, `heroisFiltrados`, `aoFechar`).
- Cada tela ou componente é um `.js` com `StyleSheet.create` no final (objeto `style` ou `styles`), só com os estilos que ele usa.
- Plataforma: `Platform.OS === "ios" ? x : y`, ou `Platform.select({ ios, web, default })`.
- **Visual (site oficial do MLBB):** fundo `#0d1424`, bordas `hsl(191, 100%, 94%)`, texto secundário `#9bd1fd`, faixas com `bg-Layer.png` + `hero.png`, dourado `#D3AF37` (bordas e títulos das telas secundárias) e `#ffd700` (menu, botões). Cores, espaços e fontes vêm **só** do `tema.js`; telas novas usam o `ui.js`.
- Sem `fontFamily` (nenhuma fonte é carregada e a web cai em serifada): só `fontWeight`.
- **Texto visível novo vai no `textos.js` (pt e en)**, nunca direto na tela: `const { t } = useIdioma();` e `t("tela.texto")`. Traduziu uma tela? Acrescente um caso em inglês no `teste-web.mjs`.
- `useIdioma()` no topo do componente, antes de qualquer `return` antecipado. Função que não é componente recebe o `t` como parâmetro.
- `FlatList`: props estáveis (`useCallback`, constantes, `StyleSheet`); função inline faz a grade inteira ser redesenhada a cada mudança de estado.
- Assets com `require` relativo: de `src/telas/` ou `src/componentes/` é `require("../../assets/...")`.
- **Onde fica cada coisa:** tela (tem rota) em `telas/`; todo o resto que desenha algo em `componentes/`, mesmo que só uma tela use; dados e acesso a eles em `dados/`.
- **Heróis só pelo `herois.js`:** ninguém mais importa o `banco_herois.js`. Precisa de algo novo (ex.: heróis por classe)? Crie uma função no `herois.js`.
- **Componente recebe só o que usa:** prefira `aoVoltar`/`aoTocar` a passar o `navigation` inteiro (pendente: o `MenuLateral` ainda recebe o `navigation`).
- Mudança de pasta vai num commit só dela, com `git mv`, sem misturar com lógica.
- Commits curtos, em inglês informal (ex.: "editing filter"), a cada arquivo ou tela finalizado.

## Arquitetura

Composição de componentes do React, com dados descendo por props. Não é MVC nem MVVM. A explicação (com comparações com C#) está no `explicaCode.md`.

```
App.js (entrada + rotas + providers)
  └▶ telas ──usam──▶ componentes ──usam──▶ tema
       ├─────────────────┴──▶ idioma/ (useIdioma) ──lê──▶ idioma/textos.js
       └─────────────────┴──▶ dados/  (herois, contatos, atualizacao) ──▶ banco_herois.js
```

- **As setas só descem:** `dados/` e `idioma/` não importam telas nem componentes; componentes não importam telas; uma tela não importa outra (navega pelo nome da rota).
- **Tela só compõe peças.** Variação por prop (`destaque`, `cor`), nunca por cópia do componente.
- **Único estado global: o idioma.** O resto é `useState` local. Estado global novo = outro Provider no mesmo molde (`createContext` + Provider no `App.js` + hook que lança erro fora do Provider). Sem Redux/Zustand.
- **`dados/` devolve valores** (ex.: `{ versao, link }` ou `null`), e quem desenha decide como mostrar. Exceção antiga: `enviarEmail` chama `Alert` direto; não repita.
- **Algo que roda ao abrir o app e precisa de hook:** componente sem visual (`return null`) no `App.js`, dentro do `IdiomaProvider` (ex.: `AvisoAtualizacao`).
- **Guarda de plataforma dentro do componente** (`InstalarApp` só na web, `AvisoAtualizacao` só no Android): quem usa não precisa de `if (Platform.OS...)`.
- **Tabela no lugar de `if/else`** (`icones`, `IDIOMAS`, `textos`, `linking`): caso novo = entrada nova no mapa.
- **Fonte única:** heróis no `banco_herois.js`, textos no `textos.js`, visual no `tema.js`, versão no `app.json` (lida por `VERSAO_ATUAL`; nunca escreva a versão à mão numa tela).
- Não exagerar: Repository/Service/UseCase num app offline seria cerimônia sem ganho.

### Decisões do dono

- `IconeClasse` fica em `componentes/` (o que ele devolve é visual) e `contatos.js` fica em `dados/`.
- **Não** criar um `SecaoHerois` no Details: as duas seções (forte/fraco) repetidas ficam como estão.
- As imagens sem uso em `assets/` (`liveLogoCut.gif`, `logoInVideo.mp4`, `profile.jpeg`, `heroi_ml_10.png`...) **ficam todas**. Não proponha apagá-las.
