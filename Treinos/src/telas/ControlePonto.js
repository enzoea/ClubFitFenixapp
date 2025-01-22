import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../../assets/background-club.png';

export default function ControlePonto({ navigation, route }) {
  const [treinoTipo, setTreinoTipo] = useState('');
  const [inicioTreino, setInicioTreino] = useState(null);
  const [fimTreino, setFimTreino] = useState(null);
  const [treinoFinalizado, setTreinoFinalizado] = useState(false);
  const [mensagem, setMensagem] = useState('');
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
    };
  
    try {
      await AsyncStorage.setItem('treinoAtual', JSON.stringify(treino));
      console.log('Treino iniciado e salvo:', treino); // Log para depuração
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
      console.log('ID do Usuário Recuperado:', usuarioId); // Log para depuração
  
      if (!usuarioId) {
        alert('Erro: ID do usuário não encontrado.');
        return;
      }
  
      const treino = {
        usuarioId: parseInt(usuarioId, 10), // Garante que o ID seja um número
        tipo: treinoTipo,
        inicio: inicioTreino.toISOString(), // Converte para string ISO
        fim: new Date().toISOString(), // Converte para string ISO
      };
  
      console.log('Dados Enviados:', treino);
  
      const response = await fetch('http://192.168.1.6:3000/register-training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(treino), // Envia os dados como JSON
      });
  
      if (response.ok) {
        //alert('Treino registrado com sucesso!');
        navigation.goBack();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao registrar treino.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Erro ao conectar ao servidor.');
    }
  };
  
  
  return (
    <ImageBackground source={backgroundImage} style={styles.imageBackground}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro de treino</Text>
        <Picker
          selectedValue={treinoTipo}
          style={styles.picker}
          onValueChange={(itemValue) => setTreinoTipo(itemValue)}
          enabled={!inicioTreino} // Desativa o Picker se o treino já foi iniciado
        >
          <Picker.Item label="Selecione o tipo de treino" value="" />
          <Picker.Item label="Academia" value="academia" />
          <Picker.Item label="Futebol" value="futebol" />
          <Picker.Item label="Natação" value="natacao" />
          <Picker.Item label="Corrida/Caminhada" value="corrida" />
          <Picker.Item label="Esporte Radical" value="esporteRadical" />
        </Picker>

        <Text style={styles.texto}>
          {inicioTreino ? `Início: ${inicioTreino.toLocaleString()}` : 'Nenhum treino iniciado'}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#febc02',
  },
  picker: {
    width: 300,
    marginBottom: 20,
    borderRadius: 5,
    color: '#fff',
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