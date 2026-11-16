// Ao abrir o APK, avisa se há uma versão nova no GitHub. Não desenha nada na
// tela: usa o Alert nativo do Android. Se o usuário aceitar, abre o link do
// APK no navegador, e ele baixa e instala.
//
// Só roda no Android: a PWA se atualiza sozinha pelo service worker.
import { useEffect } from "react";
import { Alert, Linking, Platform } from "react-native";
import { buscarAtualizacao } from "../dados/atualizacao";
import { useIdioma } from "../idioma/idioma";

export default function AvisoAtualizacao() {
  const { t } = useIdioma();

  // Uma vez ao abrir o app (trocar o idioma depois não confere de novo)
  useEffect(() => {
    if (Platform.OS !== "android") return;

    buscarAtualizacao().then((nova) => {
      if (!nova) return;
      Alert.alert(
        t("atualizacao.titulo"),
        t("atualizacao.texto", { versao: nova.versao }),
        [
          { text: t("atualizacao.depois"), style: "cancel" },
          { text: t("atualizacao.atualizar"), onPress: () => Linking.openURL(nova.link) },
        ],
      );
    });
  }, []);

  return null;
}
