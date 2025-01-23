import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../../assets/background-club.png';
import BarraMenu from './componentes/BarraMenu';

export default function ControlePonto({ navigation, route }) {
  const [treinoTipo, setTreinoTipo] = useState('');
  const [inicioTreino, setInicioTreino] = useState(null);
  const [fimTreino, setFimTreino] = useState(null);
  const [treinoFinalizado, setTreinoFinalizado] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [legenda, setLegenda] = useState(''); // Novo estado para a legenda
  const { atualizarFeed } = route.params || {}; // Recebe o callback para atualizar o feed

  const handleIniciarTreino = async () => {
    if (!treinoTipo) {
      Alert.alert('Erro', 'Por favor, selecione a modalidade do treino antes de iniciar.');
      return;
    }

    const now = new Date();
    setInicioTreino(now); // Atualiza o estado local
    setFimTreino(null);
    setTreinoFinalizado(false);
    setMensagem('');

    const treino = {
      tipo: treinoTipo,
      inicio: now.toISOString(),
      legenda: legenda // Inclui a legenda no objeto de treino
    };

    try {
      await AsyncStorage.setItem('treinoAtual', JSON.stringify(treino));
      console.log('Treino iniciado e salvo:', treino);
    } catch (error) {
      console.error('Erro ao armazenar o treino atual:', error);
    }
  };

  const handleFinalizarTreino = async () => {
    if (!inicioTreino || !treinoTipo) {
      alert('Preencha todos os campos do treino.');
      return;
    }

    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) {
        alert('Erro: ID do usuário não encontrado.');
        return;
      }

      const treino = {
        usuarioId: parseInt(usuarioId, 10),
        tipo: treinoTipo,
        inicio: inicioTreino.toISOString(),
        fim: new Date().toISOString(),
        legenda: legenda
      };

      const response = await fetch('http://192.168.100.4:3000/register-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treino),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Treino finalizado e registrado com sucesso!');
        navigation.goBack();
      } else {
        const error = await response.json();
        Alert.alert('Erro', error.error || 'Erro ao registrar treino.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.imageBackground}>
      <View style={styles.container}>
        <BarraMenu style={styles.barraMenu} />
        <Text style={styles.title}>Registro de treino</Text>
        <Picker
          selectedValue={treinoTipo}
          style={styles.picker}
          onValueChange={(itemValue) => setTreinoTipo(itemValue)}
          enabled={!inicioTreino}
        >
          <Picker.Item label="Selecione o tipo de treino" value="" />
          <Picker.Item label="Academia" value="academia" />
          <Picker.Item label="Futebol" value="futebol" />
          <Picker.Item label="Natação" value="natacao" />
          <Picker.Item label="Corrida/Caminhada" value="corrida" />
          <Picker.Item label="Esporte Radical" value="esporteRadical" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Escreva uma legenda sobre o treino"
          value={legenda}
          onChangeText={setLegenda} // Atualiza a legenda conforme o usuário digita
        />

        <Text style={styles.texto}>
          {inicioTreino ? `Início: ${inicioTreino.toLocaleString()}` : 'Nenhum treino iniciado'}
        </Text>

        <Text style={styles.texto}>
          {legenda ? `Legenda: ${legenda}` : 'Nenhuma legenda para este treino'}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={inicioTreino ? handleFinalizarTreino : handleIniciarTreino}
          disabled={treinoFinalizado}
        >
          <Text style={styles.buttonText}>
            {inicioTreino ? 'Finalizar Treino' : 'Iniciar Treino'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0, // Ajusta o espaçamento superior
    paddingHorizontal: 0,
  },
  barraMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#febc02',
    marginBottom: 30,
    textAlign: 'center',
  },
  picker: {
    width: 300,
    marginBottom: 20,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro para o Picker
  },
  input: {
    width: 300,
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro para o Input
  },
  texto: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#febc02',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: 300,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
