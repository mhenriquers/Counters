# Tarefa: transformar o Counters em PWA (pendências)

As fases 0 a 7, a 10 e a 11.1 já foram feitas e estão na branch `pwa`, já enviada ao GitHub (`origin/pwa`). Falta só o que depende do Netlify e do celular.

---

## Fase 8: Publicar (Netlify, grátis e com HTTPS)

O `netlify.toml` já está no repositório (Node 22, build `npm run build:web`, publica `dist/`).

- [ ] 8.3. No site **app.netlify.com**:
  1. Entre com a conta do GitHub.
  2. Clique em **Add new site → Import an existing project → GitHub**.
  3. Escolha o repositório **Counters**.
  4. Em **Branch to deploy**, escolha `pwa`. Depois de fazer o merge na `main`, troque para `main`.
  5. Os campos de build vêm preenchidos pelo `netlify.toml`. Clique em **Deploy**.
- [ ] 8.4. Espere o deploy ficar **Published** e abra o link `https://<algo>.netlify.app`.
- [ ] 8.5. (Opcional) Em **Site configuration → Change site name**, troque o nome para algo como `counters-mlbb`.

**✅ Como verificar** (no link do Netlify, no Chrome):
1. F12 → aba **Application**:
   - em **Manifest**, devem aparecer nome, ícones e nenhum erro em vermelho;
   - em **Service workers**, `sw.js` deve estar com status **activated and is running**.
2. Teste offline: na aba **Network**, mude "No throttling" para **Offline** e recarregue (F5). O app deve abrir normalmente, com as imagens.
3. Ainda offline, abra `https://<algo>.netlify.app/heroi/1`. Deve abrir o Aamon.
4. Volte o Network para "No throttling". Na barra de endereço deve aparecer o ícone de **instalar app** (e o botão amarelo "Instalar app" acima da grade). Instale e teste.

---

## Fase 9: Teste no celular

- [ ] 9.1. **Android (Chrome):** abra o link, toque em ⋮ → **Instalar app** (ou "Adicionar à tela inicial"). Confira:
  - o ícone na tela inicial aparece sem borda branca;
  - o app abre em tela cheia, sem a barra do navegador;
  - abra um herói e use o **gesto/botão voltar**: deve voltar para a lista, e não fechar o app;
  - ative o **modo avião** e abra o app: deve funcionar.
- [ ] 9.2. **iPhone (Safari):** abra o link, toque em **Compartilhar → Adicionar à Tela de Início**, e confira os mesmos pontos (o iPhone não tem botão voltar).
- [ ] 9.3. Copiar a chave Pix deve funcionar e mostrar o aviso.

---

## Fase 11: Finalizar

- [ ] 11.2. Atualize o `README.md` com o link do site.
- [ ] 11.3. Faça o merge na `main`:
  ```bash
  git checkout main
  git merge pwa
  git push
  ```
- [ ] 11.4. No Netlify, em **Site configuration → Build & deploy → Branches**, troque o branch de produção para `main`.

---

## Se algo der errado

| Sintoma | Causa provável / solução |
|---|---|
| Deploy falha no Netlify | Abra o log do deploy. Erro de JSON: vírgula sobrando ou faltando em `package.json`, `app.json` ou `manifest.json`. |
| Tela branca no site | Abra o F12 → Console e leia o erro. |
| Site publicado não atualiza | Feche **todas** as abas/o app e abra de novo. O service worker troca de versão na próxima abertura. |
| `workbox` reclama de arquivo grande | Aumente `maximumFileSizeToCacheInBytes` em `workbox-config.js`. |
