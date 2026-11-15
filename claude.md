# CLAUDE.md

Contexto do projeto para o Claude Code. Escrito em português, assim como o código.

## Visão geral

**Counters MLBB**: app que mostra, para cada herói do Mobile Legends: Bang Bang, contra quem ele é forte ("counters") e contra quem é fraco ("counteradoPor"). Distribuído como APK (Android) e como **PWA** (web instalável, hospedada no Netlify). Funciona 100% offline: não há backend, API nem persistência. Todos os dados ficam em um arquivo JS estático.

- JavaScript puro (há um `tsconfig.json`, mas nenhum arquivo `.ts`/`.tsx`). New Architecture (obrigatória a partir do RN 0.82).
- Navegação: React Navigation 7 (`native-stack`), com `linking` (cada tela tem uma URL na web).
- Identificador do app: `app.counters.mlbb` (Android e iOS).
- Licença: 0BSD.

### Dependências principais

| Pacote | Versão | Observação |
|---|---|---|
| `expo` | SDK **58** (`^58.0.5`) | O Expo Go do celular precisa ser da mesma versão (58.x). Cada Expo Go roda um único SDK. |
| `react-native` | 0.88.1 | |
| `react` / `react-dom` | 19.3.0 | |
| `@react-navigation/native` | ^7 (7.5.x) | Fica **fora** da lista do Expo: atualize à mão, conferindo os `peerDependencies`. |
| `@react-navigation/native-stack` | ^7 (7.21.x) | |
| `react-native-web` | ~0.21 | |
| `react-native-screens` / `react-native-safe-area-context` | ~4.30 / ~5.11 | |
| `expo-clipboard`, `expo-linear-gradient`, `expo-splash-screen`, `expo-status-bar`, `expo-asset` | ~58.0.x | |
| devDependencies | `sharp`, `workbox-cli`, `serve` | Ferramentas de build. Não dependem do SDK. |

- **Node:** 22.13+ ou 24.3+ (exigência do SDK 58). O Netlify usa `NODE_VERSION = "22"`.
- Para bibliotecas de React Native, instale **sempre** com `npx expo install <pacote>` (escolhe a versão compatível com o SDK), nunca com `npm install`.

## Comandos

```bash
npm install
npx expo start -c       # dev server (Expo Go / QR code). -c limpa o cache do Metro
npm run android         # expo run:android (build nativo local)
npm run web             # dev server web (localhost:8081, service worker desligado)
npm run build:web       # expo export -p web + workbox (gera dist/ com sw.js)
npm run preview:web     # serve dist/ em localhost:3000 (testar PWA/offline)
eas build -p android --profile preview      # gera o APK (buildType: apk)
eas build -p android --profile production   # autoIncrement de versão
node scripts/gerar-icones.mjs       # regera public/icons/ a partir de assets/counters.png
node scripts/otimizar-imagens.mjs   # recomprime assets/ (sobrescreve; só grava se ficar menor)
npx expo-doctor                     # checa compatibilidade (deve passar em todas)
npx expo install --check            # lista libs fora da versão esperada pelo SDK
npm run test:web                    # teste E2E da web (rode antes npm run build:web)
npm run shots                       # prints 384x832 de todas as telas em screenshots/
```

Não há lint nem formatter. Os testes são só da versão web (`npm run test:web`, ver "Verificação e depuração"). As pastas `/android`, `/ios`, `dist/`, `screenshots/` e `screenshots-antes/` são geradas e ficam no `.gitignore`.

### PWA e deploy

- `public/index.html` é o template da web (`"web.output": "single"` no `app.json`): metas da PWA, link para o manifest e registro do `/sw.js` (ignorado na porta 8081).
- `public/manifest.json` + `public/icons/` (gerados pelo script). Tudo em `public/` é copiado para `dist/`.
- `workbox-config.js` gera `dist/sw.js` com precache de todo o build e `navigateFallback` para `/index.html` (qualquer URL abre offline).
- Deploy no **Netlify** via `netlify.toml`: roda `npm run build:web`, publica `dist/`, redireciona `/*` para `/index.html` e manda `Cache-Control: no-cache` no `sw.js`.
- Na web, o app fica numa coluna de no máximo 480px com `overflow: "hidden"` (`App.js`), e `Alert.alert` não funciona: use `window.alert` quando `Platform.OS === "web"`.

## Estrutura

