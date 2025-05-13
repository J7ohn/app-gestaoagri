import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform,} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

export default function AddCultivo() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [data, setData] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [local, setLocal] = useState("");

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR"); // formato DD/MM/AAAA
  };

  const salvarCultivo = () => {
    if (!nome || !data || !local) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    console.log("Cultivo salvo:", {
      nome,
      data: formatarData(data),
      local,
    });

    Alert.alert("Cultivo salvo com sucesso!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Cultivo</Text>

      <View style={styles.input}>
        <Picker
          selectedValue={nome}
          onValueChange={(itemValue) => setNome(itemValue)}
        >
          <Picker.Item label="Selecione o cultivo" value="" enabled={false} />
          <Picker.Item label="Milho" value="Milho" />
          <Picker.Item label="Soja" value="Soja" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Local (ex: Lote 3, Sítio Boa Fé)"
        value={local}
        onChangeText={setLocal}
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