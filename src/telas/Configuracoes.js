import { useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco, fonte } from "../tema";
import { useIdioma, IDIOMAS } from "../idioma/idioma";
import {
  Fundo,
  CabecalhoTela,
  TituloSecao,
  Cartao,
  Paragrafo,
  LinhaAcao,
} from "../componentes/ui";

export default function Configuracoes({ navigation }) {
  const insets = useSafeAreaInsets();
  const { idioma, mudarIdioma, t } = useIdioma();
  const [escolhendoIdioma, setEscolhendoIdioma] = useState(false);

  const escolherIdioma = (codigo) => {
    mudarIdioma(codigo);
    setEscolhendoIdioma(false);
  };

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

        {/* Idioma: tocar abre a lista logo abaixo; o atual tem ✓ */}
        <LinhaAcao
          titulo={t("config.idioma")}
          subtitulo={IDIOMAS[idioma]}
          aoTocar={() => setEscolhendoIdioma(!escolhendoIdioma)}
        />
        {escolhendoIdioma &&
          Object.entries(IDIOMAS).map(([codigo, nome]) => (
            <LinhaAcao
              key={codigo}
              titulo={nome}
              corTitulo={codigo === idioma ? cores.douradoVivo : cores.texto}
              aoTocar={() => escolherIdioma(codigo)}
              direita={
                codigo === idioma ? <Text style={styles.marcado}>✓</Text> : false
              }
            />
          ))}

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

  // ✓ do idioma escolhido
  marcado: {
    color: cores.douradoVivo,
    fontSize: fonte.cabecalho,
    fontWeight: "700",
    marginLeft: espaco.sm,
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
