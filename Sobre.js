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
  Alert,
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

  if (Platform.OS === 'ios'){
    Alert.alert(
      "Sucesso",
      "Copiado para a área de tranferência",
      [{ text: "OK"}]
    );
  }
};

export default function Sobre({ navigation }) {
  return (
    <ImageBackground
      source={require(`./assets/bg-up-side.png`)}
      style={styles.fundo}
    >
      <View >
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
          <View>
            <Text style={styles.titulo}> Early Game </Text>
            <Image
              source={require("./assets/separadorbaixo.png")}
              resizeMode="stretch"
              style={styles.separador}
            />
            <Text style={styles.subtitulo}>
              {"      "}Agradeço aos meus amigos e parceiros de squad que
              testaram as primeiras versões deste app, aguentaram os bugs e me
              ajudaram a validar cada ideia implementada.
            </Text>

            <Text style={styles.titulo}> Lore </Text>
            <Image
              source={require("./assets/separadorbaixo.png")}
              style={styles.separador}
            />
            <Text style={styles.subtitulo}>
              {"      "}Tudo começou em uma noite de derrotas amargas no Land of
              Dawn. Entre sequências de derrotas inexplicáveis e a frustração de
              não saber como segurar um herói inimigo 'feedado', percebi que a
              força bruta não era o suficiente: era preciso inteligência. {"\n"}{" "}
              {"\n"}
              {"      "}
              Como um desenvolvedor solo, decidi aceitar o desafio de construir
              meu próprio 'item' de batalha. Foram muitas noites codificando
              sozinho, enfrentei obstáculos técnicos complexos e falhas críticas
              de sistema que exigiram profundas revisões de código e
              persistência, refinando dados para que esse item finalmente
              ficasse pronto.
              {"\n"}
              {"\n"} {"      "} Este aplicativo não é apenas um banco de dados;
              ele é a união de mecânicas essenciais e vivência de jogo e a prova
              de que, com a estratégia certa, qualquer herói pode ser derrotado.
              Eu criei esta ferramenta para que você, assim como eu, tenha em
              mãos um recurso prático para subir de nível e dominar as partidas.
              {"\n"}
              {"\n"} {"      "}Continuo no Glória Mítico e estou sempre pronto
              para fechar o squad. Pode passar raiva comigo nas TF's, porque
              como jogador sou um otimo programador. Nos vemos em Land of Dawn!
            </Text>

{/*         perfil

            <View style={styles.containerProfile}>
              <Image
                source={require("./assets/profile.jpeg")}
                style={styles.profile}
              />
            </View>
*/}

            <Text style={styles.titulo}> Contato</Text>
            <Image
              source={require("./assets/separadorbaixo.png")}
              style={styles.separador}
            />

            {/* Botões */}

            <TouchableOpacity onPress={enviarEmail}>
              <View style={styles.linhaContato}>
                <Image
                  source={require("./assets/gmail.png")}
                  style={styles.iconeGmail}
                />
                <Text style={styles.textoContato}>
                  {"    "}
                  mlbbcounters@gmail.com
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={abrirGit}>
              <View style={styles.linhaContato}>
                <Image
                  source={require("./assets/gitHub.png")}
                  style={styles.iconeGit}
                />
                <Text style={styles.textoContato}>
                  {"   "}
                  mhenriquers
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={copiaId}
            
            >
              <View style={styles.linhaContato}>
                <Image
                  source={require("./assets/gloria-mitico.png")}
                  style={styles.iconeMitico}
                />
                <Text style={styles.textoContato}>
                  {"   "} Owdail - ID: 1033871650
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.italico}>
              {"    "}Ao utilizar nossos canais de contato, você concorda com
              nossos termos e política de privacidade.
            </Text>
            <Text style={styles.titulo}> Aviso Legal</Text>
            <Image
              source={require("./assets/separadorbaixo.png")}
              style={styles.separador}
            />
            <Text style={styles.avisoLegal}>
              {"      "}Este aplicativo é um projeto independente desenvolvido
              por fã e para fãs de Mobile Legends: Bang Bang. Todo o conteúdo,
              incluindo nomes de heróis, imagens, ícones e marcas registradas,
              são de propriedade exclusiva da Moonton Games. {"\n"} {"\n"}
              {"      "} As informações aqui contidas servem apenas para
              propósitos educacionais e informativos de auxílio ao jogador. Este
              app não é afiliado, endossado ou patrocinado pela Moonton de
              nenhuma forma.
            </Text>
          </View>
          <Text style={styles.versao}>Versão 1.0.0 — Build: Perfurador</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    zIndex: 0,
  }, 

  conteudo: {
    padding: 20,
    paddingTop: 0,
    alignItems: "center",
    flex: 1,
  },

  logo: {
    marginTop: Platform.OS === 'ios' ? 10 : 50,
    marginBottom: -50,
    width: 250,
    height: 150,
    alignSelf: "center",
  },

  titulo: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
    marginTop: 50,
    paddingBottom: 0,
  },

  fundo: {
    flex: 1,
    width: "100%",
    height: "100%",
    zIndex: -2,
  },

  subtitulo: {
    fontSize: 14,
    color: "#FFF",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D3AF37",
    backgroundColor: "rgba(0,0,0,0.1)",
  },

  avisoLegal: {
    fontSize: 14,
    color: "#FFF",
    fontStyle: "italic",
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#D3AF37",
    marginBottom: 30,
  },

  layer: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 20,
    borderColor: "#FFFFFF",
  },

  separador: {
    top: 0,
    marginBottom: 50,
    width: 300,
    height: 2,
    marginLeft: 7,
    borderWidth: 1,
    borderColor: "#D3AF37",
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
    marginRight: 6,
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
    backgroundColor: "rgba(0,0,0,0.1)",
  },

  profile: {
    width: 200,
    height: 200,
    alignSelf: "center",
    margin: 15,
  },

  versao: {
    bottom: 20,
    fontSize: 17,
    color: "#F2F0EF",
    marginTop: 10,
    alignSelf: "center",
    fontStyle: "italic",
    paddingTop: 20,
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
    top: 0,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  bgHeader: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 999,
  },

  headerSuperior: {
    flexDirection: "row",
    alignItems: "center",
  },

  container2: {
    marginBottom: Platform.OS === "ios" ? -50 : -48,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },

  textoHeader: {
    marginLeft: 15,
    fontSize: Platform.OS === "ios" ? 30 : 16,
    fontWeight: "bold",
    color: "#FFFF",
  },
});
