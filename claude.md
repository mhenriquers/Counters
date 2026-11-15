# CLAUDE.md

Contexto do projeto para o Claude Code. Escrito em português, assim como o código.

## Visão geral

**Counters MLBB**: app que mostra, para cada herói do Mobile Legends: Bang Bang, contra quem ele é forte ("counters") e contra quem é fraco ("counteradoPor"). Distribuído como APK (Android) e como **PWA** (web instalável, hospedada no Netlify). Funciona 100% offline: não há backend, API nem persistência. Todos os dados ficam em um arquivo JS estático.

- Stack: Expo SDK 54, React Native 0.81 (New Architecture ligada), React 19.1, JavaScript puro (há um `tsconfig.json`, mas nenhum arquivo `.ts`/`.tsx`). Web via `react-native-web`.
- Navegação: `@react-navigation/native-stack` v6, com `linking` (cada tela tem uma URL na web).
- Identificador do app: `app.counters.mlbb` (Android e iOS).
- Licença: 0BSD.

## Comandos

```bash
npm install
npx expo start          # dev server (Expo Go / QR code)
npm run android         # expo run:android (build nativo local)
npm run web             # dev server web (localhost:8081, service worker desligado)
npm run build:web       # expo export -p web + workbox (gera dist/ com sw.js)
npm run preview:web     # serve dist/ em localhost:3000 (testar PWA/offline)
eas build -p android --profile preview      # gera o APK (buildType: apk)
eas build -p android --profile production   # autoIncrement de versão
node scripts/gerar-icones.mjs       # regera public/icons/ a partir de assets/counters.png
node scripts/otimizar-imagens.mjs   # recomprime assets/ (sobrescreve; só grava se ficar menor)
```

Não há testes, lint nem formatter configurados. As pastas `/android`, `/ios` e `dist/` são geradas e ficam no `.gitignore`.

### PWA e deploy

- `public/index.html` é o template da web (`"web.output": "single"` no `app.json`): metas da PWA, link para o manifest e registro do `/sw.js` (ignorado na porta 8081).
- `public/manifest.json` + `public/icons/` (gerados pelo script). Tudo em `public/` é copiado para `dist/`.
- `workbox-config.js` gera `dist/sw.js` com precache de todo o build e `navigateFallback` para `/index.html` (qualquer URL abre offline).
- Deploy no **Netlify** via `netlify.toml`: roda `npm run build:web`, publica `dist/`, redireciona `/*` para `/index.html` e manda `Cache-Control: no-cache` no `sw.js`.
- Na web, o app fica numa coluna de no máximo 480px (`App.js`), e `Alert.alert` não funciona: use `window.alert` quando `Platform.OS === "web"`.

## Estrutura

Todos os arquivos ficam na raiz, sem pasta `src/`. Cada tela é um arquivo `.js` com `StyleSheet.create` no final.

| Arquivo | Papel |
|---|---|
| `App.js` | Raiz. `SafeAreaProvider` + `NavigationContainer` (com `linking`) + Stack com `headerShown: false`. Controla o estado `menuAberto` e renderiza `MenuLateral` sobre a tela `Home`. |
| `HomeScreen.js` | Grade de heróis em 3 colunas (`FlatList`), em ordem alfabética (`localeCompare` pt-BR). A busca por nome aparece ao tocar na lupa. Ao tocar num herói, navega para `Details` com `{ id: item.id }`. Mostra `InstalarApp` abaixo do logo. |
| `Details.js` | Recebe `{ id }`, busca o herói em `HEROIS` e mostra "Herói não encontrado" se o id não existir. Exibe os ícones de classe e as listas "É forte contra" (`counters`) e "É fraco contra" (`counteradoPor`). Tocar num herói da lista faz `navigation.push("Details", { id })`, empilhando telas. |
| `InstalarApp.js` | Botão "Instalar app" (só web/Chrome): captura o `beforeinstallprompt`. Não aparece no iPhone nem com o app já instalado. |
| `MenuLateral.js` | Gaveta feita à mão (View absoluta com 75% de largura e overlay escuro), não usa o drawer do react-navigation. Recebe as props `visivel`, `aoFechar` e `navigation`. |
| `Doacoes.js` | Tela de apoio: copia uma chave Pix com `expo-clipboard`. |
| `Feedback.js` / `Sobre.js` | Links para GitHub e e-mail (`Linking`, `mailto:`) e um botão que copia um ID. Boa parte do código é duplicada entre as duas. |
| `Configuracoes.js` | Tela estática e informativa (idioma, tema, política de privacidade). Ainda não tem configurações funcionais. |
| `banco_herois.js` | **Fonte de todos os dados.** Exporta `HEROIS`. |
| `LoadingScreen.js` | **Não está registrada no Stack** (código morto). |
| `scripts/` | `gerar-icones.mjs` e `otimizar-imagens.mjs` (usam `sharp`). |
| `DraftDetails.txt`, `cod.txt` | Rascunhos e trechos antigos. `DraftDetails.txt` é praticamente uma cópia de `Details.js`. Não são importados. |

