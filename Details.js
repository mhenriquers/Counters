import React, { lazy } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HEROIS } from "./banco_herois";
import WinRateCard from "./paralelograma";
{
  /* Função principal  */
}

function DetailsScreen({ route, navigation }) {
  // O 'route.params' é onde o 'pacote' que você enviou chega
  const { heroi } = route.params;

  {
    /* Origem dos Icones das Classe */
  }

  const iconesClasses = {
    Assassino: require("./assets/assassino.png"),
    Mago: require("./assets/mago.png"),
    Tanque: require("./assets/tanque.png"),
    Suporte: require("./assets/suporte.png"),
    Lutador: require("./assets/soldado.png"),
    Atirador: require("./assets/atirador.png"),
  };

  {
    /* Filtro da classe */
  }

  const iconeDaClasse = iconesClasses[heroi.classe];
  const listaDaClasse = heroi.classe.split("/");

  {
    /* Filtro dos counters/counterados */
  }

  const counterList = HEROIS.filter((h) =>
    (heroi.counters || []).includes(h.id),
  );
  const counteradoPorList = HEROIS.filter((h) =>
    (heroi.counteradoPor || []).includes(h.id),
  );
  return (
    <ImageBackground
      // Imagem de fundo e gradiente

      source={require("./assets/bgDetails.png")}
      resizeMode="cover"
      style={style.fundoDetails}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "transparent"]}
        style={style.gradient}
      >      
      </LinearGradient>
        {/*Botão de voltar*/}

        <View style={style.HeaderDetails}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={style.botaoVoltar}
          >
            <Image
              source={require("./assets/botaoVoltar.png")}
              style={style.iconeBotaoVoltar}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={style.botaoFechar}
          >
            <Image
              source={require("./assets/botao-fechar.png")}
              style={style.iconeBotaofechar}
            />
          </TouchableOpacity>
        </View>

        {/* CARD DO HEROI PRINCIPAL */}

