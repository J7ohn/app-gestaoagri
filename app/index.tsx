import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/logo.jpg")} // Caminho para a imagem logo.jpg
      style={styles.container}
      imageStyle={styles.image} // A imagem de fundo vai cobrir toda a tela
    >

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/add-cultivo")}
        >
          <Text style={styles.buttonText}>Adicionar Cultivo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/add-insumo")}
        >
          <Text style={styles.buttonText}>Adicionar Insumo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/historico")}
        >
          <Text style={styles.buttonText}>Ver Histórico</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    resizeMode: "cover", // A imagem vai cobrir toda a tela
    justifyContent: "center", // Alinha o conteúdo no centro
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#FFFFFF", // Cor do texto alterada para branco, para melhor visibilidade na imagem
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30, // Ajusta a distância dos botões para o fundo
    left: 0,
    right: 0,
    alignItems: "center", // Centraliza os botões
  },
  button: {
    backgroundColor: "#2F3A44", // Azul escuro acinzentado
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%", // Ajusta a largura dos botões
    alignItems: "center",
    opacity: 0.8, // Torna os botões ligeiramente transparentes
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
