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
import { cores, espaco } from "./tema";
import { Fundo, LinhaAcao, Rodape } from "./ui";

// Duração das animações (ms)
const TEMPO_ABRIR = 260;
const TEMPO_FECHAR = 200;

export default function MenuLateral({ visivel, aoFechar, navigation }) {
  // A gaveta cobre a tela inteira (inclusive atrás das barras do Android),
  // então o topo e o rodapé usam as margens seguras.
  const insets = useSafeAreaInsets();

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
        <Fundo fonte={require("./assets/fundoMG.png")} style={style.bgGaveta}>
          {/* TOPO: botão de fechar + logo */}
          <View style={{ paddingTop: insets.top + espaco.md }}>
            <TouchableOpacity
              onPress={aoFechar}
              style={style.botaoFechar}
              hitSlop={8}
            >
              <Image
                source={require("./assets/botao-fechar.png")}
                style={style.iconeFechar}
              />
            </TouchableOpacity>

            <Image
              source={require("./assets/logo.png")}
              style={style.logo}
              resizeMode="contain"
            />
          </View>

          {/* ITENS */}
          <View style={style.itens}>
            <LinhaAcao
              icone={require("./assets/icon-doar.png")}
              titulo="Torne-se um apoiador"
              corTitulo={cores.douradoVivo}
              aoTocar={() => irPara("Doacoes")}
            />
            <LinhaAcao
              icone={require("./assets/icon-config.png")}
              titulo="Configurações"
              corTitulo={cores.douradoVivo}
              aoTocar={() => irPara("Configuracoes")}
            />
            <LinhaAcao
              icone={require("./assets/icon-feedback.png")}
              titulo="Feedback"
              corTitulo={cores.douradoVivo}
              aoTocar={() => irPara("Feedback")}
            />
            <LinhaAcao
              icone={require("./assets/icon-sobre.png")}
              titulo="Sobre"
              corTitulo={cores.douradoVivo}
              aoTocar={() => irPara("Sobre")}
            />
          </View>

          {/* RODAPÉ: fica sempre embaixo */}
          <View style={{ paddingBottom: insets.bottom + espaco.lg }}>
            <Rodape>Versão 1.0.0</Rodape>
            <Rodape style={style.rodapeSegundaLinha}>
              Dados: site oficial do MLBB
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
  botaoFechar: {
    alignSelf: "flex-end",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: espaco.sm,
  },
  iconeFechar: {
    width: 32,
    height: 32,
  },
  logo: {
    width: "80%",
    height: 70,
    alignSelf: "center",
    marginTop: espaco.sm,
    marginBottom: espaco.lg,
  },

  // ITENS (o espaço entre eles e as margens laterais vêm do LinhaAcao)
  itens: {
    flex: 1, // empurra o rodapé para baixo
  },

  rodapeSegundaLinha: {
    marginTop: espaco.xs,
  },
});
