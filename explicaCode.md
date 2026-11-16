# Explicação do código

Anotações para entender as decisões de arquitetura do projeto, passo a passo. As comparações com C# são para ligar com o que estou estudando.

---

## Passo 1: camada de dados (`herois.js`)

### O resultado

```
Antes:  HomeScreen ──┐                   Depois:  HomeScreen ──┐
                     ├──▶ banco_herois                         ├──▶ herois.js ──▶ banco_herois
        Details ─────┘                            Details ─────┘
```

Só o `herois.js` importa o `banco_herois.js`. As telas não sabem mais como os dados são guardados (array, `classe` com `"/"`, ordenação). Elas só **pedem** heróis.

É o **D** do SOLID (inversão de dependência): as telas dependem de um contrato (as 3 funções), não do formato do banco. Se um dia os dados vierem de um JSON ou de uma API, só o `herois.js` muda.

### 1. O comentário do topo é o contrato

```js
//   buscarHeroi(id)    -> um herói, ou null se o id não existir
//   buscarHerois(ids)  -> lista de heróis (ids inexistentes são ignorados)
//   listarHerois()     -> todos os heróis, em ordem alfabética
```

Em C# isso seria a `interface IHeroiRepository`. Em JS não existe `interface`: o contrato é o que tem `export`. Quem usa o arquivo só precisa ler esse comentário.

### 2. `preparar`: o herói no formato das telas

```js
function preparar({ classe, ...resto }) {
  return { ...resto, classes: classe.split("/") };
}
```

- `{ classe, ...resto }` é uma **desestruturação**: separa `classe` e junta o resto (id, nome, foto...) em `resto`.
- O herói que sai daqui **não tem mais** `classe`, só `classes`. É de propósito: se alguém escrever `heroi.classe` numa tela, recebe `undefined` e percebe na hora que está usando o formato antigo. O `"/"` é um detalhe de como o banco guarda, e as telas não precisam saber disso.

### 3. `heroisPorId`: o índice

```js
const heroisPorId = new Map(HEROIS.map((heroi) => [heroi.id, preparar(heroi)]));
```

- Um `Map` é o `Dictionary<string, Heroi>` do C#.
- Antes, `HEROIS.find(...)` percorria até 133 heróis a cada busca, e o Details fazia 11 buscas por tela (o herói + 5 + 5). O `Map.get(id)` acha direto.
- Essa linha roda **uma vez só**, quando o arquivo é importado pela primeira vez. Um módulo JS funciona como um `static` do C#: é carregado uma vez e compartilhado por todo o app.

### 4. `compararPorNome` e `heroisOrdenados`

- É a mesma ordenação que ficava na Home (pt-BR, sem diferenciar maiúsculas e acentos, desempate pelo id). Saiu da tela porque não depende da tela.
- **Regra para decidir o que vai para o `herois.js`:** o que não depende da tela vai para lá, e o que é estado da tela fica nela. A ordenação é sempre igual, então foi para o `herois.js`. O filtro da busca depende do que o usuário digitou (`useState`), então ficou na Home.
- Antes, a Home ordenava os 133 heróis **a cada letra digitada** na busca. Agora ordena uma vez, quando o app abre, e a Home só filtra.
- O `Object.freeze` deixa a lista **somente leitura**. Como todas as telas recebem a **mesma** lista, um `.sort()` numa tela bagunçaria a das outras. É como devolver uma `IReadOnlyList` no C#. (O `.filter()` da Home cria uma lista nova, então não tem problema.)

### 5. As 3 funções do contrato

```js
buscarHeroi(id)    → heroisPorId.get(String(id)) ?? null
buscarHerois(ids)  → ids.map(buscarHeroi).filter(Boolean)
listarHerois()     → heroisOrdenados
```

- `String(id)`: se alguém passar o número `27` em vez do texto `"27"`, ainda funciona. Por isso o Details não precisa mais converter o id que vem da URL.
- `.filter(Boolean)`: remove os `null`. Se um counter apontar para um id que não existe, ele some da lista em vez de quebrar a tela.
- `?? null`: o `Map` devolve `undefined` quando não acha, e aqui vira `null` (veja abaixo).

#### `null` x `undefined`