```
App.js              entrada + rotas (fica na raiz: o expo/AppEntry.js importa o App daqui)
assets/             imagens (fica na raiz: app.json e scripts/ apontam para cá)
src/
  telas/            uma tela por arquivo (tem rota no App.js)
  componentes/      tudo que desenha algo e não é tela
  dados/            dados e acesso a eles
  tema.js           tokens visuais
scripts/            build, testes e prints
```

Cada tela ou componente é um arquivo `.js` com `StyleSheet.create` no final, com só os estilos que ele usa.

| Arquivo | Papel |
|---|---|
| `App.js` | Raiz. `SafeAreaProvider` + `NavigationContainer` (com `linking`) + Stack com `headerShown: false`. Todas as telas usam `component=`, sem render callback. |
| **`src/telas/`** | |
| `HomeScreen.js` | Grade de heróis em 3 colunas (`FlatList`), com a lista de `listarHerois()` (já em ordem alfabética). A busca aparece ao tocar na lupa: com o campo **vazio**, uma camada invisível (`Pressable`) cobre a grade e o primeiro toque só fecha a busca; com **texto**, tocar num resultado abre direto. Fechar a busca (lupa, ☰, voltar do Android) limpa o texto. Ao tocar num herói, navega para `Details` com `{ id: item.id }`. Mostra `InstalarApp` abaixo do logo. Guarda o estado `menuAberto` e renderiza o `MenuLateral`. |
| `Details.js` | Recebe `{ id }` e usa `buscarHeroi`. Se não existir, mostra o `HeroiNaoEncontrado`. Mostra foto, nome, classes (chips com `IconeClasse`) e duas seções com `TituloSecao`: "É forte contra" (`counters`, `cores.forte`) e "É fraco contra" (`counteradoPor`, `cores.fraco`), cada herói num `LinhaHeroi`. Tocar nele faz `navigation.push("Details", { id })`, empilhando telas. O ✕ usa `navigation.popTo("Home")`. A tela só compõe as peças. **É a referência visual do app.** |
| `Doacoes.js` | Tela de apoio (URL `/apoiar`): chave Pix com `BotaoCopiar`. Primeira tela secundária no padrão novo (`CabecalhoTela`, `Cartao`, `Paragrafo`, `Rodape`): use-a como modelo para as outras. |
| `Feedback.js` / `Sobre.js` | Links para GitHub e e-mail e um botão que copia um ID. As ações vêm de `contatos.js`. |
| `Configuracoes.js` | Tela estática e informativa (idioma, tema, política de privacidade). Ainda não tem configurações funcionais. |
| **`src/componentes/`** | |
| `ui.js` | Componentes compartilhados: `Fundo` (substitui o `ImageBackground`), `TituloSecao` (faixa do site + capacete), `BarraStatus` (faixa preta atrás da hora), `CabecalhoTela` (já inclui a `BarraStatus`), `Cartao`, `Paragrafo` (justificado e com recuo de primeira linha: não faça recuo com espaços), `LinhaAcao`, `BotaoCopiar` (mostra "Copiado ✓", sem `Alert`), `ListaContatos` (e-mail, GitHub e ID, igual em Sobre e Feedback) e `Rodape`. |
| `IconeClasse.js` | `<IconeClasse classe tamanho style />`. Guarda o mapa classe → ícone (classe nova = chave nova). |
| `LinhaHeroi.js` | Card de um herói numa lista: foto, nome, classes e seta. Props: `heroi`, `cor` (borda da esquerda), `aoTocar`. |
| `HeroiNaoEncontrado.js` | Tela de erro do id inexistente (`/heroi/999`). Recebe só `aoVoltar`. |
| `MenuLateral.js` | Gaveta feita à mão (não usa o drawer do react-navigation). Props: `visivel`, `aoFechar`, `navigation`. Animada com `Animated` (desliza da esquerda, `useNativeDriver` fora da web), continua montada até terminar de fechar, e com o menu aberto o voltar do Android (`BackHandler`) fecha o menu. A gaveta tem `overflow: "hidden"` porque a imagem de fundo (`fundoMG.png`, 1167x2000) transbordava e cobria a sombra, impedindo de fechar ao tocar fora. |
| `InstalarApp.js` | Botão "Instalar app" (só web/Chrome): captura o `beforeinstallprompt`. Não aparece no iPhone nem com o app já instalado. |
| **`src/dados/`** | |
| `herois.js` | **Única porta de entrada para os heróis.** `buscarHeroi(id)` (devolve `null` se não existir), `buscarHerois(ids)` (ignora ids inexistentes) e `listarHerois()` (ordem alfabética pt-BR, lista congelada). Por dentro: um `Map` por id e o herói "preparado", com `classes: [...]` no lugar de `classe`. |
| `banco_herois.js` | **Fonte de todos os dados.** Exporta `HEROIS`. Só o `herois.js` importa este arquivo. |
| `contatos.js` | `EMAIL`, `GITHUB_USUARIO`, `ID_JOGO` e as ações `abrirGit` e `enviarEmail` (`mailto:`). Só dados e ações: a parte visual é a `ListaContatos` de `ui.js`. |
| **outros** | |
| `src/tema.js` | Tokens visuais: `cores`, `espaco`, `raio`, `fonte`. Toda cor, espaçamento ou tamanho de fonte novo deve vir daqui. |
| `scripts/` | `gerar-icones.mjs` e `otimizar-imagens.mjs` (usam `sharp`); `teste-web.mjs` (E2E, lê `src/dados/banco_herois.js` como texto) e `screenshots.mjs` (prints), que usam `cdp-util.mjs`: servidor estático de `dist/` + Chrome headless via DevTools Protocol, sem dependências. Chrome em `CHROME_PATH` ou no caminho padrão do Windows. |
| `task.md` | Plano de trabalho em andamento, na `main`. A seção "Estado atual" no topo diz o que foi feito e o próximo passo. |
| `explicaCode.md` | Anotações de estudo do dono: a explicação de cada passo da arquitetura, com comparações com C#. Quando ele pedir para explicar uma mudança de arquitetura, acrescente uma seção aqui. |
| `atualizar-sdk.md` | Anotações do dono do projeto sobre como atualizar o SDK. |

