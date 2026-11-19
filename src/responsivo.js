// Diz em que tipo de tela o app está: "celular", "tablet" ou "computador".
// Os limites ficam no tema.js (tela.tablet e tela.computador).
// Usa o useWindowDimensions: ao girar o tablet ou redimensionar a janela do
// navegador, o componente é redesenhado com o novo tamanho.
import { useWindowDimensions } from "react-native";
import { tela } from "./tema";

export function useTamanhoTela() {
  const { width: largura, height: altura } = useWindowDimensions();

  const tipo =
    largura >= tela.computador ? "computador" : largura >= tela.tablet ? "tablet" : "celular";

  return { largura, altura, tipo, celular: tipo === "celular" };
}
