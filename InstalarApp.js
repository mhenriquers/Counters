import React, { useEffect, useState } from "react";
import { Platform, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function InstalarApp() {
  const [evento, setEvento] = useState(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const aoPoderInstalar = (e) => {
      e.preventDefault(); // guarda o evento para usar no clique
      setEvento(e);
    };

    window.addEventListener("beforeinstallprompt", aoPoderInstalar);
    return () =>
      window.removeEventListener("beforeinstallprompt", aoPoderInstalar);
  }, []);

  if (!evento) return null;

  const instalar = async () => {
    evento.prompt();
    await evento.userChoice;
    setEvento(null);
  };

  return (
    <TouchableOpacity style={styles.botao} onPress={instalar}>
      <Text style={styles.texto}>📲 Instalar app</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    alignSelf: "center",
    backgroundColor: "#ffd700",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  texto: {
    color: "#000",
    fontWeight: "bold",
  },
});
