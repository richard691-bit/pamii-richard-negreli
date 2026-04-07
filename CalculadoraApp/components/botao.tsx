import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface BotaoProps {
  titulo: string;
  corFundo?: string;
  corTexto?: string;
  onPress: () => void;
}

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