# Tarefa: repaginada visual do app

## 📍 Estado atual (atualize ao fim de cada sessão)

- **Feito:** Fases 0 a 8 (ferramentas de teste, `tema.js`, `ui.js`, Details usando o tema, Home, menu lateral, `contatos.js`, Doações). Último commit: `donations screen redesign`.
- **Branch:** o trabalho está direto na `main` (a `rework` foi mergeada por fast-forward e não existe mais). A `main` está **16 commits à frente** do GitHub (sem push).
- **Aguardando:** o dono testar Doações redesenhada no celular (Fase 8): emblema encolhendo ao rolar, cabeçalho fora da barra de status, rolar até o fim, "Copiar chave" mostrando "Copiado ✓".
- **Próximo passo:** Fase 9 (Feedback).
- **Arquitetura:** a conversa sobre SOLID e pastas está resumida no `claude.md` (seção "Arquitetura"). Aplicar só **depois** desta repaginada.
- **Jeito de trabalhar combinado com o dono:**
  - fazer **uma tela por vez**, commitar e **parar**, para ele testar no celular antes da próxima;
  - deixar as perguntas para o **final** da resposta;
  - ele está aprendendo: quando pedir para ensinar, explique o porquê e mostre os comandos, em vez de só fazer.
- **Fora deste plano (o dono vai readicionar depois):** publicar o site no Netlify (a configuração já está no `netlify.toml`), testar a PWA instalada no celular e colocar o link do site no README.

## Objetivo

Deixar o app com cara **profissional**, mantendo a **identidade do site oficial do MLBB**: fundo azul-marinho escuro, faixas azuis translúcidas com filete à esquerda (`bg-Layer.png`), capacete (`hero.png`), ícones de classe, bordas azul-claras e destaques dourados.

A tela **Details** já foi refeita nesse estilo e é a **referência visual** de tudo. O resto do app deve parecer feito pela mesma pessoa, no mesmo dia.

## Regras para executar

1. Siga as fases **na ordem**. Dentro de cada fase, faça uma tarefa por vez.
2. Cada fase termina com **✅ Verificar**. Se falhar, **não avance**: corrija primeiro.
3. **Commit a cada arquivo ou tela finalizado** (não só no fim da fase), com mensagem curta em inglês informal, como pede o `claude.md`. Se uma tarefa mexe em vários arquivos de uma vez (ex.: tela + teste), eles vão juntos no mesmo commit.
4. **Não mude textos** (conteúdo das telas) além do que a tarefa manda. Correções de digitação estão listadas explicitamente.
5. Nomes de variáveis, componentes e comentários em **português**.
6. Nunca use `StyleSheet.absoluteFillObject` (removido no RN 0.88). Use `StyleSheet.absoluteFill`.
7. Nada de `fontFamily` customizada (não há fontes carregadas). Use só `fontWeight`.
8. Teste sempre na web **e** no celular (Expo Go). Bugs de layout podem aparecer só no celular.

---

## Referência visual (de onde vêm os valores)

**Cores** (já usadas no app):

| Nome | Valor | Onde aparece hoje |
|---|---|---|
| `fundo` | `#0d1424` | fundo do Details |
| `cartao` | `rgba(10, 17, 32, 0.72)` | cards da lista do Details |
| `bordaCartao` | `rgba(155, 209, 253, 0.16)` | borda dos cards do Details |
| `azulBorda` | `hsl(191, 100%, 94%)` | bordas das fotos de herói |
| `azulTexto` | `#9bd1fd` | textos secundários do Details |
| `dourado` | `#D3AF37` | bordas e títulos das telas secundárias (12 usos) |
| `douradoVivo` | `#ffd700` | itens do menu, botão "Instalar app" |
| `texto` | `#ffffff` | |
| `textoSuave` | `rgba(255, 255, 255, 0.75)` | |
| `textoFraco` | `rgba(255, 255, 255, 0.45)` | rodapés |
| `forte` | `#4fd8eb` | seção "É forte contra" |
| `fraco` | `#ff6b7a` | seção "É fraco contra" |

**Papéis:** o **azul** é a estrutura (bordas, faixas, ícones). O **dourado** é destaque (títulos de seção nas telas secundárias, botões de ação, borda de cartões de texto). Não misture os dois no mesmo elemento.

