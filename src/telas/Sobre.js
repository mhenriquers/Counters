import { StyleSheet, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco } from "../tema";
import {
  Fundo,
  CabecalhoTela,
  TituloSecao,
  Cartao,
  Paragrafo,
  ListaContatos,
  Rodape,
} from "../componentes/ui";
import { useIdioma } from "../idioma/idioma";
import { VERSAO_ATUAL } from "../dados/atualizacao";

export default function Sobre({ navigation }) {
  const insets = useSafeAreaInsets();
  const { t } = useIdioma();

  return (
    <Fundo fonte={require("../../assets/bg-up-side.png")} style={styles.fundo}>
      <CabecalhoTela
        titulo={t("sobre.titulo")}
        aoVoltar={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + espaco.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* TOPO: logo */}
        <Image
          source={require("../../assets/logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />

        {/* EARLY GAME */}
        <TituloSecao titulo={t("sobre.early")} />
        <Cartao destaque="dourado">
          <Paragrafo ultimo>{t("sobre.earlyTexto")}</Paragrafo>
        </Cartao>

        {/* LORE */}
        <TituloSecao titulo={t("sobre.lore")} />
        <Cartao destaque="dourado">
          <Paragrafo>{t("sobre.lore1")}</Paragrafo>
          <Paragrafo>{t("sobre.lore2")}</Paragrafo>
          <Paragrafo>{t("sobre.lore3")}</Paragrafo>
          <Paragrafo ultimo>{t("sobre.lore4")}</Paragrafo>
        </Cartao>

        {/* CONTATO */}
        <TituloSecao titulo={t("sobre.contato")} />
        <ListaContatos />

        {/* AVISO LEGAL */}
        <TituloSecao titulo={t("sobre.aviso")} />
        <Cartao>
          <Paragrafo>{t("sobre.aviso1")}</Paragrafo>
          <Paragrafo ultimo>{t("sobre.aviso2")}</Paragrafo>
        </Cartao>

        <Rodape>{t("sobre.versao", { versao: VERSAO_ATUAL })}</Rodape>
      </ScrollView>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  // TOPO
  logo: {
    width: "70%",
    height: 90,
    alignSelf: "center",
    marginTop: espaco.xl,
  },
});
