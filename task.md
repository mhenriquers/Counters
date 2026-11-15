# Tarefa: transformar o Counters em PWA

Siga as fases **na ordem**. Cada fase termina com um **✅ Como verificar** e um commit. Se a verificação falhar, **não avance**: corrija antes.

Rode todos os comandos no terminal do VS Code, a partir da pasta `c:\dev\Counters`.

---

## Fase 0: Preparação

- [ ] 0.1. Confirme que não há nada pendente:
  ```bash
  git status
  ```
  A saída deve mostrar `nothing to commit, working tree clean`. Se não mostrar, faça commit antes de continuar.
- [ ] 0.2. Crie uma branch só para essa tarefa:
  ```bash
  git checkout -b pwa
  ```

---

## Fase 1: Dependências

- [ ] 1.1. Remova os pacotes que não são usados:
  ```bash
  npm uninstall lottie expo-av @react-native-community/cli @react-navigation/bottom-tabs @react-navigation/drawer
  ```
- [ ] 1.2. Apague a splash antiga, que dependia do `expo-av` (o arquivo não é importado em lugar nenhum):
  ```bash
  git rm SplashScreen.js
  ```
- [ ] 1.3. Instale o suporte a web. Use **`npx expo install`**, e não `npm install`, para receber as versões compatíveis com o SDK 54:
  ```bash
  npx expo install react-dom react-native-web @expo/metro-runtime
  ```
- [ ] 1.4. Instale as ferramentas de build como dependências de desenvolvimento:
  ```bash
  npm install --save-dev sharp workbox-cli serve
  ```
- [ ] 1.5. Confira se há algum problema:
  ```bash
  npx expo-doctor
  ```
  Se aparecer um aviso sobre `expo-av` na seção `"expo" > "doctor"` do `package.json`, pode ignorar ou apagar esse bloco `"expo": { ... }` do final do `package.json`.

**✅ Como verificar:**
```bash
npx expo start --web
```
O navegador deve abrir em `http://localhost:8081` mostrando a grade de heróis. Clique num herói e confirme que a tela de detalhes abre. Para parar o servidor, use `Ctrl+C`.

```bash
git add -A
git commit -m "add web dependencies, remove unused packages"
```

---

## Fase 2: Corrigir os dados

Arquivo: `banco_herois.js`

- [ ] 2.1. **ID duplicado.** Procure o herói **Marcel** (perto do fim do arquivo) e troque **só o id dele**:
  ```js
  // ANTES
      id: "131",
      nome: "Marcel",
  // DEPOIS
      id: "133",
      nome: "Marcel",
  ```
  ⚠️ **Não altere o id do Alpha**, que também é `"131"`. Todas as referências a `"131"` no arquivo se referem ao Alpha.
- [ ] 2.2. **Classe inválida.** Procure **Kalea** e corrija a classe:
  ```js
  // ANTES
      classe: "Suporte/Soldado",
  // DEPOIS
      classe: "Suporte/Lutador",
  ```
- [ ] 2.3. (Opcional) Busque o texto `(não consta no banco)` e apague esse trecho dos comentários. O Alpha já está no banco.

**✅ Como verificar:** rode o comando abaixo. Ele deve imprimir `OK` sem nenhuma linha de erro antes:
```bash
node -e "const s=require('fs').readFileSync('banco_herois.js','utf8');const ids=[...s.matchAll(/id: \"(\d+)\"/g)].map(m=>m[1]);const d=ids.filter((x,i)=>ids.indexOf(x)!==i);if(d.length)console.log('DUPLICADOS:',d);if(s.includes('Soldado'))console.log('AINDA TEM Soldado');console.log('OK')"
```
Em seguida, rode `npx expo start --web`, abra a Kalea e confira que aparecem 2 ícones de classe.

```bash
git commit -am "fix duplicated hero id and Kalea class"
```

---

## Fase 3: Navegação com URLs (corrige o "voltar" do Android)