**Elementos do site que devem ser reaproveitados:**

| Asset | Papel |
|---|---|
| `bgDetails.png` | fundo das telas internas (já no Details) |
| `bgbg.png` | fundo da Home |
| `bg-up-side.png` | fundo das telas secundárias |
| `bg-Layer.png` + `hero.png` | faixa de título de seção (já no Details) |
| `header.png` | fundo do cabeçalho das telas secundárias |
| `seta-branca.png` / `botaoVoltar.png` / `botao-fechar.png` | botões de navegação |
| `logo.png` | logo COUNTERS |
| `icon-doar.png`, `icon-config.png`, `icon-feedback.png`, `icon-sobre.png` | ícones do menu |
| `gmail.png`, `gitHub.png`, `imortal.png` | ícones de contato |

---

## Fase 0: Preparação

- [x] 0.1. Confirme a branch `rework` e a árvore limpa: `git branch --show-current` e `git status --short` (só `task.md` pode aparecer).
- [x] 0.2. Faça commit do `task.md`: `git add task.md && git commit -m "add redesign plan"`.
- [x] 0.3. Rode `npm run build:web`. Deve terminar sem erro (linha do Workbox com "precache").

---

## Fase 1: Ferramentas de verificação

Hoje os testes automáticos só existem fora do projeto. Esta fase traz eles para dentro, para que **toda fase seguinte** possa ser verificada com um comando.

- [x] 1.1. Crie `scripts/teste-web.mjs`: teste E2E via Chrome DevTools Protocol, sem dependências novas. (Feito: o servidor estático e a conexão com o Chrome ficam em `scripts/cdp-util.mjs`, usado pelos dois scripts. Porta 3100 para teste, 3101 para prints.)
  - Sobe `npx serve dist --single -l 3000` sozinho e derruba ao terminar.
  - Caminho do Chrome: variável `CHROME_PATH` ou o padrão `C:/Program Files/Google/Chrome/Application/chrome.exe`.
  - Viewport de celular: 384x832, `mobile: true`.
  - Casos (cada um imprime `PASS`/`FAIL`):
    1. `/` carrega e mostra "Aamon";
    2. clicar em Aamon leva a `/heroi/1`;
    3. clicar no 1º counter leva a `/heroi/<id>`;
    4. `history.back()` 2x volta para `/`;
    5. o ✕ no Details depois de 2 heróis volta para `/`;
    6. o ☰ abre o menu, e cada item leva à rota certa (`/apoiar`, `/configuracoes`, `/feedback`, `/sobre`);
    7. tocar fora da gaveta fecha o menu (a gaveta some do DOM);
    8. `/heroi/999` mostra "Herói não encontrado";
    9. erros e avisos do console (`Runtime.exceptionThrown`, `console.error`/`warn`) são listados no fim.
  - Encontrar elementos: pelo **texto visível** (comparação sem maiúsculas/minúsculas, `innerText.toLowerCase()`) ou por `img[src*="nome-do-asset"]`, sempre pegando o **último** elemento encontrado (telas empilhadas continuam no DOM) e rolando até ele (`scrollIntoView`) antes de clicar.
  - Sai com código 1 se houver alguma falha.
- [x] 1.2. Crie `scripts/screenshots.mjs`: tira prints em 384x832 de `/`, `/heroi/1`, `/heroi/67`, `/heroi/999`, `/apoiar`, `/sobre`, `/feedback`, `/configuracoes` e da Home com o menu aberto. Salva em `screenshots/<nome>.png`.
- [x] 1.3. Adicione `screenshots/` ao `.gitignore`.
- [x] 1.4. No `package.json`, adicione os scripts `"test:web": "node scripts/teste-web.mjs"` e `"shots": "node scripts/screenshots.mjs"`.

**✅ Verificar:** `npm run build:web && npm run test:web` mostra só `PASS` e "nenhum erro no console". Depois `npm run shots` gera 9 imagens em `screenshots/`. Guarde essas imagens como o **"antes"**: copie a pasta para `screenshots-antes/` (também no `.gitignore`).

> ⚠️ Sempre que uma fase mudar um texto que o teste procura (ex.: itens do menu), atualize `scripts/teste-web.mjs` **na mesma tarefa**.

Commit: `add web e2e test and screenshot scripts`.

---

