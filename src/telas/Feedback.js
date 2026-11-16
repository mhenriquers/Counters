import { StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco } from "../tema";
import {
  Fundo,
  CabecalhoTela,
  TituloSecao,
  Cartao,
  Paragrafo,
  ListaContatos,
} from "../componentes/ui";
import { useIdioma } from "../idioma/idioma";

export default function Feedback({ navigation }) {
  const insets = useSafeAreaInsets();
  const { t } = useIdioma();

  return (
    <Fundo fonte={require("../../assets/bg-up-side.png")} style={styles.fundo}>
      <CabecalhoTela
        titulo={t("feedback.titulo")}
        aoVoltar={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + espaco.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* SUGESTÕES OU ERROS */}
        <TituloSecao
          titulo={t("feedback.sugestoes")}
          style={styles.primeiraSecao}
        />
        <Cartao destaque="dourado">
          <Paragrafo ultimo>{t("feedback.texto")}</Paragrafo>
        </Cartao>

        {/* CONTATO */}
        <TituloSecao titulo={t("feedback.contato")} />
        <ListaContatos />

        {/* RETORNO */}
        <TituloSecao titulo={t("feedback.retorno")} />
        <Cartao>
          <Paragrafo ultimo>{t("feedback.retornoTexto")}</Paragrafo>
        </Cartao>
      </ScrollView>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  primeiraSecao: {
    marginTop: espaco.lg,
  },
});