Sem esta fase, o gesto de voltar no Android **fecha o app** em vez de voltar para a lista.

### 3.1. `App.js`: substitua o arquivo **inteiro** por:

```js
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// TELAS
import DetailsScreen from "./Details";
import HomeScreen from "./HomeScreen";
import MenuLateral from "./MenuLateral";
import Doacoes from "./Doacoes";
import Sobre from "./Sobre";
import Feedback from "./Feedback";
import Configuracoes from "./Configuracoes";

const Stack = createNativeStackNavigator();

// Cada tela ganha uma URL no navegador (ex.: /heroi/12)
const linking = {
  prefixes: [],
  config: {
    initialRouteName: "Home",
    screens: {
      Home: "",
      Details: "heroi/:id",
      Doacoes: "apoiar",
      Sobre: "sobre",
      Feedback: "feedback",
      Configuracoes: "configuracoes",
    },
  },
};

export default function App() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <SafeAreaProvider>
      {/* Fundo preto ocupando a tela toda */}
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {/* No computador, o app fica numa coluna de no máximo 480px centralizada */}
        <View
          style={{ flex: 1, width: "100%", maxWidth: 480, alignSelf: "center" }}
        >
          <NavigationContainer
            linking={linking}
            documentTitle={{ formatter: () => "Counters MLBB" }}
          >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home">
                {(props) => (
                  <>
                    <HomeScreen
                      {...props}
                      abrirMenu={() => setMenuAberto(true)}
                    />

                    {/* MENU RECEBE navigation AQUI */}
                    <MenuLateral
                      visivel={menuAberto}
                      aoFechar={() => setMenuAberto(false)}
                      navigation={props.navigation}
                    />
                  </>
                )}
              </Stack.Screen>
              <Stack.Screen name="Details" component={DetailsScreen} />
              <Stack.Screen name="Doacoes" component={Doacoes} />
              <Stack.Screen name="Sobre" component={Sobre} />
              <Stack.Screen name="Feedback" component={Feedback} />
              <Stack.Screen name="Configuracoes" component={Configuracoes} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
```

### 3.2. `HomeScreen.js`: passe só o `id` do herói

```js
// ANTES
                      navigation.navigate("Details", { heroi: item });
// DEPOIS
                      navigation.navigate("Details", { id: item.id });
```

### 3.3. `Details.js`: receba o `id` e busque o herói

a) Troque esta linha:
```js
// ANTES
  const { heroi } = route.params;
```
por este bloco:
```js
// DEPOIS
  const id = String(route.params?.id ?? "");
  const heroi = HEROIS.find((h) => h.id === id);

  // URL com id inexistente (ex.: /heroi/999)
  if (!heroi) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", marginBottom: 20 }}>
          Herói não encontrado.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={{ color: "#ffd700" }}>Voltar para a lista</Text>
        </TouchableOpacity>
      </View>
    );
  }
```

b) Esta linha aparece **2 vezes** no arquivo. Troque **as duas**:
```js
// ANTES
                        navigation.push("Details", { heroi: dadosDoHeroi })
// DEPOIS
                        navigation.push("Details", { id: dadosDoHeroi.id })
```
Depois disso, uma busca por `heroi: dadosDoHeroi` no arquivo deve dar **0 resultados**.

**✅ Como verificar:** com `npx expo start --web` rodando:
1. Clique num herói. A URL deve mudar para `http://localhost:8081/heroi/<número>`.
2. Clique num herói da lista "É forte contra". A URL deve mudar de novo.
3. Use o botão **voltar do navegador** duas vezes. Ele deve voltar herói por herói até a lista.
4. Digite `http://localhost:8081/heroi/999` na barra de endereço. Deve aparecer "Herói não encontrado".
5. Digite `http://localhost:8081/heroi/131`. Deve abrir o **Alpha**.
6. Abra o menu lateral e entre em cada item (Apoiar, Configurações, Feedback, Sobre). Todos devem abrir e voltar normalmente.

