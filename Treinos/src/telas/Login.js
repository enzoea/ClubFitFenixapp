import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground,  KeyboardAvoidingView, Alert, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../assets/logo.png';
import { useUser } from '../context/UserContext';

export default function Login({ navigation }) {
  const { setUsuarioLogado } = useUser();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
  
    try {
      console.log('Enviando para o servidor:', { email, senha }); // Log para depuração
      const response = await fetch('http://192.168.100.113:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
  
      if (response.ok) {
        const usuario = await response.json();
        console.log('Usuário autenticado:', usuario); // Log para verificar o retorno
        await AsyncStorage.setItem('usuarioId', usuario.id.toString());
        setUsuarioLogado(usuario);
        navigation.navigate('Menu');
      } else {
        const errorResponse = await response.json();
        console.error('Erro do servidor:', errorResponse); // Log para verificar o erro
        Alert.alert('Erro', errorResponse.error || 'Credenciais inválidas.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  };  

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        
          <ImageBackground
            source={require('../../assets/background-club.png')}
            style={styles.imageBackground}
          >
            <View style={styles.container}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.title}>Bem-vindo ao Club Fit Fênix</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#FFFFFF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#FFFFFF"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.button2}
                onPress={() => navigation.navigate('Cadastro', { usuarios: [] })}
              >
                <Text style={styles.buttonText2}>Registrar-se</Text>
              </TouchableOpacity>

              <Text style={styles.credit}>Desenvolvido por Enzo Martins</Text>
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff'
  },
  credit: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#aaaaaa'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: 300,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#febc02',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: 300,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button2: {
    borderColor: '#febc02',
    borderWidth: 2,
    padding: 15,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 5,
    alignItems: 'center',
    width: 300,
  },
  buttonText2: {
    color: '#febc02',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});