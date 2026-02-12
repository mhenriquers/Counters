import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  Alert,
  Touchable,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const copiaPix = async () => {
  const chavePix = "9bfe32d9-8633-41c0-835b-5287ecd44293";
  await Clipboard.setStringAsync(chavePix);

  if (Platform.OS === "ios") {
    Alert.alert("Sucesso", "Copiado para a área de transferência.", [
      { text: "OK" },
    ]);
  }
};

export default function Doacoes({ navigation }) {
  return (
    <ImageBackground
      source={require(`./assets/bg-up-side.png`)}
      style={styles.fundo}
    >
      <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
        <View>
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
              <Text style={styles.textoHeader}> Doações </Text>
            </ImageBackground>
          </SafeAreaView>
        </View>

        <ScrollView style={styles.telaRolante}>
          <Image
            source={require("./assets/gloria-mitico.png")}
            style={styles.iconeMitico}
          />
          <View style={styles.container}>
            <View style={styles.borda}>
              <Text style={styles.titulo}>Torne-se um Lendário Apoiador!</Text>
              <View style={styles.estreitaTexto}>
                <Text style={styles.corpo}>
                  <Text style={styles.corpo}>
                    {"        "}Olá! Eu sou o desenvolvedor por trás deste app.
                    Faço tudo sozinho: do código ao design. Manter um aplicativo
                    funcionando consome tempo e recursos, especialmente com os
                    custos de hospedagem para manter os dados e as
                    imagens online. Cada centavo doado é reinvestido diretamente
                    aqui para cobrir esses servidores e trazer atualizações
                    constantes. {"\n"} {"\n"}
                    {"         "}Se este app já te ajudou a ganhar uma Ranked ou
                    a entender melhor um herói, considere apoiar o projeto com
                    qualquer valor. Você já é o MVP dessa jornada!
                  </Text>
                </Text>
              </View>
            </View>
            <Text style={styles.italico}>
              {"          "}As doações realizadas via Pix são voluntárias e
              destinadas exclusivamente à manutenção e melhoria do projeto. Não
              armazenamos quaisquer dados bancários dos doadores.
            </Text>
            <View style={styles.areaPix}>
              <View style={styles.campoChave}>
                <Text style={styles.textoChave}>
                  9bfe32d9-8633-41c0-835b-5287ecd44293
                </Text>
              </View>
              <TouchableOpacity style={styles.botaoCopiar} onPress={copiaPix}>
                <Image
                  source={require("./assets/botao-copiar.png")}
                  style={styles.imageBotao}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconeMitico: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: Platform.OS === "ios" ? 0 : 50,
    marginBottom: 10,
  },

  botaoVoltar: {
    width: 45,
    height: 45,
    position: "absolute",
    zIndex: 9,
    left: 10,
    top: 50,
  },

  iconeBotaoVoltar: {
    width: 45,
    height: 45,
    zIndex: 9,
    left: 5,
    top: 0,
  },

  botaoFechar: {
    width: 45,
    height: 45,
    position: "absolute",
    zIndex: 9,
    right: 20,
    top: 70,
  },

  fundo: {
    flex: 1,
  },

  ImageBase: {
    justifyContent: "flex-end",
    width: 250,
    height: 250,
    alignSelf: "center",
    marginTop: 50,
  },

  titulo: {
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 30,
    marginBottom: 30,
    alignSelf: "center",
  },

  corpo: {
    color: "#FFFFFF",
    fontStyle: "italic",
    //textAlign: "justify",
  },

  borda: {
    width: "95%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D3AF37",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },

  estreitaTexto: {
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 20,
  },

  areaPix: {
    marginBottom: 20,
    alignItems: "center",
    paddingBottom: 40,
    flexDirection: "row",
  },

  campoChave: {
    backgroundColor: "#131314",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#818181",
  },

  textoChave: {
    fontSize: Platform.OS === "ios" ? 18 : 12,
    color: "#FFFFFF",
  },

  imageBotao: {
    width: 40,
    height: 40,
    margin: 10,
  },

  subtitulo: {
    fontStyle: "italic",
    color: "#131314",
  },
  italico: {
    fontStyle: "italic",
    color: "#818181",
    fontSize: 10,
    padding: 20,
  },

  bgHeader: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },

  headerSuperior: {
    flexDirection: "row",
    alignItems: "center",
  },

  container2: {
    marginBottom: Platform.OS === "ios" ? 0 : -48,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 99, // Garante que fique por cima
    elevation: 5, // Essencial para Android
  },

  textoHeader: {
    marginLeft: 15,
    fontSize: Platform.OS === "ios" ? 30 : 16,
    fontWeight: "bold",
    color: "#FFFF",
  },
});
