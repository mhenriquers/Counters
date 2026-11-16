import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { cores, espaco, raio } from "../tema";

// Aviso de "Herói não encontrado": capacete + título em negrito.
// O texto e o botão são opcionais: só aparecem se forem passados.
//   - Details (/heroi/999): com texto e botão de voltar
//   - Home (busca sem resultado): só o capacete e o título
// O fundo fica com quem usa o componente.
export default function HeroiNaoEncontrado({ texto, aoVoltar, style }) {
  return (
    <View style={[estilos.container, style]}>
      <Image
        source={require("../../assets/hero.png")}
        resizeMode="contain"
        style={estilos.icone}
      />
      <Text style={estilos.titulo}>Herói não encontrado</Text>

      {texto ? <Text style={estilos.texto}>{texto}</Text> : null}

      {aoVoltar ? (
        <TouchableOpacity
          onPress={aoVoltar}
          style={estilos.botao}
          activeOpacity={0.8}
        >
          <Text style={estilos.textoBotao}>Voltar para a lista</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    alignItems: "center",
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
