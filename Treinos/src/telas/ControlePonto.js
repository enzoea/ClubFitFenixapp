import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ImageBackground, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../../assets/background-club.png';
import BarraMenu from './componentes/BarraMenu';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from "../utils/uploadImage";


export default function ControlePonto({ navigation, route }) {
  const [treino, setTreino] = useState({
    tipo: '',
    inicio: null,
    fim: null,
    legenda: '',
    fotos: [],
  });

  const atualizarEstado = (campo, valor) => {
    setTreino((prev) => ({ ...prev, [campo]: valor }));
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erro', 'Permissão para acessar a câmera é necessária.');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  };

  const handleIniciarTreino = async () => {
    if (!treino.tipo) {
      Alert.alert('Erro', 'Por favor, selecione o tipo de treino antes de iniciar.');
      return;
    }

    const foto = await tirarFoto();
    if (foto) {
      const cloudinaryUrl = await uploadImageToCloudinary(foto);
      if (cloudinaryUrl) {
        atualizarEstado('fotos', [...treino.fotos, cloudinaryUrl]);
      }
    }

    atualizarEstado('inicio', new Date().toISOString());
    atualizarEstado('fim', null);
  };

  const handleFinalizarTreino = async () => {
    if (!treino.inicio || !treino.tipo) {
      Alert.alert('Erro', 'Inicie o treino antes de finalizar.');
      return;
    }
  
    const usuarioId = await AsyncStorage.getItem('usuarioId');
    if (!usuarioId) {
      Alert.alert('Erro', 'ID do usuário não encontrado.');
      return;
    }
  
    // 🔥 Convertendo imagens locais para URLs do Cloudinary antes de salvar no banco
    const uploadedFotos = await Promise.all(
      treino.fotos.map(async (foto) => {
        if (foto.startsWith("file://")) {
          return await uploadImageToCloudinary(foto); // Enviando ao Cloudinary
        }
        return foto; // Caso já seja URL do Cloudinary, mantém a mesma
      })
    );
  
    try {
      const response = await fetch('http://192.168.100.113:3000/register-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: parseInt(usuarioId, 10),
          tipo: treino.tipo,
          inicio: new Date(treino.inicio).toISOString(),
          fim: new Date().toISOString(),
          legenda: treino.legenda,
          fotos: uploadedFotos, // 🔥 Agora somente URLs do Cloudinary são salvas
        }),
      });
  
      if (response.ok) {
        Alert.alert('Sucesso', 'Treino registrado com sucesso!');
        navigation.navigate('Menu', { feedAtualizado: true });
      } else {
        Alert.alert('Erro', 'Erro ao registrar treino.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  };  

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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

            {treino.fotos.length > 0 && (
              <View style={styles.fotosContainer}>
                {treino.fotos.map((foto, index) => (
                  <Image
                    key={index}
                    source={{ uri: foto.startsWith("http") ? foto : "https://via.placeholder.com/150" }}
                    style={styles.foto}
                  />
                ))}
              </View>
            )}

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
      </ScrollView>
    </KeyboardAvoidingView>
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
