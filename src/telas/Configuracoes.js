import { Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco, fonte } from "../tema";
import { useIdioma } from "../idioma/idioma";
import {
  Fundo,
  CabecalhoTela,
  TituloSecao,
  Cartao,
  Paragrafo,
  LinhaAcao,
} from "../componentes/ui";
import SeletorIdioma from "../componentes/SeletorIdioma";

export default function Configuracoes({ navigation }) {
  const insets = useSafeAreaInsets();
  const { t } = useIdioma();

  return (
    <Fundo fonte={require("../../assets/bg-up-side.png")} style={styles.fundo}>
      <CabecalhoTela
        titulo={t("config.titulo")}
        aoVoltar={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + espaco.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* PREFERÊNCIAS */}
        <TituloSecao
          titulo={t("config.preferencias")}
          style={styles.primeiraSecao}
        />

        {/* Idioma: sanfona que abre a lista dentro do próprio cartão */}
        <SeletorIdioma />

        {/* Tema: só informativo (ainda não dá para mudar) */}
        <LinhaAcao
          titulo={t("config.tema")}
          subtitulo={t("config.temaUnico")}
        />

        {/* PRIVACIDADE E USO */}
        <TituloSecao titulo={t("config.privacidade")} />
        {/* Um cartão para cada assunto, com o título fora do cartão */}
        <Text style={styles.subtitulo}>{t("config.politica")}</Text>
        <Cartao>
          <Paragrafo ultimo>{t("config.politicaTexto")}</Paragrafo>
        </Cartao>

        <Text style={styles.subtitulo}>{t("config.imagens")}</Text>
        <Cartao>
          <Paragrafo ultimo>{t("config.imagensTexto")}</Paragrafo>
        </Cartao>

        <Text style={styles.subtitulo}>{t("config.links")}</Text>
        <Cartao>
          <Paragrafo ultimo>{t("config.linksTexto")}</Paragrafo>
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

  // Título acima de cada cartão de privacidade (alinhado com a borda do cartão)
  subtitulo: {
    color: cores.texto,
    fontSize: fonte.item,
    fontWeight: "700",
    marginHorizontal: espaco.lg + espaco.xs,
    marginTop: espaco.md,
    marginBottom: espaco.sm,
  },
});
