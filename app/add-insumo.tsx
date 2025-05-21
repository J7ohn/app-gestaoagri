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
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { addInsumo } from "../services/database";
import { showToast } from "../components/Toast";

const TIPOS_INSUMO = [
  { label: "Fertilizante", value: "fertilizante" },
  { label: "Semente", value: "semente" },
  { label: "Defensivo", value: "defensivo" }
];

const UNIDADES_MEDIDA = [
  { label: "Quilogramas (kg)", value: "kg" },
  { label: "Litros (L)", value: "L" },
  { label: "Unidades", value: "un" },
  { label: "Sacas", value: "sc" }
];

export default function AddInsumo() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("kg");
  const [fabricante, setFabricante] = useState("");
  const [lote, setLote] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const validarDados = () => {
    if (!nome.trim()) return "Nome do insumo é obrigatório";
    if (!tipo) return "Selecione o tipo do insumo";
    if (!quantidade || isNaN(Number(quantidade)) || Number(quantidade) < 0) {
      return "Quantidade inválida";
    }
    return null;
  };

  const salvarInsumo = async () => {
    const erro = validarDados();
    if (erro) {
      showToast('error', 'Erro', erro);
      return;
    }

    try {
      await addInsumo({
        nome: `${nome} (${unidade})`,
        tipo,
        quantidade_estoque: Number(quantidade)
      });

      showToast('success', 'Sucesso', 'Insumo cadastrado com sucesso!');
      router.back();
    } catch (error) {
      showToast('error', 'Erro', 'Não foi possível salvar o insumo');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.title}>Adicionar Insumo</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Insumo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: NPK 10-10-10"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.input}>
            <Picker
              selectedValue={tipo}
              onValueChange={setTipo}
            >
              <Picker.Item label="Selecione o tipo" value="" />
              {TIPOS_INSUMO.map((tipo) => (
                <Picker.Item 
                  key={tipo.value} 
                  label={tipo.label} 
                  value={tipo.value} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 2, marginRight: 10 }]}>
            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 100"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Unidade</Text>
            <View style={styles.input}>
              <Picker
                selectedValue={unidade}
                onValueChange={setUnidade}
              >
                {UNIDADES_MEDIDA.map((un) => (
                  <Picker.Item 
                    key={un.value} 
                    label={un.label} 
                    value={un.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Fabricante (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do fabricante"
            value={fabricante}
            onChangeText={setFabricante}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Lote (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Número do lote"
            value={lote}
            onChangeText={setLote}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Observações (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observações adicionais"
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={salvarInsumo}>
          <Text style={styles.buttonText}>Salvar Insumo</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#F57C00",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderColor: "#FFE0B2",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#FFA000",
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