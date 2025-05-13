import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Index() {
  const router = useRouter();
  const [gestoes, setGestoes] = useState<any[]>([]);

  const fetchGestoes = async () => {
    try {
      const snapshot = await getDocs(collection(db, "gestoes"));
      const dados = snapshot.docs.map(doc => doc.data());
      setGestoes(dados);
    } catch (error) {
      console.error("Erro ao buscar dados das gestões:", error);
    }
  };

  useEffect(() => {
    fetchGestoes();
  }, []);

  // Dados simulados para o gráfico (substitua conforme necessário)
  const chartData = {
    labels: gestoosLabels(gestoes),
    datasets: [
      {
        data: gestoosValores(gestoes),
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ImageBackground
      source={require("../assets/logo.jpg")}
      style={styles.container}
      imageStyle={styles.image}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Resumo da Produção</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Registros de gestão: {gestoes.length}</Text>
        </View>

        {gestoes.length > 0 && (
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#2F3A44",
              backgroundGradientTo: "#1E1E1E",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: () => "#FFFFFF",
              decimalPlaces: 0,
            }}
            bezier
            style={styles.chart}
          />
        )}
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/gestao")}
        >
          <Text style={styles.buttonText}>Adicionar Cultivo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/add-cultivo")}
        >
          <Text style={styles.buttonText}>Cultivo Beta</Text>
        </TouchableOpacity>

      </ScrollView>
    </ImageBackground>
  );
}

// Função para extrair datas ou nomes como labels do gráfico
function gestoosLabels(gestoes: any[]) {
  return gestoes.map((g, index) => g.data || `#${index + 1}`).slice(0, 5);
}

// Função para extrair valores numéricos para o gráfico
function gestoosValores(gestoes: any[]) {
  return gestoes.map(g => Number(g.quantidade) || 0).slice(0, 5);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    resizeMode: "cover",
  },
  scrollContainer: {
    alignItems: "center",
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  infoBox: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  infoText: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 5,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#2F3A44",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
    opacity: 0.9,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
