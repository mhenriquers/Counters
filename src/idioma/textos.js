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

  // Componentes compartilhados (ui.js)
  "ui.copiar": { pt: "Copiar", en: "Copy" },
  "ui.copiado": { pt: "Copiado ✓", en: "Copied ✓" },
  "contatos.email": { pt: "Enviar e-mail", en: "Send email" },
  "contatos.github": { pt: "Abrir GitHub", en: "Open GitHub" },
  "contatos.aviso": {
    pt: "Ao utilizar nossos canais de contato, você concorda com nossos termos e política de privacidade.",
    en: "By using our contact channels, you agree to our terms and privacy policy.",
  },

  // Feedback
  "feedback.titulo": { pt: "Feedback", en: "Feedback" },
  "feedback.sugestoes": { pt: "Sugestões ou erros?", en: "Suggestions or bugs?" },
  "feedback.texto": {
    pt: "Este aplicativo foi desenvolvido para ser uma ferramenta útil no dia a dia das suas partidas. Se você encontrou algum erro, tem uma sugestão de melhoria ou sentiu falta de algum conteúdo, por favor, envie seu comentário. Feedbacks diretos de quem usa o app são a melhor forma de evoluir o projeto.",
    en: "This app was built to be a useful tool in your everyday matches. If you found a bug, have a suggestion for improvement or missed some content, please send your comment. Direct feedback from the people who use the app is the best way to improve the project.",
  },
  "feedback.contato": { pt: "Contato", en: "Contact" },
  "feedback.retorno": { pt: "Retorno", en: "Updates" },
  "feedback.retornoTexto": {
    pt: "Separei esse espaço para trazer quaisquer atualizações do App, se você pediu algo, lhe darei um retorno por aqui.",
    en: "I set aside this space to share any updates about the app. If you asked for something, I'll get back to you here.",
  },

  // Sobre
  "sobre.titulo": { pt: "Sobre", en: "About" },
  "sobre.early": { pt: "Early Game", en: "Early Game" },
  "sobre.earlyTexto": {
    pt: "Agradeço aos meus amigos e parceiros de squad que testaram as primeiras versões deste app, aguentaram os bugs e me ajudaram a validar cada ideia implementada.",
    en: "Thanks to my friends and squad mates who tested the first versions of this app, put up with the bugs and helped me validate every idea I implemented.",
  },
  "sobre.lore": { pt: "Lore", en: "Lore" },
  "sobre.lore1": {
    pt: "Tudo começou em uma noite de derrotas amargas no Land of Dawn. Entre sequências de derrotas inexplicáveis e a frustração de não saber como segurar um herói inimigo 'feedado', percebi que a força bruta não era o suficiente: era preciso inteligência.",
    en: "It all started on a night of bitter defeats in the Land of Dawn. Between streaks of inexplicable losses and the frustration of not knowing how to hold off a 'fed' enemy hero, I realized that brute force wasn't enough: it took intelligence.",
  },
  "sobre.lore2": {
    pt: "Como um desenvolvedor solo, decidi aceitar o desafio de construir meu próprio 'item' de batalha. Foram muitas noites codificando sozinho, enfrentei obstáculos técnicos complexos e falhas críticas de sistema que exigiram profundas revisões de código e persistência, refinando dados para que esse item finalmente ficasse pronto.",
    en: "As a solo developer, I decided to take on the challenge of building my own battle 'item'. It took many nights of coding alone. I faced complex technical obstacles and critical system failures that demanded deep code reviews and persistence, refining data until this item was finally ready.",
  },
  "sobre.lore3": {
    pt: "Este aplicativo não é apenas um banco de dados; ele é a união de mecânicas essenciais e vivência de jogo e a prova de que, com a estratégia certa, qualquer herói pode ser derrotado. Eu criei esta ferramenta para que você, assim como eu, tenha em mãos um recurso prático para subir de nível e dominar as partidas.",
    en: "This app isn't just a database; it's the union of essential mechanics and game experience, and proof that, with the right strategy, any hero can be defeated. I created this tool so that you, like me, have a practical resource at hand to level up and dominate your matches.",
  },
  "sobre.lore4": {
    pt: "Continuo no Glória Mítico e estou sempre pronto para fechar o squad. Pode passar raiva comigo nas TF's, porque como jogador sou um otimo programador. Nos vemos em Land of Dawn!",
    en: "I'm still in Mythical Glory and always ready to fill the squad. Feel free to rage with me in the team fights, because as a player I'm a great programmer. See you in the Land of Dawn!",
  },
  "sobre.contato": { pt: "Contato", en: "Contact" },
  "sobre.aviso": { pt: "Aviso legal", en: "Legal notice" },
  "sobre.aviso1": {
    pt: "Este aplicativo é um projeto independente desenvolvido por fã e para fãs de Mobile Legends: Bang Bang. Todo o conteúdo, incluindo nomes de heróis, imagens, ícones e marcas registradas, são de propriedade exclusiva da Moonton Games.",
    en: "This app is an independent project made by a fan, for fans of Mobile Legends: Bang Bang. All content, including hero names, images, icons and trademarks, is the exclusive property of Moonton Games.",
  },
  "sobre.aviso2": {
    pt: "As informações aqui contidas servem apenas para propósitos educacionais e informativos de auxílio ao jogador. Este app não é afiliado, endossado ou patrocinado pela Moonton de nenhuma forma.",
    en: "The information here is for educational and informational purposes only, to help players. This app is not affiliated with, endorsed by or sponsored by Moonton in any way.",
  },
  "sobre.versao": {
    pt: "Versão {versao} — Build: Perfurador",
    en: "Version {versao} — Build: Perfurador",
  },

  // Configurações
  "config.titulo": { pt: "Configurações", en: "Settings" },
  "config.preferencias": { pt: "Preferências", en: "Preferences" },
  "config.idioma": { pt: "Idioma", en: "Language" },
  "config.tema": { pt: "Tema", en: "Theme" },
  "config.temaUnico": { pt: "Único", en: "Default" },
  "config.privacidade": { pt: "Privacidade e uso", en: "Privacy and usage" },
  "config.politica": { pt: "Política de privacidade", en: "Privacy policy" },
  "config.politicaTexto": {
    pt: "Este aplicativo não coleta informações de identificação pessoal dos usuários. Não solicitamos acesso a contatos, localização ou arquivos privados.",
    en: "This app doesn't collect any personally identifiable information from users. We don't ask for access to contacts, location or private files.",
  },
  "config.imagens": {
    pt: "Uso de imagens e direitos autorais",
    en: "Use of images and copyright",
  },
  "config.imagensTexto": {
    pt: "Todas as imagens de heróis e marcas registradas pertencem à Moonton Games. Este é um aplicativo desenvolvido por fã para a comunidade, sem fins lucrativos ou vínculo oficial. Este é apenas um guia informativo gratuito.",
    en: "All hero images and trademarks belong to Moonton Games. This is a fan-made app for the community, non-profit and with no official affiliation. It's just a free informational guide.",
  },
  "config.links": { pt: "Links externos", en: "External links" },
  "config.linksTexto": {
    pt: "Ao acessar links de terceiros, você estará sujeito às políticas de privacidade dos respectivos serviços.",
    en: "When you open third-party links, you'll be subject to the privacy policies of those services.",
  },
};
