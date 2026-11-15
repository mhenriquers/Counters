import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
        {/* No computador, o app fica numa coluna de no máximo 480px centralizada */}
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 480,
            alignSelf: "center",
            overflow: "hidden",
          }}
        >
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
        </View>
      </View>
    </SafeAreaProvider>
  );
}
