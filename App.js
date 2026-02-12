import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { View } from "react-native";

// TELAS
import DetailsScreen from "./Details";
import HomeScreen from "./HomeScreen";
import MenuLateral from "./MenuLateral";
import Doacoes from "./Doacoes";
import Sobre from "./Sobre";
import Feedback from "./Feedback";
import Configuracoes from "./Configuracoes";

const Stack = createNativeStackNavigator();


export default function App() {
  const [menuAberto, setMenuAberto] = useState(false);


  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home">
            {(props) => (
              <>
                <HomeScreen
                  {...props}
                  abrirMenu={() => setMenuAberto(true)}
                />

                {/* MENU RECEBE navigation AQUI */}
                <MenuLateral
                  visivel={menuAberto}
                  aoFechar={() => setMenuAberto(false)}
                  navigation={props.navigation}
                />
              </>
            )}
          </Stack.Screen>

          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Doacoes" component={Doacoes} />
          <Stack.Screen name="Sobre" component={Sobre}/>
          <Stack.Screen name="Feedback" component={Feedback}/>
          <Stack.Screen name="Configuracoes" component={Configuracoes}/>
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}
