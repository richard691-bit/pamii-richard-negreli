import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CardCustom from "../../src/views/components/CardCustom";
import { listarDiretores, deletarDiretor } from "../../src/controllers/DiretorController";
import { Diretor } from "../../src/models/DiretorModel";

export default function DiretorListaScreen() {
  // ─── ESTADOS ──────────────────────────────────────────
  const [diretores, setDiretores] = useState<Diretor[]>([]); // Lista de diretores
  const [carregando, setCarregando] = useState(true); // true para mostrar tela de carregamento inicial
  const [atualizando, setAtualizando] = useState(false); // true para mostrar indicador de pull-to-refresh

  // ─── CARREGAR DIRETORES ───────────────────────────────
  const carregarDiretores = async () => {
    const dados = await listarDiretores();
    setDiretores(dados); // Atualiza a lista de diretores no estado
    setCarregando(false); // Desativa tela de carregamento inicial
    setAtualizando(false); // Desativa indicador de pull-to-refresh
  };

  // ─── RECARREGA TODA VEZ QUE A TELA RECEBE FOCO ───────
  useFocusEffect(
    useCallback(() => { // Quando a tela é focada, inicia o carregamento
      setCarregando(true); // Ativa tela de carregamento inicial
      carregarDiretores(); 
    }, [])
  );

  // ─── PULL TO REFRESH ──────────────────────────────────
  const handleRefresh = () => {
    setAtualizando(true);
    carregarDiretores();
  };




  // ─── DELETAR ──────────────────────────────────────────
  const handleDeletar = async (diretor: Diretor) => { // Função para deletar um diretor, recebe o objeto diretor como parâmetro
  const confirmado = Platform.OS === "web"
    ? window.confirm(`Deseja remover "${diretor.nome}"? Esta ação não pode ser desfeita.`) // Mostra um alerta de confirmação no web
    : await new Promise<boolean>((resolve) => { // Mostra um alerta de confirmação no mobile
        Alert.alert(
          "Remover Diretor",
          `Deseja remover "${diretor.nome}"?`,
          [
            { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
            { text: "Remover", style: "destructive", onPress: () => resolve(true) },
          ]
        );
      });

  if (!confirmado) return;

  const resultado = await deletarDiretor(diretor.id!);
  if (resultado.sucesso) {
    setDiretores((prev) => prev.filter((d) => d.id !== diretor.id));
    Platform.OS === "web"
      ? window.alert("✅ Diretor removido com sucesso!")
      : Alert.alert("✅ Sucesso", resultado.mensagem);
  } else {
    Platform.OS === "web"
      ? window.alert("❌ Erro ao remover diretor.")
      : Alert.alert("❌ Erro", resultado.mensagem);
  }
};




  // ─── TELA DE CARREGAMENTO ─────────────────────────────
  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />
        <View style={styles.centralized}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.carregandoTexto}>Carregando diretores...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── RENDER ───────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitulo}>Diretores</Text>
          <Text style={styles.headerSubtitulo}>
            {diretores.length} {diretores.length === 1 ? "diretor cadastrado" : "diretores cadastrados"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => router.push("/diretores/cadastro")}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* ── LISTA ── */}
      {diretores.length === 0 ? (
        <View style={styles.centralized}>
          <Ionicons name="people-outline" size={64} color="#2A2A4A" />
          <Text style={styles.vazioTitulo}>Nenhum diretor cadastrado</Text>
          <Text style={styles.vazioSubtitulo}>
            Toque no botão + para adicionar o primeiro
          </Text>
          <TouchableOpacity
            style={styles.botaoCadastrar}
            onPress={() => router.push("/diretores/cadastro")}
          >
            <Text style={styles.botaoCadastrarTexto}>Cadastrar diretor</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={diretores}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.lista} // Estiliza a lista
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={handleRefresh}
              tintColor="#E50914"
              colors={["#E50914"]}
            />
          }
          ListHeaderComponent={
            <View style={styles.listaHeader}> 
              <Ionicons name="trophy-outline" size={14} color="#FFD700" /> {/* Ícone de troféu para indicar diretores premiados */}	
              <Text style={styles.listaHeaderTexto}>
                🏆 = Diretor premiado
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CardCustom
              titulo={item.nome}
              subtitulo={`${item.nacionalidade} • ${item.dataNascimento}`}
              info={item.premiado ? "🏆 Diretor premiado" : undefined}
              badge={item.premiado ? "PREMIADO" : undefined}
              onDeletar={() => handleDeletar(item)}
            />
          )}
        />
      )}
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
  botaoAdicionar: {
    backgroundColor: "#E50914",
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  lista: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  listaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A2E",
  },
  listaHeaderTexto: {
    fontSize: 12,
    color: "#606080",
    letterSpacing: 0.5,
  },
  centralized: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  carregandoTexto: {
    color: "#606080",
    fontSize: 14,
    marginTop: 12,
  },
  vazioTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
  },
  vazioSubtitulo: {
    fontSize: 13,
    color: "#606080",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  botaoCadastrar: {
    backgroundColor: "#E50914",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  botaoCadastrarTexto: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
});