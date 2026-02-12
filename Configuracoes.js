import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Configuracoes({ navigation }) {
  return (
    <ImageBackground
      source={require("./assets/bg-up-side.png")}
      style={styles.fundo}
    >
      <View style={styles.containerHead}>
        <SafeAreaView style={styles.container2}>
          <ImageBackground
            source={require("./assets/header.png")}
            resizeMethod="stretch"
            style={styles.bgHeader}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.botaoVoltarContainer}
            >
              <Image
                source={require("./assets/seta-branca.png")}
                style={styles.iconeBotaoVoltar}
              />
            </TouchableOpacity>
            <Text style={styles.textoHeader}> Configurações</Text>
          </ImageBackground>
        </SafeAreaView>
      </View>
     

      <ScrollView style={styles.container}>
        <Image
          source={require("./assets/logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <View style={styles.conteudo}>
          <Text style={styles.titulo}> Idioma</Text>
          <Image
            source={require("./assets/separadorbaixo.png")}
            style={styles.separador}
          />
          <Text style={styles.subtitulo}> Português</Text>
          <Text style={styles.titulo}> Tema </Text>
          <Image
            source={require("./assets/separadorbaixo.png")}
            style={styles.separador}
          />
          <Text style={styles.subtitulo}> Unico </Text>
          <TouchableOpacity>
            <Text style={styles.titulo}> Avalie-nos </Text>
          </TouchableOpacity>
          <Image
            source={require("./assets/separadorbaixo.png")}
            style={styles.separador}
          />
          <Text style={styles.subtitulo}> </Text>
          <Text style={styles.titulo}> Politica de Privacidade </Text>
          <Image
            source={require("./assets/separadorbaixo.png")}
            style={styles.separador}
          />
          <Text style={styles.subtitulo}>
            {"    "}
            Este aplicativo não coleta informações de identificação pessoal dos
            usuários. Não solicitamos acesso a contatos, localização ou arquivos
            privados.
          </Text>
          <Text style={styles.titulo}>
            {" "}
            Uso de Imagens e Direitos Autorais{" "}
          </Text>
          <Image
            source={require("./assets/separadorbaixo.png")}
            style={styles.separador}
          />
          <Text style={styles.subtitulo}>
            {" "}
            Todas as imagens de heróis e marcas registradas pertencem à Moonton
            Games. Este é um aplicativo desenvolvido por fã para a comunidade,
            sem fins lucrativos ou vínculo oficial. Este é apenas um guia informativo
            gratuito.
          </Text>
          <Text style={styles.titulo}> Links Externos </Text>
          <Image
            source={require("./assets/separadorbaixo.png")}
            style={styles.separador}
          />
          <Text style={styles.ultsubtitulo}>
            {" "}
            Ao acessar links de terceiros, você estará sujeito às políticas de
            privacidade dos respectivos serviços.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconeBotaoVoltar: {
    width: 45,
    height: 45,
    zIndex: 9,
    left: -15,
    top: 0,
  },
  botaoVoltarContainer: {
    zIndex: 9,
    left: 20,
    top: 0,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  conteudo: {
    padding: 20,
  },
  logo: {
    marginTop: Platform.OS === 'ios' ? 20 : 50,
    width: 250,
    height: 150,
    alignSelf: "center",
    marginBottom: -50,
  },
  titulo: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
    marginTop: 30,
  },
  subtitulo: {
    fontSize: 16,
    color: "#888",
    marginTop: 0,
  },
  fundo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  separador: {
    top: 0,
    marginBottom: 0,
    width: 300,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: "#D3AF37",
  },

  bgHeader: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },

  headerSuperior: {
    flexDirection: "row",
    alignItems: "center",
  },

  container2: {
    marginBottom: Platform.OS === "ios" ? 5 : -48,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },

  textoHeader: {
    marginLeft: 15,
    fontSize: Platform.OS === "ios" ? 30 : 16,
    fontWeight: "bold",
    color: "#FFFF",
  },

  ultsubtitulo: {
    fontSize: 16,
    color: "#888",
    marginTop: 0,
    marginBottom: 50,
  },

  containerHead: {
  zIndex: 100,         // Garante que fique por cima no iOS
  elevation: 10,       // Garante que fique por cima no Android 
  height: 60,
},
});
