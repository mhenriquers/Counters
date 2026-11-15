// Componentes visuais compartilhados entre as telas.
// Seguem a identidade do site oficial do MLBB (ver tema.js e a tela Details).
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { Asset } from "expo-asset";
import { cores, espaco, raio, fonte } from "./tema";

// ---------------------------------------------------------------------------
// Fundo: substitui o ImageBackground (descontinuado no React Native 0.88).
// A imagem fica atrás, ocupando todo o espaço do container.
// ---------------------------------------------------------------------------
// modo "largura": a imagem encaixa na largura da tela (aparece inteira de lado
// a lado, sem zoom), presa no topo. O que sobra embaixo fica com o
// backgroundColor do `style`, que deve ser a cor do fim da imagem.
export function Fundo({ fonte: imagem, modo = "cover", style, children }) {
  const estiloImagem =
    modo === "largura"
      ? [estilos.imagemLargura, { aspectRatio: proporcao(imagem) }]
      : [StyleSheet.absoluteFill, estilos.imagemFundo];

  return (
    <View style={style}>
      <Image
        source={imagem}
        resizeMode={modo === "largura" ? "stretch" : modo}
        style={estiloImagem}
      />
      {children}
    </View>
  );
}

// largura / altura do arquivo de imagem (o expo-asset sabe isso em todas as plataformas)
function proporcao(imagem) {
  const { width, height } = Asset.fromModule(imagem);
  return width && height ? width / height : 1;
}

// ---------------------------------------------------------------------------
// TituloSecao: faixa azul do site (bg-Layer.png) + capacete + título.
// ---------------------------------------------------------------------------
export function TituloSecao({ titulo, subtitulo, cor = cores.azulTexto }) {
  return (
    <Fundo
      fonte={require("./assets/bg-Layer.png")}
      modo="stretch"
      style={estilos.faixaSecao}
    >
      <Image
        source={require("./assets/hero.png")}
        resizeMode="contain"
        style={estilos.iconeSecao}
      />
      <View style={{ flex: 1 }}>
        <Text style={estilos.tituloSecao}>{titulo}</Text>
        {subtitulo ? (
          <Text style={[estilos.subtituloSecao, { color: cor }]} numberOfLines={1}>
            {subtitulo}
          </Text>
        ) : null}
      </View>
    </Fundo>
  );
}

// ---------------------------------------------------------------------------
// CabecalhoTela: barra do topo das telas secundárias (seta + título).
// ---------------------------------------------------------------------------
export function CabecalhoTela({ titulo, aoVoltar }) {
  const insets = useSafeAreaInsets();

  return (
    <Fundo
      fonte={require("./assets/header.png")}
      style={[estilos.cabecalho, { paddingTop: insets.top, height: 56 + insets.top }]}
    >
      <TouchableOpacity onPress={aoVoltar} style={estilos.botaoVoltar} hitSlop={8}>
        <Image
          source={require("./assets/seta-branca.png")}
          resizeMode="contain"
          style={estilos.iconeVoltar}
        />
      </TouchableOpacity>
      <Text style={estilos.tituloCabecalho} numberOfLines={1}>
        {titulo}
      </Text>
    </Fundo>
  );
}