## Fase 2: Tema (`tema.js`)

Um arquivo só com cores, espaçamentos e tamanhos. Nenhuma tela muda nesta fase.

- [x] 2.1. Crie `tema.js` na raiz exportando:
  ```js
  export const cores = { /* exatamente a tabela "Cores" acima */ };
  export const espaco = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
  export const raio = { sm: 6, md: 8, lg: 14, pilula: 999 };
  export const fonte = {
    tituloTela: 26,   // nome do herói, títulos grandes
    cabecalho: 17,    // título do cabeçalho das telas
    secao: 15,        // título de seção (maiúsculas)
    corpo: 14,        // parágrafos
    item: 15,         // nome em listas/linhas
    legenda: 12,      // textos secundários
    rodape: 11,
  };
  ```

**✅ Verificar:** `npm run build:web` sem erro (o arquivo ainda não é importado por ninguém).

Commit: `add theme tokens`.

---

## Fase 3: Componentes compartilhados (`ui.js`)

Todos ficam num arquivo só, `ui.js`, na raiz, e usam `tema.js`. Cada tarefa cria **um** componente. Nenhuma tela usa eles ainda.

- [x] 3.1. **`Fundo`**: substitui o `ImageBackground` (descontinuado no RN 0.88).
  - Props: `fonte` (o `require` da imagem), `modo` (`resizeMode`, padrão `"cover"`), `style`, `children`.
  - Implementação: `<View style={style}>` + `<Image source={fonte} resizeMode={modo} style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]} />` + `children`. (Feito sem `overflow: "hidden"` fixo: a imagem já tem 100% do tamanho e nunca vaza, e cortar por padrão poderia esconder conteúdo que transborda de propósito, como o logo da Home. Quem precisar, passa `overflow` no `style`.)
- [x] 3.2. **`TituloSecao`**: mova do `Details.js` **sem mudar o visual** (faixa `bg-Layer.png` + `hero.png` + título em maiúsculas + subtítulo opcional).
  - Props: `titulo`, `subtitulo` (opcional), `cor` (cor do subtítulo, padrão `cores.azulTexto`).
  - Usa `Fundo` com `modo="stretch"`.
- [x] 3.3. **`CabecalhoTela`**: cabeçalho padrão das telas secundárias.
  - Props: `titulo`, `aoVoltar`.
  - Altura 56 + `useSafeAreaInsets().top` (padding no topo). Fundo `header.png` via `Fundo`. Seta `seta-branca.png` (24x24) num botão de toque 44x44 com `hitSlop={8}`. Título branco, `fontWeight: "700"`, `fonte.cabecalho`. Linha inferior de 1px `cores.bordaCartao`.
- [x] 3.4. **`Cartao`**: caixa de conteúdo.
  - Props: `destaque` (`"azul"` padrão, ou `"dourado"`), `style`, `children`.
  - Fundo `cores.cartao`, borda 1px (`cores.bordaCartao` ou `cores.dourado` com 50% de opacidade, `rgba(211, 175, 55, 0.5)`), `raio.md`, padding `espaco.lg`, margem horizontal `espaco.lg`.
- [x] 3.5. **`Paragrafo`**: texto corrido.
  - `fonte.corpo`, `lineHeight: 21`, cor `cores.textoSuave`, `marginBottom: espaco.md` (o último parágrafo recebe `ultimo` para zerar a margem).
  - **Sem recuo com espaços.** Parágrafos separados viram `<Paragrafo>` separados.
- [x] 3.6. **`LinhaAcao`**: linha tocável, usada no menu, nos contatos e nas configurações.
  - Props: `icone` (require, opcional), `titulo`, `subtitulo` (opcional), `aoTocar` (opcional: sem ele, a linha não é tocável e não mostra seta), `direita` (elemento opcional no lugar da seta), `corTitulo` (padrão `cores.texto`).
  - Altura mínima 56, ícone 28x28 com `resizeMode="contain"`, título `fonte.item` `fontWeight: "600"`, subtítulo `fonte.legenda` `cores.azulTexto`, seta "›" `rgba(224, 250, 255, 0.45)` tamanho 26. Mesmo estilo de card das linhas do Details (`cores.cartao`, borda `cores.bordaCartao`, `raio.md`), `marginHorizontal: espaco.lg`, `marginTop: espaco.sm`.
