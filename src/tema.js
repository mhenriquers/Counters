// Tema visual do app: cores, espaçamentos, raios e tamanhos de fonte.
// Identidade do site oficial do MLBB: azul é estrutura, dourado é destaque.

export const cores = {
  fundo: "#0d1424", // fundo das telas
  barraStatus: "#000000", // faixa da hora/notificações no topo (igual em todas as telas)
  cartao: "rgba(10, 17, 32, 0.72)", // fundo de cards e caixas
  bordaCartao: "rgba(155, 209, 253, 0.16)", // borda de cards
  azulBorda: "hsl(191, 100%, 94%)", // borda das fotos de herói
  azulTexto: "#9bd1fd", // textos secundários
  dourado: "#D3AF37", // títulos e bordas das telas secundárias
  douradoVivo: "#ffd700", // itens do menu e botões de ação
  douradoBorda: "rgba(211, 175, 55, 0.55)", // borda de um cartão aberto (ex.: seletor de idioma)
  douradoFundo: "rgba(255, 215, 0, 0.08)", // fundo da opção escolhida
  texto: "#ffffff",
  textoSuave: "rgba(255, 255, 255, 0.75)",
  textoCorpo: "rgba(255, 255, 255, 0.9)", // parágrafos dentro de cartões
  textoFraco: "rgba(255, 255, 255, 0.45)", // rodapés
  forte: "#4fd8eb", // seção "É forte contra"
  fraco: "#ff6b7a", // seção "É fraco contra"
};

export const espaco = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const raio = { sm: 6, md: 8, lg: 14, pilula: 999 };

export const fonte = {
  tituloTela: 26, // nome do herói, títulos grandes
  cabecalho: 17, // título do cabeçalho das telas
  secao: 15, // título de seção (maiúsculas)
  corpo: 14, // parágrafos
  item: 15, // nome em listas/linhas
  legenda: 12, // textos secundários
  rodape: 11,
};

// Layout responsivo: a partir de que largura a tela conta como tablet ou
// computador, e a largura máxima do conteúdo em cada tipo de tela
// (no computador o conteúdo fica no meio, e o fundo ocupa a tela inteira).
export const tela = {
  tablet: 600, // de 600 a 1023: tablet (ou janela média no computador)
  computador: 1024, // 1024 ou mais: computador
  larguraTexto: 720, // telas secundárias (Sobre, Apoiar...): linhas de texto legíveis
  larguraDetalhes: 1040, // Details com as duas seções lado a lado
  larguraGrade: 1280, // grade de heróis da Home
};
