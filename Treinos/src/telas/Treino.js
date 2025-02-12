import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';

export default function CriarExercicio({ navigation }) {
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [series, setSeries] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [carga, setCarga] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [idFicha, setIdFicha] = useState('');  // Pode ser passado por props ou obtido dinamicamente

  // Função para salvar o exercício
  const handleSubmit = async () => {
    if (!nomeExercicio || !series || !repeticoes) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios!');
    }

    try {
      const response = await fetch('http://192.168.0.102:3000/treino', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_ficha: idFicha,
          nome_exercicio: nomeExercicio,
          series: parseInt(series),
          repeticoes: parseInt(repeticoes),
          carga: carga,
          observacoes: observacoes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message);
        navigation.goBack();  // Volta para a tela anterior
      } else {
        Alert.alert('Erro', data.error || 'Erro ao salvar o exercício');
      }
    } catch (error) {
      console.error('Erro ao salvar o exercício:', error);
      Alert.alert('Erro', 'Erro ao salvar o exercício');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Criar Novo Exercício</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Exercício"
        value={nomeExercicio}
        onChangeText={setNomeExercicio}
      />

      <TextInput
        style={styles.input}
        placeholder="Séries"
        keyboardType="numeric"
        value={series}
        onChangeText={setSeries}
      />

      <TextInput
        style={styles.input}
        placeholder="Repetições"
        keyboardType="numeric"
        value={repeticoes}
        onChangeText={setRepeticoes}
      />

      <TextInput
        style={styles.input}
        placeholder="Carga (kg)"
        value={carga}
        onChangeText={setCarga}
      />

      <TextInput
        style={styles.input}
        placeholder="Observações"
        value={observacoes}
        onChangeText={setObservacoes}
      />

      <Button title="Salvar Exercício" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
