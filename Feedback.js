import { StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco } from "./tema";
import {
  Fundo,
  CabecalhoTela,
  TituloSecao,
  Cartao,
  Paragrafo,
  LinhaAcao,
  BotaoCopiar,
  Rodape,
} from "./ui";
import { EMAIL, GITHUB_USUARIO, ID_JOGO, abrirGit, enviarEmail } from "./contatos";

export default function Feedback({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <Fundo fonte={require("./assets/bg-up-side.png")} style={styles.fundo}>
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
        <LinhaAcao
          icone={require("./assets/gmail.png")}
          titulo={EMAIL}
          subtitulo="Enviar e-mail"
          aoTocar={enviarEmail}
        />
        <LinhaAcao
          icone={require("./assets/gitHub.png")}
          titulo={GITHUB_USUARIO}
          subtitulo="Abrir GitHub"
          aoTocar={abrirGit}
        />
        <LinhaAcao
          icone={require("./assets/imortal.png")}
          titulo="Owdail"
          subtitulo={"ID: " + ID_JOGO}
          direita={<BotaoCopiar texto={ID_JOGO} />}
        />
        <Rodape>
          Ao utilizar nossos canais de contato, você concorda com nossos termos e
          política de privacidade.
        </Rodape>

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
