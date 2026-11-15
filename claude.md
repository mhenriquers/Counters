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

Todos os arquivos ficam na raiz, sem pasta `src/`. Cada tela é um arquivo `.js` com `StyleSheet.create` no final.

| Arquivo | Papel |
|---|---|
| `App.js` | Raiz. `SafeAreaProvider` + `NavigationContainer` (com `linking`) + Stack com `headerShown: false`. Todas as telas usam `component=`, sem render callback. |
| `HomeScreen.js` | Grade de heróis em 3 colunas (`FlatList`), em ordem alfabética (`localeCompare` pt-BR). A busca por nome aparece ao tocar na lupa. Ao tocar num herói, navega para `Details` com `{ id: item.id }`. Mostra `InstalarApp` abaixo do logo. Guarda o estado `menuAberto` e renderiza o `MenuLateral`. |
| `Details.js` | Recebe `{ id }`, busca o herói em `HEROIS` e mostra "Herói não encontrado" se o id não existir. Mostra foto, nome, classes (chips com ícone) e duas seções no estilo do site oficial (faixa `bg-Layer.png` + capacete `hero.png`): "É forte contra" (`counters`, destaque ciano) e "É fraco contra" (`counteradoPor`, destaque vermelho). Cada herói da lista é um card com foto, nome e classes. Tocar nele faz `navigation.push("Details", { id })`, empilhando telas. O ✕ usa `navigation.popTo("Home")`. **É a referência visual do app.** |
| `InstalarApp.js` | Botão "Instalar app" (só web/Chrome): captura o `beforeinstallprompt`. Não aparece no iPhone nem com o app já instalado. |
| `MenuLateral.js` | Gaveta feita à mão (não usa o drawer do react-navigation). Props: `visivel`, `aoFechar`, `navigation`. Animada com `Animated` (desliza da esquerda, `useNativeDriver` fora da web), continua montada até terminar de fechar, e com o menu aberto o voltar do Android (`BackHandler`) fecha o menu. A gaveta tem `overflow: "hidden"` porque a imagem de fundo (`fundoMG.png`, 1167x2000) transbordava e cobria a sombra, impedindo de fechar ao tocar fora. |
| `Doacoes.js` | Tela de apoio (URL `/apoiar`): copia uma chave Pix com `expo-clipboard`. |
| `Feedback.js` / `Sobre.js` | Links para GitHub e e-mail (`Linking`, `mailto:`) e um botão que copia um ID. Boa parte do código é duplicada entre as duas. |
| `Configuracoes.js` | Tela estática e informativa (idioma, tema, política de privacidade). Ainda não tem configurações funcionais. |
| `banco_herois.js` | **Fonte de todos os dados.** Exporta `HEROIS`. |
| `LoadingScreen.js` | **Não está registrada no Stack** (código morto). |
| `tema.js` | Tokens visuais: `cores`, `espaco`, `raio`, `fonte`. Toda cor, espaçamento ou tamanho de fonte novo deve vir daqui. |
| `ui.js` | Componentes compartilhados: `Fundo` (substitui o `ImageBackground`), `TituloSecao` (faixa do site + capacete), `CabecalhoTela`, `Cartao`, `Paragrafo`, `LinhaAcao`, `BotaoCopiar` (mostra "Copiado ✓", sem `Alert`) e `Rodape`. |
| `scripts/` | `gerar-icones.mjs` e `otimizar-imagens.mjs` (usam `sharp`); `teste-web.mjs` (E2E) e `screenshots.mjs` (prints), que usam `cdp-util.mjs`: servidor estático de `dist/` + Chrome headless via DevTools Protocol, sem dependências. Chrome em `CHROME_PATH` ou no caminho padrão do Windows. |
| `task.md` | Plano de trabalho em andamento (hoje: repaginada visual, na `main`). A seção "Estado atual" no topo diz o que foi feito e o próximo passo. |
| `atualizar-sdk.md` | Anotações do dono do projeto sobre como atualizar o SDK. |
| `DraftDetails.txt`, `cod.txt` | Rascunhos e trechos antigos. `DraftDetails.txt` é uma versão antiga de `Details.js`. Não são importados. |

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

