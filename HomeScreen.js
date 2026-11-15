import React, { useCallback, useMemo, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
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
import { cores, espaco, raio, fonte } from "./tema";
import { Fundo } from "./ui";

const chaveDoHeroi = (item) => item.id;

// Mostrado quando a busca não encontra nenhum herói. Fica fora da Home para
// ser sempre a mesma referência (a FlatList não redesenha à toa).
function ListaVazia() {
  return <Text style={styles.listaVazia}>Nenhum herói encontrado</Text>;
}

// Logo + botão de instalar, no topo da grade. Também fica fora da Home
// para ser sempre a mesma referência.
function CabecalhoGrade() {
  return (
    <View>
      <Image
        source={require("./assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <InstalarApp />
    </View>
  );
}

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
            <Fundo
              fonte={require("./assets/bgbg.png")}
              modo="largura"
              style={styles.backgroundImage}
            >
              {/* CABEÇALHO: menu | separador | busca + lupa */}
              <Fundo
                fonte={require("./assets/bg-header.png")}
                style={styles.cabecalho}
              >
                <TouchableOpacity
                  onPress={() => setMenuAberto(true)}
                  style={styles.botaoCabecalho}
                  hitSlop={8}
                >
                  <Image source={require("./assets/opcoes.png")} />
                </TouchableOpacity>
                <Image
                  source={require("./assets/separador.png")}
                  style={styles.separador}
                />

                <View style={styles.areaPesquisa}>
                  {pesquisar && (
                    <View style={styles.campoBusca}>
                      <TextInput
                        ref={inputRef}
                        autoFocus={true}
                        style={styles.input}
                        placeholder="Pesquisar herói..."
                        placeholderTextColor={cores.textoFraco}
                        value={busca}
                        onChangeText={setBusca}
                      />
                      {busca.length > 0 && (
                        <TouchableOpacity
                          onPress={() => setBusca("")}
                          hitSlop={8}
                          style={styles.botaoLimpar}
                        >
                          <Text style={styles.textoLimpar}>✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={alternarPesquisa}
                    style={styles.botaoCabecalho}
                    hitSlop={8}
                  >
                    <Image source={require("./assets/lupa.png")} />
                  </TouchableOpacity>
                </View>
              </Fundo>

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
                ListHeaderComponent={CabecalhoGrade}
                ListEmptyComponent={ListaVazia}
                renderItem={desenharHeroi}
              />
              <StatusBar style="light" />
            </Fundo>
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
    backgroundColor: cores.fundoHome, // continua a imagem onde ela acaba
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
    borderColor: cores.azulBorda,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
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

  logo: {
    width: "80%",
    height: 180,
    marginTop: -40,
    marginBottom: -10,
    alignSelf: "center",
  },

  listaVazia: {
    color: cores.textoSuave,
    fontSize: fonte.corpo,
    textAlign: "center",
    marginTop: espaco.xl,
  },

  // CABEÇALHO
  cabecalho: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: espaco.md,
    paddingHorizontal: espaco.sm,
  },

  // Área de toque mínima de 44x44 (os ícones são um pouco maiores e ficam no tamanho original)
  botaoCabecalho: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  separador: {
    height: 40,
  },

  areaPesquisa: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: espaco.sm,
  },

  // Campo de busca em pílula
  campoBusca: {
    flex: 1,
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: espaco.md,
    borderRadius: raio.pilula,
    borderWidth: 1,
    borderColor: "rgba(155, 209, 253, 0.35)",
    backgroundColor: "rgba(155, 209, 253, 0.1)",
  },

  input: {
    flex: 1,
    height: "100%",
    paddingVertical: 0, // o Android põe padding próprio e o texto sai da pílula
    color: cores.texto,
    fontSize: fonte.corpo,
    // na web, tira o contorno azul do navegador (a pílula já mostra o campo)
    ...Platform.select({ web: { outlineStyle: "none" }, default: {} }),
  },

  botaoLimpar: {
    paddingLeft: espaco.sm,
  },

  textoLimpar: {
    color: cores.textoSuave,
    fontSize: fonte.corpo,
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

});
