# Tarefas

## 📍 Estado atual (atualize ao fim de cada sessão)

- **Feito** (o histórico está no git e no `claude.md`): repaginada visual, arquitetura (`herois.js`, Details em componentes, pastas em `src/`), idiomas pt/en no app inteiro e publicação da PWA na Vercel (https://counters-peach-one.vercel.app), testada num navegador real (links diretos, service worker e offline).
- **Branch:** o trabalho está direto na `main`. Cada `git push` publica a PWA sozinho.
- **Decisões já tomadas:**
  - cartões mais escuros aprovados; **manter** todas as imagens sem uso;
  - a descrição da PWA (`public/manifest.json` e `public/index.html`) fica **só em português**, mesmo com o app traduzido;
  - opções de idioma nas Configurações **sem recuo**;
  - **não** criar um `SecaoHerois` no Details;
  - deploy na **Vercel** (o `netlify.toml` foi apagado pelo dono).
- **Jeito de trabalhar combinado com o dono:**
  - fazer **uma tela por vez**, commitar e **parar**, para ele testar no celular antes da próxima (exceção: quando ele pedir para seguir até o fim);
  - deixar as perguntas para o **final** da resposta;
  - ele está aprendendo: quando pedir para ensinar, explique o porquê e mostre os comandos, em vez de só fazer. Explicações de arquitetura vão para o `explicaCode.md`.

## Pendências do dono (precisam do celular ou da conta dele)

- [ ] Testar o app inteiro em **inglês** no celular (`npx expo start -c`): trocar o idioma, fechar e abrir o app (a escolha continua) e passar por todas as telas nos dois idiomas.
- [ ] Revisar as traduções em `src/idioma/textos.js` (as da Home e do menu já foram aprovadas).
- [ ] Instalar a PWA no celular e abrir com o modo avião ligado (se ainda não fez).
- [ ] Gerar um **APK novo** (`eas build -p android --profile preview`): entraram bibliotecas nativas (`async-storage`, `expo-localization`), e o APK do README (v1.0.0) ainda não tem os idiomas. Depois, atualizar o link do README.

## Perguntas em aberto (decidir quando der)

- **Pix em inglês:** o Pix só funciona no Brasil. Manter a tela de Doações igual em inglês, ou mostrar um aviso / outra forma de doação para quem é de fora?
- **Versão em dois lugares:** o "1.0.0" está no `MenuLateral.js` (constante `VERSAO`) e no `Sobre.js`. Ler do `app.json` para mudar num lugar só?
- **Erro de digitação no Sobre:** "como jogador sou um **otimo** programador" (sem acento). Corrigir para "ótimo"? (Pela regra 3, não foi mudado sem pedido.)

## Depois: landing page (pedido do dono, adiado)

Um site separado para "vender o peixe": explicar o que o app faz e convencer a usar, com botão para a PWA.

Proposta já conversada:
- HTML e CSS puros, numa página só (rápido, bom para o Google, fácil de editar);
- mesma identidade visual do app (azul-marinho, dourado, logo, faixas com capacete, prints do `npm run shots`);
- seções: topo com frase de impacto e botões "Abrir o app" / "Baixar APK", o problema, como funciona (3 passos), vantagens (133 heróis, offline, grátis, sem cadastro, pt/en), perguntas frequentes, chamada final e rodapé;
- **obrigatório:** aviso no rodapé de que é projeto de fã, sem vínculo com a Moonton;
- repositório separado (ex.: `c:\dev\counters-site`), com projeto próprio na Vercel.

Perguntas para quando retomar: a pasta pode ser `c:\dev\counters-site`? Tem link fixo para o APK (o do GitHub Releases serve)? Só português ou pt/en? Já tem uma frase de impacto?

## Regras para executar

1. **Commit a cada arquivo ou tela finalizado**, com mensagem curta em inglês informal, como pede o `claude.md`. Se uma tarefa mexe em vários arquivos de uma vez (ex.: tela + teste), eles vão juntos no mesmo commit.
2. Antes de commitar: `npm run build:web && npm run test:web` (tudo `PASS`). Em mudança visual, compare os prints (`npm run shots` antes e depois).
3. **Não mude textos** (conteúdo das telas) além do que a tarefa manda.
4. Texto visível novo vai em `src/idioma/textos.js` (pt e en). Sempre que mudar um texto que o teste procura, atualize `scripts/teste-web.mjs` **na mesma tarefa**.
5. Teste sempre na web **e** no celular (Expo Go). Bugs de layout podem aparecer só no celular.

**Nota que vale para frente:** a cor `#121212` da gaveta do menu ficou de propósito, porque o teste web acha a gaveta por ela. Se mudar a cor, mude o teste junto.