- [x] 3.7. **`BotaoCopiar`**: copia um texto e confirma **sem `Alert`** (funciona igual em Android, iOS e web).
  - Props: `texto` (o que vai para a área de transferência), `rotulo` (padrão "Copiar").
  - Usa `expo-clipboard`. Depois de copiar, mostra "Copiado ✓" por 2 segundos e volta ao rótulo (`useState` + `setTimeout`, limpando o timer no unmount).
  - Visual: pílula dourada (`cores.douradoVivo`, texto preto `fontWeight: "700"`), padding 8x16.
- [x] 3.8. **`Rodape`**: texto pequeno de rodapé.
  - `fonte.rodape`, itálico, `cores.textoFraco`, centralizado, `marginTop: espaco.xl`, `marginHorizontal: espaco.xl`.

**✅ Verificar:** `npm run build:web` sem erro. `ui.js` importa só `react`, `react-native`, `react-native-safe-area-context`, `expo-clipboard`, `./tema`.

Commit: `add shared ui components`.

---

## Fase 4: Details usa o tema (sem mudança visual)

- [x] 4.1. Em `Details.js`, troque as constantes `AZUL_BORDA`, `AZUL_TEXTO`, `COR_FORTE`, `COR_FRACO` por `cores.*` de `tema.js`.
- [x] 4.2. Apague a função `TituloSecao` local e importe a de `ui.js`.
- [x] 4.3. Troque os 2 `ImageBackground` por `Fundo` (o fundo da tela com `bgDetails.png`; a faixa já está dentro do `TituloSecao`). Remova `ImageBackground` do import.
- [x] 4.4. Estilize o estado "Herói não encontrado": fundo `bgDetails.png`, texto `cores.texto` e um botão em pílula dourada "Voltar para a lista" (chama `navigation.popTo("Home")`).

**✅ Verificar:** `npm run test:web` tudo `PASS`. `npm run shots`, e compare `heroi-1.png` e `heroi-67.png` com o "antes": devem estar **idênticos** (só o `heroi-999.png` muda). No celular: abrir um herói e conferir a tela.
> 📝 **Resultado da Fase 4:** o conteúdo do Details ficou idêntico, mas o **fundo** mudou na web: agora aparece a marca d'água "M" do `bgDetails.png`. Isso é uma **correção**: o `ImageBackground` do react-native-web desenhava a imagem no tamanho original (1125x2000), cortando só o canto superior esquerdo, quando o container não tinha `width`/`height` (o próprio código dele chama isso de "Temporary Workaround"). O `Fundo` preenche a tela em modo `cover`, como o celular já fazia. **Nas próximas fases, espere a mesma diferença de fundo na web** ao comparar com `screenshots-antes/`. Compare só o conteúdo.

Commit: `details uses theme and shared components`.

---

## Fase 5: Home

- [x] 5.1. Troque os 2 `ImageBackground` por `Fundo` (`bgbg.png` e `bg-header.png`).
- [x] 5.2. **Cabeçalho:**
  - altura fixa 56;
  - ☰ à esquerda (44x44, como já está);
  - separador;
  - lupa à direita com área de toque 44x44 e `hitSlop={8}`.
- [x] 5.3. **Campo de busca** (aparece ao tocar na lupa, como hoje):
  - pílula com fundo `rgba(155, 209, 253, 0.1)`, borda 1px `rgba(155, 209, 253, 0.35)`, `raio.pilula`, altura 36, texto `cores.texto`;
  - quando houver texto, mostra um "✕" à direita que limpa a busca (`setBusca("")`).
  - Não mude a lógica de abrir/fechar (`pesquisar`) nem o filtro.
- [x] 5.4. **Contador e lista vazia:**
  - abaixo do logo, um texto `fonte.legenda` `cores.azulTexto` centralizado: "`N` heróis" (ou "`N` resultados para "`busca`"" quando estiver buscando), com `N = heroisFiltrados.length`;
  - se `N === 0`, a lista mostra (`ListEmptyComponent`) "Nenhum herói encontrado" em `cores.textoSuave`.
  - ⚠️ O cabeçalho da lista é a constante `cabecalhoGrade`, fora do componente. Como o contador depende de estado, crie um `useMemo` para o cabeçalho, com dependências `[heroisFiltrados.length, busca]`.
