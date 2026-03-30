import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';

interface BotaoProps {
  titulo: string;
  corFundo?: string;
  corTexto?: string;
  largo?: boolean;
}

export default function Index() {
  const [expressao, setExpressao] = useState<string>('');
  const [resultado, setResultado] = useState<string>('0');
  const [calculado, setCalculado] = useState<boolean>(false);

  const operadores = ['+', '-', 'x', '÷', '.'];

  const linhasDeBotoes = [
    ['C', '(', ')', '÷'],
    ['7', '8', '9', 'x'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '='],
  ];

  const obterCorFundo = (botao: string): string => {
    if (botao === 'C') return '#ff3b30';
    if (botao === '=') return '#34c759';
    if (['+', 'x', '-', '÷'].includes(botao)) return '#ff9500';
    if (['(', ')', '⌫'].includes(botao)) return '#555555';
    return '#333333';
  };

  const obterTamanhoFonte = (texto: string): number => {
    if (texto.length > 12) return 36;
    if (texto.length > 9) return 48;
    return 68;
  };

  const lidarComToque = (valor: string): void => {
    if (valor === 'C') {
      setExpressao('');
      setResultado('0');
      setCalculado(false);
    } else if (valor === '⌫') {
      if (calculado) {
        setExpressao('');
        setResultado('0');
        setCalculado(false);
        return;
      }
      const novaExpressao = expressao.slice(0, -1);
      setExpressao(novaExpressao);
      setResultado(novaExpressao.length > 0 ? novaExpressao : '0');
    } else if (valor === '=') {
      try {
        const expressaoFormatada = expressao.replace(/x/g, '*').replace(/÷/g, '/');
        let resultadoCalculado = eval(expressaoFormatada);
        resultadoCalculado = Math.round(resultadoCalculado * 1e10) / 1e10;
        setResultado(String(resultadoCalculado));
        setExpressao(String(resultadoCalculado));
        setCalculado(true);
      } catch (e) {
        setResultado('Erro');
      }
    } else {
      if (calculado && !operadores.includes(valor)) {
        setExpressao(valor);
        setResultado(valor);
        setCalculado(false);
        return;
      }
      setCalculado(false);

      if (operadores.includes(valor)) {
        if (expressao === '' && valor !== '-') return;
        const ultimoCaractere = expressao.slice(-1);
        if (operadores.includes(ultimoCaractere)) {
          const novaExpressao = expressao.slice(0, -1) + valor;
          setExpressao(novaExpressao);
          setResultado(novaExpressao);
          return;
        }
      }

      const novaExpressao = expressao + valor;
      setExpressao(novaExpressao);
      setResultado(novaExpressao);
    }
  };

  const Botao: React.FC<BotaoProps> = ({ titulo, corFundo = '#333333', corTexto = '#ffffff' }) => (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: corFundo }]}
      onPress={() => lidarComToque(titulo)}
      activeOpacity={0.6}
    >
      <Text style={[styles.textoBotao, { color: corTexto }]}>{titulo}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.displayContainer}>
        {expressao !== '' && expressao !== resultado && (
          <Text style={styles.textoExpressao} numberOfLines={1} adjustsFontSizeToFit>
            {expressao}
          </Text>
        )}
        <Text
          style={[styles.textoDisplay, { fontSize: obterTamanhoFonte(resultado) }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.4}
        >
          {resultado}
        </Text>
      </View>

      <View style={styles.tecladoContainer}>
        {linhasDeBotoes.map((linha, indexLinha) => (
          <View key={indexLinha} style={styles.linha}>
            {linha.map((botao) => (
              <Botao
                key={botao}
                titulo={botao}
                corFundo={obterCorFundo(botao)}
              />
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  textoExpressao: {
    fontSize: 22,
    color: '#888888',
    fontWeight: '300',
    marginBottom: 4,
  },
  textoDisplay: {
    color: '#ffffff',
    fontWeight: '200',
    letterSpacing: -2,
  },
  tecladoContainer: {
    paddingBottom: 32,
    paddingHorizontal: 12,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  botao: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 30,
    fontWeight: '400',
  },
});