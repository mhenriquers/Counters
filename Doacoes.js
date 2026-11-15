import { Text, StyleSheet, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco, fonte } from "./tema";
import {
  Fundo,
  CabecalhoTela,
  Cartao,
  Paragrafo,
  BotaoCopiar,
  Rodape,
} from "./ui";

const CHAVE_PIX = "9bfe32d9-8633-41c0-835b-5287ecd44293";

export default function Doacoes({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <Fundo fonte={require("./assets/bg-up-side.png")} style={styles.fundo}>
      <CabecalhoTela
        titulo="Apoiar o projeto"
        aoVoltar={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + espaco.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("./assets/imortal.png")}
          resizeMode="contain"
          style={styles.emblema}
        />

        <Text style={styles.titulo}>Torne-se um Lendário Apoiador!</Text>

        <Cartao destaque="dourado">
          <Paragrafo>
            Olá! Eu sou o desenvolvedor por trás deste app. Faço tudo sozinho: do
            código ao design. Manter um aplicativo funcionando consome tempo e
            recursos, especialmente com os custos de hospedagem para manter os
            dados e as imagens online. Cada centavo doado é reinvestido
            diretamente aqui para cobrir esses servidores e trazer atualizações
            constantes.
          </Paragrafo>
          <Paragrafo ultimo>
            Se este app já te ajudou a ganhar uma Ranked ou a entender melhor um
            herói, considere apoiar o projeto com qualquer valor. Você já é o MVP
            dessa jornada!
          </Paragrafo>
        </Cartao>

        {/* CHAVE PIX */}
        <Cartao style={styles.cartaoPix}>
          <Text style={styles.legendaPix}>Chave Pix</Text>
          <Text style={styles.chavePix} selectable>
            {CHAVE_PIX}
          </Text>
          <BotaoCopiar texto={CHAVE_PIX} rotulo="Copiar chave" />
        </Cartao>

        <Rodape>
          As doações realizadas via Pix são voluntárias e destinadas
          exclusivamente à manutenção e melhoria do projeto. Não armazenamos
          quaisquer dados bancários dos doadores.
        </Rodape>
      </ScrollView>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  emblema: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: espaco.xl,
  },

  titulo: {
    color: cores.texto,
    fontSize: fonte.tituloTela - 6,
    fontWeight: "800",
    textAlign: "center",
    marginTop: espaco.md,
    marginBottom: espaco.lg,
    marginHorizontal: espaco.lg,
  },

  cartaoPix: {
    marginTop: espaco.lg,
  },

  legendaPix: {
    color: cores.azulTexto,
    fontSize: fonte.legenda,
  },

  chavePix: {
    color: cores.texto,
    fontSize: fonte.corpo,
    marginTop: espaco.xs,
    marginBottom: espaco.md,
  },
});
