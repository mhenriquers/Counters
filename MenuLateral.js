import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  Animated,
  Easing,
  BackHandler,
  Platform,
  useWindowDimensions,
} from "react-native";

// Duração das animações (ms)
const TEMPO_ABRIR = 260;
const TEMPO_FECHAR = 200;

export default function MenuLateral({ visivel, aoFechar, navigation }) {
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
        <ImageBackground
          source={require("./assets/fundoMG.png")}
          style={style.bgGaveta}
        >
          <View style={style.containerGaveta}>
            <TouchableOpacity onPress={aoFechar}>
              <Text>Fechar</Text>
            </TouchableOpacity>

            <Image
              source={require("./assets/logo.png")}
              style={style.logo}
              resizeMode="contain"
            />

            <TouchableOpacity
              style={style.itemMenu}
              onPress={() => irPara("Doacoes")}
            >
              <Image source={require('./assets/icon-doar.png')} style={style.iconeMenu}/>
              <Text style={style.textoItem}>Torne-se um apoidor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={style.itemMenu}
              onPress={() => irPara("Configuracoes")}
            >
              <Image source={require('./assets/icon-config.png')} style={style.iconeMenu}/>
              <Text style={style.textoItem}>Configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={style.itemMenu}
              onPress={() => irPara("Feedback")}
            >
              <Image source={require('./assets/icon-feedback.png')} style={style.iconeMenu}/>
              <Text style={style.textoItem}>Feedback </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={style.itemMenu}
              onPress={() => irPara("Sobre")}
            >
              <Image source={require('./assets/icon-sobre.png')} style={style.iconeMenu}/>
              <Text style={style.textoItem}>Sobre</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
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
    backgroundColor: "#121212",
    zIndex: 999, // Valor alto para ficar na frente de tudo
    padding: 1,
    paddingTop: 1,
  },
  itemMenu: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    flexDirection: 'row',
  },
  textoItem: {
    color: "#ffd700",
    fontSize: 18,
  },
  botaoFechar: {
    marginBottom: 30,
  },
  sombra: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
  logo: {
    width: "100%",
    marginTop: 30,
  },
  bgGaveta: {
    flex: 1,
  },
  containerGaveta: {
    padding: 20,
  },
  
  iconeMenu: {
    width: 30,
    height: 30,
    marginLeft: 5,
    marginRight: 5,
  },
});
