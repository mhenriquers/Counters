import { useNavigation } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Image } from "react-native";

export default function SplashScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const barAnim = useRef(new Animated.Value(0)).current;
  const barWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Video
        source={require("./assets/logoInVideo.mp4")}
        style={styles.Video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={true}
        isMuted={true}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            navigation.navigate("Home");
          }
        }}
      />
      {/*
      <View style={styles.backBar}> 
        <Animated.View style={[styles.loadingBar, {width: barWidth}]}/>
      </View>*/}
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

  Video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

  },

  backBar: {
    width: '80%',
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    position: 'absolute',
    bottom: 150,

    overflow: 'hidden',
  },

  loadingBar: {
    height: '100%',
    backgroundColor: '#0087b1',
  },

});