- [x] 5.5. **Quadros dos heróis:** troque a borda por `cores.azulBorda` (mesmo valor) importado do tema, e a sombra (`elevation: 10`) por `elevation: 4`. O resto fica igual (o tamanho e o nome foram ajustados recentemente).
- [x] 5.6. **Botão "Instalar app"** (`InstalarApp.js`): use `cores.douradoVivo` e `raio.pilula` do tema, e `marginBottom: espaco.md`. Só a web mostra o botão.

**✅ Verificar:** `npm run test:web` tudo `PASS`. Nos prints: cabeçalho alinhado, contador visível. Na web, buscar "zzz" mostra "Nenhum herói encontrado", e o ✕ limpa a busca. No celular: busca, teclado e rolagem funcionando.

> 📝 **Resultado da Fase 5:** o **contador foi removido** a pedido do dono (ficou só o "Nenhum herói encontrado"). No celular, o fundo do cabeçalho terminava 16px antes da borda direita: era um bug do `Fundo` (o `width: "100%"` com o padding do pai). A primeira correção tirou o `100%` no celular e deixou os fundos com o tamanho do arquivo (zoom gigante). A correção final põe a imagem numa `View` com `absoluteFill` (ver "Armadilhas" no `claude.md`). Um modo "encaixar pela largura" foi testado e desfeito: no celular, mudava só ~10%. O fundo do cabeçalho (`bg-header.png`) ficou em `cover`, como o `ImageBackground` fazia no celular. A lista vazia é o componente `ListaVazia`, fora da Home (referência estável para a `FlatList`). Na web, o campo de busca não mostra o contorno azul do navegador (`outlineStyle: "none"`). Os ícones ☰ e lupa ficam no tamanho original, dentro de uma área de toque mínima de 44x44.

Commit: `home redesign`.

---

## Fase 6: Menu lateral

- [x] 6.1. Troque o `ImageBackground` (`fundoMG.png`) por `Fundo`.
- [x] 6.2. **Topo da gaveta:**
  - `paddingTop: insets.top + espaco.md` (`useSafeAreaInsets`);
  - troque o texto "Fechar" (hoje preto, quase invisível) por um botão com `botao-fechar.png` (32x32), alinhado à direita, área 44x44;
  - logo logo abaixo, `width: "80%"`, altura 70, `resizeMode="contain"`.
- [x] 6.3. **Itens:**
  - troque os 4 `TouchableOpacity` por `LinhaAcao` (com `icone` e `titulo`, `corTitulo={cores.douradoVivo}`, `aoTocar={() => irPara(...)}`);
  - corrija "Torne-se um apoidor" para **"Torne-se um apoiador"**;
  - atualize o texto em `scripts/teste-web.mjs` na mesma tarefa.
- [x] 6.4. **Rodapé da gaveta** (fixo embaixo): `Rodape` com "Versão 1.0.0" e, abaixo, "Dados: site oficial do MLBB". `paddingBottom: insets.bottom + espaco.lg`.
- [x] 6.5. Não mexa na animação, no `BackHandler` nem no `overflow: "hidden"` da gaveta.

**✅ Verificar:** `npm run test:web` tudo `PASS` (inclusive "tocar fora fecha"). Print `menu.png`: ✕ visível, itens alinhados, rodapé. No celular: abrir, fechar pelo ✕, tocar fora e o gesto de voltar.

> 📝 **Resultado da Fase 6:** o texto "Fechar" virou o botão `botao-fechar.png`, **na mesma linha do logo** (a pedido do dono: com o ✕ numa linha só pra ele, sobrava muito espaço vazio no topo). O logo tem a largura calculada (`larguraGaveta - SOBRA_TOPO`) para não pegar a largura do arquivo no celular. Na web, o fundo da gaveta agora mostra a marca "M" do `fundoMG.png` (mesma correção de tamanho de imagem das fases anteriores). A cor `#121212` da gaveta ficou porque o teste web acha a gaveta por ela.

Commit: `side menu redesign`.

---

## Fase 7: Lógica de contato compartilhada (`contatos.js`)

`Sobre.js` e `Feedback.js` têm as **mesmas** funções copiadas. Esta fase junta tudo num lugar, sem mudar visual.

