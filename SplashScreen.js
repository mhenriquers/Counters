import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Image } from "react-native";

export default function SplashScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
    setTimeout (() => {
         navigation.navigate("Home");
    }, 4000);
  }, []);
  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("./assets/counters-icon.png")}
        style={[styles.foto, { transform: [{ scale: fadeAnim }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  foto: {
    width: 250,
    height: 250,
  },
});
