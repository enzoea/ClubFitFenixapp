// React
import React, { useState, useEffect } from 'react';

// React Native
import { View, Text, Image, StyleSheet, ImageBackground, Alert } from 'react-native';

// Componentes
import InputField from '../componentes/InputField';
import ScreenContainer from '../componentes/ScreenContainer';
import Title from '../componentes/Title';
import ButtonPrimary from '../componentes/ButtonPrimary';
import ButtonSecondary from '../componentes/ButtonSecondary';

// Contexto
import { useUser } from '../context/UserContext';

// Utils / API
import { apiPost } from '../lib/api';

// Terceiros
import AsyncStorage from '@react-native-async-storage/async-storage';

// Assets
import logo from '../../assets/logo.png';

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
      console.log('Enviando para o servidor:', { email, senha });
      const usuario = await apiPost('/api/user/login', { email, senha });
      console.log('Usuário autenticado:', usuario);
      await AsyncStorage.setItem('usuarioId', usuario.user.id.toString());
      if (usuario?.token) {
        await AsyncStorage.setItem('token', usuario.token);
      }
      setUsuarioLogado(usuario);

      // Verificar o tipo de usuário e navegar para a tela correspondente
      if (usuario.profissao === 'Nutricionista') {
        navigation.navigate('Nutricionista');
      } else if (usuario.profissao === 'Personal Trainer') {
        navigation.navigate('Personal');
      } else {
        navigation.navigate('Menu');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    }
  };
  

  return (
    <ImageBackground
      source={require('../../assets/background-club.png')}
      style={styles.imageBackground}
    >
      <ScreenContainer centered>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          <Title>Club Fit Fênix</Title>
          <InputField
            label="Email"
            placeholder="Email"
            placeholderTextColor="#FFFFFF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <InputField
            label="Senha"
            placeholder="Senha"
            placeholderTextColor="#FFFFFF"
            secure
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
          />
          <ButtonPrimary title="Entrar" onPress={handleLogin} />
          <ButtonSecondary title="Não tenho uma conta" onPress={() => navigation.navigate('Cadastro', { usuarios: [] })} />
          <Text style={styles.credit}>Desenvolvido por Enzo Martins</Text>
        </View>
      </ScreenContainer>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  // title movido para componente Title
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
    marginBottom: 5,
    width: 300,
    color: '#ffffff',
  },
  // botões substituídos por componentes ButtonPrimary/Secondary
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
});