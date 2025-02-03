import React, { useState, useEffect  } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import logo from '../../assets/logo.png';
import { useUser } from '../context/UserContext';

export default function Cadastro({ navigation }) {
  const { usuarios, addUsuario, setUsuarioLogado } = useUser();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [senha, setSenha] = useState('');
  const [serverIP, setServerIP] = useState(null);
  

  useEffect(() => {
    const fetchServerIP = async () => {
      try {
        const response = await fetch('http://192.168.0.102:3000/api/ip');
        const data = await response.json();
        setServerIP(data.ip);
      } catch (error) {
        console.error('Erro ao buscar o IP do servidor:', error);
      }
    };

    fetchServerIP();
  }, []);


  const handleCadastro = async () => {
    if (!nome || !email || !senha || !objetivo || !telefone || !dataNascimento) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
  //verificar o ${serverIP}, pois ele não esta armazenando na minha maquina
    try {
      const response = await fetch(`http://192.168.0.102:3000/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha, objetivo, telefone, dataNascimento }),
      });
  
      if (response.ok) {
        alert('Usuário cadastrado com sucesso!');
        navigation.navigate('Login');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Erro ao conectar ao servidor.');
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
                
                <Text style={styles.title}>Cadastro</Text>
                <Text style={styles.text}>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#febc02"
                    value={nome}
                    onChangeText={setNome}
                />
                <Text style={styles.text}>Telefone</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    placeholderTextColor="#febc02"
                    value={telefone}
                    keyboardType="phone-pad"
                    onChangeText={setTelefone}
                />
                <Text style={styles.text}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#febc02"
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={setEmail}
                />
                <Text style={styles.text}>Data de Nascimento</Text>
                <TextInput
                    style={styles.input}
                    placeholder="xx/xx/xxxx"
                    placeholderTextColor="#febc02"
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                />
                <Text style={styles.text}>Objetivos na Academia</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Ganhar massa"
                    placeholderTextColor="#febc02"
                    value={objetivo}
                    onChangeText={setObjetivo}
                />
                <Text style={styles.text}>Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#febc02"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />
                <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
// testando
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
    
    text:{
        fontSize: 16,
        color: '#febc02',
        marginBottom: 10,
    },

    input: {
        borderWidth: 1,
        borderColor: '#febc02',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        width: 300,
        color: '#ffffff',
        textAlign: 'center',
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