import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function AddCultivo() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [local, setLocal] = useState("");

  const salvarCultivo = () => {
    if (!nome || !data || !local) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    // Aqui futuramente salvaremos no banco (SQLite ou AsyncStorage)
    console.log("Cultivo salvo:", { nome, data, local });

    Alert.alert("Cultivo salvo com sucesso!");
    router.back(); // Volta para a tela anterior
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Cultivo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do cultivo (ex: Milho)"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de plantio (ex: 25/04/2025)"
        value={data}
        onChangeText={setData}
      />
      <TextInput
        style={styles.input}
        placeholder="Local (ex: Lote 3, Sítio Boa Fé)"
        value={local}
        onChangeText={setLocal}
      />

      <TouchableOpacity style={styles.button} onPress={salvarCultivo}>
        <Text style={styles.buttonText}>Salvar Cultivo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8E9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#33691E",
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
    backgroundColor: "#558B2F",
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
