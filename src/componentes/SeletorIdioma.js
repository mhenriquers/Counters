// Seletor de idioma em sanfona: um cartão com a linha "Idioma" (idioma atual
// embaixo) que abre e fecha, deslizando, a lista de idiomas dentro dele.
// Escolher um idioma troca na hora (fica salvo) e fecha a sanfona.
//
// Não recebe props: lê e troca o idioma pelo useIdioma().
import { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { cores, espaco, raio, fonte } from "../tema";
import { useIdioma, IDIOMAS } from "../idioma/idioma";

const TEMPO = 220; // duração da animação (ms)

export default function SeletorIdioma() {
  const { idioma, mudarIdioma, t } = useIdioma();
  const [aberto, setAberto] = useState(false);

  // Altura da lista, medida pelo onLayout. A caixa de fora anima de 0 até ela.
  const [alturaLista, setAlturaLista] = useState(0);

  // 0 = fechado, 1 = aberto. Anima a altura e a seta juntas.
  // Altura não roda no driver nativo, então tudo fica no driver JS.
  const progresso = useRef(new Animated.Value(0)).current;

  const alternar = (abrir) => {
    setAberto(abrir);
    Animated.timing(progresso, {
      toValue: abrir ? 1 : 0,
      duration: TEMPO,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const escolher = (codigo) => {
    mudarIdioma(codigo);
    alternar(false);
  };

  const altura = progresso.interpolate({ inputRange: [0, 1], outputRange: [0, alturaLista] });
  // "›" de lado vira seta para baixo (90°) e, aberto, para cima (270°)
  const giro = progresso.interpolate({ inputRange: [0, 1], outputRange: ["90deg", "270deg"] });

  return (
    <View style={[styles.cartao, aberto && styles.cartaoAberto]}>
      {/* Cabeçalho: abre e fecha */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => alternar(!aberto)}
        style={styles.cabecalho}
        accessibilityRole="button"
        accessibilityState={{ expanded: aberto }}
      >
        <View style={styles.textos}>
          <Text style={styles.titulo} numberOfLines={1}>
            {t("config.idioma")}
          </Text>
          <Text style={styles.atual} numberOfLines={1}>
            {IDIOMAS[idioma]}
          </Text>
        </View>
        <Animated.Text style={[styles.seta, { transform: [{ rotate: giro }] }]}>›</Animated.Text>
      </TouchableOpacity>

      {/* Lista: sempre montada (para medir a altura), escondida quando fechada */}
      <Animated.View
        style={[styles.caixaLista, { height: altura }]}
        pointerEvents={aberto ? "auto" : "none"}
        importantForAccessibility={aberto ? "auto" : "no-hide-descendants"}
        accessibilityElementsHidden={!aberto}
      >
        <View
          style={styles.lista}
          onLayout={(e) => setAlturaLista(e.nativeEvent.layout.height)}
        >
          {Object.entries(IDIOMAS).map(([codigo, nome]) => {
            const escolhido = codigo === idioma;
            return (
              <TouchableOpacity
                key={codigo}
                activeOpacity={0.7}
                onPress={() => escolher(codigo)}
                style={[styles.opcao, escolhido && styles.opcaoEscolhida]}
                accessibilityRole="radio"
                accessibilityState={{ checked: escolhido }}
              >
                {/* Faixa dourada à esquerda do escolhido */}
                {escolhido ? <View style={styles.faixa} /> : null}

                <View style={[styles.sigla, escolhido && styles.siglaEscolhida]}>
                  <Text style={[styles.siglaTexto, escolhido && styles.textoEscolhido]}>
                    {codigo.toUpperCase()}
                  </Text>
                </View>

                <Text
                  style={[styles.nome, escolhido && styles.textoEscolhido]}
                  numberOfLines={1}
                >
                  {nome}
                </Text>

                {/* Bolinha de seleção */}
                <View style={[styles.radio, escolhido && styles.radioEscolhido]}>
                  {escolhido ? <View style={styles.radioMiolo} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mesmas medidas da LinhaAcao (ui.js), para alinhar com as outras linhas
  cartao: {
    marginHorizontal: espaco.lg,
    marginTop: espaco.sm,
    borderRadius: raio.md,
    borderWidth: 1,
    borderColor: cores.bordaCartao,
    backgroundColor: cores.cartao,
    overflow: "hidden",
  },
  cartaoAberto: {
    borderColor: cores.douradoBorda,
  },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    paddingVertical: espaco.sm,
    paddingHorizontal: espaco.md,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    color: cores.texto,
    fontSize: fonte.item,
    fontWeight: "600",
  },
  atual: {
    color: cores.azulTexto,
    fontSize: fonte.legenda,
    marginTop: 2,
  },
  seta: {
    color: "rgba(224, 250, 255, 0.45)",
    fontSize: 26,
    marginLeft: espaco.sm,
  },

  // A caixa corta a lista enquanto anima; a lista tem a altura natural
  caixaLista: {
    overflow: "hidden",
  },
  lista: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },

  opcao: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingHorizontal: espaco.md,
    borderTopWidth: 1,
    borderTopColor: cores.bordaCartao,
  },
  opcaoEscolhida: {
    backgroundColor: cores.douradoFundo,
  },
  faixa: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: cores.douradoVivo,
  },

  sigla: {
    width: 34,
    height: 22,
    borderRadius: raio.sm,
    borderWidth: 1,
    borderColor: cores.bordaCartao,
    alignItems: "center",
    justifyContent: "center",
    marginRight: espaco.md,
  },
  siglaEscolhida: {
    borderColor: cores.douradoVivo,
  },
  siglaTexto: {
    color: cores.azulTexto,
    fontSize: fonte.rodape,
    fontWeight: "700",
    letterSpacing: 1,
  },

  nome: {
    flex: 1,
    color: cores.texto,
    fontSize: fonte.item,
  },
  textoEscolhido: {
    color: cores.douradoVivo,
    fontWeight: "700",
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: raio.pilula,
    borderWidth: 2,
    borderColor: cores.textoFraco,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: espaco.sm,
  },
  radioEscolhido: {
    borderColor: cores.douradoVivo,
  },
  radioMiolo: {
    width: 10,
    height: 10,
    borderRadius: raio.pilula,
    backgroundColor: cores.douradoVivo,
  },
});
