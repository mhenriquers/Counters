import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
} from "react-native";

export default function MenuLateral({ visivel, aoFechar, navigation }) {
  if (!visivel) return null;

  const irPara = (tela) => {
    aoFechar();
    if (navigation) {
      navigation.navigate(tela);
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <TouchableWithoutFeedback onPress={aoFechar}>
        <View style={style.sombra} />
      </TouchableWithoutFeedback>

      <View style={style.gavetaManual}>
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
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  gavetaManual: {
    position: "absolute", // Faz flutuar
    top: 0,
    left: 0,
    width: "75%", // Largura da gaveta
    height: "100%",
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
    ...StyleSheet.absoluteFillObject,
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
