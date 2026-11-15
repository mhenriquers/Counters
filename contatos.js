// Dados e ações de contato, usados pelas telas Sobre e Feedback.
// Antes, cada tela tinha a sua cópia destas funções.
import { Linking, Platform, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";

export const EMAIL = "mlbbcounters@gmail.com";
export const GITHUB_USUARIO = "mhenriquers";
export const ID_JOGO = "1033871650";

export const abrirGit = () => {
  Linking.openURL(`https://github.com/${GITHUB_USUARIO}`);
};

export const enviarEmail = async () => {
  const assunto = encodeURIComponent("Feedback - App Counters");
  const corpo = encodeURIComponent("Olá! Gostaria de sugerir...");

  const url = `mailto:${EMAIL}?subject=${assunto}&body=${corpo}`;
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(
      "App de E-mail não encontrado",
      `Para enviar um e-mail, configure o aplicativo 'Mail' padrão do seu iPhone ou copie o endereço: ${EMAIL}`,
      [{ text: "OK" }],
    );
  }
};

// Provisório: nas fases 9 e 10 do task.md, Sobre e Feedback passam a usar o
// BotaoCopiar (de ui.js), que confirma na própria tela, e esta função sai.
export const copiarId = async () => {
  await Clipboard.setStringAsync(ID_JOGO);

  if (Platform.OS === "web") {
    window.alert("Copiado para a área de transferência.");
  } else if (Platform.OS === "ios") {
    Alert.alert("Sucesso", "Copiado para a área de tranferência", [{ text: "OK" }]);
  }
};
