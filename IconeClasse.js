import React from "react";
import { Image } from "react-native";

// Ícones das classes. As chaves são os nomes das classes no banco.
// Classe nova = só uma chave nova aqui, sem mexer no componente.
const icones = {
  Assassino: require("./assets/assassino.png"),
  Mago: require("./assets/mago.png"),
  Tanque: require("./assets/tanque.png"),
  Suporte: require("./assets/suporte.png"),
  Lutador: require("./assets/soldado.png"),
  Atirador: require("./assets/atirador.png"),
};

// Ícone quadrado de uma classe. `tamanho` em px; `style` para ajustes extras
// (ex.: opacidade).
export default function IconeClasse({ classe, tamanho, style }) {
  return (
    <Image
      source={icones[classe]}
      style={[{ width: tamanho, height: tamanho }, style]}
    />
  );
}
