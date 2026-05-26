import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import InputCustom from "../../src/views/components/InputCustom";
import BotaoCustom from "../../src/views/components/BotaoCustom";
import { cadastrarFilme } from "../../src/controllers/FilmeController";
import { listarDiretores } from "../../src/controllers/DiretorController";
import { Diretor } from "../../src/models/DiretorModel";

export default function FilmeCadastroScreen() {
  // ─── ESTADOS DOS CAMPOS ───────────────────────────────
  const [titulo, setTitulo] = useState("");
  const [ano, setAno] = useState("");
  const [genero, setGenero] = useState("");
  const [sinopse, setSinopse] = useState("");
  const [nota, setNota] = useState("");
  const [carregando, setCarregando] = useState(false);

  // ─── ESTADOS DO DIRETOR ───────────────────────────────
  const [diretores, setDiretores] = useState<Diretor[]>([]);
  const [diretorSelecionado, setDiretorSelecionado] = useState<Diretor | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [carregandoDiretores, setCarregandoDiretores] = useState(true);

  // ─── ESTADOS DOS ERROS ────────────────────────────────
  const [erros, setErros] = useState({ //
    titulo: "",
    ano: "",
    genero: "",
    sinopse: "",
    nota: "",
    diretor: "",
  });

  // ─── CARREGAR DIRETORES AO ABRIR A TELA ──────────────
  useEffect(() => {
    const buscarDiretores = async () => {
      const dados = await listarDiretores();
      setDiretores(dados);
      setCarregandoDiretores(false);
    };
    buscarDiretores();
  }, []);

  // ─── VALIDAÇÃO LOCAL ──────────────────────────────────
  const validarCampos = (): boolean => {
    const novosErros = {
      titulo: "",
      ano: "",
      genero: "",
      sinopse: "",
      nota: "",
      diretor: "",
    };
    let valido = true;

    if (!titulo || titulo.trim().length < 2) {
      novosErros.titulo = "Título deve ter pelo menos 2 caracteres.";
      valido = false;
    }

    const anoNum = Number(ano);
    const anoAtual = new Date().getFullYear();
    if (!ano || isNaN(anoNum)) {
      novosErros.ano = "Ano é obrigatório e deve ser um número.";
      valido = false;
    } else if (anoNum < 1888 || anoNum > anoAtual + 1) {
      novosErros.ano = `Ano deve estar entre 1888 e ${anoAtual + 1}.`;
      valido = false;
    }

    if (!genero || genero.trim().length < 3) {
      novosErros.genero = "Gênero deve ter pelo menos 3 caracteres.";
      valido = false;
    }

    if (!sinopse || sinopse.trim().length <= 0) {
      novosErros.sinopse = "Sinopse deve ter pelo menos 20 caracteres.";
      valido = false;
    }

    const notaNum = Number(nota);
    if (nota === "" || isNaN(notaNum)) {
      novosErros.nota = "Nota é obrigatória.";
      valido = false;
    } else if (notaNum < 0 || notaNum > 10) {
      novosErros.nota = "Nota deve ser entre 0 e 10.";
      valido = false;
    }

    if (!diretorSelecionado) {
      novosErros.diretor = "Selecione um diretor.";
      valido = false;
    }

    setErros(novosErros);
    return valido;
  };

  // ─── LIMPAR FORMULÁRIO ────────────────────────────────
  const limparFormulario = () => { // Reseta todos os campos e erros para o estado inicial
    setTitulo("");
    setAno("");
    setGenero("");
    setSinopse("");
    setNota("");
    setDiretorSelecionado(null);
    setErros({
      titulo: "",
      ano: "",
      genero: "",
      sinopse: "",
      nota: "",
      diretor: "",
    });
  };

  // ─── SALVAR ───────────────────────────────────────────
  const handleSalvar = async () => {
    if (!validarCampos()) return;

    setCarregando(true);
    const resultado = await cadastrarFilme( // Chama a função para cadastrar o filme
      titulo,
      Number(ano),
      genero,
      sinopse,
      Number(nota),
      diretorSelecionado!.id!,
      diretorSelecionado!.nome
    );
    setCarregando(false);

    if (resultado.sucesso) {
      Alert.alert("✅ Sucesso", resultado.mensagem, [
        {
          text: "Ver filmes",
          onPress: () => router.push("/filmes"),
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
            <Text style={styles.headerTitulo}>Novo Filme</Text>
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
              label="Título"
              placeholder="Ex: Interestelar"
              value={titulo}
              onChangeText={(t) => {
                setTitulo(t);
                if (erros.titulo) setErros((e) => ({ ...e, titulo: "" }));
              }}
              erro={erros.titulo}
              autoCapitalize="words"
            />

            <InputCustom
              label="Ano de lançamento"
              placeholder="Ex: 2014"
              value={ano}
              onChangeText={(t) => {
                setAno(t.replace(/\D/g, ""));
                if (erros.ano) setErros((e) => ({ ...e, ano: "" }));
              }}
              erro={erros.ano}
              keyboardType="numeric"
              maxLength={4}
            />

            <InputCustom
              label="Gênero"
              placeholder="Ex: Ficção Científica"
              value={genero}
              onChangeText={(t) => {
                setGenero(t);
                if (erros.genero) setErros((e) => ({ ...e, genero: "" }));
              }}
              erro={erros.genero}
              autoCapitalize="sentences"
            />

            <InputCustom
              label="Sinopse"
              placeholder="Descreva o filme em pelo menos 20 caracteres..."
              value={sinopse}
              onChangeText= {(t) => {
                setSinopse(t);
                if (erros.sinopse) setErros((e) => ({ ...e, sinopse: "" }));
              }}
              erro={erros.sinopse}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top", color :"#ffffff" }}
              autoCapitalize="sentences"
            />

            {/* ── CONTADOR DE CARACTERES DA SINOPSE ── */}
            <Text style={styles.contador}>
              {sinopse.length} caracteres{sinopse.length < 20 ? ` (mínimo 20)` : " ✓"}
            </Text>

            <InputCustom
              label="Nota (0 a 10)"
              placeholder="Ex: 9.5"
              value={nota}
              onChangeText={(t) => {
                setNota(t.replace(/[^0-9.]/g, ""));
                if (erros.nota) setErros((e) => ({ ...e, nota: "" }));
              }}
              erro={erros.nota}
              keyboardType="decimal-pad"
              maxLength={4}
            />

            {/* ── SELETOR DE DIRETOR ── */}
            <Text style={styles.label}>DIRETOR</Text>
            <TouchableOpacity
              style={[
                styles.seletorDiretor,
                erros.diretor ? styles.seletorErro : null,
              ]}
              onPress={() => setModalVisivel(true)}
            >
              {diretorSelecionado ? (
                <View style={styles.diretorSelecionado}>
                  <View style={styles.diretorAvatar}>
                    <Ionicons name="person" size={18} color="#FFF" />
                  </View>
                  <View>
                    <Text style={styles.diretorNome}>
                      {diretorSelecionado.nome}
                    </Text>
                    <Text style={styles.diretorNacionalidade}>
                      {diretorSelecionado.nacionalidade}
                      {diretorSelecionado.premiado ? " • 🏆" : ""}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.seletorPlaceholder}>
                  {carregandoDiretores
                    ? "Carregando diretores..."
                    : "Selecione um diretor"}
                </Text>
              )}
              <Ionicons name="chevron-down" size={20} color="#606080" />
            </TouchableOpacity>
            {erros.diretor ? (
              <Text style={styles.erro}>{erros.diretor}</Text>
            ) : null}
          </View>

          {/* ── BOTÕES ── */}
          <View style={styles.botoes}>
            <BotaoCustom
              titulo="Salvar Filme"
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

      {/* ── MODAL DE SELEÇÃO DE DIRETOR ── */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Selecionar Diretor</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {diretores.length === 0 ? (
              <View style={styles.modalVazio}>
                <Ionicons name="people-outline" size={48} color="#2A2A4A" />
                <Text style={styles.modalVazioTexto}>
                  Nenhum diretor cadastrado
                </Text>
                <TouchableOpacity
                  style={styles.modalBotaoCadastrar}
                  onPress={() => {
                    setModalVisivel(false);
                    router.push("/diretores/cadastro");
                  }}
                >
                  <Text style={styles.modalBotaoCadastrarTexto}>
                    Cadastrar diretor
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={diretores}
                keyExtractor={(item) => item.id!}
                contentContainerStyle={{ paddingBottom: 24 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      diretorSelecionado?.id === item.id && styles.modalItemSelecionado,
                    ]}
                    onPress={() => {
                      setDiretorSelecionado(item);
                      if (erros.diretor) setErros((e) => ({ ...e, diretor: "" }));
                      setModalVisivel(false);
                    }}
                  >
                    <View style={styles.modalItemAvatar}>
                      <Ionicons name="person" size={18} color="#FFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalItemNome}>{item.nome}</Text>
                      <Text style={styles.modalItemInfo}>
                        {item.nacionalidade}
                        {item.premiado ? " • 🏆 Premiado" : ""}
                      </Text>
                    </View>
                    {diretorSelecionado?.id === item.id && (
                      <Ionicons name="checkmark-circle" size={22} color="#E50914" />
                    )}
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
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
  contador: {
    fontSize: 11,
    color: "#606080",
    textAlign: "right",
    marginTop: -10,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E0E0E0",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  seletorDiretor: {
    backgroundColor: "#0A0A1A",
    borderWidth: 1,
    borderColor: "#2A2A4A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  seletorErro: {
    borderColor: "#FF4C4C",
  },
  seletorPlaceholder: {
    color: "#999",
    fontSize: 15,
  },
  diretorSelecionado: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  diretorAvatar: {
    backgroundColor: "#E50914",
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  diretorNome: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  diretorNacionalidade: {
    color: "#606080",
    fontSize: 12,
  },
  erro: {
    color: "#FF4C4C",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 8,
  },
  botoes: {
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000AA",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#0A0A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingTop: 24,
    borderWidth: 1,
    borderColor: "#2A2A4A",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A4A",
    marginBottom: 8,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A2E",
  },
  modalItemSelecionado: {
    backgroundColor: "#1A1A2E",
  },
  modalItemAvatar: {
    backgroundColor: "#1A1AE5",
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalItemNome: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
  modalItemInfo: {
    color: "#606080",
    fontSize: 12,
    marginTop: 2,
  },
  modalVazio: {
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  modalVazioTexto: {
    color: "#606080",
    fontSize: 15,
  },
  modalBotaoCadastrar: {
    backgroundColor: "#E50914",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  modalBotaoCadastrarTexto: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
});