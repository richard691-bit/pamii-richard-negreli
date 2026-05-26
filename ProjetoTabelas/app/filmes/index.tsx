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
import { listarFilmes, deletarFilme } from "../../src/controllers/FilmeController";
import { Filme } from "../../src/models/FilmeModel";

// ─── COMPONENTE DE ESTRELAS ───────────────────────────────
const Estrelas = ({ nota }: { nota: number }) => {
  const estrelas = Math.round(nota / 2);
  return (
    <View style={{ flexDirection: "row", gap: 2, marginTop: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => ( // Para cada estrela, se o índice for menor ou igual à nota arredondada, mostra estrela cheia, caso contrário, mostra estrela vazia.
        <Ionicons
          key={i}
          name={i <= estrelas ? "star" : "star-outline"}
          size={12}
          color="#FFD700"
        />
      ))}
      <Text style={{ color: "#606080", fontSize: 11, marginLeft: 4 }}>
        {nota}/10
      </Text>
    </View>
  );
};

// ─── COMPONENTE DE CARD DE FILME ──────────────────────────
const CardFilme = ({
  filme,
  onDeletar,
}: {
  filme: Filme;
  onDeletar: () => void;
}) => ( 
  <View style={estilosCard.card}>
    <View style={estilosCard.badgeGenero}>
      <Text style={estilosCard.badgeGeneroTexto}>{filme.genero}</Text>
    </View>

    <View style={estilosCard.conteudo}>
      <View style={estilosCard.topo}>
        <View style={{ flex: 1 }}>
          <Text style={estilosCard.titulo} numberOfLines={1}>
            {filme.titulo}
          </Text>
          <Text style={estilosCard.ano}>{filme.ano}</Text>
        </View>
        <TouchableOpacity style={estilosCard.botaoDeletar} onPress={onDeletar}>
          <Ionicons name="trash-outline" size={18} color="#FF4C4C" />
        </TouchableOpacity>
      </View>

      <Text style={estilosCard.sinopse} numberOfLines={2}>
        {filme.sinopse}
      </Text>

      <View style={estilosCard.rodape}>
        <View style={estilosCard.diretorInfo}>
          <Ionicons name="person-circle-outline" size={14} color="#606080" />
          <Text style={estilosCard.diretorNome} numberOfLines={1}>
            {filme.diretorNome}
          </Text>
        </View>
        <Estrelas nota={filme.nota} />
      </View>
    </View>
  </View>
);