- [x] 7.1. Crie `contatos.js` exportando:
  - `EMAIL = "mlbbcounters@gmail.com"`, `GITHUB_USUARIO = "mhenriquers"`, `ID_JOGO = "1033871650"` (**sem** o espaço na frente que existe hoje);
  - `abrirGit()` e `enviarEmail()`, copiados de `Sobre.js` sem mudança de comportamento.
- [x] 7.2. Em `Sobre.js` e `Feedback.js`, apague as cópias locais de `abrirGit`, `enviarEmail` e `copiaId` e importe de `contatos.js`. (O `copiaId` vira `BotaoCopiar` nas fases 9 e 10. Até lá, use `Clipboard.setStringAsync(ID_JOGO)` direto.)

**✅ Verificar:** `npm run test:web` tudo `PASS`. Os prints de Sobre e Feedback continuam iguais ao "antes".

> 📝 **Resultado da Fase 7:** o `copiaId` virou `copiarId()` em `contatos.js`, mantendo o aviso de hoje (`window.alert` na web, `Alert` no iOS), em vez do `Clipboard` direto: sem o aviso, o teste de copiar em Sobre/Feedback falharia até as fases 9 e 10. Nessas fases, troque por `BotaoCopiar` e apague o `copiarId`. As duas cópias diferiam (só o Sobre avisava no iOS): ficou a versão do Sobre. O ID agora é copiado sem o espaço na frente. Prints de Sobre e Feedback idênticos pixel a pixel.

Commit: `share contact helpers`.

---

## Fase 8: Doações

- [x] 8.1. Troque o cabeçalho (`ImageBackground` + seta + texto) por `<CabecalhoTela titulo="Apoiar o projeto" aoVoltar={() => navigation.goBack()} />`. Isso também corrige o bug de o cabeçalho ocupar só a largura do texto.
- [x] 8.2. Troque o fundo (`bg-up-side.png`) por `Fundo`.
- [x] 8.3. Mantenha o emblema `imortal.png` no topo (120x120, centralizado, `marginTop: espaco.xl`).
- [x] 8.4. Título "Torne-se um Lendário Apoiador!" fora do cartão, centralizado, `fonte.tituloTela - 6` (20), branco, `fontWeight: "800"`.
- [x] 8.5. O texto vira `<Cartao destaque="dourado">` com **2** `<Paragrafo>` (os 2 parágrafos atuais, **sem** os espaços de recuo e sem o itálico).
- [x] 8.6. **Área do Pix** num `<Cartao>`:
  - legenda "Chave Pix" (`fonte.legenda`, `cores.azulTexto`);
  - chave em `fonte.corpo` `cores.texto`, com `selectable`;
  - `<BotaoCopiar texto={chavePix} rotulo="Copiar chave" />`;
  - apague a função `copiaPix` (o `BotaoCopiar` já confirma).
- [x] 8.7. O aviso "As doações realizadas via Pix…" vira `Rodape` (sem os espaços de recuo).
- [x] 8.8. Remova os imports que sobrarem sem uso (`Alert`, `Touchable`, `SafeAreaProvider`…).
- [x] 8.9. Atualize o teste: o caso de copiar em `/apoiar` agora clica em "Copiar chave" e espera ver "Copiado ✓" (não há mais `window.alert`).

**✅ Verificar:** `npm run test:web` tudo `PASS`. No print `apoiar.png`, cabeçalho com largura total. No celular: copiar mostra "Copiado ✓" (antes, no Android, não aparecia nada).

> 📝 **Resultado da Fase 8:** o teste de copiar em `/apoiar` ficou mais rígido: exige "Copiado ✓" na tela **e** nenhum `window.alert`. O `botao-copiar.png` deixou de ser usado (o build tem 1 arquivo a menos). Dá para apagar na Fase 12.
> **Redesenho pedido pelo dono** (achou amador, com as coisas soltas): bloco de destaque como o do Details (emblema 200 + título em maiúsculas + divisor dourado), seções com `TituloSecao` ("Por que apoiar", "Chave Pix"), chave num campo e botão de copiar com a largura toda (`BotaoCopiar` ganhou a prop `style`). O emblema **encolhe ao rolar** (até 55%, desce até 57px e esmaece; `Animated` com native driver no celular). O texto ficava "esquecido": o `Cartao` dourado ficou mais sólido (`rgba(10, 17, 32, 0.88)`), o `Paragrafo` usa `cores.textoCorpo` (90% de branco) e "Você já é o MVP dessa jornada!" fica em dourado e negrito. O dono **não quis degradês**: nem no fundo do cartão, nem brilho atrás do emblema (ali fica transparente, mostrando o fundo da tela).

