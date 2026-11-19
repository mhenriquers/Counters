import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
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
  Pressable,
  BackHandler,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { listarHerois } from "../dados/herois";
import InstalarApp from "../componentes/InstalarApp";
import MenuLateral from "../componentes/MenuLateral";
import HeroiNaoEncontrado from "../componentes/HeroiNaoEncontrado";
import { cores, espaco, raio, fonte, tela } from "../tema";
import { useTamanhoTela } from "../responsivo";
import { Fundo } from "../componentes/ui";
import { useIdioma } from "../idioma/idioma";

const chaveDoHeroi = (item) => item.id;

// Lado do quadro de cada herói, por tipo de tela. No celular são sempre
// 3 colunas; no tablet e no computador, cabem quantas colunas der.
const LADO_QUADRO = { celular: 115, tablet: 130, computador: 140 };
// Espaço que cada quadro ocupa além do lado: margem (2 + 2) + gap da linha (1)
const SOBRA_QUADRO = 5;
const PADDING_GRADE = 10; // igual ao paddingHorizontal de conteudoGrade

// Mostrado quando a busca não encontra nenhum herói. Fica fora da Home para
// ser sempre a mesma referência (a FlatList não redesenha à toa).
function ListaVazia() {
  return <HeroiNaoEncontrado style={styles.listaVazia} />;
}