// ─── TELA PRINCIPAL ───────────────────────────────────────
export default function FilmeListaScreen() {
  const [filmes, setFilmes] = useState<Filme[]>([]); 
  const [carregando, setCarregando] = useState(true); 
  const [atualizando, setAtualizando] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | "melhor" | "pior">("todos");

  // ─── CARREGAR FILMES ────────────────────────────────
  const carregarFilmes = async () => {
    const dados = await listarFilmes();
    setFilmes(dados);
    setCarregando(false);
    setAtualizando(false);
  };

  // ─── RECARREGA AO FOCAR A TELA ──────────────────────
  useFocusEffect( // Quando a tela é focada, inicia o carregamento
    useCallback(() => {
      setCarregando(true); 
      carregarFilmes();
    }, [])
  );

  // ─── PULL TO REFRESH ────────────────────────────────
  const handleRefresh = () => { // Quando o usuário puxa para atualizar, inicia o estado de atualização e recarrega os filmes
    setAtualizando(true);
    carregarFilmes();
  };



  // ─── DELETAR ────────────────────────────────────────
 const handleDeletar = async (filme: Filme) => {
  // ─── usa window.confirm na web, Alert no mobile ───
  const confirmado = Platform.OS === "web"
    ? window.confirm(`Deseja remover "${filme.titulo}"? Esta ação não pode ser desfeita.`) // Mostra um alerta de confirmação no web
    : await new Promise<boolean>((resolve) => { // Mostra um alerta de confirmação no mobile
        Alert.alert(
          "Remover Filme",
          `Deseja remover "${filme.titulo}"?`,
          [
            { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
            { text: "Remover", style: "destructive", onPress: () => resolve(true) },
          ]
        );
      });

  if (!confirmado) return;

  const resultado = await deletarFilme(filme.id!);
  if (resultado.sucesso) {
    setFilmes((prev) => prev.filter((f) => f.id !== filme.id));
    Platform.OS === "web"
      ? window.alert("✅ Filme removido com sucesso!")
      : Alert.alert("✅ Sucesso", resultado.mensagem);
  } else {
    Platform.OS === "web"
      ? window.alert("❌ Erro ao remover filme.")
      : Alert.alert("❌ Erro", resultado.mensagem);
  }
};


  // ─── FILTROS ────────────────────────────────────────
  const filmesFiltrados = [...filmes].sort((a, b) => {
    if (filtro === "melhor") return b.nota - a.nota;
    if (filtro === "pior") return a.nota - b.nota;
    return 0;
  });

  // ─── ESTATÍSTICAS ───────────────────────────────────
  const mediaNotas =
    filmes.length > 0
      ? (filmes.reduce((acc, f) => acc + f.nota, 0) / filmes.length).toFixed(1)
      : "0.0";

  const melhorFilme = filmes.length > 0
    ? filmes.reduce((a, b) => (a.nota > b.nota ? a : b))
    : null;

  // ─── TELA DE CARREGAMENTO ───────────────────────────
  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.carregandoTexto}>Carregando filmes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── RENDER ─────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitulo}>Filmes</Text>
          <Text style={styles.headerSubtitulo}>
            {filmes.length} {filmes.length === 1 ? "filme cadastrado" : "filmes cadastrados"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => router.push("/filmes/cadastro")}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {filmes.length === 0 ? (
        // ── LISTA VAZIA ──
        <View style={styles.centralizado}>
          <Ionicons name="film-outline" size={64} color="#2A2A4A" />
          <Text style={styles.vazioTitulo}>Nenhum filme cadastrado</Text>
          <Text style={styles.vazioSubtitulo}>
            Toque no botão + para adicionar o primeiro
          </Text>
          <TouchableOpacity
            style={styles.botaoCadastrar}
            onPress={() => router.push("/filmes/cadastro")}
          >
            <Text style={styles.botaoCadastrarTexto}>Cadastrar filme</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filmesFiltrados}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.lista}
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
            <>
              {/* ── ESTATÍSTICAS ── */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValor}>{filmes.length}</Text>
                  <Text style={styles.statLabel}>Filmes</Text>
                </View>
                <View style={styles.statDivisor} />
                <View style={styles.statItem}>
                  <Text style={styles.statValor}>{mediaNotas}</Text>
                  <Text style={styles.statLabel}>Média</Text>
                </View>
                <View style={styles.statDivisor} />
                <View style={styles.statItem}>
                  <Text style={styles.statValor} numberOfLines={1}>
                    {melhorFilme?.titulo.split(" ")[0] ?? "-"}
                  </Text>
                  <Text style={styles.statLabel}>Melhor</Text>
                </View>
              </View>

              {/* ── FILTROS ── */}
              <View style={styles.filtros}>
                {(["todos", "melhor", "pior"] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.filtroBotao, filtro === f && styles.filtroAtivo]}
                    onPress={() => setFiltro(f)}
                  >
                    <Text
                      style={[styles.filtroTexto, filtro === f && styles.filtroTextoAtivo]}
                    >
                      {f === "todos" ? "Todos" : f === "melhor" ? "Melhor nota" : "Pior nota"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
          renderItem={({ item }) => (
            <CardFilme filme={item} onDeletar={() => handleDeletar(item)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

// ─── ESTILOS DO CARD DE FILME ─────────────────────────────
const estilosCard = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A4A",
    overflow: "hidden",
  },
  badgeGenero: {
    backgroundColor: "#E50914",
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    borderBottomRightRadius: 10,
  },
  badgeGeneroTexto: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  conteudo: {
    padding: 14,
  },
  topo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  ano: {
    fontSize: 12,
    color: "#606080",
    marginTop: 2,
  },
  botaoDeletar: {
    padding: 4,
    marginLeft: 8,
  },
  sinopse: {
    fontSize: 13,
    color: "#A0A0C0",
    lineHeight: 19,
    marginBottom: 10,
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2A2A4A",
    paddingTop: 10,
  },
  diretorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  diretorNome: {
    color: "#606080",
    fontSize: 12,
  },
});

// ─── ESTILOS DA TELA ──────────────────────────────────────
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
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A4A",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValor: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 11,
    color: "#606080",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statDivisor: {
    width: 1,
    height: 32,
    backgroundColor: "#2A2A4A",
  },
  filtros: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filtroBotao: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#1A1A2E",
    borderWidth: 1,
    borderColor: "#2A2A4A",
  },
  filtroAtivo: {
    backgroundColor: "#E50914",
    borderColor: "#E50914",
  },
  filtroTexto: {
    color: "#606080",
    fontSize: 12,
    fontWeight: "600",
  },
  filtroTextoAtivo: {
    color: "#FFF",
  },
  centralizado: {
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