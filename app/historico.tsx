import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function Historico() {
  // Exemplo de dados fictícios. Depois vamos puxar do armazenamento local.
  const cultivos = [
    { nome: "Milho", data: "10/04/2025", local: "Sítio Boa Fé" },
    { nome: "Feijão", data: "02/03/2025", local: "Lote 4" },
  ];

  const insumos = [
    { nome: "Fertilizante NPK", quantidade: "20kg", data: "12/04/2025" },
    { nome: "Inseticida", quantidade: "5L", data: "05/03/2025" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Histórico de Cultivos</Text>
      {cultivos.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text>Data: {item.data}</Text>
          <Text>Local: {item.local}</Text>
        </View>
      ))}

      <Text style={styles.title}>Histórico de Insumos</Text>
      {insumos.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text>Quantidade: {item.quantidade}</Text>
          <Text>Data de uso: {item.data}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECEFF1",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#37474F",
    marginVertical: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    borderColor: "#CFD8DC",
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 4,
  },
});
