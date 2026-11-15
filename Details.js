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
import { buscarHeroi, buscarHerois } from "./herois";
import { cores } from "./tema";
import { Fundo, TituloSecao, BarraStatus } from "./ui";
import IconeClasse from "./IconeClasse";
import LinhaHeroi from "./LinhaHeroi";
import HeroiNaoEncontrado from "./HeroiNaoEncontrado";

function DetailsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();

  const heroi = buscarHeroi(route.params?.id);

  // URL com id inexistente (ex.: /heroi/999)
  if (!heroi) {
    return <HeroiNaoEncontrado aoVoltar={() => navigation.popTo("Home")} />;
  }

  const forteContra = buscarHerois(heroi.counters);
  const fracoContra = buscarHerois(heroi.counteradoPor);

  const abrirHeroi = (outro) => navigation.push("Details", { id: outro.id });

  return (
    <Fundo fonte={require("./assets/bgDetails.png")} style={style.fundo}>
      {/* Brilho azul atrás do herói */}
      <LinearGradient
        colors={["rgba(79, 216, 235, 0.16)", "transparent"]}
        style={style.brilho}
      />

      {/* Faixa da hora/notificações (igual em todas as telas) */}
      <BarraStatus />

      {/* Botões de voltar e fechar */}
      <View style={[style.cabecalho, { paddingTop: 6 }]}>
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
            {heroi.classes.map((classe) => (
              <View key={classe} style={style.chipClasse}>
                <IconeClasse classe={classe} tamanho={22} />
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
    color: cores.texto,
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

  textoChip: {
    color: cores.azulBorda,
    fontSize: 13,
    fontWeight: "600",
  },

  rodape: {
    color: cores.texto,
    opacity: 0.45,
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 28,
  },
});

export default DetailsScreen;