// ---------------------------------------------------------------------------
// Cartao: caixa de conteúdo. destaque "azul" (padrão) ou "dourado".
// ---------------------------------------------------------------------------
export function Cartao({ destaque = "azul", style, children }) {
  return (
    <View
      style={[
        estilos.cartao,
        destaque === "dourado" && { borderColor: "rgba(211, 175, 55, 0.5)" },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Paragrafo: texto corrido, sem recuo. Use `ultimo` no último do bloco.
// ---------------------------------------------------------------------------
export function Paragrafo({ ultimo, style, children }) {
  return (
    <Text style={[estilos.paragrafo, ultimo && { marginBottom: 0 }, style]}>
      {children}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// LinhaAcao: linha (card) com ícone, título, subtítulo e seta.
// Sem `aoTocar`, a linha é só informativa (não tocável e sem seta).
// ---------------------------------------------------------------------------
export function LinhaAcao({ icone, titulo, subtitulo, aoTocar, direita, corTitulo = cores.texto }) {
  const conteudo = (
    <>
      {icone ? <Image source={icone} resizeMode="contain" style={estilos.iconeLinha} /> : null}
      <View style={estilos.textosLinha}>
        <Text style={[estilos.tituloLinha, { color: corTitulo }]} numberOfLines={1}>
          {titulo}
        </Text>
        {subtitulo ? (
          <Text style={estilos.subtituloLinha} numberOfLines={1}>
            {subtitulo}
          </Text>
        ) : null}
      </View>
      {direita ?? (aoTocar ? <Text style={estilos.seta}>›</Text> : null)}
    </>
  );

  if (!aoTocar) return <View style={estilos.linha}>{conteudo}</View>;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={aoTocar} style={estilos.linha}>
      {conteudo}
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// BotaoCopiar: copia `texto` e mostra "Copiado ✓" por 2 segundos.
// Funciona igual em Android, iOS e web (não usa Alert).
// ---------------------------------------------------------------------------
export function BotaoCopiar({ texto, rotulo = "Copiar" }) {
  const [copiado, setCopiado] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copiar = async () => {
    await Clipboard.setStringAsync(texto);
    setCopiado(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <TouchableOpacity onPress={copiar} activeOpacity={0.8} style={estilos.botaoCopiar}>
      <Text style={estilos.textoBotaoCopiar}>{copiado ? "Copiado ✓" : rotulo}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Rodape: texto pequeno e discreto.
// ---------------------------------------------------------------------------
export function Rodape({ style, children }) {
  return <Text style={[estilos.rodape, style]}>{children}</Text>;
}

const estilos = StyleSheet.create({
  // Só na web: sem tamanho, o react-native-web desenha a imagem no tamanho
  // original do arquivo. No celular NÃO pode: lá, o "100%" de um filho absoluto
  // desconta o padding do pai, e a imagem termina antes da borda (sobrava uma
  // faixa à direita do cabeçalho da Home). O absoluteFill já preenche tudo.
  imagemFundo: Platform.select({
    web: { width: "100%", height: "100%" },
    default: {},
  }),

  // modo "largura": presa no topo, a altura sai do aspectRatio.
  // left/right em vez de width: "100%" pelo mesmo motivo do imagemFundo.
  imagemLargura: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    // na web, sem height o react-native-web usa a altura do arquivo (2000px);
    // "auto" deixa o aspect-ratio do CSS calcular
    ...Platform.select({ web: { width: "100%", height: "auto" }, default: {} }),
  },

  // TituloSecao (valores iguais aos que estavam no Details.js)
  faixaSecao: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    marginTop: espaco.xl,
    marginBottom: 6,
    marginLeft: espaco.sm,
    paddingLeft: 14,
    paddingRight: espaco.md,
    gap: espaco.md,
  },
  iconeSecao: {
    width: 26,
    height: 34,
  },
  tituloSecao: {
    color: cores.texto,
    fontSize: fonte.secao,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  subtituloSecao: {
    fontSize: fonte.rodape,
    marginTop: 2,
    opacity: 0.9,
  },

  // CabecalhoTela
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: espaco.sm,
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaCartao,
  },
  botaoVoltar: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  iconeVoltar: {
    width: 24,
    height: 24,
  },
  tituloCabecalho: {
    flex: 1,
    color: cores.texto,
    fontSize: fonte.cabecalho,
    fontWeight: "700",
    marginLeft: espaco.xs,
  },

  // Cartao
  cartao: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.bordaCartao,
    borderRadius: raio.md,
    padding: espaco.lg,
    marginHorizontal: espaco.lg,
  },

  // Paragrafo
  paragrafo: {
    color: cores.textoSuave,
    fontSize: fonte.corpo,
    lineHeight: 21,
    marginBottom: espaco.md,
  },

  // LinhaAcao (mesmo card das linhas do Details)
  linha: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    marginHorizontal: espaco.lg,
    marginTop: espaco.sm,
    paddingVertical: espaco.sm,
    paddingHorizontal: espaco.md,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.bordaCartao,
    backgroundColor: cores.cartao,
  },
  iconeLinha: {
    width: 28,
    height: 28,
    marginRight: espaco.md,
  },
  textosLinha: {
    flex: 1,
  },
  tituloLinha: {
    fontSize: fonte.item,
    fontWeight: "600",
  },
  subtituloLinha: {
    color: cores.azulTexto,
    fontSize: fonte.legenda,
    marginTop: 2,
  },
  seta: {
    color: "rgba(224, 250, 255, 0.45)",
    fontSize: 26,
    marginLeft: espaco.sm,
    marginTop: -2,
  },

  // BotaoCopiar
  botaoCopiar: {
    backgroundColor: cores.douradoVivo,
    borderRadius: raio.pilula,
    paddingVertical: espaco.sm,
    paddingHorizontal: espaco.lg,
    alignSelf: "flex-start",
  },
  textoBotaoCopiar: {
    color: "#000",
    fontWeight: "700",
    fontSize: fonte.legenda + 1,
  },

  // Rodape
  rodape: {
    color: cores.textoFraco,
    fontSize: fonte.rodape,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: espaco.xl,
    marginHorizontal: espaco.xl,
  },
});