Telas registradas no Stack e suas URLs: `Home` (`/`), `Details` (`/heroi/:id`), `Doacoes` (`/apoiar`), `Sobre` (`/sobre`), `Feedback` (`/feedback`), `Configuracoes` (`/configuracoes`). Ao criar uma tela nova, registre-a também em `linking.config.screens` no `App.js`. Parâmetros de rota devem ser simples (strings/números), pois viram parte da URL.

## Modelo de dados (`src/dados/banco_herois.js`)

```js
{
  id: "1",                      // string. É a chave usada nas referências e no keyExtractor
  nome: "Aamon",
  classe: "Assassino",          // uma ou duas classes separadas por "/", ex.: "Lutador/Tanque"
  foto: require("../../assets/heroi_ml_49.png"),
  counters: ["27", "51", ...],      // ids de heróis contra os quais ele é FORTE (5 itens)
  counteradoPor: ["44", "98", ...], // ids de heróis contra os quais ele é FRACO (5 itens)
}
```

- As telas **não** veem esse formato: elas recebem o herói do `herois.js`, que troca `classe` por `classes: ["Lutador", "Tanque"]`.
- Cada referência tem um comentário com os nomes, ex.: `// Guinevere, Eudora, ...`. Mantenha esses comentários atualizados ao editar.
- Os dados vêm do site oficial do MLBB (o rodapé da tela Details cita isso). Em Marcel, a convenção está anotada: `counters` = "MOST COUNTERED BY" do site e `counteradoPor` = "BEST COUNTERS".
- O nome do arquivo de imagem (`heroi_ml_N.png`) **não** corresponde ao `id` do herói. Sempre confira o `require` existente.
- As classes válidas são as chaves do mapa `icones` em `src/componentes/IconeClasse.js`: `Assassino`, `Mago`, `Tanque`, `Suporte`, `Lutador`, `Atirador`. O ícone de `Lutador` é `soldado.png`.
- Ao adicionar um herói: use um `id` novo e único (o maior hoje é `"133"`, do Marcel), adicione a imagem em `assets/` e insira o objeto. A Home ordena sozinha, então a posição no array não importa.

## Armadilhas do SDK 58 / RN 0.88 / React Navigation 7

Aprendidas na atualização do SDK 54 para o 58. Valem para qualquer código novo.

