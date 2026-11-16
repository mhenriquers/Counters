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

// Recebe o `t` (tradução) de quem chama: este arquivo não é um componente,
// então não pode usar o useIdioma() (hooks só funcionam dentro de componentes).
export const enviarEmail = async (t) => {
  const assunto = encodeURIComponent(t("email.assunto"));
  const corpo = encodeURIComponent(t("email.corpo"));

  const url = `mailto:${EMAIL}?subject=${assunto}&body=${corpo}`;
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(
      t("email.semAppTitulo"),
      t("email.semAppTexto", { email: EMAIL }),
      [{ text: "OK" }],
    );
  }
};
