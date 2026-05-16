import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface MenuItemProps {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  subtitulo: string;
  rota: string;
  cor: string;
}

const MenuItem = ({ icone, titulo, subtitulo, rota, cor }: MenuItemProps) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => router.push(rota as any)}
    activeOpacity={0.85}
  >
    <View style={[styles.iconeContainer, { backgroundColor: cor }]}>
      <Ionicons name={icone} size={28} color="#FFF" />
    </View>
    <View style={styles.menuTexto}>
      <Text style={styles.menuTitulo}>{titulo}</Text>
      <Text style={styles.menuSubtitulo}>{subtitulo}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#606080" />
  </TouchableOpacity>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerTopo}>
          <View style={styles.logoBadge}>
            <Ionicons name="film" size={20} color="#FFF" />
          </View>
          <Text style={styles.logoTexto}>CineBase</Text>
        </View>
        <Text style={styles.headerTitulo}>Sua biblioteca{"\n"}de filmes</Text>
        <Text style={styles.headerSubtitulo}>
          Gerencie filmes e diretores com facilidade
        </Text>
      </View>

      {/* ── LINHA DIVISÓRIA ── */}
      <View style={styles.divisor} />

      {/* ── MENU ── */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>🎬 FILMES</Text>
        <MenuItem
          icone="list"
          titulo="Ver todos os filmes"
          subtitulo="Consulte o catálogo completo"
          rota="/filmes"
          cor="#E50914"
        />
        <MenuItem
          icone="add-circle"
          titulo="Cadastrar filme"
          subtitulo="Adicione um novo filme"
          rota="/filmes/cadastro"
          cor="#B20710"
        />
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>🎥 DIRETORES</Text>
        <MenuItem
          icone="people"
          titulo="Ver todos os diretores"
          subtitulo="Consulte os diretores cadastrados"
          rota="/diretores"
          cor="#1A1AE5"
        />
        <MenuItem
          icone="person-add"
          titulo="Cadastrar diretor"
          subtitulo="Adicione um novo diretor"
          rota="/diretores/cadastro"
          cor="#1010B2"
        />
      </View>

      {/* ── RODAPÉ ── */}
      <View style={styles.rodape}>
        <Text style={styles.rodapeTexto}>CineBase • v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A1A",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerTopo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    backgroundColor: "#E50914",
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoTexto: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  headerTitulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 40,
    marginBottom: 8,
  },
  headerSubtitulo: {
    fontSize: 14,
    color: "#606080",
    letterSpacing: 0.3,
  },
  divisor: {
    height: 1,
    backgroundColor: "#1A1A2E",
    marginHorizontal: 24,
    marginBottom: 24,
  },
  secao: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#606080",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2A2A4A",
  },
  iconeContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuTexto: {
    flex: 1,
  },
  menuTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  menuSubtitulo: {
    fontSize: 12,
    color: "#606080",
  },
  rodape: {
    position: "absolute",
    bottom: 24,
    width: width,
    alignItems: "center",
  },
  rodapeTexto: {
    fontSize: 12,
    color: "#2A2A4A",
    letterSpacing: 1,
  },
});