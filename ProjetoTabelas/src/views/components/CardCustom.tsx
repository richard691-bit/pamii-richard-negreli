import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  titulo: string;
  subtitulo?: string;
  info?: string;
  badge?: string;
  onDeletar?: () => void;
  onPress?: () => void;
}

export default function CardCustom({
  titulo,
  subtitulo,
  info,
  badge,
  onDeletar,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.conteudo}>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{badge}</Text>
          </View>
        ) : null}

        <Text style={styles.titulo} numberOfLines={1}>
          {titulo}
        </Text>

        {subtitulo ? (
          <Text style={styles.subtitulo} numberOfLines={1}>
            {subtitulo}
          </Text>
        ) : null}

        {info ? (
          <Text style={styles.info} numberOfLines={2}>
            {info}
          </Text>
        ) : null}
      </View>

      {onDeletar ? (
        <TouchableOpacity style={styles.botaoDeletar} onPress={onDeletar}>
          <Ionicons name="trash-outline" size={20} color="#FF4C4C" />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A4A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  conteudo: {
    flex: 1,
  },
  badge: {
    backgroundColor: "#E50914",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  badgeTexto: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: 13,
    color: "#A0A0C0",
    marginBottom: 4,
  },
  info: {
    fontSize: 12,
    color: "#606080",
    lineHeight: 18,
  },
  botaoDeletar: {
    padding: 8,
    marginLeft: 8,
  },
});