| | `undefined` | `null` |
|---|---|---|
| Quem coloca | **o JavaScript**, sozinho | **o programador**, de propósito |
| Significa | "ninguém deu valor a isso" | "isso está vazio, e foi de propósito" |
| Quando aparece | variável sem valor, propriedade que não existe, função sem `return`, `find`/`Map.get` sem achar | só quando alguém escreve `null` |

O C# só tem `null`. O `undefined` é coisa do JavaScript.

Por que `null` no `buscarHeroi`: um `undefined` pode ser "o herói não existe" ou um erro de digitação (`heroi.nomee` também dá `undefined`). Já o `null` só aparece porque a função escolheu devolver. Ele faz parte do contrato: "procurei e não achei".

O `??` quer dizer "se o da esquerda for `null` ou `undefined`, use o da direita". Na tela, `if (!heroi)` funciona com os dois, então o código da tela não muda. A diferença está no que a função comunica.

### Como ficaram as telas

**Details.js:** saíram a função `separarClasses`, o `HEROIS.find` e a `buscarHerois` local.

```js
// antes
const id = String(route.params?.id ?? "");
const heroi = HEROIS.find((h) => h.id === id);

// depois
const heroi = buscarHeroi(route.params?.id);
```

**HomeScreen.js:** 17 linhas de ordenar e filtrar viraram 3.

```js
return listarHerois().filter((heroi) =>
  heroi.nome.toLocaleLowerCase("pt-BR").includes(textoBusca),
);
```

---

## Passo 2: quebrar o `Details.js` (S do SOLID)

### O problema

O `Details.js` tinha 432 linhas e fazia várias coisas ao mesmo tempo: guardava o mapa de ícones das classes, desenhava o card de cada herói da lista, desenhava a tela de erro do `/heroi/999` e ainda montava a tela do herói. O **S** (responsabilidade única) diz: cada peça deve ter **um motivo para mudar**. Se eu quisesse mudar o card da lista, precisava abrir a tela inteira.

### O resultado

```
Details.js (252 linhas): só junta as peças
├── IconeClasse.js         (24)  ícone de uma classe
├── LinhaHeroi.js         (100)  card de um herói na lista (usa o IconeClasse)
└── HeroiNaoEncontrado.js  (77)  tela de erro do id inexistente
```

Cada componente leva **junto** os seus estilos. O `StyleSheet` de cada arquivo só tem o que aquele componente usa.

### `IconeClasse`: o O do SOLID

```js
const icones = { Assassino: require(...), Mago: require(...), ... };

export default function IconeClasse({ classe, tamanho, style }) {
  return <Image source={icones[classe]} style={[{ width: tamanho, height: tamanho }, style]} />;
}
```

- O mapa `icones` é o **O** (aberto/fechado): uma classe nova é só uma chave nova, sem `if/else` e sem mexer no componente.
- O `tamanho` resolve os dois usos: 22 nos chips do herói e 14 nos cards da lista.
- O `style` é para ajustes extras. O card da lista passa `opacity: 0.85`. Em `[{...}, style]`, um array de estilos, o último vence quando há conflito.
- Antes, quem quisesse um ícone precisava conhecer o mapa e montar o `<Image>`. Agora só diz qual classe quer.

### `LinhaHeroi`: polimorfismo por props

As seções "É forte contra" e "É fraco contra" usam o **mesmo** componente. Só muda a cor:

```js
<LinhaHeroi heroi={outro} cor={cores.forte} aoTocar={...} />
<LinhaHeroi heroi={outro} cor={cores.fraco} aoTocar={...} />
```

Em C# seria uma classe com um parâmetro no construtor, em vez de duas classes `LinhaForte` e `LinhaFraca`.

### `HeroiNaoEncontrado`: o I do SOLID

```js
<HeroiNaoEncontrado aoVoltar={() => navigation.popTo("Home")} />
```

O componente recebe só a função `aoVoltar`, **não** o `navigation` inteiro. Isso é o **I** (segregação de interface): "não exija o que você não usa".

- O componente não sabe que existe React Navigation nem uma tela chamada "Home". Ele só sabe que tem um botão que chama `aoVoltar`.
- Quem decide **para onde** voltar é o Details. Se um dia o botão tiver que ir para outro lugar, só o Details muda.
- Em C#, seria receber uma `Action aoVoltar` em vez do objeto `NavigationService` inteiro.

### Como conferir que nada mudou na tela

Refatorar é mudar o código **sem mudar o comportamento**. Para provar isso:

1. Antes de mexer: `npm run build:web`, `npm run shots` e copiar `screenshots/` para `screenshots-antes/`.
2. Depois de mexer: `npm run build:web`, `npm run test:web` e `npm run shots`.
3. Comparar as duas pastas. Neste passo, todas as telas saíram idênticas pixel a pixel.

---

## Passo 3: organizar em pastas (`src/`)

### A estrutura

```
App.js              ← entrada + rotas (fica na raiz: o Expo procura o App aqui)
assets/             ← imagens (fica na raiz: app.json e scripts apontam para cá)
src/
  telas/            HomeScreen, Details, Doacoes, Feedback, Sobre, Configuracoes
  componentes/      ui, MenuLateral, InstalarApp, LinhaHeroi, IconeClasse, HeroiNaoEncontrado
  dados/            banco_herois, herois, contatos
  tema.js           ← usado por todo mundo, fica no meio
```

As pastas mostram as **camadas** que já existiam no código, mas que antes só dava para ver lendo os imports:

```
telas ──usam──▶ componentes ──usam──▶ tema
  │
  └──pedem dados──▶ dados/herois.js ──lê──▶ dados/banco_herois.js
```

Em C#, seria como separar os projetos (ou pastas) `UI`, `Components` e `Data` de uma solution.

### Por que um commit só de mudança de pasta

Um commit que **move** e **muda** ao mesmo tempo é difícil de revisar: o diff mostra o arquivo inteiro como apagado e criado, e a mudança de verdade some no meio. Separando os dois:

- O commit de mudança de pasta tem **só** caminhos trocados (201 linhas, todas de `import`/`require`).
- O `git mv` avisa o git que é o **mesmo arquivo** em outro lugar. O histórico continua: `git log --follow src/telas/Details.js` mostra os commits de quando ele ainda estava na raiz.

### Caminhos relativos

O caminho de um `import` é relativo **ao arquivo que importa**:

| Quem importa | Importa | Caminho |
|---|---|---|
| `App.js` (raiz) | a tela Details | `./src/telas/Details` |
| `src/telas/Details.js` | o `herois.js` | `../dados/herois` (sobe para `src/`, entra em `dados/`) |
| `src/telas/Details.js` | o `tema.js` | `../tema` |
| `src/componentes/LinhaHeroi.js` | o `IconeClasse.js` | `./IconeClasse` (mesma pasta) |
| `src/dados/banco_herois.js` | uma imagem | `../../assets/heroi_ml_49.png` (sobe 2 níveis até a raiz) |

`./` = "nesta pasta"; `../` = "uma pasta acima".

### Como foi feito: um script em vez de editar à mão

Eram 205 caminhos (133 só no `banco_herois.js`). Editar à mão seria lento e fácil de errar. O script fez, para cada arquivo:

1. `git mv` para a pasta nova.
2. Para cada `import`/`require` relativo: descobrir **qual arquivo** o caminho antigo apontava (a partir da posição antiga), descobrir **onde esse arquivo está agora** e recalcular o caminho a partir da posição nova (`path.relative`).

Errar um caminho não quebra em silêncio: o Metro (e o `expo export` da web) **para o build** com "Unable to resolve module". É um erro barulhento, que é o tipo bom de erro.

### Verificação

- `npm run build:web` sem erro: todos os caminhos resolvem.
- `npm run test:web`: tudo passou.
- Prints comparados pixel a pixel: idênticos. Na primeira rodada, o print de um herói deu diferente, mas era só a foto que ainda estava carregando quando o print foi tirado. Na segunda, saiu idêntico. Lição: se a diferença é pequena e fica numa imagem, tire o print de novo antes de procurar um bug.
- No celular: rodar `npx expo start -c`. O `-c` limpa o cache do Metro, que ainda lembra dos caminhos antigos.

---

## Idiomas, parte 1: `src/idioma/` (Context do React)

### Onde fica e por quê

```
src/
  idioma/
    textos.js     ← só os textos: { "config.idioma": { pt: "Idioma", en: "Language" } }
    idioma.js     ← IdiomaProvider, useIdioma(), salvar a escolha, detectar o idioma do celular
  tema.js
```