```bash
git commit -am "add URL linking for web navigation"
```

---

## Fase 4: Ajustes de tela para a web

### 4.1. `HomeScreen.js`: tamanho do nome do herói

No estilo `nomeHeroi`:
```js
// ANTES
    fontSize: Platform.OS === "ios" ? 17 : 10,
// DEPOIS
    fontSize: Platform.select({ ios: 17, web: 12, default: 10 }),
```

### 4.2. `HomeScreen.js`: remover código que não faz nada

a) Apague estas linhas (o "puxar para atualizar" é falso: só espera 1 segundo):
```js
  const [atualizando, setAtualizando] = useState(false);
```
```js
  const aoRecarregar = () => {
    setAtualizando(true);
    setTimeout(() => {
      setAtualizando(false);
    }, 1000);
  };
```

b) Dentro do `<FlatList`, apague o bloco inteiro:
```js
                refreshControl={
                  <RefreshControl
                    refreshing={atualizando} // Ele olha para o estado 'atualizando'
                    onRefresh={aoRecarregar} // Quando puxas a tela, ele chama a função acima
                    colors={["#00e5ff"]} // Cor da bolinha (azul ciano)
                  />
                }
```

c) Dentro do `<FlatList`, apague a linha (essa prop não existe):
```js
                delayContentThrittle={false}
```

d) No `<Image>` do logo, dentro de `ListHeaderComponent`, apague o `onPress` (o `Image` não é clicável):
```js
                      onPress={() => {
                        navigation.navigate("Doacoes");
                      }}
```

e) No `import` do topo, apague a linha `  RefreshControl,`.

### 4.3. Aviso de "copiado" na web

Na web, o `Alert.alert` não faz nada, então o usuário não recebe aviso ao copiar.

**`Doacoes.js`**, dentro de `copiaPix`:
```js
// ANTES
  if (Platform.OS === "ios") {
// DEPOIS
  if (Platform.OS === "web") {
    window.alert("Copiado para a área de transferência.");
  } else if (Platform.OS === "ios") {
```

**`Sobre.js`**, dentro de `copiaId`:
```js
// ANTES
  if (Platform.OS === 'ios'){
// DEPOIS
  if (Platform.OS === "web") {
    window.alert("Copiado para a área de transferência.");
  } else if (Platform.OS === 'ios'){
```

**`Feedback.js`**, dentro de `copiaId`, logo abaixo de `await Clipboard.setStringAsync(id);`, adicione:
```js
  if (Platform.OS === "web") {
    window.alert("Copiado para a área de transferência.");
  }
```
⚠️ No `import { ... } from "react-native"` do topo do `Feedback.js`, confira se `Platform,` está na lista. Se não estiver, adicione.

**✅ Como verificar:** com `npx expo start --web`:
1. Os nomes na grade devem estar legíveis.
2. Com a janela do navegador bem larga, o app deve aparecer numa coluna central com fundo preto dos lados.
3. Em Apoiar, o botão de copiar deve mostrar o aviso "Copiado...". O mesmo em Sobre e em Feedback.
4. Abra o console do navegador (F12 → Console). Não deve haver erros em vermelho.

```bash
git commit -am "web layout and clipboard feedback"
```

---

## Fase 5: Imagens (de 38 MB para bem menos)

### 5.1. Crie a pasta `scripts/` e o arquivo `scripts/gerar-icones.mjs`:

```js
// Gera os ícones da PWA a partir do ícone do app
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const ORIGEM = "assets/counters.png"; // 1024x1024
const DESTINO = "public/icons";

await mkdir(DESTINO, { recursive: true });

await sharp(ORIGEM).resize(192, 192).png().toFile(`${DESTINO}/icon-192.png`);
await sharp(ORIGEM).resize(512, 512).png().toFile(`${DESTINO}/icon-512.png`);

await sharp(ORIGEM)
  .resize(180, 180)
  .flatten({ background: "#000000" })
  .png()
  .toFile(`${DESTINO}/apple-touch-icon.png`);

// "maskable": logo menor com borda preta, para o Android recortar em círculo
await sharp(ORIGEM)
  .resize(410, 410)
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: "#000000" })
  .flatten({ background: "#000000" })
  .png()
  .toFile(`${DESTINO}/maskable-512.png`);

console.log("Ícones gerados em public/icons/");
```

