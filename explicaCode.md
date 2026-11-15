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