Commit: `donations screen redesign`.

---

## Fase 9: Feedback

- [ ] 9.1. `CabecalhoTela titulo="Feedback"` e `Fundo` (como na Fase 8).
- [ ] 9.2. Remova o logo grande do topo (o cabeçalho já identifica a tela). Abra com `TituloSecao titulo="Sugestões ou erros?"` e `marginTop: espaco.lg`.
- [ ] 9.3. O texto vira `<Cartao destaque="dourado"><Paragrafo ultimo>…</Paragrafo></Cartao>` (sem recuo).
- [ ] 9.4. **Contatos** com `LinhaAcao`:
  - `gmail.png` com título `EMAIL` e subtítulo "Enviar e-mail", `aoTocar={enviarEmail}`;
  - `gitHub.png` com título `GITHUB_USUARIO` e subtítulo "Abrir GitHub", `aoTocar={abrirGit}`;
  - `imortal.png` com título "Owdail" e subtítulo `"ID: " + ID_JOGO`, e `direita={<BotaoCopiar texto={ID_JOGO} />}` (sem `aoTocar`).
- [ ] 9.5. O aviso "Ao utilizar nossos canais…" vira `Rodape`.
- [ ] 9.6. Seção "Retorno": `TituloSecao titulo="Retorno"` + `Cartao` + `Paragrafo ultimo`. Corrija "se vc pediu" para **"se você pediu"**.
- [ ] 9.7. Remova os estilos e imports sem uso (inclusive os de `fontFamily` monospace).
- [ ] 9.8. Atualize o teste de copiar em `/feedback` (clicar em "Copiar" e esperar "Copiado ✓").

**✅ Verificar:** `npm run test:web` tudo `PASS`. No celular: e-mail abre o app de e-mail, GitHub abre o navegador, copiar mostra "Copiado ✓".

Commit: `feedback screen redesign`.

---

## Fase 10: Sobre

- [ ] 10.1. `CabecalhoTela titulo="Sobre"` e `Fundo`.
- [ ] 10.2. Topo: `logo.png` (`width: "70%"`, altura 90, `resizeMode="contain"`, centralizado), com "Versão 1.0.0 — Build: Perfurador" logo abaixo (`fonte.legenda`, `cores.azulTexto`). Esse texto sai do fim da tela.
- [ ] 10.3. Cada seção vira `TituloSecao` + `Cartao` + `Paragrafo`, com os textos atuais **sem recuo**:
  - "Early Game": 1 parágrafo;
  - "Lore": 4 parágrafos (separe pelos `{"\n"}` atuais);
  - "Aviso legal": 2 parágrafos.
- [ ] 10.4. "Contato": as mesmas 3 `LinhaAcao` da Fase 9.4, mais o `Rodape` "Ao utilizar nossos canais…".
- [ ] 10.5. Apague o bloco comentado do perfil (`profile.jpeg`).
- [ ] 10.6. Remova estilos e imports sem uso.
- [ ] 10.7. Atualize o teste de copiar em `/sobre`.

**✅ Verificar:** `npm run test:web` tudo `PASS`. No print, todas as seções no mesmo padrão. No celular: rolar até o fim sem nada cortado.

Commit: `about screen redesign`.

---

## Fase 11: Configurações

- [ ] 11.1. `CabecalhoTela titulo="Configurações"` e `Fundo`. Remova o logo grande.
- [ ] 11.2. **Preferências**: `TituloSecao titulo="Preferências"` + 2 `LinhaAcao` **sem `aoTocar`** (informativas):
  - "Idioma" com subtítulo "Português";
  - "Tema" com subtítulo **"Único"** (corrige "Unico").
- [ ] 11.3. "Avalie-nos": hoje não faz nada. **Remova** (decidido: o app não está numa loja, então não há página para avaliar; volta quando estiver na Play Store).
- [ ] 11.4. **Privacidade e uso**: `TituloSecao titulo="Privacidade e uso"` + `Cartao` com 3 blocos, cada um com um subtítulo em negrito (`fonte.item`, branco, `fontWeight: "700"`) e um `Paragrafo`:
  - **"Política de privacidade"** (corrige "Politica");
  - "Uso de imagens e direitos autorais";
  - "Links externos".
  - Textos atuais, sem os espaços de recuo.
