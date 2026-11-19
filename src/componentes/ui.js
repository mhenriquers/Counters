// Componentes visuais compartilhados entre as telas.
// Seguem a identidade do site oficial do MLBB (ver tema.js e a tela Details).
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { cores, espaco, raio, fonte, tela } from "../tema";
import { EMAIL, GITHUB_USUARIO, ID_JOGO, abrirGit, enviarEmail } from "../dados/contatos";
import { useIdioma } from "../idioma/idioma";

// ---------------------------------------------------------------------------
// Fundo: substitui o ImageBackground (descontinuado no React Native 0.88).
// A imagem fica atrás, ocupando todo o espaço do container.
//
// Por que a View em volta da imagem:
// - Imagem com require SEM width/height ganha o tamanho do arquivo (ex.:
//   1125x2000), no celular e na web. Então ela precisa de width/height.
// - Mas "100%" de um filho absoluto, num pai com padding, fica curto no
//   Android (sobrava uma faixa à direita do cabeçalho da Home).
// A View com absoluteFill cobre o container inteiro (View não tem "tamanho de
// arquivo") e não tem padding, então o 100% da imagem é medido nela.
// ---------------------------------------------------------------------------
export function Fundo({ fonte: imagem, modo = "cover", style, children }) {
  return (
    <View style={style}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image source={imagem} resizeMode={modo} style={estilos.imagemFundo} />
      </View>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Coluna: centraliza o conteúdo com uma largura máxima (padrão: a das telas
// de texto). No celular não muda nada (a tela é mais estreita que o máximo);
// no tablet e no computador, evita linhas de texto enormes de ponta a ponta.
// ---------------------------------------------------------------------------
export function Coluna({ largura = tela.larguraTexto, style, children }) {
  return <View style={[estilos.coluna, { maxWidth: largura }, style]}>{children}</View>;
}

// ---------------------------------------------------------------------------
// TituloSecao: faixa azul do site (bg-Layer.png) + capacete + título.
// ---------------------------------------------------------------------------
export function TituloSecao({ titulo, subtitulo, cor = cores.azulTexto, style }) {
  return (
    <Fundo
      fonte={require("../../assets/bg-Layer.png")}
      modo="stretch"
      style={[estilos.faixaSecao, style]}
    >
      <Image
        source={require("../../assets/hero.png")}
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
// BarraStatus: faixa sólida atrás da hora e das notificações, com a altura da
// barra do celular. Assim nada da tela aparece ali (igual à Home).
// Use no topo de toda tela que desenha atrás da barra de status.
// ---------------------------------------------------------------------------
export function BarraStatus() {
  const insets = useSafeAreaInsets();
  return <View style={{ height: insets.top, backgroundColor: cores.barraStatus }} />;
}

// ---------------------------------------------------------------------------
// CabecalhoTela: barra do topo das telas secundárias (seta + título).
// ---------------------------------------------------------------------------
export function CabecalhoTela({ titulo, aoVoltar }) {
  // A imagem do cabeçalho começa ABAIXO da barra de status (hora, notificações)
  return (
    <View>
      <BarraStatus />
      {/* A imagem ocupa a largura toda; a seta e o título ficam alinhados
          com a Coluna do conteúdo (no computador, não vão para o canto) */}
      <Fundo fonte={require("../../assets/header.png")} style={estilos.cabecalho}>
        <Coluna style={estilos.linhaCabecalho}>
          <TouchableOpacity onPress={aoVoltar} style={estilos.botaoVoltar} hitSlop={8}>
            <Image
              source={require("../../assets/seta-branca.png")}
              resizeMode="contain"
              style={estilos.iconeVoltar}
            />
          </TouchableOpacity>
          <Text style={estilos.tituloCabecalho} numberOfLines={1}>
            {titulo}
          </Text>
        </Coluna>
      </Fundo>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Cartao: caixa de conteúdo. destaque "azul" (padrão) ou "dourado".
// O dourado tem fundo mais sólido, para o texto se destacar do fundo da tela.
// ---------------------------------------------------------------------------
export function Cartao({ destaque = "azul", style, children }) {
  return (
    <View
      style={[estilos.cartao, destaque === "dourado" && estilos.cartaoDourado, style]}
    >
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Paragrafo: texto corrido, justificado e com recuo. Use `ultimo` no último do bloco.
// ---------------------------------------------------------------------------
// Recuo da primeira linha: o React Native não tem textIndent, então cada
// parágrafo começa com 2 espaços largos (U+2003, da largura da letra M).
// Diferente do espaço comum, o navegador não junta esses espaços.
const RECUO = "  ";

export function Paragrafo({ ultimo, style, children }) {
  return (
    <Text style={[estilos.paragrafo, ultimo && { marginBottom: 0 }, style]}>
      {RECUO}
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
// Sem `rotulo`, o botão diz "Copiar" (no idioma atual).
// ---------------------------------------------------------------------------
export function BotaoCopiar({ texto, rotulo, style }) {
  const { t } = useIdioma();
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
    <TouchableOpacity onPress={copiar} activeOpacity={0.8} style={[estilos.botaoCopiar, style]}>
      <Text style={estilos.textoBotaoCopiar}>{copiado ? t("ui.copiado") : (rotulo ?? t("ui.copiar"))}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// ListaContatos: e-mail, GitHub e ID do jogo (com "Copiar"), mais o aviso.
// Igual em Sobre e Feedback. Os dados e as ações vêm de contatos.js.
// ---------------------------------------------------------------------------
export function ListaContatos() {
  const { t } = useIdioma();

  return (
    <>
      <LinhaAcao
        icone={require("../../assets/gmail.png")}
        titulo={EMAIL}
        subtitulo={t("contatos.email")}
        aoTocar={() => enviarEmail(t)}
      />
      <LinhaAcao
        icone={require("../../assets/gitHub.png")}
        titulo={GITHUB_USUARIO}
        subtitulo={t("contatos.github")}
        aoTocar={abrirGit}
      />
      <LinhaAcao
        icone={require("../../assets/imortal.png")}
        titulo="Owdail"
        subtitulo={"ID: " + ID_JOGO}
        direita={<BotaoCopiar texto={ID_JOGO} />}
      />
      <Rodape>{t("contatos.aviso")}</Rodape>
    </>
  );
}

// ---------------------------------------------------------------------------
// Rodape: texto pequeno e discreto.
// ---------------------------------------------------------------------------
export function Rodape({ style, children }) {
  return <Text style={[estilos.rodape, style]}>{children}</Text>;
}

const estilos = StyleSheet.create({
  // 100% da View em volta (ver o comentário do Fundo)
  imagemFundo: {
    width: "100%",
    height: "100%",
  },

  // Coluna (o maxWidth vem da prop `largura`)
  coluna: {
    width: "100%",
    alignSelf: "center",
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
    height: 56,
    paddingHorizontal: espaco.sm,
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaCartao,
  },
  linhaCabecalho: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
  cartaoDourado: {
    borderColor: "rgba(211, 175, 55, 0.5)",
    backgroundColor: "rgba(10, 17, 32, 0.88)", // mais sólido que o azul
  },

  // Paragrafo
  paragrafo: {
    textAlign: "justify",
    color: cores.textoCorpo,
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
