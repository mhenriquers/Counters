import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Animated,
  Easing,
  BackHandler,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco } from "../tema";
import { Fundo, LinhaAcao, Rodape } from "./ui";
import { useIdioma } from "../idioma/idioma";

// Versão mostrada no rodapé do menu
const VERSAO = "1.0.0";

// Duração das animações (ms)
const TEMPO_ABRIR = 260;
const TEMPO_FECHAR = 200;

// Espaço do topo que não é do logo: padding (16 + 8) + gap (8) + botão ✕ (44)
const SOBRA_TOPO = espaco.lg + espaco.sm + espaco.sm + 44;

export default function MenuLateral({ visivel, aoFechar, navigation }) {
  // A gaveta cobre a tela inteira (inclusive atrás das barras do Android),
  // então o topo e o rodapé usam as margens seguras.
  const insets = useSafeAreaInsets();
  const { t } = useIdioma();

  // Na web o app fica numa coluna de no máximo 480px (ver App.js)
  const { width } = useWindowDimensions();
  const larguraGaveta = Math.min(width, 480) * 0.75;

  // 0 = fechado, 1 = aberto. Uma única animação controla gaveta e sombra.
  const progresso = useRef(new Animated.Value(0)).current;

  // Mantém o menu na tela enquanto a animação de fechar acontece
  const [montado, setMontado] = useState(visivel);

  useEffect(() => {
    if (visivel) setMontado(true);

    const animacao = Animated.timing(progresso, {
      toValue: visivel ? 1 : 0,
      duration: visivel ? TEMPO_ABRIR : TEMPO_FECHAR,
      easing: visivel ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      // No celular, a animação roda na thread nativa (fica lisa mesmo se o JS estiver ocupado)
      useNativeDriver: Platform.OS !== "web",
    });

    animacao.start(({ finished }) => {
      if (finished && !visivel) setMontado(false);
    });

    return () => animacao.stop();
  }, [visivel, progresso]);

  // Botão/gesto "voltar" do Android fecha o menu em vez de sair do app
  useEffect(() => {
    if (!visivel) return;
    const assinatura = BackHandler.addEventListener("hardwareBackPress", () => {
      aoFechar();
      return true;
    });
    return () => assinatura.remove();
  }, [visivel, aoFechar]);

  if (!montado) return null;

  const irPara = (tela) => {
    aoFechar();
    if (navigation) {
      navigation.navigate(tela);
    }
  };

  const deslocamento = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [-larguraGaveta, 0],
  });

  return (
    <View
      style={StyleSheet.absoluteFill}
      // enquanto fecha, os toques passam para a Home
      pointerEvents={visivel ? "auto" : "none"}
    >
      <TouchableWithoutFeedback onPress={aoFechar}>
        <Animated.View style={[style.sombra, { opacity: progresso }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          style.gavetaManual,
          { width: larguraGaveta, transform: [{ translateX: deslocamento }] },
        ]}
      >
        <Fundo fonte={require("../../assets/fundoMG.png")} style={style.bgGaveta}>
          {/* TOPO: logo e botão de fechar na mesma linha */}
          <View style={[style.topo, { paddingTop: insets.top + espaco.sm }]}>
            <Image
              source={require("../../assets/logo.png")}
              style={[style.logo, { width: larguraGaveta - SOBRA_TOPO }]}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={aoFechar}
              style={style.botaoFechar}
              hitSlop={8}
            >
              <Image
                source={require("../../assets/botao-fechar.png")}
                style={style.iconeFechar}
              />
            </TouchableOpacity>
          </View>

          {/* ITENS */}
          <View style={style.itens}>
            <LinhaAcao
              icone={require("../../assets/icon-doar.png")}
              titulo={t("menu.apoiar")}
              corTitulo={cores.douradoVivo}
              aoTocar={() => irPara("Doacoes")}
            />
            <LinhaAcao
              icone={require("../../assets/icon-config.png")}
              titulo={t("menu.configuracoes")}
              corTitulo={cores.douradoVivo}
              aoTocar={() => irPara("Configuracoes")}
            />
            <LinhaAcao
              icone={require("../../assets/icon-feedback.png")}
              titulo={t("menu.feedback")}
              corTitulo={cores.douradoVivo}
              aoTocar={() => irPara("Feedback")}
            />
            <LinhaAcao
              icone={require("../../assets/icon-sobre.png")}
              titulo={t("menu.sobre")}
              corTitulo={cores.douradoVivo}
              aoTocar={() => irPara("Sobre")}
            />
          </View>

          {/* RODAPÉ: fica sempre embaixo */}
          <View style={{ paddingBottom: insets.bottom + espaco.lg }}>
            <Rodape>{t("menu.versao", { versao: VERSAO })}</Rodape>
            <Rodape style={style.rodapeSegundaLinha}>
              {t("menu.dados")}
            </Rodape>
          </View>
        </Fundo>
      </Animated.View>
    </View>
  );
}

const style = StyleSheet.create({
  gavetaManual: {
    position: "absolute", // Faz flutuar
    top: 0,
    left: 0,
    // a largura é calculada no componente (75% da tela)
    height: "100%",
    overflow: "hidden", // a imagem de fundo é maior que a gaveta e cobria a sombra
    backgroundColor: "#121212", // o teste web acha a gaveta por esta cor
    zIndex: 999, // Valor alto para ficar na frente de tudo
  },
  sombra: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  bgGaveta: {
    flex: 1,
  },

  // TOPO
  topo: {
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.sm,
    paddingLeft: espaco.lg,
    paddingRight: espaco.sm,
    marginBottom: espaco.md,
  },
  // a largura é calculada no componente (larguraGaveta - SOBRA_TOPO): imagem
  // sem width ganharia no celular a largura do arquivo (435)
  logo: {
    height: 56,
  },
  botaoFechar: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  iconeFechar: {
    width: 32,
    height: 32,
  },

  // ITENS (o espaço entre eles e as margens laterais vêm do LinhaAcao)
  itens: {
    flex: 1, // empurra o rodapé para baixo
  },

  rodapeSegundaLinha: {
    marginTop: espaco.xs,
  },
});