### 5.2. Crie o arquivo `scripts/otimizar-imagens.mjs`:

```js
// Reduz o tamanho das imagens de assets/ (sobrescreve os arquivos).
// Só grava se o resultado ficar MENOR que o original.
import sharp from "sharp";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PASTA = "assets";

// Ícones do app: não mexer
const IGNORAR = new Set([
  "counters.png",
  "counters-icon.png",
  "icon.png",
  "favicon.png",
  "splashicon.png",
  "iconeapp.png",
]);

// Largura máxima por arquivo (o padrão vale para o resto)
const LARGURA_PADRAO = 1080;
const LARGURAS = {
  "imortal.png": 600,
  "gloria-mitico.png": 600,
  "QRCode.png": 600,
};

const arquivos = (await readdir(PASTA)).filter(
  (f) => /\.(png|jpe?g)$/i.test(f) && !IGNORAR.has(f),
);

let antes = 0;
let depois = 0;

for (const nome of arquivos) {
  const caminho = path.join(PASTA, nome);
  const original = await readFile(caminho);
  const largura = LARGURAS[nome] ?? LARGURA_PADRAO;
  const ehRetrato = nome.startsWith("heroi_ml_") || nome.endsWith("-icon.png");

  let img = sharp(original).resize({ width: largura, withoutEnlargement: true });

  if (/\.png$/i.test(nome)) {
    img = img.png({ compressionLevel: 9, palette: ehRetrato, quality: 90 });
  } else {
    img = img.jpeg({ quality: 80, mozjpeg: true });
  }

  const novo = await img.toBuffer();
  antes += original.length;

  if (novo.length < original.length) {
    await writeFile(caminho, novo);
    depois += novo.length;
  } else {
    depois += original.length;
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
console.log(`${arquivos.length} imagens | antes: ${mb(antes)} | depois: ${mb(depois)}`);
```

### 5.3. Rode os dois scripts:
```bash
node scripts/gerar-icones.mjs
node scripts/otimizar-imagens.mjs
```

**✅ Como verificar:**
1. A pasta `public/icons/` deve ter 4 arquivos: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` e `maskable-512.png`.
2. O segundo script deve mostrar "depois" bem menor que "antes".
3. Rode `npx expo start --web` e olhe a grade, os detalhes de um herói e as telas do menu. As imagens devem estar nítidas. Se alguma ficou feia, restaure com `git checkout -- assets/NOME.png` e coloque o nome dela em `IGNORAR`.

```bash
git add -A
git commit -m "optimize images and generate PWA icons"
```

---

## Fase 6: Arquivos da PWA

### 6.1. Crie `public/manifest.json`:

```json
{
  "name": "Counters MLBB",
  "short_name": "Counters",
  "description": "Counters de heróis do Mobile Legends, rápido e offline.",
  "lang": "pt-BR",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    {
      "src": "/icons/maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### 6.2. Crie `public/index.html` (o Expo usa esse arquivo automaticamente):

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
    />
    <title>Counters MLBB</title>
    <meta
      name="description"
      content="Counters de heróis do Mobile Legends, rápido e offline."
    />

    <!-- PWA -->
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" type="image/png" href="/icons/icon-192.png" />

    <!-- iPhone -->
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="apple-mobile-web-app-title" content="Counters" />

    <!-- Reset recomendado pelo react-native-web -->
    <style id="expo-reset">
      html,
      body {
        height: 100%;
      }
      body {
        overflow: hidden;
        background-color: #000000;
      }
      #root {
        display: flex;
        height: 100%;
        flex: 1;
      }
    </style>
  </head>

  <body>
    <noscript>Ative o JavaScript para usar o Counters.</noscript>
    <div id="root"></div>

    <!-- Registra o service worker (modo offline). Desligado no servidor de dev (porta 8081). -->
    <script>
      if ("serviceWorker" in navigator && location.port !== "8081") {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("/sw.js");
        });
      }
    </script>
  </body>
