import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HEROIS } from "./banco_herois";
import { cores, espaco, raio } from "./tema";
import { Fundo, TituloSecao } from "./ui";

// Ícones das classes (as chaves são os nomes usados em `classe` no banco)
const iconesClasses = {
  Assassino: require("./assets/assassino.png"),
  Mago: require("./assets/mago.png"),
  Tanque: require("./assets/tanque.png"),
  Suporte: require("./assets/suporte.png"),
  Lutador: require("./assets/soldado.png"),
  Atirador: require("./assets/atirador.png"),
};

const separarClasses = (classe) => classe.split("/");

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
      <Fundo
        fonte={require("./assets/bgDetails.png")}
        style={[style.fundo, style.naoEncontrado]}
      >
        <Image
          source={require("./assets/hero.png")}
          resizeMode="contain"
          style={style.iconeNaoEncontrado}
        />
        <Text style={style.tituloNaoEncontrado}>Herói não encontrado</Text>
        <Text style={style.textoNaoEncontrado}>
          Esse link não corresponde a nenhum herói do banco.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.popTo("Home")}
          style={style.botaoNaoEncontrado}
          activeOpacity={0.8}
        >
          <Text style={style.textoBotaoNaoEncontrado}>Voltar para a lista</Text>
        </TouchableOpacity>
      </Fundo>
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
    <Fundo fonte={require("./assets/bgDetails.png")} style={style.fundo}>
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
          onPress={() => navigation.popTo("Home")}
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
            colors={["transparent", cores.azulTexto, "transparent"]}
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
          cor={cores.forte}
        />
        {forteContra.map((outro) => (
          <LinhaHeroi
            key={outro.id}
            heroi={outro}
            cor={cores.forte}
            aoTocar={() => abrirHeroi(outro)}
          />
        ))}

        {/* É FRACO CONTRA */}
        <TituloSecao
          titulo="É fraco contra"
          subtitulo={`Estes heróis levam vantagem contra ${heroi.nome}`}
          cor={cores.fraco}
        />
        {fracoContra.map((outro) => (
          <LinhaHeroi
            key={outro.id}
            heroi={outro}
            cor={cores.fraco}
            aoTocar={() => abrirHeroi(outro)}
          />
        ))}

        <Text style={style.rodape}>
          Pesquisa realizada no site oficial do MLBB
        </Text>
      </ScrollView>
    </Fundo>
  );
}

const style = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  // HERÓI NÃO ENCONTRADO (/heroi/999)
  naoEncontrado: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espaco.xl,
  },

  iconeNaoEncontrado: {
    width: 44,
    height: 58,
    opacity: 0.8,
    marginBottom: espaco.lg,
  },

  tituloNaoEncontrado: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },

  textoNaoEncontrado: {
    color: cores.azulTexto,
    fontSize: 13,
    textAlign: "center",
    marginTop: espaco.sm,
    marginBottom: espaco.xl,
  },

  botaoNaoEncontrado: {
    backgroundColor: cores.douradoVivo,
    borderRadius: raio.pilula,
    paddingVertical: 10,
    paddingHorizontal: espaco.xl,
  },

  textoBotaoNaoEncontrado: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
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
    borderColor: cores.azulBorda,
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
    color: cores.azulBorda,
    fontSize: 13,
    fontWeight: "600",
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
    borderColor: cores.azulBorda,
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
    color: cores.azulTexto,
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
