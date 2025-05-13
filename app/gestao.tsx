// app/gestao.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function Gestao() {
  const [nomeCultivo, setNomeCultivo] = useState("");
  const [nomeInsumo, setNomeInsumo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [data, setData] = useState("");
  const [gestoes, setGestoes] = useState<any[]>([]);

  const fetchDados = async () => {
    const snapshot = await getDocs(collection(db, "gestoes"));
    setGestoes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const adicionarGestao = async () => {
    if (!nomeCultivo.trim() || !nomeInsumo.trim() || !quantidade.trim() || !data.trim()) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    await addDoc(collection(db, "gestoes"), {
      nomeCultivo,
      nomeInsumo,
      quantidade,
      data,
    });

    setNomeCultivo("");
    setNomeInsumo("");
    setQuantidade("");
    setData("");
    fetchDados();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão Agrícola</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Cultivo"
        value={nomeCultivo}
        onChangeText={setNomeCultivo}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do Insumo"
        value={nomeInsumo}
        onChangeText={setNomeInsumo}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade (ex: 10 sacas)"
        value={quantidade}
        onChangeText={setQuantidade}
      />
      <TextInput
        style={styles.input}
        placeholder="Data (ex: 13/05/2025)"
        value={data}
        onChangeText={setData}
      />

      <TouchableOpacity style={styles.button} onPress={adicionarGestao}>
        <Text style={styles.buttonText}>Registrar Gestão</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Histórico de Gestão</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.cellHeader}>Cultivo</Text>
        <Text style={styles.cellHeader}>Insumo</Text>
        <Text style={styles.cellHeader}>Qtd</Text>
        <Text style={styles.cellHeader}>Data</Text>
      </View>
      <FlatList
        data={gestoes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.nomeCultivo}</Text>
            <Text style={styles.cell}>{item.nomeInsumo}</Text>
            <Text style={styles.cell}>{item.quantidade}</Text>
            <Text style={styles.cell}>{item.data}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#1E88E5",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  subTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    padding: 10,
  },
  cellHeader: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});
