import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../../assets/background-club.png';
import BarraMenu from './componentes/BarraMenu';
import * as ImagePicker from 'expo-image-picker';

export default function ControlePonto({ navigation, route }) {
  const [treino, setTreino] = useState({
    tipo: '',
    inicio: null,
    fim: null,
    legenda: '',
    fotos: [], // Permitir até duas fotos
  });

  const atualizarEstado = (campo, valor) => {
    setTreino((prev) => ({ ...prev, [campo]: valor }));
  };

  const selecionarFoto = async () => {
    if (treino.fotos.length >= 2) {
      Alert.alert('Limite atingido', 'Você só pode adicionar até 2 fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      atualizarEstado('fotos', [...treino.fotos, result.assets[0].uri]);
    }
  };

  const handleIniciarTreino = async () => {
    if (!treino.tipo) {
      Alert.alert('Erro', 'Por favor, selecione a modalidade do treino antes de iniciar.');
      return;
    }
  
    atualizarEstado('inicio', new Date().toISOString());
    atualizarEstado('fim', null);
    // Remover essa linha para manter as fotos quando o treino for iniciado
    // atualizarEstado('fotos', []); 
  
    try {
      await AsyncStorage.setItem('treinoAtual', JSON.stringify(treino));
      console.log('Treino iniciado:', treino);
    } catch (error) {
      console.error('Erro ao armazenar o treino atual:', error);
    }
  };
  

  const handleFinalizarTreino = async () => {
    if (!treino.inicio || !treino.tipo) {
      Alert.alert('Erro', 'Você precisa iniciar o treino e preencher os campos necessários antes de finalizar.');
      return;
    }
  
    try {
      const usuarioId = await AsyncStorage.getItem('usuarioId');
      if (!usuarioId) {
        Alert.alert('Erro', 'ID do usuário não encontrado.');
        return;
      }
  
      const treinoFinalizado = {
        ...treino,
        usuarioId: parseInt(usuarioId, 10),
        fim: new Date().toISOString(),
      };
  
      const response = await fetch('http://192.168.100.4:3000/register-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(treinoFinalizado),
      });
  
      if (response.ok) {
        Alert.alert('Sucesso', 'Treino registrado com sucesso!');
        // Passar as fotos como parâmetro na navegação
        navigation.navigate('Menu', {
          feedAtualizado: true, // Atualizar o feed no Menu.js
          fotos: treinoFinalizado.fotos, // Passar as fotos
        });
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
          selectedValue={treino.tipo}
          style={styles.picker}
          onValueChange={(itemValue) => atualizarEstado('tipo', itemValue)}
          enabled={!treino.inicio}
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
          value={treino.legenda}
          onChangeText={(text) => atualizarEstado('legenda', text)}
        />
  
        <Text style={styles.texto}>
          {treino.inicio ? `Início: ${new Date(treino.inicio).toLocaleString()}` : 'Nenhum treino iniciado'}
        </Text>
  
        <Text style={styles.texto}>
          {treino.fim ? `Fim: ${new Date(treino.fim).toLocaleString()}` : 'Treino ainda não finalizado'}
        </Text>
  
        {/* Mapeando e exibindo as fotos lado a lado */}
        {treino.fotos.length > 0 && (
          <View style={styles.fotosContainer}>
            {treino.fotos.map((foto, index) => (
              <Image key={index} source={{ uri: foto }} style={styles.foto} />
            ))}
          </View>
        )}
  
        <TouchableOpacity style={styles.button} onPress={selecionarFoto}>
          <Text style={styles.buttonText}>Adicionar Foto ({treino.fotos.length}/2)</Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          style={styles.button}
          onPress={treino.inicio ? handleFinalizarTreino : handleIniciarTreino}
        >
          <Text style={styles.buttonText}>
            {treino.inicio ? 'Finalizar Treino' : 'Iniciar Treino'}
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
    paddingTop: 0,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  fotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  foto: {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 5,
  },
});
