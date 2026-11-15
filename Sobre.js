import { StyleSheet, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores, espaco } from "./tema";
import {
  Fundo,
  CabecalhoTela,
  TituloSecao,
  Cartao,
  Paragrafo,
  ListaContatos,
  Rodape,
} from "./ui";

export default function Sobre({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <Fundo fonte={require("./assets/bg-up-side.png")} style={styles.fundo}>
      <CabecalhoTela titulo="Sobre" aoVoltar={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + espaco.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* TOPO: logo */}
        <Image
          source={require("./assets/logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />

        {/* EARLY GAME */}
        <TituloSecao titulo="Early Game" />
        <Cartao destaque="dourado">
          <Paragrafo ultimo>
            Agradeço aos meus amigos e parceiros de squad que testaram as
            primeiras versões deste app, aguentaram os bugs e me ajudaram a
            validar cada ideia implementada.
          </Paragrafo>
        </Cartao>

        {/* LORE */}
        <TituloSecao titulo="Lore" />
        <Cartao destaque="dourado">
          <Paragrafo>
            Tudo começou em uma noite de derrotas amargas no Land of Dawn. Entre
            sequências de derrotas inexplicáveis e a frustração de não saber como
            segurar um herói inimigo 'feedado', percebi que a força bruta não era
            o suficiente: era preciso inteligência.
          </Paragrafo>
          <Paragrafo>
            Como um desenvolvedor solo, decidi aceitar o desafio de construir meu
            próprio 'item' de batalha. Foram muitas noites codificando sozinho,
            enfrentei obstáculos técnicos complexos e falhas críticas de sistema
            que exigiram profundas revisões de código e persistência, refinando
            dados para que esse item finalmente ficasse pronto.
          </Paragrafo>
          <Paragrafo>
            Este aplicativo não é apenas um banco de dados; ele é a união de
            mecânicas essenciais e vivência de jogo e a prova de que, com a
            estratégia certa, qualquer herói pode ser derrotado. Eu criei esta
            ferramenta para que você, assim como eu, tenha em mãos um recurso
            prático para subir de nível e dominar as partidas.
          </Paragrafo>
          <Paragrafo ultimo>
            Continuo no Glória Mítico e estou sempre pronto para fechar o squad.
            Pode passar raiva comigo nas TF's, porque como jogador sou um otimo
            programador. Nos vemos em Land of Dawn!
          </Paragrafo>
        </Cartao>

        {/* CONTATO */}
        <TituloSecao titulo="Contato" />
        <ListaContatos />

        {/* AVISO LEGAL */}
        <TituloSecao titulo="Aviso legal" />
        <Cartao>
          <Paragrafo>
            Este aplicativo é um projeto independente desenvolvido por fã e para
            fãs de Mobile Legends: Bang Bang. Todo o conteúdo, incluindo nomes de
            heróis, imagens, ícones e marcas registradas, são de propriedade
            exclusiva da Moonton Games.
          </Paragrafo>
          <Paragrafo ultimo>
            As informações aqui contidas servem apenas para propósitos
            educacionais e informativos de auxílio ao jogador. Este app não é
            afiliado, endossado ou patrocinado pela Moonton de nenhuma forma.
          </Paragrafo>
        </Cartao>

        <Rodape>Versão 1.0.0 — Build: Perfurador</Rodape>
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
