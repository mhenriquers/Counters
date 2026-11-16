# Tarefa: fechar a repaginada e adicionar idiomas

## 📍 Estado atual (atualize ao fim de cada sessão)

- **Feito:** a repaginada visual inteira (Fases 0 a 13). O resumo do que mudou está no `claude.md`. O 13.1 rendeu ajustes na busca da Home (commit `fix search behavior`).
- **Branch:** o trabalho está direto na `main`.
- **Decisões já tomadas:** cartões mais escuros aprovados; **manter** todas as imagens sem uso.
- **Próximo passo:** a arquitetura, que vem **ANTES da Fase 14** (decisão do dono em 2026-11-15), na ordem do plano da seção "Arquitetura" do `claude.md`:
  1. ✅ `herois.js` (commit `add heroes data layer`). `buscarHeroi(id)` devolve **`null`** quando não acha.
  2. ✅ Quebrar o `Details.js` (commit `split details screen`): saíram `IconeClasse`, `LinhaHeroi` e `HeroiNaoEncontrado`. O dono decidiu **não** criar um `SecaoHerois` (as duas seções repetidas ficam como estão).
  - O Claude escreve e explica, e cada explicação vai para o `explicaCode.md` (arquivo de estudo do dono).
  3. ✅ Mover para `src/` (commit `move files to src`, só `git mv` e caminhos). Testado no celular.
  4. ✅ Atualizar `claude.md` (Estrutura, Modelo de dados, Convenções e Arquitetura) e `task.md`.
  - **Agora:** Fase 14. Feito 14.1 a 14.3 (commit `add language support`). 14.4 em andamento, uma tela por commit: ✅ Home (commit `translate home`, inclui `InstalarApp` e `HeroiNaoEncontrado`). ✅ menu lateral (commit `translate side menu`). Próximo: Details. O dono aprovou as traduções da Home e quis manter as opções de idioma sem recuo.
- **Jeito de trabalhar combinado com o dono:**
  - fazer **uma tela por vez**, commitar e **parar**, para ele testar no celular antes da próxima;
  - deixar as perguntas para o **final** da resposta;
  - ele está aprendendo: quando pedir para ensinar, explique o porquê e mostre os comandos, em vez de só fazer.
- **Fora deste plano (o dono vai readicionar depois):** publicar o site no Netlify (a configuração já está no `netlify.toml`), testar a PWA instalada no celular e colocar o link do site no README.

## Regras para executar

1. Siga as fases **na ordem**. Dentro de cada fase, faça uma tarefa por vez.
2. Cada fase termina com **✅ Verificar**. Se falhar, **não avance**: corrija primeiro.
3. **Commit a cada arquivo ou tela finalizado**, com mensagem curta em inglês informal, como pede o `claude.md`. Se uma tarefa mexe em vários arquivos de uma vez (ex.: tela + teste), eles vão juntos no mesmo commit.
4. **Não mude textos** (conteúdo das telas) além do que a tarefa manda.
5. Sempre que mudar um texto que o teste procura, atualize `scripts/teste-web.mjs` **na mesma tarefa**.
6. Teste sempre na web **e** no celular (Expo Go). Bugs de layout podem aparecer só no celular.

**Nota da repaginada que vale para frente:** a cor `#121212` da gaveta do menu ficou de propósito, porque o teste web acha a gaveta por ela. Se mudar a cor, mude o teste junto.

---

## Fase 13: Idiomas (português e inglês)

Pedido do dono: em Configurações → "Idioma", poder escolher **inglês**, e o app inteiro muda de idioma.

**Decisões do dono (2026-11-15):**
- **Lembrar a escolha:** sim. Instalar `@react-native-async-storage/async-storage` com `npx expo install` (funciona no Expo Go e, na web, usa o `localStorage`).
- **Idioma inicial:** o do celular, com `expo-localization` (instalar com `npx expo install`). Celular em português abre em português. **Qualquer outro idioma abre em inglês.**
- **Traduções:** o Claude escreve as versões em inglês e o dono revisa.

**Plano:**
- [x] 13.1. Instalar as duas bibliotecas (`npx expo install @react-native-async-storage/async-storage expo-localization`) e rodar `npx expo-doctor`.
- [x] 13.2. Criar `src/idioma/textos.js` (os textos) e `src/idioma/idioma.js` (decisão do dono: pasta própria, ao lado do `tema.js`): textos `pt` e `en` por chave (ex.: `"menu.apoiar"`), um `IdiomaProvider` (Context) e um hook `useIdioma()` que devolve `{ idioma, mudarIdioma, t }`. O idioma inicial vem do que foi salvo, ou do celular (`pt*` → `pt`, o resto → `en`). Envolver o app com o `IdiomaProvider` no `App.js`.
- [x] 13.3. Configurações: tocar em "Idioma" mostra **Português** e **English** (com ✓ no atual). A troca vale na hora e é salva.
- [ ] 13.4. Trocar os textos fixos por `t("...")`, **uma tela por commit**, parando para o dono testar: Home, menu lateral, Details, Doações, Feedback, Sobre, Configurações, e também `ui.js` (`ListaContatos`, `BotaoCopiar`: "Copiar"/"Copiado ✓").
- [ ] 13.5. Classes dos heróis traduzidas só na hora de mostrar, com os nomes oficiais do jogo: Assassin, Mage, Tank, Support, Fighter, Marksman. O `banco_herois.js` continua com as chaves em português (são as chaves de `iconesClasses`). Os nomes dos heróis não mudam.
- [ ] 13.6. Teste web: um caso que troca para inglês e confere textos de algumas telas. Os testes atuais procuram textos em português: garanta que eles rodem com o idioma em português (o Chrome headless pode vir em inglês e abrir o app em inglês, por causa do 14.2).
- [ ] 13.7. Atualizar o `claude.md`: `idioma.js` na Estrutura e, nas Convenções, "texto visível novo vai em `idioma.js` (pt e en), nunca direto na tela".

**✅ Verificar:** `npm run test:web` tudo `PASS`. No celular: trocar o idioma, fechar e abrir o app (a escolha continua), e passar por todas as telas nos dois idiomas.

Commits: um por tela, mais `add language support` (13.1 a 13.3).