## Armadilhas do SDK 58 / RN 0.88 / React Navigation 7

Aprendidas na atualização do SDK 54 para o 58. Valem para qualquer código novo.

- **`StyleSheet.absoluteFillObject` não existe mais** no RN 0.88. Use `StyleSheet.absoluteFill`. Na web ainda funciona (react-native-web), então o erro só aparece no celular: a View fica com altura 0 e o elemento "some".
- **`ImageBackground` está descontinuado** (aviso no Metro: "will be removed in a future release"). Ainda funciona, mas não use em código novo: use o `Fundo` de `ui.js`.
- **Imagem com `require` na web ganha o tamanho original do arquivo** se não receber `width`/`height`. O `ImageBackground` do react-native-web cai nisso quando o container só tem `flex: 1`: o fundo aparecia no tamanho real (ex.: 1125x2000) e só o canto superior esquerdo ficava visível. No celular não acontece. O `Fundo` já resolve, passando `width: "100%"` e `height: "100%"` para a imagem. O mesmo efeito fazia a imagem da gaveta do menu (1167x2000) cobrir a tela e impedir de fechar.
- **Filho `position: absolute` com `width: "100%"` num pai com padding fica mais curto no celular:** no Android, o `100%` desconta o padding do pai, mas a posição começa na borda, então sobra uma faixa no fim (aconteceu no cabeçalho da Home). Na web não acontece. No celular, use só `StyleSheet.absoluteFill`, sem tamanho. O `Fundo` já faz isso (o `100%` vale só na web).
- **React Navigation 7:** `navigate("Tela")` **não volta** para uma tela que já está na pilha, ele empilha outra. Para voltar a uma tela existente, use `navigation.popTo("Tela")`.
- **`app.json`:** as chaves `newArchEnabled`, `android.edgeToEdgeEnabled` e `splash` (na raiz) foram removidas. A splash agora é configurada no plugin `expo-splash-screen` (em `plugins`, com `image`, `resizeMode`, `backgroundColor` e `imageWidth`).
- **Edge-to-edge é obrigatório no Android:** o app desenha atrás da barra de status e da barra de navegação. Use `useSafeAreaInsets` / `SafeAreaView` em vez de margens fixas para o Android.
- **Expo Go:** a splash do app não aparece no Expo Go (só no APK).

## Problemas conhecidos (verificados no código)

- O `ImageBackground` (descontinuado) ainda é usado em 6 arquivos: Home, Menu, Doacoes, Sobre, Feedback, Configuracoes. O Details já usa o `Fundo`. A troca está planejada no `task.md`.
- No **Android**, copiar (Pix e ID) não mostra nenhum aviso: só há `Alert` no iOS e `window.alert` na web.
- O ID copiado em Sobre e Feedback leva um espaço na frente (`" 1033871650"`).
- Erros de digitação: "Torne-se um apoidor" (menu), "Unico" e "Politica" (Configurações), "se vc pediu" (Feedback).
- "Avalie-nos" em Configurações não faz nada (`TouchableOpacity` sem `onPress`).
- O cabeçalho de Doações ocupa só a largura do texto (o container pai tem `alignItems: "center"`).
- Os textos das telas secundárias usam recuo feito com espaços (`{"        "}`).
- `LoadingScreen.js` usa a cor `'21FFB5'` sem `#`.
- `assets/` tem vários arquivos de teste ou duplicados (`bgLayer - Copia.png`, `botaoVoltar (1).png`, `bg.layerTeste.png`, `gojo.jpg`).

## Verificação e depuração

- **Teste automático (web):** `npm run build:web && npm run test:web`. Cobre a navegação, o voltar, o ✕ do Details, os itens do menu, fechar o menu tocando fora, `/heroi/999`, os botões de copiar e os erros no console. Sai com código 1 se algo falhar. Quando mudar um texto que o teste procura (ex.: um item do menu), atualize `scripts/teste-web.mjs` no mesmo commit.
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
- Assets são carregados com `require("./assets/...")`, com caminho relativo à raiz.
- Commits são curtos e em inglês informal (ex.: "editing filter"), feitos a cada arquivo ou tela finalizado.