Telas registradas no Stack e suas URLs: `Home` (`/`), `Details` (`/heroi/:id`), `Doacoes` (`/apoiar`), `Sobre` (`/sobre`), `Feedback` (`/feedback`), `Configuracoes` (`/configuracoes`). Ao criar uma tela nova, registre-a também em `linking.config.screens` no `App.js`. Parâmetros de rota devem ser simples (strings/números), pois viram parte da URL.

## Modelo de dados (`banco_herois.js`)

```js
{
  id: "1",                      // string. É a chave usada nas referências e no keyExtractor
  nome: "Aamon",
  classe: "Assassino",          // uma ou duas classes separadas por "/", ex.: "Lutador/Tanque"
  foto: require("./assets/heroi_ml_49.png"),
  counters: ["27", "51", ...],      // ids de heróis contra os quais ele é FORTE (5 itens)
  counteradoPor: ["44", "98", ...], // ids de heróis contra os quais ele é FRACO (5 itens)
}
```

- Cada referência tem um comentário com os nomes, ex.: `// Guinevere, Eudora, ...`. Mantenha esses comentários atualizados ao editar.
- Os dados vêm do site oficial do MLBB (o rodapé da tela Details cita isso). Em Marcel, a convenção está anotada: `counters` = "MOST COUNTERED BY" do site e `counteradoPor` = "BEST COUNTERS".
- O nome do arquivo de imagem (`heroi_ml_N.png`) **não** corresponde ao `id` do herói. Sempre confira o `require` existente.
- As classes válidas são as chaves de `iconesClasses` em `Details.js`: `Assassino`, `Mago`, `Tanque`, `Suporte`, `Lutador`, `Atirador`. O ícone de `Lutador` é `soldado.png`.
- Ao adicionar um herói: use um `id` novo e único (o maior hoje é `"133"`, do Marcel), adicione a imagem em `assets/` e insira o objeto. A Home ordena sozinha, então a posição no array não importa.

## Problemas conhecidos (verificados no código)

- `LoadingScreen.js` usa a cor `'21FFB5'` sem `#`.
- `Details.js` importa `lazy` e calcula `iconeDaClasse`, `counterList` e `counteradoPorList`, mas não usa nenhum deles.
- `assets/` tem vários arquivos de teste ou duplicados (`bgLayer - Copia.png`, `botaoVoltar (1).png`, `bg.layerTeste.png`, `gojo.jpg`).

## Convenções

- Nomes de variáveis, componentes de UI e comentários em **português** (`busca`, `heroisFiltrados`, `aoFechar`, `irPara`). Siga esse padrão.
- Estilos inline via `StyleSheet.create`, num objeto chamado `style` ou `styles` (varia entre arquivos).
- Ajustes por plataforma usam `Platform.OS === "ios" ? x : y`, ou `Platform.select({ ios, web, default })` quando a web precisa de um valor próprio.
- Visual: fundo escuro, bordas azul-claras `hsl(191, 100%, 94%)`, texto de menu dourado `#ffd700`, imagens de fundo (`ImageBackground`) em quase todas as telas.
- Assets são carregados com `require("./assets/...")`, com caminho relativo à raiz.
- Commits são curtos e em inglês informal (ex.: "editing filter").

commits são feitos a cada feature importante finalizada 