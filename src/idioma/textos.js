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

  // Menu lateral
  "menu.apoiar": { pt: "Torne-se um apoiador", en: "Become a supporter" },
  "menu.configuracoes": { pt: "Configurações", en: "Settings" },
  "menu.feedback": { pt: "Feedback", en: "Feedback" },
  "menu.sobre": { pt: "Sobre", en: "About" },
  "menu.versao": { pt: "Versão {versao}", en: "Version {versao}" },
  "menu.dados": { pt: "Dados: site oficial do MLBB", en: "Data: official MLBB website" },

  // Configurações
  "config.idioma": { pt: "Idioma", en: "Language" },
};
