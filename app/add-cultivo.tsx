import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { addCultura } from "../services/database";
import { showToast } from "../components/Toast";

const CULTURAS = [
  { label: "Milho", value: "Milho", variedades: ["Híbrido", "Transgênico", "Convencional"] },
  { label: "Soja", value: "Soja", variedades: ["Precoce", "Média", "Tardia"] },
  { label: "Feijão", value: "Feijão", variedades: ["Carioca", "Preto", "Vermelho"] },
  { label: "Arroz", value: "Arroz", variedades: ["Irrigado", "Sequeiro"] },
  { label: "Trigo", value: "Trigo", variedades: ["Comum", "Durum"] }
];

export default function AddCultivo() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [variedade, setVariedade] = useState("");
  const [dataPlantio, setDataPlantio] = useState(new Date());
  const [dataColheita, setDataColheita] = useState(new Date());
  const [area, setArea] = useState("");
  const [mostrarPickerPlantio, setMostrarPickerPlantio] = useState(false);
  const [mostrarPickerColheita, setMostrarPickerColheita] = useState(false);
  const [status, setStatus] = useState("plantado");

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR");
  };

  const variedadesDisponiveis = CULTURAS.find(c => c.value === nome)?.variedades || [];

  const validarDados = () => {
    if (!nome) return "Selecione uma cultura";
    if (!variedade) return "Selecione uma variedade";
    if (!area) return "Informe a área plantada";
    if (isNaN(Number(area)) || Number(area) <= 0) return "Área inválida";
    if (dataColheita <= dataPlantio) return "Data de colheita deve ser posterior ao plantio";
    return null;
  };

  const salvarCultivo = async () => {
    const erro = validarDados();
    if (erro) {
      showToast('error', 'Erro', erro);
      return;
    }

    try {
      await addCultura({
        nome,
        variedade,
        data_plantio: formatarData(dataPlantio),
        data_colheita: formatarData(dataColheita),
        area: Number(area),
        status
      });

      showToast('success', 'Sucesso', 'Cultivo cadastrado com sucesso!');
      router.back();
    } catch (error) {
      showToast('error', 'Erro', 'Não foi possível salvar o cultivo');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.title}>Adicionar Cultivo</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cultura</Text>
          <View style={styles.input}>
            <Picker
              selectedValue={nome}
              onValueChange={(itemValue) => {
                setNome(itemValue);
                setVariedade("");
              }}
            >
              <Picker.Item label="Selecione a cultura" value="" />
              {CULTURAS.map((cultura) => (
                <Picker.Item 
                  key={cultura.value} 
                  label={cultura.label} 
                  value={cultura.value} 
                />
              ))}
            </Picker>
          </View>
        </View>

        {nome && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Variedade</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={variedade}
                onValueChange={setVariedade}
              >
                <Picker.Item label="Selecione a variedade" value="" />
                {variedadesDisponiveis.map((var_) => (
                  <Picker.Item key={var_} label={var_} value={var_} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Área (hectares)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 10.5"
            value={area}
            onChangeText={setArea}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Data do Plantio</Text>
          <TouchableOpacity
            onPress={() => setMostrarPickerPlantio(true)}
            style={styles.input}
          >
            <Text>{formatarData(dataPlantio)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Data Prevista da Colheita</Text>
          <TouchableOpacity
            onPress={() => setMostrarPickerColheita(true)}
            style={styles.input}
          >
            <Text>{formatarData(dataColheita)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.input}>
            <Picker
              selectedValue={status}
              onValueChange={setStatus}
            >
              <Picker.Item label="Plantado" value="plantado" />
              <Picker.Item label="Em desenvolvimento" value="desenvolvimento" />
              <Picker.Item label="Pronto para colheita" value="pronto" />
            </Picker>
          </View>
        </View>

        {mostrarPickerPlantio && (
          <DateTimePicker
            value={dataPlantio}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setMostrarPickerPlantio(false);
              if (selectedDate) {
                setDataPlantio(selectedDate);
              }
            }}
          />
        )}

        {mostrarPickerColheita && (
          <DateTimePicker
            value={dataColheita}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setMostrarPickerColheita(false);
              if (selectedDate) {
                setDataColheita(selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={salvarCultivo}>
          <Text style={styles.buttonText}>Salvar Cultivo</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#33691E",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderColor: "#AED581",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#558B2F",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});