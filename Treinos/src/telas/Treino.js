import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, Alert } from 'react-native';
import InputField from '../componentes/InputField';
import { apiPost } from '../lib/api';

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
      const data = await apiPost('/api/treino', {
        id_ficha: idFicha,
        nome_exercicio: nomeExercicio,
        series: parseInt(series),
        repeticoes: parseInt(repeticoes),
        carga: carga,
        observacoes: observacoes,
      });
      Alert.alert('Sucesso', data.message || 'Treino salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar o exercício:', error);
      Alert.alert('Erro', 'Erro ao salvar o exercício');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Criar Novo Exercício</Text>

      <InputField
        label="Nome do Exercício"
        style={styles.input}
        placeholder="Nome do Exercício"
        value={nomeExercicio}
        onChangeText={setNomeExercicio}
      />

      <InputField
        label="Séries"
        style={styles.input}
        placeholder="Séries"
        keyboardType="numeric"
        value={series}
        onChangeText={setSeries}
      />

      <InputField
        label="Repetições"
        style={styles.input}
        placeholder="Repetições"
        keyboardType="numeric"
        value={repeticoes}
        onChangeText={setRepeticoes}
      />

      <InputField
        label="Carga (kg)"
        style={styles.input}
        placeholder="Carga (kg)"
        value={carga}
        onChangeText={setCarga}
      />

      <InputField
        label="Observações"
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
