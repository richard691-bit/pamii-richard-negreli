import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface Props extends TouchableOpacityProps { // Extende as props padrão do TouchableOpacity
  titulo: string;
  carregando?: boolean;
  variante?: "primario" | "secundario" | "perigo";
}

export default function BotaoCustom({
  titulo,
  carregando = false,
  variante = "primario",
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.botao, styles[variante], rest.disabled && styles.desabilitado]}
      activeOpacity={0.8}
      {...rest}
    >
      {carregando ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <Text style={styles.texto}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  primario: {
    backgroundColor: "#E50914",
  },
  secundario: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E50914",
  },
  perigo: {
    backgroundColor: "#7B0000",
  },
  desabilitado: {
    opacity: 0.5,
  },
  texto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});