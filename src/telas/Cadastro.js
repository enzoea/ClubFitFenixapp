import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import logo from '../../assets/logo.png';
import { useUser } from '../context/UserContext';

export default function Cadastro({ navigation }) {
  const { usuarios, addUsuario } = useUser();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = () => {
    if (!nome || !email || !senha) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
  
    const novoUsuario = { nome, telefone, email, dataNascimento, objetivo, senha };
    addUsuario(novoUsuario); // Adiciona o usuário ao contexto
    alert('Usuário cadastrado com sucesso!');
    navigation.navigate('Login');
  };  

  return (
    <ImageBackground
        source={require('../../assets/background-club.png')}
        style={styles.imageBackground}
    >
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Cadastro</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#FFFFFF"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.input}
                placeholder="Telefone"
                placeholderTextColor="#FFFFFF"
                value={telefone}
                keyboardType="phone-pad"
                onChangeText={setTelefone}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#FFFFFF"
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Data de Nascimento"
                placeholderTextColor="#FFFFFF"
                value={dataNascimento}
                onChangeText={setDataNascimento}
            />
            <TextInput
                style={styles.input}
                placeholder="Objetivo na Academia (Ex.: Ganhar massa)"
                placeholderTextColor="#FFFFFF"
                value={objetivo}
                onChangeText={setObjetivo}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#FFFFFF"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />
            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                <Text style={styles.buttonText}>Cadastrar</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#ffffff',
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
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        resizeMode: 'contain',
    },
});
