import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../context/UserContext';

export default function Perfil() {
  const { usuarioLogado } = useUser(); // Obtém o ID do usuário logado
  const [dadosUsuario, setDadosUsuario] = useState(null);

  useEffect(() => {
    // Faz a requisição para buscar os dados do usuário
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`http://192.168.100.113:3000/user/${usuarioLogado?.id}`);
        if (response.ok) {
          const data = await response.json();
          setDadosUsuario(data);
        } else {
          console.error('Erro ao buscar dados do usuário.');
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      }
    };

    if (usuarioLogado?.id) {
      fetchUsuario();
    }
  }, [usuarioLogado]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Image
        source={require('../../assets/logo.png')} // Placeholder para foto
        style={styles.fotoPerfil}
      />
      {dadosUsuario ? (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.info}>{dadosUsuario.nome}</Text>
          <Text style={styles.label}>Telefone:</Text>
          <Text style={styles.info}>{dadosUsuario.telefone || 'Não informado'}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{dadosUsuario.email}</Text>
          <Text style={styles.label}>Data de Nascimento:</Text>
          <Text style={styles.info}>{dadosUsuario.dataNascimento || 'Não informado'}</Text>
          <Text style={styles.label}>Objetivo:</Text>
          <Text style={styles.info}>{dadosUsuario.objetivo || 'Não informado'}</Text>
        </View>
      ) : (
        <Text style={styles.loading}>Carregando dados...</Text>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Fundo escuro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#febc02',
    marginBottom: 20,
  },
  subTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
  },
  fotoPerfil: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#febc02',
  },
  infoContainer: {
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#febc02',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#fff',
  },
});
