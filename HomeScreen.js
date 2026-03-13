import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
  RefreshControl,
  Keyboard,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { HEROIS } from "./banco_herois";

export default function HomeScreen({ navigation, route, abrirMenu }) {
  //Constantes

  const inputRef = useRef(null); // criando a referência
  const alternarPesquisa = () => {
    setPesquisar(!pesquisar);
  };
  const [atualizando, setAtualizando] = useState(false);
  const [busca, setBusca] = useState("");
  const aoRecarregar = () => {
    setAtualizando(true);
    setTimeout(() => {
      setAtualizando(false);
    }, 1000);
  };

  const heroisFiltrados = HEROIS.filter((heroi) =>
    heroi.nome.toLowerCase().includes(busca.toLowerCase()),
  );
  const [pesquisar, setPesquisar] = useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss(); // fecha o teclado
        setPesquisar(false); // esconde o textInput
      }}
    >
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <ImageBackground
              source={require("./assets/bgbg.png")}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              {/* BOTÃO QUE ABRE O MENU */}

              <ImageBackground
                source={require("./assets/bg-header.png")}
                style={styles.bgHeader}
              >
                <View style={styles.headerSuperior}>
                  <TouchableOpacity
                    onPress={abrirMenu}
                    style={styles.botaoOpcoes}
                  >
                    <Image source={require("./assets/opcoes.png")} />
                  </TouchableOpacity>
                  <Image
                    source={require("./assets/separador.png")}
                    style={styles.separador}
                  />

                  {/* local de pesquisa */}

                  <View resizeMode="contain" style={styles.areaPesquisa}>
                    <View style={styles.inputContainer}>
                      {pesquisar && (
                        <TextInput
                          ref={inputRef}
                          autoFocus={true}
                          style={styles.input}
                          placeholder="Pesquisar herói..."
                          placeholderTextColor="#ddd"
                          value={busca}
                          onChangeText={setBusca}
                        />
                      )}
                      <TouchableOpacity onPress={alternarPesquisa}>
                        <Image
                          source={require("./assets/lupa.png")}
                          style={styles.iconeLupa}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ImageBackground>

              {/* Grade de herois */}

              <FlatList
                data={heroisFiltrados}
                keyExtractor={(item) => item.id}
                numColumns={3}
                onScrollBeginDrag={() => {
                  if (pesquisar) {
                    Keyboard.dismiss();
                    setPesquisar(false);
                  }
                }}
                onScroll={() => {
                  if (pesquisar) setPesquisar(false);
                }}
                scrollEventThrottle={16}
                delayContentThrittle={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                refreshControl={
                  <RefreshControl
                    refreshing={atualizando} // Ele olha para o estado 'atualizando'
                    onRefresh={aoRecarregar} // Quando puxas a tela, ele chama a função acima
                    colors={["#00e5ff"]} // Cor da bolinha (azul ciano)
                  />
                }
                columnWrapperStyle={{ justifyContent: "center", gap: 1 }}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                }}
                ListHeaderComponent={
                  <View>
                    <Image
                      source={require("./assets/logo.png")}
                      style={styles.fotoIcone}
                      resizeMode="contain"
                      onPress={() => {
                        navigation.navigate("Doacoes");
                      }}
                    />
                  </View>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.quadrado}
                    onPress={() => {
                      setBusca("");
                      setPesquisar(false);
                      navigation.navigate("Details", { heroi: item });
                    }}
                  >
                    <View>
                      <Image source={item.foto} style={styles.fotoHeroi} />
                      <LinearGradient
                        colors={["transparent", "rgba(0, 0, 0, 0.94)"]}
                        style={styles.gradiente}
                      >
                        <Text style={styles.nomeHeroi}>{item.nome}</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <StatusBar style="light" />
            </ImageBackground>
          </SafeAreaView>
        </SafeAreaProvider>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    
  },

  backgroundImage: {
    flex: 1,
    width: "100%",
    
  },

  texto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  quadrado: {
    width: 115,
    height: 115,
    backgroundColor: "rgba(0,0,0,0.5)",
    margin: 2,
    borderWidth: 2,
    borderColor: "hsl(191, 100%, 94%)", // Azul do desenho
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    overflow: "hidden",
  },

  fotoHeroi: {
    width: 118,
    height: 118,
    borderRadius: 5,
  },

  nomeHeroi: {
    color: "#fff",
    fontSize: Platform.OS === 'ios' ? 17 : 10,
    marginTop: 5,
    position: "absolute",
    fontWeight: "bold",
    textShadowColor: "rgb(0, 0, 0)",
    textShadowRadius: 10,
    textShadowOffset: { width: 1, height: 1 },
    justifyContent: "center",
    bottom: 0,
    textAlign: "center",
    left: 0,
    right: 0,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
  },

  areaPesquisa: {
    width: "100%",
    width: 100,
    height: 40,
    flex: 1,
  },

  placeholder: {
    paddingRight: 10,
    marginRight: 20,
  },

  input: {
    flex: 1,
    color: "#FFFF",
  },

  inputContainer: {
    flexDirection: "row",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 0,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  iconeLupa: {
    right: 0,
  },

  gradiente: {
    position: "absolute",
    height: "40%",
    justifyContent: "flex-end",
    bottom: 0,
    left: 0,
    right: 0,
  },

  fotoIcone: {
    width: "80%",
    height: 180,
    marginTop: -40,
    marginBottom: -10,
    alignSelf: "center",
  },

  botaoOpcoes: {
    width: 40,
  },

  headerSuperior: {
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    padding: 10,
  },

  bgHeader: {
    width: "100%",
    height: 60,
  },

  separador: {
    height: 40,
    marginLeft: 5,
  },
});
