// Idioma do app: qual está ativo, como trocar e como traduzir.
//
// Uso numa tela ou componente:
//   const { idioma, mudarIdioma, t } = useIdioma();
//   <Text>{t("config.idioma")}</Text>
//
// O app inteiro fica dentro do <IdiomaProvider> (no App.js). Quando o idioma
// muda, toda tela que usa useIdioma() é redesenhada com os textos novos.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { textos } from "./textos";

// Idiomas disponíveis, cada um com o nome escrito nele mesmo
// (quem não lê português precisa achar "English").
export const IDIOMAS = { pt: "Português", en: "English" };

// Chave onde a escolha fica salva (na web, vira uma chave do localStorage)
const CHAVE_SALVA = "idioma";

// Celular em português abre em português; qualquer outro idioma, em inglês
function idiomaDoCelular() {
  const codigo = getLocales()[0]?.languageCode;
  return codigo === "pt" ? "pt" : "en";
}

const IdiomaContext = createContext(null);

export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(idiomaDoCelular);
  const [carregado, setCarregado] = useState(false);

  // Ao abrir o app: uma escolha salva vence o idioma do celular
  useEffect(() => {
    AsyncStorage.getItem(CHAVE_SALVA)
      .then((salvo) => {
        if (Object.keys(IDIOMAS).includes(salvo)) setIdioma(salvo);
      })
      .catch(() => {}) // sem armazenamento (ex.: navegador bloqueando): fica o do celular
      .finally(() => setCarregado(true));
  }, []);

  const mudarIdioma = useCallback((novo) => {
    setIdioma(novo);
    AsyncStorage.setItem(CHAVE_SALVA, novo).catch(() => {});
  }, []);

  // Traduz uma chave. Se faltar o inglês, usa o português; se faltar a chave,
  // mostra a própria chave (e avisa no console) para o erro aparecer na tela.
  const t = useCallback(
    (chave, valores) => {
      const texto = textos[chave];
      if (!texto) {
        console.warn(`Texto sem tradução: "${chave}"`);
        return chave;
      }
      const frase = texto[idioma] ?? texto.pt;
      if (!valores) return frase;
      return frase.replace(/\{(\w+)\}/g, (_, nome) => valores[nome] ?? "");
    },
    [idioma],
  );

  const valor = useMemo(
    () => ({ idioma, mudarIdioma, t }),
    [idioma, mudarIdioma, t],
  );

  // Espera ler a escolha salva antes de desenhar, para não abrir num idioma
  // e trocar para o outro um instante depois (leva poucos milissegundos)
  if (!carregado) return null;

  return (
    <IdiomaContext.Provider value={valor}>{children}</IdiomaContext.Provider>
  );
}

export function useIdioma() {
  const contexto = useContext(IdiomaContext);
  if (!contexto) {
    throw new Error("useIdioma() precisa estar dentro do <IdiomaProvider>");
  }
  return contexto;
}
