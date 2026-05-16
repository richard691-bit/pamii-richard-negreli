import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import InputCustom from "../../src/views/components/InputCustom";
import BotaoCustom from "../../src/views/components/BotaoCustom";
import { cadastrarDiretor } from "../../src/controllers/DiretorController";

export default function DiretorCadastroScreen() {
  // ─── ESTADOS DOS CAMPOS ───────────────────────────────
  const [nome, setNome] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [premiado, setPremiado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // ─── ESTADOS DOS ERROS ────────────────────────────────
  const [erros, setErros] = useState({
    nome: "",
    nacionalidade: "",
    dataNascimento: "",
  });

  // ─── MÁSCARA DE DATA ──────────────────────────────────
  const aplicarMascaraData = (texto: string) => {
    const numeros = texto.replace(/\D/g, "");
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  };

  // ─── VALIDAÇÃO LOCAL ──────────────────────────────────
  const validarCampos = (): boolean => {
    const novosErros = { nome: "", nacionalidade: "", dataNascimento: "" };
    let valido = true;

    if (!nome || nome.trim().length < 3) {
      novosErros.nome = "Nome deve ter pelo menos 3 caracteres.";
      valido = false;
    }

    if (!nacionalidade || nacionalidade.trim().length < 3) {
      novosErros.nacionalidade = "Nacionalidade deve ter pelo menos 3 caracteres.";
      valido = false;
    }

    if (!dataNascimento) {
      novosErros.dataNascimento = "Data de nascimento é obrigatória.";
      valido = false;
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)) {
      novosErros.dataNascimento = "Use o formato DD/MM/AAAA.";
      valido = false;
    }

    setErros(novosErros);
    return valido;
  };

  // ─── LIMPAR FORMULÁRIO ────────────────────────────────
  const limparFormulario = () => {
    setNome("");
    setNacionalidade("");
    setDataNascimento("");
    setPremiado(false);
    setErros({ nome: "", nacionalidade: "", dataNascimento: "" });
  };

  // ─── SALVAR ───────────────────────────────────────────
  const handleSalvar = async () => {
    if (!validarCampos()) return;

    setCarregando(true);
    const resultado = await cadastrarDiretor(nome, nacionalidade, dataNascimento, premiado);
    setCarregando(false);

    if (resultado.sucesso) {
      Alert.alert("✅ Sucesso", resultado.mensagem, [
        {
          text: "Ver diretores",
          onPress: () => router.push("/diretores"),
        },
        {
          text: "Cadastrar outro",
          onPress: limparFormulario,
        },
      ]);
    } else {
      Alert.alert("❌ Erro", resultado.mensagem);
    }
  };

  // ─── RENDER ───────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
            <Ionicons name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitulo}>Novo Diretor</Text>
            <Text style={styles.headerSubtitulo}>Preencha todos os campos</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── FORMULÁRIO ── */}
          <View style={styles.formulario}>

            <InputCustom
              label="Nome completo"
              placeholder="Ex: Christopher Nolan"
              value={nome}
              onChangeText={(t) => {
                setNome(t);
                if (erros.nome) setErros((e) => ({ ...e, nome: "" }));
              }}
              erro={erros.nome}
              autoCapitalize="words"
            />

            <InputCustom
              label="Nacionalidade"
              placeholder="Ex: Britânico"
              value={nacionalidade}
              onChangeText={(t) => {
                setNacionalidade(t);
                if (erros.nacionalidade) setErros((e) => ({ ...e, nacionalidade: "" }));
              }}
              erro={erros.nacionalidade}
              autoCapitalize="sentences"
            />

            <InputCustom
              label="Data de nascimento"
              placeholder="DD/MM/AAAA"
              value={dataNascimento}
              onChangeText={(t) => {
                setDataNascimento(aplicarMascaraData(t));
                if (erros.dataNascimento) setErros((e) => ({ ...e, dataNascimento: "" }));
              }}
              erro={erros.dataNascimento}
              keyboardType="numeric"
              maxLength={10}
            />

            {/* ── SWITCH PREMIADO ── */}
            <View style={styles.switchContainer}>
              <View>
                <Text style={styles.switchLabel}>Diretor premiado</Text>
                <Text style={styles.switchSubLabel}>
                  Possui Oscar ou prêmio equivalente
                </Text>
              </View>
              <Switch
                value={premiado}
                onValueChange={setPremiado}
                trackColor={{ false: "#2A2A4A", true: "#E50914" }}
                thumbColor={premiado ? "#FFF" : "#606080"}
              />
            </View>

            {/* ── BADGE PREMIADO ── */}
            {premiado && (
              <View style={styles.badgePremiado}>
                <Ionicons name="trophy" size={16} color="#FFD700" />
                <Text style={styles.badgePremiadoTexto}>
                  Diretor marcado como premiado 🏆
                </Text>
              </View>
            )}
          </View>

          {/* ── BOTÕES ── */}
          <View style={styles.botoes}>
            <BotaoCustom
              titulo="Salvar Diretor"
              onPress={handleSalvar}
              carregando={carregando}
              disabled={carregando}
            />
            <BotaoCustom
              titulo="Limpar campos"
              onPress={limparFormulario}
              variante="secundario"
              disabled={carregando}
            />
            <BotaoCustom
              titulo="Cancelar"
              onPress={() => router.back()}
              variante="perigo"
              disabled={carregando}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },
  botaoVoltar: {
    backgroundColor: "#1A1A2E",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A4A",
  },
  headerTitulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSubtitulo: {
    fontSize: 13,
    color: "#606080",
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  formulario: {
    backgroundColor: "#1A1A2E",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2A2A4A",
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A4A",
    marginTop: 4,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E0E0E0",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  switchSubLabel: {
    fontSize: 12,
    color: "#606080",
    marginTop: 2,
  },
  badgePremiado: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2000",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FFD70030",
  },
  badgePremiadoTexto: {
    color: "#FFD700",
    fontSize: 13,
    fontWeight: "600",
  },
  botoes: {
    gap: 4,
  },
});