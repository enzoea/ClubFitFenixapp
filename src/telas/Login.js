import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import logo from '../../assets/logo.png';
import { useUser } from '../context/UserContext';

export default function Login({ setIsAuthenticated, navigation }) {
  const { usuarios } = useUser(); // Obtém a lista de usuários do contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const emailFixo = "teste";
    const senhaFixa = "1234";

    // Verifica credenciais fixas
    if (email === emailFixo && password === senhaFixa) {
      setIsAuthenticated(true);
      alert("Login realizado com sucesso!");
      navigation.navigate("Menu");
      return;
    }

    // Verifica credenciais de usuários cadastrados
    const usuarioEncontrado = usuarios.find(
      (usuario) => usuario.email === email && usuario.senha === password
    );

    if (usuarioEncontrado) {
      setIsAuthenticated(true);
      alert("Login realizado com sucesso!");
      navigation.navigate("Menu");
    } else {
      alert("Credenciais inválidas!");
    }
  };


  return (
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
          value={password}
          onChangeText={setPassword}
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
    width:300,
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
    width:300,
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
