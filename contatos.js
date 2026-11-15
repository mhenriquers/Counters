// Dados e ações de contato. A parte visual (ListaContatos) fica em ui.js.
// Antes, Sobre e Feedback tinham cada uma a sua cópia destas funções.
// (Copiar o ID é feito pelo BotaoCopiar de ui.js.)
import { Linking, Alert } from "react-native";

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