- **`StyleSheet.absoluteFillObject` não existe mais** no RN 0.88. Use `StyleSheet.absoluteFill`. Na web ainda funciona (react-native-web), então o erro só aparece no celular: a View fica com altura 0 e o elemento "some".
- **`ImageBackground` está descontinuado** (aviso no Metro: "will be removed in a future release"). Ainda funciona, mas não use em código novo: use o `Fundo` de `ui.js`.
- **Imagem com `require` sem `width`/`height` ganha o tamanho original do arquivo, no celular E na web.** `absoluteFill` (top/left/right/bottom) **não** basta: o tamanho do arquivo vence. Em 2026-11-15, tirar o `100%` no celular deixou o fundo da Home com 1125 de largura (triângulos gigantes, "muito zoom"). Na web, o `ImageBackground` do react-native-web caía nisso com o container só com `flex: 1`, e a imagem da gaveta do menu (1167x2000) cobria a tela e impedia de fechar. O `ImageBackground` nativo escapa porque copia o `width`/`height` do container para a imagem.
- **Filho `position: absolute` com `width: "100%"` num pai com padding fica mais curto no Android:** o `100%` desconta o padding, mas a posição começa na borda, e sobra uma faixa no fim (aconteceu no cabeçalho da Home). Na web não acontece.
- **Para imagem de fundo, as duas regras juntas:** ponha a imagem dentro de uma `View` com `StyleSheet.absoluteFill` (sem padding) e dê `width: "100%"`/`height: "100%"` à imagem. É o que o `Fundo` de `ui.js` faz. Use sempre o `Fundo`.
- **React Navigation 7:** `navigate("Tela")` **não volta** para uma tela que já está na pilha, ele empilha outra. Para voltar a uma tela existente, use `navigation.popTo("Tela")`.
- **`app.json`:** as chaves `newArchEnabled`, `android.edgeToEdgeEnabled` e `splash` (na raiz) foram removidas. A splash agora é configurada no plugin `expo-splash-screen` (em `plugins`, com `image`, `resizeMode`, `backgroundColor` e `imageWidth`).
- **Edge-to-edge é obrigatório no Android:** o app desenha atrás da barra de status e da barra de navegação. Use `useSafeAreaInsets` / `SafeAreaView` em vez de margens fixas para o Android. **Decisão do dono:** nada da tela aparece atrás da hora e das notificações. Toda tela tem no topo uma faixa sólida `cores.barraStatus` (preta), como a Home: use a `BarraStatus` de `ui.js` (o `CabecalhoTela` já usa). Na web a faixa tem altura 0, então só dá para conferir no celular.
- **Expo Go:** a splash do app não aparece no Expo Go (só no APK).

## Problemas conhecidos (verificados no código)

- `assets/` ainda tem imagens que nenhum código usa (ex.: `liveLogoCut.gif`, de 11 MB, `logoInVideo.mp4`, `profile.jpeg`, `heroi_ml_10.png`). O Metro só empacota o que tem `require`, então elas não pesam no app, só no repositório. **Decisão do dono (2026-11-15): ficam todas.** Não proponha apagá-las de novo; se um dia ele mudar de ideia, confira com `git grep` antes.

## Verificação e depuração

- **Teste automático (web):** `npm run build:web && npm run test:web`. Cobre a navegação, o voltar, o ✕ do Details, os itens do menu, fechar o menu tocando fora, a busca (camada que bloqueia o toque, resultado abre direto, lupa limpa o filtro), `/heroi/999`, os botões de copiar e os erros no console. Sai com código 1 se algo falhar. Quando mudar um texto que o teste procura (ex.: um item do menu), atualize `scripts/teste-web.mjs` no mesmo commit.
- **Comparação visual:** `npm run shots` gera prints em `screenshots/`. Antes de mexer numa tela, copie a pasta para `screenshots-antes/` e compare depois.
- **Na web, manual:** `npm run preview:web`. Teste o modo offline (F12 → Network → Offline).
- **No celular:** sempre teste também no Expo Go. Há bugs que só aparecem no nativo (ex.: o `absoluteFillObject`).
- **Depurar no celular:** `console.log` aparece no terminal do `npx expo start`. Para elementos que "não aparecem", logue o `onLayout` (`e.nativeEvent.layout`): ele mostra se o componente renderiza com tamanho ou posição errados. Remova os logs antes do commit.

## Convenções