</html>
```

### 6.3. Crie `workbox-config.js` na **raiz** do projeto (ao lado do `package.json`):

```js
// Gera o service worker que guarda o app inteiro para uso offline
module.exports = {
  globDirectory: "dist/",
  globPatterns: [
    "**/*.{html,js,css,json,png,jpg,jpeg,gif,webp,svg,ico,ttf,woff,woff2}",
  ],
  swDest: "dist/sw.js",
  // o bundle JS passa do limite padrão de 2 MB
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  // qualquer URL (ex.: /heroi/12) abre o app, mesmo offline
  navigateFallback: "/index.html",
  // versão nova entra sozinha na próxima abertura do app
  clientsClaim: true,
  skipWaiting: true,
};
```

### 6.4. `app.json`: no bloco `"web"`, adicione `"output"`:

```json
// ANTES
    "web": {
      "favicon": "./assets/favicon.png"
    },
// DEPOIS
    "web": {
      "favicon": "./assets/favicon.png",
      "output": "single"
    },
```
(Não copie as linhas `// ANTES` e `// DEPOIS`, porque JSON não aceita comentários.)

### 6.5. `package.json`: substitua o bloco `"scripts"` **inteiro** por:

```json
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "build:web": "expo export -p web && workbox generateSW workbox-config.js",
    "preview:web": "serve dist --single"
  },
```
⚠️ Mantenha a vírgula depois do `}`, porque logo abaixo vem `"dependencies"`.

**✅ Como verificar:** passe para a Fase 7.

---

## Fase 7: Build e teste local

- [ ] 7.1. Gere a versão de produção:
  ```bash
  npm run build:web
  ```
  O comando deve terminar sem erro, com uma mensagem do Workbox do tipo `The service worker file was written to dist/sw.js`.
- [ ] 7.2. Confira que a pasta `dist/` tem `index.html`, `sw.js`, `manifest.json` e a pasta `icons/`.
- [ ] 7.3. Sirva a pasta como se fosse o site publicado:
  ```bash
  npm run preview:web
  ```
  Abra `http://localhost:3000` **no Chrome**.
- [ ] 7.4. No Chrome, abra o F12 e vá na aba **Application**:
  - em **Manifest**, devem aparecer nome, ícones e nenhum erro em vermelho;
  - em **Service workers**, `sw.js` deve estar com status **activated and is running**.
- [ ] 7.5. Teste offline: na aba **Network** do F12, mude "No throttling" para **Offline** e recarregue (F5). O app deve abrir normalmente, com as imagens.
- [ ] 7.6. Ainda offline, abra `http://localhost:3000/heroi/1`. Deve abrir o Aamon.
- [ ] 7.7. Volte o Network para "No throttling". Na barra de endereço deve aparecer o ícone de **instalar app** (um monitor com seta). Instale e teste.

```bash
git add -A
git commit -m "add PWA manifest, index.html and service worker"
```

---

## Fase 8: Publicar (Netlify, grátis e com HTTPS)

- [ ] 8.1. Crie `netlify.toml` na **raiz** do projeto:

```toml
[build]
  command = "npm run build:web"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# Qualquer URL (ex.: /heroi/12) abre o app
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# O service worker nunca deve ficar em cache, senão as atualizações não chegam
[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"
```

- [ ] 8.2. Faça commit e envie a branch:
  ```bash
  git add netlify.toml
  git commit -m "add netlify config"
  git push -u origin pwa
  ```
