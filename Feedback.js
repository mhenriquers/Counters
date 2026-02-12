import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const abrirGit = () => {
  Linking.openURL("https://github.com/mhenriquers");
};

const enviarEmail = async () => {
  const email = "mlbbcounters@gmail.com";

  const assunto = encodeURIComponent("Feedback - App Counters");
  const corpo = encodeURIComponent("Olá! Gostaria de sugerir...");

  const url = `mailto:${email}?subject=${assunto}&body=${corpo}`;
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(
      "App de E-mail não encontrado",
      "Para enviar um e-mail, configure o aplicativo 'Mail' padrão do seu iPhone ou copie o endereço: mlbbcounters@gmail.com",
      [{ text: "OK" }],
    );
  }

  //Linking.openURL(`mailto:${email}?subject=${assunto}&body${corpo}`);
};

const copiaId = async () => {
  const id = " 1033871650";
  await Clipboard.setStringAsync(id);
};

export default function Feedback({ navigation }) {
  return (
    <ImageBackground
      source={require(`./assets/bg-up-side.png`)}
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
            <Text style={styles.textoHeader}> Feedback</Text>
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
          <Text style={styles.titulo}> Sugestões ou erros?</Text>
          <Image
            source={require("./assets/separadorbaixo.png")}
            style={styles.separador}
          />
          <View style={styles.borda}>
            <Text style={styles.subtitulo}>
              {"      "}Este aplicativo foi desenvolvido para ser uma ferramenta
              útil no dia a dia das suas partidas. Se você encontrou algum erro,
              tem uma sugestão de melhoria ou sentiu falta de algum conteúdo,
              por favor, envie seu comentário. Feedbacks diretos de quem usa o
              app são a melhor forma de evoluir o projeto.
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={enviarEmail}>
              <View style={styles.linhaContato}>
                <Image
                  source={require("./assets/gmail.png")}
                  style={styles.iconeGmail}
                />
                <Text style={styles.textoContato}> mlbbcounters@gmail.com</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={abrirGit}>
              <View style={styles.linhaContato}>
                <Image
                  source={require("./assets/gitHub.png")}
                  style={styles.iconeGit}
                />
                <Text style={styles.textoContato}> mhenriquers</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={copiaId}>
              <View style={styles.linhaContato}>
                <Image
                  source={require("./assets/gloria-mitico.png")}
                  style={styles.iconeMitico}
                />
                <Text style={styles.textoContato}>
                  {" "}
                  Owdail - ID: 1033871650
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.italico}>
            {"    "}Ao utilizar nossos canais de contato, você concorda com
            nossos termos e política de privacidade.
          </Text>
          <View style={styles.containerRetorno}>
            <Text style={styles.titulo}> Retorno: </Text>
            <Image
              source={require("./assets/separadorbaixo.png")}
              style={styles.separador}
            />
            <View style={styles.retorno}>
              <Text style={styles.textoRetorno}>
                {"      "}
                Separei esse espaço para trazer quaisquer atualizações do App,
                se vc pediu algo, lhe darei um retorno por aqui.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  botaoFechar: {
    width: 45,
    height: 45,
    position: "absolute",
    zIndex: 999,
    right: 20,
    top: 50,
  },

  conteudo: {
    //alignItems: "center",
    padding: 20,
  },

  logo: {
    marginTop: Platform.OS === 'ios' ? 20 : 50,
    marginBottom: -50,
    width: 250,
    height: 150,
    alignSelf: "center",
  },

  titulo: {
    marginTop: 30,
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
    //textAlign: "center",
  },

  separador: {
    width: 350,
    borderWidth: 1,
    borderColor: "#D3AF37",
    left: 7,
    marginBottom: 50,
  },

  subtitulo: {
    fontSize: 15,
    color: "#FFF",
    marginTop: 10,
    left: 10,
    marginBottom: 20,
  },

  fundo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  borda: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D3AF37",
    marginBottom: 20,
    paddingRight: 7,
    backgroundColor: "rgba(0,0,0,0.1)",
  },

  linhaContato: {
    flexDirection: "row",
    height: 50,
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D3AF37",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  iconeGit: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  iconeGmail: {
    width: 30,
    height: 30,
    marginLeft: 5,
    marginRight: 15,
  },

  iconeMitico: {
    width: 35,
    height: 35,
    marginLeft: 2,
  },

  textoContato: {
    fontSize: 14,
    color: "#FFF",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  containerProfile: {
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D3AF37",
    marginTop: 25,
    marginBottom: -25,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  retorno: {
    marginTop: 10,
    width: "100%",
    height: 300,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D3AF37",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  textoRetorno: {
    color: "#FFF",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: Platform.OS === "ios" ? 18 : 14,
    textAlign: "justify",
  },

  italico: {
    fontStyle: "italic",
    color: "#818181",
    fontSize: 12,
    marginTop: 10,
  },
  iconeBotaoVoltar: {
    width: 45,
    height: 45,
    zIndex: 9,
    left: -10,
    top: 0,
  },
  botaoVoltarContainer: {
    zIndex: 9,
    left: 20,
    width: 45,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
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
    zIndex: 101,
  },

  textoHeader: {
    margin: 15,
    fontSize: Platform.OS === "ios" ? 30 : 16,
    fontWeight: "bold",
    color: "#FFFF",
  },

  containerHead: {
  zIndex: 100,        
  elevation: 10,      
  height: 60,
},
});
