import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LineChart, PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { initDatabase, getGestoes, getStatistics } from "../services/database";

const screenWidth = Dimensions.get("window").width;

export default function Index() {
  const router = useRouter();
  const [gestoes, setGestoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCultivos: 0,
    totalInsumos: 0,
    cultivosPorTipo: [] as any[],
  });

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initDatabase();
        await fetchData();
      } catch (error) {
        console.error('Error setting up database:', error);
        setLoading(false);
      }
    };

    setupDatabase();
  }, []);

  const fetchData = async () => {
    try {
      const [dadosGestoes, estatisticas] = await Promise.all([
        getGestoes(),
        getStatistics()
      ]);
      
      setGestoes(dadosGestoes);
      setStats(estatisticas);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const chartData = {
    labels: gestoes.slice(-5).map((g) => g.data || ""),
    datasets: [
      {
        data: gestoes.slice(-5).map((g) => Number(g.quantidade) || 0),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F3A44" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/logo.jpg")}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard Agrícola</Text>
          <Text style={styles.headerSubtitle}>Visão Geral da Produção</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="leaf" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.totalCultivos}</Text>
            <Text style={styles.statLabel}>Cultivos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="flask" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.totalInsumos}</Text>
            <Text style={styles.statLabel}>Insumos</Text>
          </View>
        </View>

        {gestoes.length > 0 && (
          <>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Produção Recente</Text>
              <LineChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(47, 58, 68, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(47, 58, 68, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#2F3A44",
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>

            {stats.cultivosPorTipo.length > 0 && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Distribuição de Cultivos</Text>
                <PieChart
                  data={stats.cultivosPorTipo}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(47, 58, 68, ${opacity})`,
                  }}
                  accessor="value"
                  backgroundColor="transparent"
                  paddingLeft="15"
                />
              </View>
            )}
          </>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/gestao")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Nova Gestão</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push("/add-cultivo")}
          >
            <Ionicons name="leaf-outline" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Novo Cultivo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  backgroundImage: {
    opacity: 0.15,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2F3A44",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2F3A44",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2F3A44",
    marginBottom: 15,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  actionButtons: {
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2F3A44",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});