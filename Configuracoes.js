import { Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco, fonte } from "./tema";
import {
  Fundo,
  CabecalhoTela,
  TituloSecao,
  Cartao,
  Paragrafo,
  LinhaAcao,
} from "./ui";

export default function Configuracoes({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <Fundo fonte={require("./assets/bg-up-side.png")} style={styles.fundo}>
      <CabecalhoTela
        titulo="Configurações"
        aoVoltar={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + espaco.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* PREFERÊNCIAS (informativas: ainda não dá para mudar) */}
        <TituloSecao titulo="Preferências" style={styles.primeiraSecao} />
        <LinhaAcao titulo="Idioma" subtitulo="Português" />
        <LinhaAcao titulo="Tema" subtitulo="Único" />

        {/* PRIVACIDADE E USO */}
        <TituloSecao titulo="Privacidade e uso" />
        <Cartao>
          <Text style={[styles.subtitulo, styles.primeiroSubtitulo]}>
            Política de privacidade
          </Text>
          <Paragrafo>
            Este aplicativo não coleta informações de identificação pessoal dos
            usuários. Não solicitamos acesso a contatos, localização ou arquivos
            privados.
          </Paragrafo>

          <Text style={styles.subtitulo}>Uso de imagens e direitos autorais</Text>
          <Paragrafo>
            Todas as imagens de heróis e marcas registradas pertencem à Moonton
            Games. Este é um aplicativo desenvolvido por fã para a comunidade, sem
            fins lucrativos ou vínculo oficial. Este é apenas um guia informativo
            gratuito.
          </Paragrafo>

          <Text style={styles.subtitulo}>Links externos</Text>
          <Paragrafo ultimo>
            Ao acessar links de terceiros, você estará sujeito às políticas de
            privacidade dos respectivos serviços.
          </Paragrafo>
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

  // Subtítulo de cada bloco dentro do cartão de privacidade
  subtitulo: {
    color: cores.texto,
    fontSize: fonte.item,
    fontWeight: "700",
    marginTop: espaco.sm,
    marginBottom: espaco.xs,
  },
  primeiroSubtitulo: {
    marginTop: 0,
  },
});
