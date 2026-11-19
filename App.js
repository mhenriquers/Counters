import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IdiomaProvider } from "./src/idioma/idioma";
import AvisoAtualizacao from "./src/componentes/AvisoAtualizacao";

// TELAS
import DetailsScreen from "./src/telas/Details";
import HomeScreen from "./src/telas/HomeScreen";
import Doacoes from "./src/telas/Doacoes";
import Sobre from "./src/telas/Sobre";
import Feedback from "./src/telas/Feedback";
import Configuracoes from "./src/telas/Configuracoes";

const Stack = createNativeStackNavigator();

// Cada tela ganha uma URL no navegador (ex.: /heroi/12)
const linking = {
  prefixes: [],
  config: {
    initialRouteName: "Home",
    screens: {
      Home: "",
      Details: "heroi/:id",
      Doacoes: "apoiar",
      Sobre: "sobre",
      Feedback: "feedback",
      Configuracoes: "configuracoes",
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Fundo preto ocupando a tela toda */}
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {/* O app ocupa a tela inteira. Cada tela se ajusta à largura
            (celular, tablet ou computador) com o useTamanhoTela e a Coluna. */}
        <View style={{ flex: 1, overflow: "hidden" }}>
          {/* Idioma disponível para todas as telas (dentro do fundo preto,
              para a tela continuar preta enquanto lê a escolha salva) */}
          <IdiomaProvider>
            {/* Só no APK: avisa se há versão nova no GitHub */}
            <AvisoAtualizacao />
            <NavigationContainer
              linking={linking}
              documentTitle={{ formatter: () => "Counters MLBB" }}
            >
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
                <Stack.Screen name="Doacoes" component={Doacoes} />
                <Stack.Screen name="Sobre" component={Sobre} />
                <Stack.Screen name="Feedback" component={Feedback} />
                <Stack.Screen name="Configuracoes" component={Configuracoes} />
              </Stack.Navigator>
            </NavigationContainer>
          </IdiomaProvider>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
