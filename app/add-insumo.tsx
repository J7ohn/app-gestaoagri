import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform,} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

export default function AddInsumo() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [data, setData] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR"); // formato DD/MM/AAAA
  };

  const salvarInsumo = () => {
    if (!nome || !quantidade || !data) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    // Aqui futuramente salvaremos no banco
    console.log("Insumo salvo:", {
      nome,
      data: formatarData(data),
      quantidade,
    });

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
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={(event, selectedDate) => {
            setMostrarPicker(false);
            if (selectedDate) {
              setData(selectedDate);
            }
          }}
        />
      )}

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