- [ ] 11.5. Remova estilos e imports sem uso.

**✅ Verificar:** `npm run test:web` tudo `PASS`. Print `configuracoes.png` no padrão das outras telas.

Commit: `settings screen redesign`.

---

## Fase 12: Limpeza e consistência

- [ ] 12.1. `git grep -n "ImageBackground" -- "*.js"` deve dar **0 resultados**.
- [ ] 12.2. `git grep -n "absoluteFillObject\|fontFamily" -- "*.js"` deve dar **0 resultados**.
- [ ] 12.3. `git grep -n '{"  ' -- "*.js"` (recuo feito com espaços) deve dar **0 resultados**.
- [ ] 12.4. Procure cores soltas que já existem no tema (`#D3AF37`, `#ffd700`, `#9bd1fd`, `hsl(191`) fora de `tema.js` e troque por `cores.*`.
- [ ] 12.5. Rode `npx expo-doctor` (deve dar todas as verificações OK).
- [ ] 12.6. Apague o código morto e os arquivos de teste, um `git rm` por vez, conferindo antes com `git grep` que nada os importa:
  - `LoadingScreen.js`, `DraftDetails.txt`, `cod.txt`;
  - `assets/gojo.jpg`, `"assets/bgLayer - Copia.png"`, `"assets/botaoVoltar (1).png"`, `assets/bg.layerTeste.png`.
  
  Depois, tire `LoadingScreen.js` e os rascunhos da tabela de Estrutura do `claude.md`, e os dois itens correspondentes de "Problemas conhecidos".

**✅ Verificar:** `npm run build:web && npm run test:web` tudo `PASS`, com "nenhum erro no console". `npm run shots`: coloque o "antes" e o "depois" lado a lado e revise tela por tela.

Commit: `cleanup after redesign`.

---

## Fase 13: Finalizar

- [ ] 13.1. Teste completo no celular (Expo Go, `npx expo start -c`). Em todas as telas, confira:
  - nada escondido atrás da barra de status ou da barra de navegação;
  - todos os botões respondem;
  - o gesto de voltar funciona;
  - copiar funciona (Pix e ID);
  - menu: abrir, fechar e navegar.
- [ ] 13.2. Atualize o `claude.md`:
  - o topo ainda diz **"Expo SDK 54, React Native 0.81, React 19.1"** e **"native-stack v6"**: troque para **SDK 58, React Native 0.88, React 19.3, React Navigation 7**;
  - na Estrutura, adicione `tema.js`, `ui.js`, `contatos.js` e `scripts/teste-web.mjs` / `scripts/screenshots.mjs`;
  - nos Comandos, adicione `npm run test:web` e `npm run shots`;
  - nas Convenções, troque "imagens de fundo (`ImageBackground`)" por "imagens de fundo com o componente `Fundo` de `ui.js`", e adicione "cores, espaços e fontes vêm de `tema.js`; telas novas usam os componentes de `ui.js`".
- [ ] 13.3. Commit `update claude.md after redesign` e `git push` (o trabalho já está na `main`).

---

## Decisões

**Tomadas:**

- **Fase 11, "Avalie-nos":** remover. Quando o app estiver na Play Store, volta como link para a página da loja.
- **Fase 8, título do cabeçalho:** "Apoiar o projeto". Combina com o item do menu ("Torne-se um apoiador") e com a URL `/apoiar`.

- **Fase 10, textos longos:** manter o "Lore" como está (só tirar os espaços de recuo).
- **Código morto e arquivos de teste:** apagar (Fase 12.6).
- **Aviso "ImageBackground is deprecated"** (pedido do dono): resolvido ao longo das Fases 5 a 11 (cada tela troca o `ImageBackground` pelo `Fundo` de `ui.js`) e conferido na Fase 12.1 (zero ocorrências). Já resolvido no Details. Faltam: `HomeScreen.js`, `MenuLateral.js`, `Doacoes.js`, `Sobre.js`, `Feedback.js`, `Configuracoes.js`.


Nenhuma decisão pendente.
