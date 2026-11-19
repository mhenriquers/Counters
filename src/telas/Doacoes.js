import { useRef } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco, raio, fonte } from "../tema";
import {
  Fundo,
  Coluna,
  CabecalhoTela,
  TituloSecao,
  Cartao,
  Paragrafo,
  BotaoCopiar,
  Rodape,
} from "../componentes/ui";
import { useIdioma } from "../idioma/idioma";

const CHAVE_PIX = "9bfe32d9-8633-41c0-835b-5287ecd44293";

// Emblema: tamanho cheio no topo e quanto ele encolhe ao rolar
const TAMANHO_EMBLEMA = 200;
const ROLAGEM_ENCOLHER = 180; // depois de rolar 180, ele fica no tamanho mínimo

export default function Doacoes({ navigation }) {
  const insets = useSafeAreaInsets();
  const { t } = useIdioma();

  // Posição da rolagem, ligada direto à animação do emblema
  const rolagem = useRef(new Animated.Value(0)).current;
  const aoRolar = Animated.event(
    [{ nativeEvent: { contentOffset: { y: rolagem } } }],
    // no celular, a animação roda na thread nativa (fica lisa)
    { useNativeDriver: Platform.OS !== "web" },
  );

  const escalaEmblema = rolagem.interpolate({
    inputRange: [0, ROLAGEM_ENCOLHER],
    outputRange: [1, 0.55],
    extrapolate: "clamp",
  });
  // O emblema desce um pouco enquanto encolhe: fica mais tempo visível e
  // continua encostado no título. 57 = o máximo sem encostar no título
  // (metade do espaço que ele libera ao chegar em 55%: 200 x 0,45 / 2 = 45,
  // mais a margem de 12 até o título).
  const descidaEmblema = rolagem.interpolate({
    inputRange: [0, ROLAGEM_ENCOLHER],
    outputRange: [0, 57],
    extrapolate: "clamp",
  });
  const opacidadeEmblema = rolagem.interpolate({
    inputRange: [0, ROLAGEM_ENCOLHER],
    outputRange: [1, 0.35],
    extrapolate: "clamp",
  });

  return (
    <Fundo fonte={require("../../assets/bg-up-side.png")} style={styles.fundo}>
      <CabecalhoTela
        titulo={t("doacoes.titulo")}
        aoVoltar={() => navigation.goBack()}
      />

      <Animated.ScrollView
        onScroll={aoRolar}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + espaco.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Coluna>
          {/* DESTAQUE: emblema + título (como o bloco do herói no Details) */}
          <View style={styles.destaque}>
            <Animated.Image
              source={require("../../assets/imortal.png")}
              resizeMode="contain"
              style={[
                styles.emblema,
                {
                  opacity: opacidadeEmblema,
                  transform: [
                    { translateY: descidaEmblema },
                    { scale: escalaEmblema },
                  ],
                },
              ]}
            />
            <Text style={styles.titulo}>{t("doacoes.chamada")}</Text>
            <LinearGradient
              colors={["transparent", cores.dourado, "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.divisor}
            />
          </View>

          {/* POR QUE APOIAR */}
          <TituloSecao titulo={t("doacoes.porque")} cor={cores.dourado} />
          <Cartao destaque="dourado">
            <Paragrafo>{t("doacoes.texto1")}</Paragrafo>
            <Paragrafo ultimo>
              {t("doacoes.texto2")}{" "}
              <Text style={styles.destaqueTexto}>{t("doacoes.mvp")}</Text>
            </Paragrafo>
          </Cartao>

          {/* CHAVE PIX */}
          <TituloSecao titulo={t("doacoes.chavePix")} />
          <Cartao>
            <View style={styles.campoChave}>
              <Text style={styles.chavePix} selectable>
                {CHAVE_PIX}
              </Text>
            </View>
            <BotaoCopiar
              texto={CHAVE_PIX}
              rotulo={t("doacoes.copiarChave")}
              style={styles.botaoCopiar}
            />
          </Cartao>

          <Rodape>{t("doacoes.aviso")}</Rodape>
        </Coluna>
      </Animated.ScrollView>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  // DESTAQUE
  destaque: {
    alignItems: "center",
    paddingTop: espaco.lg,
  },
  emblema: {
    width: TAMANHO_EMBLEMA,
    height: TAMANHO_EMBLEMA,
  },
  titulo: {
    color: cores.texto,
    fontSize: fonte.tituloTela - 6,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: espaco.md,
    marginHorizontal: espaco.lg,
  },
  divisor: {
    width: 160,
    height: 1,
    marginTop: espaco.md,
  },

  destaqueTexto: {
    color: cores.douradoVivo,
    fontWeight: "700",
  },

  // CHAVE PIX
  campoChave: {
    backgroundColor: "rgba(155, 209, 253, 0.08)",
    borderWidth: 1,
    borderColor: cores.bordaCartao,
    borderRadius: raio.md,
    paddingVertical: espaco.md,
    paddingHorizontal: espaco.md,
  },
  chavePix: {
    color: cores.texto,
    fontSize: fonte.corpo,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  botaoCopiar: {
    alignSelf: "stretch",
    alignItems: "center",
    paddingVertical: espaco.md,
    marginTop: espaco.md,
  },
});