## Arquitetura (conversa de 2026-11-15, ainda não aplicada)

O dono está aprendendo C# (POO, SOLID) e quis entender a arquitetura deste projeto. Resumo do que foi conversado, para retomar depois.

### Como está hoje

- **Sem arquitetura formal:** estrutura plana e centrada em telas. Cada tela busca dados, transforma, desenha e estiliza sozinha.
- Camadas começando a surgir: `App.js` (entrada + rotas, como um `Program.cs`) → telas → `ui.js` (componentes) → `tema.js` (tokens) → `banco_herois.js` (dados).
- O padrão é o do React: **composição de componentes** com dados descendo por props (fluxo unidirecional). Não é MVC nem MVVM.

### POO e SOLID neste projeto

- **POO:** não há classes nem herança, e isso não faz falta. As ideias continuam aqui: encapsulamento (só o que tem `export` sai do módulo, e o `useState` é privado), composição em vez de herança (`children`) e polimorfismo por props (`<Cartao destaque="dourado">`).
- **S (responsabilidade única):** o mais útil. Criar o `ui.js` já foi aplicar o S. Violações atuais: as telas acessam os dados direto, o `Details.js` faz cerca de 8 coisas, e `Sobre.js`/`Feedback.js` duplicam código (a Fase 7 do `task.md` resolve essa duplicação).
- **D (inversão de dependência):** o equivalente ao `IHeroiRepository` do C#. Em JS não há `interface`: as **funções exportadas por um módulo são o contrato**. Não precisa de injeção de dependência.
- **O (aberto/fechado):** exemplo existente é o mapa `iconesClasses` (classe nova = chave nova, sem `if/else`). Componentes se estendem por props/`children`.
- **I (segregação de interface):** "não exija props que não usa". Ex.: o `MenuLateral` recebe o `navigation` inteiro, mas talvez só precise de `irPara(tela)`.
- **L (Liskov):** quase não se aplica (fala de herança). Versão solta: componentes com o mesmo contrato de props são intercambiáveis (`Fundo` no lugar do `ImageBackground`).
- **Alerta:** não exagerar. Repository/Service/UseCase num app offline seria cerimônia sem ganho. S + D resolvem 90%.

### Plano (depois da repaginada do `task.md`)

1. **Camada de dados (D), pode ser feita a qualquer momento**, mesmo antes de mover pastas: um `herois.js` com `buscarHeroi(id)`, `buscarHerois(ids)` e `listarHerois()` (já ordenado). Por dentro, um `Map` por id (troca o `HEROIS.find`, que percorre o array) e um herói já "preparado", com `classes: [...]` (as telas param de fazer `split("/")`). **Nenhuma tela importa `banco_herois.js` direto.**
2. **Details com S:** sai `LinhaHeroi`, `HeroiNaoEncontrado` e `IconeClasse` para componentes. A tela só compõe as peças, indo de cerca de 435 para 150 a 200 linhas.
3. **Pastas:** um commit **só de mudança de pasta**, com `git mv` (preserva o histórico) e os caminhos ajustados. Não fazer no meio da repaginada, para não misturar "moveu" com "mudou" no diff. Custo medido em 2026-11-15: 69 imports relativos nos `.js` + 133 `require` de imagens no `banco_herois.js`. Caminho errado faz o Metro parar o build (erro barulhento).
   ```
   App.js
   src/
     telas/        Home, Details, Sobre...
     componentes/  ui.js, MenuLateral, InstalarApp, LinhaHeroi, IconeClasse...
     dados/        banco_herois.js, herois.js
     tema.js
   ```
4. Depois de mover, transformar estas regras em convenções (seção acima) e atualizar a tabela de Estrutura e os scripts de teste.

### Decisões tomadas

- `IconeClasse` fica em **componentes** (decisão do dono: mesmo sabendo uma regra do domínio, o que ele devolve é visual).
- Reorganizar as pastas só **depois** da repaginada.

### Regras propostas (valem quando o plano for aplicado)

- Tela nova vai em `telas/`. Componente usado em 2+ telas vai em `componentes/`.
- Telas pegam dados só pelas funções de `dados/herois.js`.
