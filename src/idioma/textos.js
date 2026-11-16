// Todos os textos visíveis do app, em português (pt) e inglês (en).
//
// Cada chave é "tela.texto". Os dois idiomas ficam lado a lado para ser fácil
// revisar e ver se faltou alguma tradução.
//
// Texto com parte variável usa {nome}: t("chave", { nome: "Aamon" }).
//
// Os nomes dos idiomas (Português, English) não ficam aqui: eles aparecem
// sempre no próprio idioma (ver IDIOMAS em idioma.js).

export const textos = {
  // Home
  "home.pesquisar": { pt: "Pesquisar herói...", en: "Search hero..." },
  "home.instalar": { pt: "Instalar app", en: "Install app" },

  // Aviso de herói não encontrado (busca sem resultado e /heroi/999)
  "naoEncontrado.titulo": { pt: "Herói não encontrado", en: "Hero not found" },
  "naoEncontrado.voltar": { pt: "Voltar para a lista", en: "Back to the list" },
  "naoEncontrado.link": {
    pt: "Esse link não corresponde a nenhum herói do banco.",
    en: "This link doesn't match any hero in the database.",
  },

  // Details
  "details.forte": { pt: "É forte contra", en: "Strong against" },
  "details.forteSub": {
    pt: "{nome} leva vantagem contra estes heróis",
    en: "{nome} has the advantage against these heroes",
  },
  "details.fraco": { pt: "É fraco contra", en: "Weak against" },
  "details.fracoSub": {
    pt: "Estes heróis levam vantagem contra {nome}",
    en: "These heroes have the advantage against {nome}",
  },
  "details.fonte": {
    pt: "Pesquisa realizada no site oficial do MLBB",
    en: "Data collected from the official MLBB website",
  },

  // Classes dos heróis (nomes oficiais do jogo em inglês). A chave usa o nome
  // em português, que é como o banco guarda: t(`classe.${classe}`)
  "classe.Assassino": { pt: "Assassino", en: "Assassin" },
  "classe.Mago": { pt: "Mago", en: "Mage" },
  "classe.Tanque": { pt: "Tanque", en: "Tank" },
  "classe.Suporte": { pt: "Suporte", en: "Support" },
  "classe.Lutador": { pt: "Lutador", en: "Fighter" },
  "classe.Atirador": { pt: "Atirador", en: "Marksman" },

  // Menu lateral
  "menu.apoiar": { pt: "Torne-se um apoiador", en: "Become a supporter" },
  "menu.configuracoes": { pt: "Configurações", en: "Settings" },
  "menu.feedback": { pt: "Feedback", en: "Feedback" },
  "menu.sobre": { pt: "Sobre", en: "About" },
  "menu.versao": { pt: "Versão {versao}", en: "Version {versao}" },
  "menu.dados": { pt: "Dados: site oficial do MLBB", en: "Data: official MLBB website" },

  // Doações (/apoiar)
  "doacoes.titulo": { pt: "Apoiar o projeto", en: "Support the project" },
  "doacoes.chamada": {
    pt: "Torne-se um Lendário Apoiador!",
    en: "Become a Legendary Supporter!",
  },
  "doacoes.porque": { pt: "Por que apoiar", en: "Why support" },
  "doacoes.texto1": {
    pt: "Olá! Eu sou o desenvolvedor por trás deste app. Faço tudo sozinho: do código ao design. Manter um aplicativo funcionando consome tempo e recursos, especialmente com os custos de hospedagem para manter os dados e as imagens online. Cada centavo doado é reinvestido diretamente aqui para cobrir esses servidores e trazer atualizações constantes.",
    en: "Hi! I'm the developer behind this app. I do everything on my own, from the code to the design. Keeping an app running takes time and resources, especially the hosting costs to keep the data and images online. Every cent donated goes straight back into covering these servers and bringing constant updates.",
  },
  "doacoes.texto2": {
    pt: "Se este app já te ajudou a ganhar uma Ranked ou a entender melhor um herói, considere apoiar o projeto com qualquer valor.",
    en: "If this app has ever helped you win a Ranked match or better understand a hero, consider supporting the project with any amount.",
  },
  "doacoes.mvp": {
    pt: "Você já é o MVP dessa jornada!",
    en: "You're already the MVP of this journey!",
  },
  "doacoes.chavePix": { pt: "Chave Pix", en: "Pix key" },
  "doacoes.copiarChave": { pt: "Copiar chave", en: "Copy key" },
  "doacoes.aviso": {
    pt: "As doações realizadas via Pix são voluntárias e destinadas exclusivamente à manutenção e melhoria do projeto. Não armazenamos quaisquer dados bancários dos doadores.",
    en: "Pix donations are voluntary and go exclusively toward maintaining and improving the project. We don't store any banking data from donors.",
  },

  // Configurações
  "config.idioma": { pt: "Idioma", en: "Language" },
};
