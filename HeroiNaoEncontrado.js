import React from "react";
import { Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { cores, espaco, raio } from "./tema";
import { Fundo } from "./ui";

// Tela de erro para um id que não existe (ex.: a URL /heroi/999).
// Recebe só `aoVoltar`, não o `navigation` inteiro: quem decide para onde
// voltar é quem usa o componente.
export default function HeroiNaoEncontrado({ aoVoltar }) {
  return (
    <Fundo fonte={require("./assets/bgDetails.png")} style={style.fundo}>
      <Image
        source={require("./assets/hero.png")}
        resizeMode="contain"
        style={style.icone}
      />
      <Text style={style.titulo}>Herói não encontrado</Text>
      <Text style={style.texto}>
        Esse link não corresponde a nenhum herói do banco.
      </Text>
      <TouchableOpacity
        onPress={aoVoltar}
        style={style.botao}
        activeOpacity={0.8}
      >
        <Text style={style.textoBotao}>Voltar para a lista</Text>
      </TouchableOpacity>
    </Fundo>
  );
}

const style = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: espaco.xl,
  },

  icone: {
    width: 44,
    height: 58,
    opacity: 0.8,
    marginBottom: espaco.lg,
  },

  titulo: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },

  texto: {
    color: cores.azulTexto,
    fontSize: 13,
    textAlign: "center",
    marginTop: espaco.sm,
    marginBottom: espaco.xl,
  },

  botao: {
    backgroundColor: cores.douradoVivo,
    borderRadius: raio.pilula,
    paddingVertical: 10,
    paddingHorizontal: espaco.xl,
  },

  textoBotao: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },
});
