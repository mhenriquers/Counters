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