- O idioma é "irmão" do `tema.js`: os dois são usados por todo mundo e nenhum é regra do jogo. O `tema.js` diz **como** o texto aparece, e o `idioma/` diz **o que** está escrito.
- Não foi para `dados/` porque lá fica o domínio (heróis, contatos), e o `idioma.js` tem estado do React (Provider e hook).
- São dois arquivos por causa do **S**: o `textos.js` cresce e muda a cada texto novo (e é onde se revisam as traduções, com `pt` e `en` lado a lado), enquanto o `idioma.js` fica pequeno e quase não muda. Em C#, é como separar o `.resx` da classe que escolhe a cultura.

### O problema que o Context resolve

O idioma precisa chegar em **todas** as telas e componentes. Sem Context, seria preciso passá-lo por props de pai para filho, tela por tela, inclusive por componentes que nem usam o idioma, só para repassar adiante (isso tem nome: *prop drilling*).

O **Context** cria um "canal" que qualquer componente lá embaixo pode ler direto:

```
App.js
└─ <IdiomaProvider>            ← guarda o idioma (useState) e oferece { idioma, mudarIdioma, t }
   └─ NavigationContainer
      └─ Configuracoes          ← const { t } = useIdioma();   (lê direto, sem props)
      └─ Home → MenuLateral     ← const { t } = useIdioma();   (idem)
```

Comparando com C#: é parecido com registrar um serviço **singleton** na injeção de dependência (`services.AddSingleton<IIdiomaService>()`) e pedir ele onde precisar. A diferença: quando o idioma muda, o React **redesenha sozinho** todo componente que usa `useIdioma()`. No C# isso seria o `INotifyPropertyChanged` do WPF/MAUI.

### As peças do `idioma.js`

**`IdiomaProvider`:** um componente que guarda o idioma num `useState` e o entrega pelo `<IdiomaContext.Provider value={...}>`. Ele envolve o app inteiro no `App.js`.

**`useIdioma()`:** um *hook* (função que começa com `use` e usa outros hooks). Ele só faz `useContext(IdiomaContext)`. Se alguém usar fora do Provider, recebe um erro claro em vez de um `null` misterioso.

**O idioma inicial, em 2 etapas:**
1. `useState(idiomaDoCelular)`: começa com o idioma do celular (`expo-localization`). `pt` → português, qualquer outro → inglês.
2. `useEffect` ao abrir: lê a escolha salva no `AsyncStorage`. Se existir, ela vence.

O `AsyncStorage` é um "guarda-volumes" chave → texto que sobrevive a fechar o app. No celular, é um arquivo do app; na web, é o `localStorage` do navegador. Ler é **assíncrono** (devolve uma Promise), por isso o `.then`.

**`carregado`:** enquanto a escolha salva não foi lida, o Provider devolve `null` (não desenha nada). Sem isso, um celular em português com "English" salvo abriria em português e trocaria para inglês um instante depois (um "pisca"). A leitura leva poucos milissegundos, e o fundo preto do `App.js` fica visível nesse tempo.

**`mudarIdioma(novo)`:** troca o estado (a tela muda na hora) e salva no `AsyncStorage` (para a próxima vez que o app abrir).

**`t(chave, valores)`:** a função de tradução.
- Procura a chave no `textos.js` e devolve o texto do idioma atual.
- Se faltar o inglês, usa o português. Se faltar a chave, mostra a própria chave na tela e avisa no console (e o teste web falha com o aviso). Assim um esquecimento aparece em vez de sumir.
- Texto com parte variável: `t("details.vantagem", { nome: "Aamon" })` troca `{nome}` por "Aamon".

**`useCallback` e `useMemo`:** guardam a mesma função/objeto entre um desenho e outro, enquanto o idioma não muda. Sem isso, cada desenho do Provider criaria um objeto novo, e o React acharia que o valor do Context mudou, redesenhando o app inteiro à toa.

### Os testes e o idioma do "celular"

O Chrome dos testes usa o idioma do Windows. Nesta máquina é `pt-BR`, mas em outra poderia ser inglês, e aí os testes (que procuram textos em português) falhariam sem motivo. Por isso o `cdp-util.mjs` agora fixa o idioma do navegador em `pt-BR`, e um teste abre um segundo Chrome em `en-US` para conferir que o app abre em inglês.

Detalhe descoberto no caminho: o comando `Emulation.setLocaleOverride` do Chrome **não** muda o `navigator.language` (que é o que o `expo-localization` lê na web). O que funciona é o `acceptLanguage` do `Emulation.setUserAgentOverride`.