- [ ] 8.3. No site **app.netlify.com**:
  1. Entre com a conta do GitHub.
  2. Clique em **Add new site → Import an existing project → GitHub**.
  3. Escolha o repositório **Counters**.
  4. Em **Branch to deploy**, escolha `pwa`. Depois de fazer o merge na `main`, troque para `main`.
  5. Os campos de build vêm preenchidos pelo `netlify.toml`. Clique em **Deploy**.
- [ ] 8.4. Espere o deploy ficar **Published** e abra o link `https://<algo>.netlify.app`.
- [ ] 8.5. (Opcional) Em **Site configuration → Change site name**, troque o nome para algo como `counters-mlbb`.

**✅ Como verificar:** repita no link do Netlify os passos 7.4 a 7.7.

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

## Fase 10 (opcional): botão "Instalar app"

Só funciona no Chrome/Android. No iPhone, o botão simplesmente não aparece.

- [ ] 10.1. Crie `InstalarApp.js` na raiz:

```js
import React, { useEffect, useState } from "react";
import { Platform, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function InstalarApp() {
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const aoPoderInstalar = (e) => {
      e.preventDefault(); // guarda o evento para usar no clique
      setEvento(e);
    };

    window.addEventListener("beforeinstallprompt", aoPoderInstalar);
    return () =>
      window.removeEventListener("beforeinstallprompt", aoPoderInstalar);
  }, []);

  if (!evento) return null;

  const instalar = async () => {
    evento.prompt();
    await evento.userChoice;
    setEvento(null);
  };

  return (
    <TouchableOpacity style={styles.botao} onPress={instalar}>
      <Text style={styles.texto}>📲 Instalar app</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    alignSelf: "center",
    backgroundColor: "#ffd700",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  texto: {
    color: "#000",
    fontWeight: "bold",
  },
});
```

- [ ] 10.2. Em `HomeScreen.js`, adicione o import no topo:
  ```js
  import InstalarApp from "./InstalarApp";
  ```
- [ ] 10.3. Em `HomeScreen.js`, dentro de `ListHeaderComponent`, coloque `<InstalarApp />` logo **depois** do `<Image ... />` do logo e **antes** do `</View>`.

**✅ Como verificar:** rode `npm run build:web` e depois `npm run preview:web`. Abra no Chrome **sem** o app instalado: o botão amarelo deve aparecer acima da grade, e o clique deve abrir a janela de instalação.

```bash
git add -A
git commit -m "add install app button"
```

---

## Fase 11: Finalizar

- [ ] 11.1. Atualize o `claude.md`:
  - a seção "Problemas conhecidos" perde os itens corrigidos (id 131, Kalea, RefreshControl, `delayContentThrittle`, `onPress` no logo);
  - `SplashScreen.js` não existe mais;
  - `Details` agora recebe `{ id }` em vez de `{ heroi }`;
  - acrescente os comandos `npm run build:web` / `npm run preview:web` e o deploy no Netlify.
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
| `expo start --web` pede para instalar pacotes | A Fase 1.3 não rodou. Rode de novo. |
| Tela branca na web | Abra o F12 → Console e leia o erro. Quase sempre é um erro de digitação nas Fases 3 ou 4. |
| "Herói não encontrado" ao clicar num herói | Algum `navigate`/`push` ainda passa `{ heroi: ... }` em vez de `{ id: ... }` (Fase 3). |
| Aviso de `sw.js` 404 no console durante o `expo start` | Não deveria acontecer (o registro é ignorado na porta 8081). Se acontecer, ignore: no dev ele não existe. |
| Site publicado não atualiza | Feche **todas** as abas/o app e abra de novo. O service worker troca de versão na próxima abertura. |
| `workbox` reclama de arquivo grande | Aumente `maximumFileSizeToCacheInBytes` em `workbox-config.js`. |
| Erro de JSON no build | Vírgula sobrando ou faltando em `package.json`, `app.json` ou `manifest.json`. |
