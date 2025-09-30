// React
import React, { useState, useEffect  } from 'react';

// React Native
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

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

// Assets
import logo from '../../assets/logo.png';

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
      await apiPost('/api/user/register', { nome, email, senha, objetivo, telefone, dataNascimento });
      alert('Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Erro ao conectar ao servidor.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background-club.png')}
      style={styles.imageBackground}
    >
      <ScreenContainer centered>
        <View style={styles.container}>
          <Title>Cadastro</Title>
          <InputField
            label="Nome"
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <InputField
            label="Telefone"
            placeholder="Telefone"
            value={telefone}
            keyboardType="phone-pad"
            onChangeText={setTelefone}
            style={styles.input}
          />
          <InputField
            label="Email"
            placeholder="Email"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            style={styles.input}
          />
          <InputField
            label="Data de Nascimento"
            placeholder="xx/xx/xxxx"
            value={dataNascimento}
            onChangeText={setDataNascimento}
            style={styles.input}
          />
          <InputField
            label="Objetivos na Academia"
            placeholder="Ex: Ganhar massa"
            value={objetivo}
            onChangeText={setObjetivo}
            style={styles.input}
          />
          <InputField
            label="Senha"
            placeholder="Senha"
            secure
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
          />
          <ButtonPrimary title="Cadastrar" onPress={handleCadastro} />
          <ButtonSecondary title="Cadastrar como Profissional" onPress={() => navigation.navigate('CadastroProf')} />
        </View>
      </ScreenContainer>
    </ImageBackground>
  );
}
// testando
const styles = StyleSheet.create({
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profButton: {
      marginTop: 10,
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#febc02',
      alignItems: 'center',
      width: 300,
    },
    profButtonText: {
      color: '#febc02',
      fontWeight: 'bold',
      fontSize: 16,
    },
    
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    // título padronizado via componente Title
    
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
    // botão primário agora via componente ButtonPrimary
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
        resizeMode: 'contain',
    },
});