// Logo + botão de instalar, no topo da grade. Também fica fora da Home
// para ser sempre a mesma referência.
function CabecalhoGrade() {
  return (
    <View>
      <Image
        source={require("../../assets/logo.png")}
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
  const { t } = useIdioma();
  const inputRef = useRef(null); // criando a referência
  const [pesquisar, setPesquisar] = useState(false);
  const [busca, setBusca] = useState("");

  // Grade responsiva: tamanho dos quadros e número de colunas pela largura
  const { largura, tipo, celular } = useTamanhoTela();
  const lado = LADO_QUADRO[tipo];
  const larguraUtil = Math.min(largura, tela.larguraGrade) - PADDING_GRADE * 2;
  const colunas = celular
    ? 3
    : Math.max(3, Math.floor(larguraUtil / (lado + SOBRA_QUADRO)));

  // Estilos que dependem do tamanho, guardados com useMemo: só mudam quando
  // o tipo de tela muda (assim a grade não é redesenhada à toa)
  const tamanhos = useMemo(
    () => ({
      quadro: { width: lado, height: lado },
      // a foto é 3px maior que o quadro (como no celular: 118 x 115)
      foto: { width: lado + 3, height: lado + 3 },
      nome: celular ? null : styles.nomeHeroiGrande,
    }),
    [lado, celular],
  );

  const heroisFiltrados = useMemo(() => {
    const textoBusca = busca.trim().toLocaleLowerCase("pt-BR");

    // A lista já vem em ordem alfabética; aqui só filtramos pela busca
    return listarHerois().filter((heroi) =>
      heroi.nome.toLocaleLowerCase("pt-BR").includes(textoBusca),
    );
  }, [busca]);

  // Fecha a busca de vez: esconde o campo, fecha o teclado e limpa o texto
  // (a grade volta inteira).
  const sairDaPesquisa = useCallback(() => {
    Keyboard.dismiss();
    setPesquisar(false);
    setBusca("");
  }, []);

  const alternarPesquisa = () =>
    pesquisar ? sairDaPesquisa() : setPesquisar(true);

  // Toque fora do campo. Vazio (só o placeholder): fecha a busca.
  // Com texto: só fecha o teclado, e o campo continua mostrando o filtro.
  const tocarFora = () => (busca ? Keyboard.dismiss() : sairDaPesquisa());

  // Voltar do Android com a busca aberta: fecha a busca em vez de sair do app
  useEffect(() => {
    if (!pesquisar) return;
    const assinatura = BackHandler.addEventListener("hardwareBackPress", () => {
      sairDaPesquisa();
      return true;
    });
    return () => assinatura.remove();
  }, [pesquisar, sairDaPesquisa]);

  // Funções da FlatList guardadas com useCallback: assim, abrir/fechar o menu
  // não faz a grade inteira ser redesenhada (as props da lista não mudam).
  const desenharHeroi = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[styles.quadrado, tamanhos.quadro]}
        onPress={() => {
          setBusca("");
          setPesquisar(false);
          navigation.navigate("Details", { id: item.id });
        }}
      >
        <View>
          <Image source={item.foto} style={[styles.fotoHeroi, tamanhos.foto]} />
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.94)"]}
            style={styles.gradiente}
          >
            <Text style={[styles.nomeHeroi, tamanhos.nome]}>
              {item.nome}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    ),
    [navigation, tamanhos],
  );

  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  return (
    <TouchableWithoutFeedback onPress={tocarFora}>
      <View style={{ flex: 1, backgroundColor: cores.barraStatus }}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <Fundo
              fonte={require("../../assets/bgbg.png")}
              style={styles.backgroundImage}
            >
              {/* CABEÇALHO: menu | separador | busca + lupa */}
              <Fundo
                fonte={require("../../assets/bg-header.png")}
                style={styles.cabecalho}
              >
                {/* Com a busca aberta, o botão do menu só fecha a busca */}
                <TouchableOpacity
                  onPress={() =>
                    pesquisar ? sairDaPesquisa() : setMenuAberto(true)
                  }
                  style={styles.botaoCabecalho}
                  hitSlop={8}
                >
                  <Image source={require("../../assets/opcoes.png")} />
                </TouchableOpacity>
                <Image
                  source={require("../../assets/separador.png")}
                  style={styles.separador}
                />

                <View style={styles.areaPesquisa}>
                  {pesquisar && (
                    <View style={styles.campoBusca}>
                      <TextInput
                        ref={inputRef}
                        autoFocus={true}
                        style={styles.input}
                        placeholder={t("home.pesquisar")}
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
                    <Image source={require("../../assets/lupa.png")} />
                  </TouchableOpacity>
                </View>
              </Fundo>

              {/* Grade de herois */}

              <View style={styles.areaGrade}>
                {/* key: a FlatList não aceita mudar numColumns depois de
                    desenhada; com a key, ela é recriada ao mudar de colunas
                    (ex.: ao girar o tablet ou redimensionar a janela) */}
                <FlatList
                  key={colunas}
                  data={heroisFiltrados}
                  keyExtractor={chaveDoHeroi}
                  numColumns={colunas}
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps="handled"
                  columnWrapperStyle={styles.linhaGrade}
                  contentContainerStyle={styles.conteudoGrade}
                  ListHeaderComponent={CabecalhoGrade}
                  ListEmptyComponent={ListaVazia}
                  renderItem={desenharHeroi}
                />

                {/* Busca aberta e vazia: esta camada invisível cobre a grade,
                    e o primeiro toque só fecha a busca, sem abrir herói.
                    Com texto digitado, a camada some: tocar num resultado abre direto. */}
                {pesquisar && busca === "" && (
                  <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={sairDaPesquisa}
                  />
                )}
              </View>
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
    backgroundColor: cores.barraStatus, // a faixa da hora fica com esta cor (SafeAreaView)
  },

  backgroundImage: {
    flex: 1,
    width: "100%",
  },

  texto: {
    color: cores.texto,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  // width/height vêm de tamanhos.quadro (dependem do tipo de tela)
  quadrado: {
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

  // width/height vêm de tamanhos.foto (dependem do tipo de tela)
  fotoHeroi: {
    borderRadius: 5,
  },

  nomeHeroi: {
    color: cores.texto,
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

  // Tablet e computador: quadros maiores, nome um pouco maior
  nomeHeroiGrande: {
    fontSize: 13,
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
    maxWidth: 560, // no computador, 80% da tela seria largo demais
    height: 180,
    marginTop: -40,
    marginBottom: -10,
    alignSelf: "center",
  },

  listaVazia: {
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
    maxWidth: 420, // no computador, a pílula não atravessa a tela toda
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

  // Envolve a grade para a camada da busca (absoluteFill) cobrir só ela
  areaGrade: {
    flex: 1,
  },

  linhaGrade: {
    justifyContent: "center",
    gap: 1,
  },

  // No computador, a grade fica no meio com largura máxima (tela.larguraGrade)
  conteudoGrade: {
    width: "100%",
    maxWidth: tela.larguraGrade,
    alignSelf: "center",
    paddingHorizontal: PADDING_GRADE,
    paddingVertical: 20,
  },

});
