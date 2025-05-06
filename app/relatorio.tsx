import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Relatorio() {
  // Dados simulados (depois substituímos pelos reais)
  const cultivos = [
    { nome: "Milho", data: "10/04/2025" },
    { nome: "Feijão", data: "02/03/2025" },
  ];

  const insumos = [
    { nome: "Fertilizante NPK", quantidade: "20kg", data: "12/04/2025" },
    { nome: "Inseticida", quantidade: "5L", data: "05/03/2025" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relatório Geral</Text>

      <View style={styles.box}>
        <Text style={styles.boxTitle}>Total de Cultivos:</Text>
        <Text style={styles.boxValue}>{cultivos.length}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.boxTitle}>Total de Insumos:</Text>
        <Text style={styles.boxValue}>{insumos.length}</Text>
      </View>

      <Text style={styles.subTitle}>Últimos Cultivos</Text>
      {cultivos.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text>{item.nome} - {item.data}</Text>
        </View>
      ))}

      <Text style={styles.subTitle}>Últimos Insumos</Text>
      {insumos.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text>{item.nome} - {item.quantidade} - {item.data}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBE7",
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: "#827717",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 10,
    color: "#616161",
  },
  box: {
    backgroundColor: "#FFF9C4",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F4C3",
  },
  boxTitle: {
    fontSize: 16,
    color: "#827717",
    fontWeight: "600",
  },
  boxValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#33691E",
  },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