- Nomes de variáveis, componentes de UI e comentários em **português** (`busca`, `heroisFiltrados`, `aoFechar`, `irPara`). Siga esse padrão.
- Estilos inline via `StyleSheet.create`, num objeto chamado `style` ou `styles` (varia entre arquivos).
- Ajustes por plataforma usam `Platform.OS === "ios" ? x : y`, ou `Platform.select({ ios, web, default })` quando a web precisa de um valor próprio.
- **Visual (identidade do site oficial do MLBB):** fundo azul-marinho escuro (`#0d1424`), bordas azul-claras `hsl(191, 100%, 94%)`, textos secundários `#9bd1fd`, faixas de seção com `bg-Layer.png` + `hero.png`, dourado `#D3AF37` (bordas e títulos das telas secundárias) e `#ffd700` (menu, botões). Siga a tela `Details.js` como referência. Cores, espaços e fontes vêm de `tema.js`, e telas novas usam os componentes de `ui.js`.
- Não use `fontFamily` customizada (nenhuma fonte é carregada, e a web cai em fonte serifada). Use só `fontWeight`.
- **`FlatList`:** mantenha as props estáveis (`renderItem`, `keyExtractor`, handlers e estilos com `useCallback`, constantes ou `StyleSheet`). Funções inline fazem a grade inteira ser redesenhada a cada mudança de estado da tela (ex.: ao abrir o menu).
- Assets são carregados com `require`, com caminho relativo ao arquivo: de `src/telas/` ou `src/componentes/` é `require("../../assets/...")`.
- **Onde fica cada coisa:** tela (tem rota no `App.js`) vai em `src/telas/`; todo o resto que desenha algo vai em `src/componentes/`, mesmo que só uma tela use; dados e acesso a eles vão em `src/dados/`.
- **Dados de heróis só pelo `herois.js`:** nenhuma tela ou componente importa `banco_herois.js` direto. Se precisar de algo novo (ex.: heróis por classe), crie uma função no `herois.js`.
- **Componente recebe só o que usa** (I do SOLID): prefira uma função (`aoVoltar`, `aoTocar`) a passar o `navigation` inteiro.
- **Mudança de pasta** vai num commit só dela, com `git mv` (preserva o histórico), sem misturar com mudança de lógica.
- Commits são curtos e em inglês informal (ex.: "editing filter"), feitos a cada arquivo ou tela finalizado.

## Arquitetura (aplicada em 2026-11-15)

O dono está aprendendo C# (POO, SOLID). A explicação passo a passo, com comparações com C#, está no `explicaCode.md`.

### Como está

- O padrão é o do React: **composição de componentes** com dados descendo por props (fluxo unidirecional). Não é MVC nem MVVM.
- Camadas, uma por pasta:
  ```
  App.js (entrada + rotas, como um Program.cs)
    └▶ telas ──usam──▶ componentes ──usam──▶ tema
         └──pedem dados──▶ dados/herois.js ──lê──▶ dados/banco_herois.js
  ```
- Feito em 3 commits: `add heroes data layer`, `split details screen`, `move files to src`.

### POO e SOLID neste projeto

- **POO:** não há classes nem herança, e isso não faz falta. As ideias continuam aqui: encapsulamento (só o que tem `export` sai do módulo, e o `useState` é privado), composição em vez de herança (`children`) e polimorfismo por props (`<Cartao destaque="dourado">`, `<LinhaHeroi cor={cores.forte}>`).
- **S (responsabilidade única):** o mais útil. Exemplos: `ui.js`, `contatos.js` (tirou a duplicação entre Sobre e Feedback) e o Details quebrado em `IconeClasse`, `LinhaHeroi` e `HeroiNaoEncontrado`.
- **D (inversão de dependência):** o `herois.js` é o equivalente ao `IHeroiRepository` do C#. Em JS não há `interface`: as **funções exportadas por um módulo são o contrato**. Não precisa de injeção de dependência.
- **O (aberto/fechado):** o mapa `icones` do `IconeClasse` (classe nova = chave nova, sem `if/else`). Componentes se estendem por props/`children`.
- **I (segregação de interface):** "não exija props que não usa". Exemplo: o `HeroiNaoEncontrado` recebe só `aoVoltar`. Pendente: o `MenuLateral` ainda recebe o `navigation` inteiro, mas talvez só precise de `irPara(tela)`.
- **L (Liskov):** quase não se aplica (fala de herança). Versão solta: componentes com o mesmo contrato de props são intercambiáveis (`Fundo` no lugar do `ImageBackground`).
- **Alerta:** não exagerar. Repository/Service/UseCase num app offline seria cerimônia sem ganho. S + D resolvem 90%.

### Decisões do dono

- `IconeClasse` fica em **componentes**: mesmo sabendo uma regra do domínio, o que ele devolve é visual.
- `contatos.js` fica em **dados**.
- **Não** criar um `SecaoHerois` no Details: as duas seções (forte/fraco) repetidas ficam como estão, porque são só duas e o código fica fácil de ler.
- As regras de pastas e de dados estão na seção "Convenções".
