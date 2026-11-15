import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import IconeClasse from "./IconeClasse";
import { cores } from "../tema";

// Card de um herói numa lista: foto, nome, classes e seta.
// `cor` pinta a borda da esquerda (ex.: cores.forte ou cores.fraco).
export default function LinhaHeroi({ heroi, cor, aoTocar }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={aoTocar}
      style={[style.container, { borderLeftColor: cor }]}
    >
      <Image source={heroi.foto} style={style.foto} />

      <View style={style.textos}>
        <Text style={style.nome} numberOfLines={1}>
          {heroi.nome}
        </Text>
        <View style={style.classes}>
          {heroi.classes.map((classe) => (
            <IconeClasse
              key={classe}
              classe={classe}
              tamanho={14}
              style={style.iconeClasse}
            />
          ))}
          <Text style={style.textoClasses} numberOfLines={1}>
            {heroi.classes.join(" · ")}
          </Text>
        </View>
      </View>

      <Text style={style.seta}>›</Text>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cores.bordaCartao,
    borderLeftWidth: 3,
    backgroundColor: cores.cartao,
  },

  foto: {
    width: 46,
    height: 46,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: cores.azulBorda,
  },

  textos: {
    flex: 1,
    marginLeft: 12,
  },

  nome: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: "700",
  },

  classes: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 4,
  },

  iconeClasse: {
    opacity: 0.85,
  },

  textoClasses: {
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
});
