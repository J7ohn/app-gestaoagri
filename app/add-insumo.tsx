import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function AddInsumo() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [data, setData] = useState("");

  const salvarInsumo = () => {
    if (!nome || !quantidade || !data) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    // Aqui futuramente salvaremos no banco
    console.log("Insumo salvo:", { nome, quantidade, data });

    Alert.alert("Insumo salvo com sucesso!");
    router.back(); // Volta para a tela anterior
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Insumo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do insumo (ex: Fertilizante NPK)"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade (ex: 10 kg)"
        value={quantidade}
        onChangeText={setQuantidade}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de uso (ex: 25/04/2025)"
        value={data}
        onChangeText={setData}
      />

      <TouchableOpacity style={styles.button} onPress={salvarInsumo}>
        <Text style={styles.buttonText}>Salvar Insumo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E1",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#FF6F00",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#FFA000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
