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

export default function Feedback({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <Fundo fonte={require("../../assets/bg-up-side.png")} style={styles.fundo}>
      <CabecalhoTela titulo="Feedback" aoVoltar={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + espaco.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* SUGESTÕES OU ERROS */}
        <TituloSecao titulo="Sugestões ou erros?" style={styles.primeiraSecao} />
        <Cartao destaque="dourado">
          <Paragrafo ultimo>
            Este aplicativo foi desenvolvido para ser uma ferramenta útil no dia a
            dia das suas partidas. Se você encontrou algum erro, tem uma sugestão
            de melhoria ou sentiu falta de algum conteúdo, por favor, envie seu
            comentário. Feedbacks diretos de quem usa o app são a melhor forma de
            evoluir o projeto.
          </Paragrafo>
        </Cartao>

        {/* CONTATO */}
        <TituloSecao titulo="Contato" />
        <ListaContatos />

        {/* RETORNO */}
        <TituloSecao titulo="Retorno" />
        <Cartao>
          <Paragrafo ultimo>
            Separei esse espaço para trazer quaisquer atualizações do App, se você
            pediu algo, lhe darei um retorno por aqui.
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
});
