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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function Gestao() {
  const router = useRouter();
  const [nomeCultivo, setNomeCultivo] = useState("");
  const [nomeInsumo, setNomeInsumo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [data, setData] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [gestoes, setGestoes] = useState<any[]>([]);

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR"); // formato DD/MM/AAAA
  };

  const fetchDados = async () => {
    const snapshot = await getDocs(collection(db, "gestoes"));
    setGestoes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const adicionarGestao = async () => {
    if (!nomeCultivo.trim() || !nomeInsumo.trim() || !quantidade.trim() || !data) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    await addDoc(collection(db, "gestoes"), {
      nomeCultivo,
      nomeInsumo,
      quantidade,
      data: formatarData(data),
    });

    setNomeCultivo("");
    setNomeInsumo("");
    setQuantidade("");
    fetchDados();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão Agrícola</Text>

    <View style={styles.input}>
            <Picker
              selectedValue={nomeCultivo}
              onValueChange={(itemValue) => setNomeCultivo(itemValue)}
            >
              <Picker.Item label="Selecione o cultivo" value="" enabled={false} />
              <Picker.Item label="Milho" value="Milho" />
              <Picker.Item label="Soja" value="Soja" />
            </Picker>
      </View>

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
      <TouchableOpacity
        onPress={() => setMostrarPicker(true)}
        style={styles.input}
      >
        <Text style={{ color: data ? "#000" : "#aaa" }}>
          {data ? formatarData(data) : "Selecione a data do plantio"}
        </Text>
      </TouchableOpacity>

      {mostrarPicker && (
        <DateTimePicker
          value={data}
          mode="date"
          onChange={(event, selectedDate) => {
            setMostrarPicker(false);
            if (selectedDate) {
              setData(selectedDate);
            }
          }}
        />
      )}

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
