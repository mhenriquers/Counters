import React, { useCallback, useMemo, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { HEROIS } from "./banco_herois";
import InstalarApp from "./InstalarApp";
import MenuLateral from "./MenuLateral";

const chaveDoHeroi = (item) => item.id;

// Logo do topo da grade (não muda, então é criado uma vez só)
const cabecalhoGrade = (
  <View>
    <Image
      source={require("./assets/logo.png")}
      style={{
        width: "80%",
        height: 180,
        marginTop: -40,
        marginBottom: -10,
        alignSelf: "center",
      }}
      resizeMode="contain"
    />
    <InstalarApp />
  </View>
);

export default function HomeScreen({ navigation }) {
  //Constantes

  // O estado do menu lateral fica aqui na própria Home
  const [menuAberto, setMenuAberto] = useState(false);
  const inputRef = useRef(null); // criando a referência
  const alternarPesquisa = () => {
    setPesquisar(!pesquisar);
  };
  const [busca, setBusca] = useState("");

  const heroisFiltrados = useMemo(() => {
    const textoBusca = busca.trim().toLocaleLowerCase("pt-BR");

    return [...HEROIS]
      .sort((a, b) => {
        const comparacao = a.nome.localeCompare(b.nome, "pt-BR", {
          sensitivity: "base",
          numeric: true,
        });

        // Critério secundário para nomes iguais
        if (comparacao === 0) {
          return Number(a.id) - Number(b.id);
        }

        return comparacao;
      })
      .filter((heroi) =>
        heroi.nome.toLocaleLowerCase("pt-BR").includes(textoBusca),
      );
  }, [busca]);
  const [pesquisar, setPesquisar] = useState(false);

  // Funções da FlatList guardadas com useCallback: assim, abrir/fechar o menu
  // não faz a grade inteira ser redesenhada (as props da lista não mudam).
  const aoComecarRolagem = useCallback(() => {
    if (pesquisar) {
      Keyboard.dismiss();
      setPesquisar(false);
    }
  }, [pesquisar]);

  const aoRolar = useCallback(() => {
    if (pesquisar) setPesquisar(false);
  }, [pesquisar]);

  const desenharHeroi = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.quadrado}
        onPress={() => {
          setBusca("");
          setPesquisar(false);
          navigation.navigate("Details", { id: item.id });
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
    ),
    [navigation],
  );

  const fecharMenu = useCallback(() => setMenuAberto(false), []);

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
                    onPress={() => setMenuAberto(true)}
                    style={styles.botaoOpcoes}
                    hitSlop={8}
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
                keyExtractor={chaveDoHeroi}
                numColumns={3}
                onScrollBeginDrag={aoComecarRolagem}
                onScroll={aoRolar}
                scrollEventThrottle={16}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                columnWrapperStyle={styles.linhaGrade}
                contentContainerStyle={styles.conteudoGrade}
                ListHeaderComponent={cabecalhoGrade}
                renderItem={desenharHeroi}
              />
              <StatusBar style="light" />
            </ImageBackground>
          </SafeAreaView>
        </SafeAreaProvider>

        {/* Menu lateral: desenhado por cima de toda a Home */}
        <MenuLateral
          visivel={menuAberto}
          aoFechar={fecharMenu}
          navigation={navigation}
        />
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
    fontSize: Platform.select({ ios: 17, web: 12, default: 10 }),
    marginTop: 5,
    position: "absolute",
    fontWeight: "bold",
    textShadowColor: "rgb(0, 0, 0)",
    textShadowRadius: 10,
    textShadowOffset: { width: 1, height: 1 },
    justifyContent: "center",
    // a foto (118px) é maior que o quadro (111px úteis) e é cortada ~3,5px embaixo
    bottom: 4,
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

  linhaGrade: {
    justifyContent: "center",
    gap: 1,
  },

  conteudoGrade: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  botaoOpcoes: {
    width: 40,
    height: 40,
    justifyContent: "center",
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
