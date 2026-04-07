import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
// criado a função botão para chamar sempre que precisar



interface BotaoProps {
  titulo: string;
  corFundo?: string;
  corTexto?: string;
  onPress: () => void;
}
// aqui são as funções e caracteristicas do botão
export default function Botao({ titulo, corFundo = '#333333', corTexto = '#ffffff', onPress }: BotaoProps) {
  return (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: corFundo }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text style={[styles.textoBotao, { color: corTexto }]}>{titulo}</Text>
    </TouchableOpacity>
  );
}
// estilo do botão
const styles = StyleSheet.create({
  botao: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 30,
    fontWeight: '400',
  },
});