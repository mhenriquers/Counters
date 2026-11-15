import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HEROIS } from "./banco_herois";

// Ícones das classes (as chaves são os nomes usados em `classe` no banco)
const iconesClasses = {
  Assassino: require("./assets/assassino.png"),
  Mago: require("./assets/mago.png"),
  Tanque: require("./assets/tanque.png"),
  Suporte: require("./assets/suporte.png"),
  Lutador: require("./assets/soldado.png"),
  Atirador: require("./assets/atirador.png"),
};

// Cores
const AZUL_BORDA = "hsl(191, 100%, 94%)";
const AZUL_TEXTO = "#9bd1fd";
const COR_FORTE = "#4fd8eb";
const COR_FRACO = "#ff6b7a";

const separarClasses = (classe) => classe.split("/");

// Cabeçalho de seção no estilo do site oficial (faixa azul + capacete)
function TituloSecao({ titulo, subtitulo, cor }) {
  return (
    <ImageBackground
      source={require("./assets/bg-Layer.png")}
      resizeMode="stretch"
      style={style.faixaSecao}
    >
      <Image
        source={require("./assets/hero.png")}
        resizeMode="contain"
        style={style.iconeSecao}
      />
      <View style={{ flex: 1 }}>
        <Text style={style.tituloSecao}>{titulo}</Text>
        <Text style={[style.subtituloSecao, { color: cor }]} numberOfLines={1}>
          {subtitulo}
        </Text>
      </View>
    </ImageBackground>
  );
}

// Uma linha da lista: foto, nome, classes e seta
function LinhaHeroi({ heroi, cor, aoTocar }) {
  const classes = separarClasses(heroi.classe);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={aoTocar}
      style={[style.linhaHeroi, { borderLeftColor: cor }]}
    >
      <Image source={heroi.foto} style={style.fotoLinha} />

      <View style={style.textosLinha}>
        <Text style={style.nomeLinha} numberOfLines={1}>
          {heroi.nome}
        </Text>
        <View style={style.classesLinha}>
          {classes.map((classe) => (
            <Image
              key={classe}
              source={iconesClasses[classe]}
              style={style.iconeClasseLinha}
            />
          ))}
          <Text style={style.textoClasseLinha} numberOfLines={1}>
            {classes.join(" · ")}
          </Text>
        </View>
      </View>

      <Text style={style.seta}>›</Text>
    </TouchableOpacity>
  );
}

function DetailsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const id = String(route.params?.id ?? "");
  const heroi = HEROIS.find((h) => h.id === id);

  // URL com id inexistente (ex.: /heroi/999)
  if (!heroi) {
    return (
      <View style={style.naoEncontrado}>
        <Text style={{ color: "#fff", marginBottom: 20 }}>
          Herói não encontrado.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={{ color: "#ffd700" }}>Voltar para a lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Converte a lista de ids em heróis, mantendo a ordem do banco
  const buscarHerois = (ids) =>
    (ids || []).map((x) => HEROIS.find((h) => h.id === x)).filter(Boolean);

  const forteContra = buscarHerois(heroi.counters);
  const fracoContra = buscarHerois(heroi.counteradoPor);
  const classes = separarClasses(heroi.classe);

  const abrirHeroi = (outro) => navigation.push("Details", { id: outro.id });

  return (
    <ImageBackground
      source={require("./assets/bgDetails.png")}
      resizeMode="cover"
      style={style.fundo}
    >
      {/* Brilho azul atrás do herói */}
      <LinearGradient
        colors={["rgba(79, 216, 235, 0.16)", "transparent"]}
        style={style.brilho}
      />

      {/* Botões de voltar e fechar */}
      <View style={[style.cabecalho, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={style.botaoCabecalho}
          hitSlop={8}
        >
          <Image
            source={require("./assets/botaoVoltar.png")}
            style={style.iconeVoltar}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={style.botaoCabecalho}
          hitSlop={8}
        >
          <Image
            source={require("./assets/botao-fechar.png")}
            style={style.iconeFechar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERÓI PRINCIPAL */}
        <View style={style.blocoHeroi}>
          <View style={style.molduraFoto}>
            <Image source={heroi.foto} style={style.fotoHeroi} />
          </View>

          <Text style={style.nomeHeroi}>{heroi.nome}</Text>

          <LinearGradient
            colors={["transparent", AZUL_TEXTO, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={style.divisor}
          />

          <View style={style.chipsClasse}>
            {classes.map((classe) => (
              <View key={classe} style={style.chipClasse}>
                <Image
                  source={iconesClasses[classe]}
                  style={style.iconeChip}
                />
                <Text style={style.textoChip}>{classe}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* É FORTE CONTRA */}
        <TituloSecao
          titulo="É forte contra"
          subtitulo={`${heroi.nome} leva vantagem contra estes heróis`}
          cor={COR_FORTE}
        />
        {forteContra.map((outro) => (
          <LinhaHeroi
            key={outro.id}
            heroi={outro}
            cor={COR_FORTE}
            aoTocar={() => abrirHeroi(outro)}
          />
        ))}

        {/* É FRACO CONTRA */}
        <TituloSecao
          titulo="É fraco contra"
          subtitulo={`Estes heróis levam vantagem contra ${heroi.nome}`}
          cor={COR_FRACO}
        />
        {fracoContra.map((outro) => (
          <LinhaHeroi
            key={outro.id}
            heroi={outro}
            cor={COR_FRACO}
            aoTocar={() => abrirHeroi(outro)}
          />
        ))}

        <Text style={style.rodape}>
          Pesquisa realizada no site oficial do MLBB
        </Text>
      </ScrollView>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "#0d1424",
  },

  naoEncontrado: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  brilho: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 360,
  },

  // CABEÇALHO
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  botaoCabecalho: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  iconeVoltar: {
    width: 13,
    height: 24,
  },

  iconeFechar: {
    width: 34,
    height: 34,
  },

  // HERÓI PRINCIPAL
  blocoHeroi: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 8,
  },

  molduraFoto: {
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(224, 250, 255, 0.35)",
    backgroundColor: "rgba(13, 20, 36, 0.6)",
  },

  fotoHeroi: {
    width: 136,
    height: 136,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AZUL_BORDA,
  },

  nomeHeroi: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 14,
    textAlign: "center",
  },

  divisor: {
    width: 160,
    height: 1,
    marginTop: 8,
    marginBottom: 12,
  },

  chipsClasse: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },

  chipClasse: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingLeft: 6,
    paddingRight: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(155, 209, 253, 0.35)",
    backgroundColor: "rgba(155, 209, 253, 0.1)",
  },

  iconeChip: {
    width: 22,
    height: 22,
  },

  textoChip: {
    color: AZUL_BORDA,
    fontSize: 13,
    fontWeight: "600",
  },

  // SEÇÕES
  faixaSecao: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    marginTop: 24,
    marginBottom: 6,
    marginLeft: 8,
    paddingLeft: 14,
    paddingRight: 12,
    gap: 12,
  },

  iconeSecao: {
    width: 26,
    height: 34,
  },

  tituloSecao: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  subtituloSecao: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.9,
  },

  // LINHAS DA LISTA
  linhaHeroi: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(155, 209, 253, 0.16)",
    borderLeftWidth: 3,
    backgroundColor: "rgba(10, 17, 32, 0.72)",
  },

  fotoLinha: {
    width: 46,
    height: 46,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: AZUL_BORDA,
  },

  textosLinha: {
    flex: 1,
    marginLeft: 12,
  },

  nomeLinha: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  classesLinha: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 4,
  },

  iconeClasseLinha: {
    width: 14,
    height: 14,
    opacity: 0.85,
  },

  textoClasseLinha: {
    color: AZUL_TEXTO,
    fontSize: 12,
    marginLeft: 2,
    flexShrink: 1,
  },

  seta: {
    color: "rgba(224, 250, 255, 0.45)",
    fontSize: 26,
    marginLeft: 8,
    marginTop: -2,
  },

  rodape: {
    color: "#fff",
    opacity: 0.45,
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 28,
  },
});

export default DetailsScreen;