<ScrollView>
        <View style={style.cardHeroi}>
          {/* iMAGENS */}

          <Image source={heroi.foto} style={style.imagemHeroi} />

          <View style={style.nomeTexto}>
            <Text style={style.nomeHeroi}>{heroi.nome}</Text>
            <View style={style.containerIcones}>
              {listaDaClasse.map((item, index) => (
                <Image
                  key={index}
                  source={iconesClasses[item]}
                  style={style.iconeClasse}
                />
              ))}
            </View>
          </View>
        </View>

        {/* CONTAINER HEROIS */}

        {/* Layer do heroi counter*/}

        <View style={style.secao}>
          <ImageBackground
            source={require("./assets/bg-Layer.png")}
            resizeMode="stretch"
            style={style.fundoLayer}
          >
            <View style={style.layer}>
              <ImageBackground
                source={require("./assets/hero.png")}
                resizeMode="contain"
                style={style.imgLayer}
              />
              <Text style={style.textoLayer}>É forte contra :</Text>
            </View>
          </ImageBackground>

          {/* Imagens dos herois counter */}

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={style.scrollHerois}
          >
            <View style={style.containerCirculos}>
              {/* fazer com que o .map percorre o array 'counter' na ordem dos ID's */}

              {heroi.counters?.map((idDoHeroi) => {
                const dadosDoHeroi = HEROIS.find((h) => h.id === idDoHeroi);
                if (!dadosDoHeroi) return null;

                return (
                  <TouchableOpacity
                    key={idDoHeroi}
                    onPress={() =>
                      navigation.push("Details", { heroi: dadosDoHeroi })
                    }
                  >
                    <View style={style.containerHerois}>
                      <Image
                        source={dadosDoHeroi.foto}
                        style={style.circuloHeroi}
                      />

                      {/* nome herois counter */}

                      <Text
                        style={style.nomeHeroiCirculo}
                        numberOfLines={1} // Força o texto a ficar em uma única linha
                        ellipsizeMode="tail" // Se o nome for gigante (ex: Yi Sun-shin), ele coloca "..." no final
                      >
                        {" "}
                        {dadosDoHeroi.nome}{" "}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Layer herois counterado */}

        <View style={style.secao}>
          <ImageBackground
            source={require("./assets/bg-Layer.png")}
            resizeMode="stretch"
            style={style.fundoLayer}
          >
            <View style={style.layer}>
              <ImageBackground
                source={require("./assets/hero.png")}
                resizeMode="contain"
                style={style.imgLayer}
              />

              <Text style={style.textoLayer}>É fraco contra :</Text>
            </View>
          </ImageBackground>

          {/* Imagem herois counterado */}

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={style.scrollHerois}
          >
            <View style={style.containerCirculos}>
              {/* fazer com que o .map percorre o array 'counteradoPor' na ordem dos ID's */}

              {heroi.counteradoPor?.map((idDoHeroi) => {
                const dadosDoHeroi = HEROIS.find((h) => h.id === idDoHeroi);
                if (!dadosDoHeroi) return null;

                return (
                  <TouchableOpacity
                    key={idDoHeroi}
                    onPress={() =>
                      navigation.push("Details", { heroi: dadosDoHeroi })
                    }
                  >
                    <View style={style.containerHerois}>
                      <Image
                        source={dadosDoHeroi.foto}
                        style={style.circuloHeroi}
                      />

                      {/* nome herois counterado */}

                      <Text
                        style={style.nomeHeroiCirculo}
                        numberOfLines={1} // Força o texto a ficar em uma única linha
                       // ellipsizeMode="tail" // Se o nome for gigante (ex: Yi Sun-shin), ele coloca "..." no final
                      >
                        {" "}
                        {dadosDoHeroi.nome}{" "}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
              </ScrollView>

      <Text style={style.textoRodapé}>
        pesquisa realizada no site oficial do MLBB
      </Text>

    </ImageBackground>
  );
}
const style = StyleSheet.create({
  fundoDetails: {
    flex: 1,
  },

  gradient: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: "50%",
    paddingTop: 40,
    zIndex: -1,
  },

  HeaderDetails: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9,
    // para separar os botões
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  botaoVoltar: {
    width: 30,
    height: 40,
    paddingLeft: 10,
  },

  iconeBotaoVoltar: {
    height: "100%",
    width: "100%",
  },

  botaoFechar: {
    width: 45,
    height: 45,
  },

  iconeBotaofechar: {
    height: "100%",
    width: "100%",
  },

  cardHeroi: {
    marginTop: Platform.OS === "ios" ? 100 : 100,
    marginLeft: 30,
    marginRight: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },

  imagemHeroi: {
    width: 148,
    height: 148,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "hsl(191, 100%, 94%)",
    elevation: 10,
  },

  nomeHeroi: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
    letterSpacing: 0.9,
  },

  iconeClasse: {
    width: 50,
    height: 50,
  },

  containerIcones: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
    justifyContent: "center",
  },

  NomeTexto: {
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },

  containerCirculos: {
    flexDirection: "row",
    gap: Platform.OS === "ios" ? 0 : 5,
    marginRight: 30,
    alignItems: "center",
  },

  circuloHeroi: {
    width: 70,
    height: 70,
    borderRadius: 35, //circulo perfeito
    borderWidth: 2,
    borderColor: "hsl(191, 100%, 94%)", //borda
  },

  secao: {
    marginBottom: 0,
    minHeight: 100,
  },

  fundoLayer: {
    alignContent: "center",
    width: "100%",
    height: 60,
    marginLeft: 5,
    paddingLeft: 0,
    marginTop: Platform.OS === "ios" ? 20 : 55,
  },
  layer: {
    // layer { imgLayer/textoLayer}
    width: 145,
    height: 44,
    marginLeft: 10,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  textoLayer: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "sans-serif-condensed",
  },

  imgLayer: {
    justifyContent: "center",
    width: 40,
    height: 40,
  },

  containerHerois: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 20,
    height:  Platform.OS === "ios" ? 110 : 80,
    width: 85,
    marginTop: -5,
    paddingLeft: 20,

  },

  nomeHeroiCirculo: {
    color: "#FFFFFF",
    fontStyle: "italic",
    opacity: 0.6,
    numberOfLines: 1,
    includeFontPadding: false,
    fontSize: Platform.OS === 'ios' ? 12 : 10,
  },

  scrollHerois: {
    width: "100%",
    height: Platform.OS === "ios" ? 140 : 120,
    marginLeft: 0,
    marginBottom: Platform.OS === "ios" ? 5 : 0,
    zIndex: 10,
  },

  textoRodapé: {
    position: "absolute",
    alignSelf: "center",
    color: "#FFFFFF",
    opacity: 0.5,
    fontStyle: "italic",
    bottom: 45,
  },

  bgNome: {
    width: 150,
    height: 150,
  },
});
export default DetailsScreen;
