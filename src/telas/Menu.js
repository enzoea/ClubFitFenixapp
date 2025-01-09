import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Menu({ navigation }) {
  const [feedGlobal, setFeedGlobal] = useState([]);

  useEffect(() => {
    const carregarFeed = async () => {
      try {
        const feed = JSON.parse(await AsyncStorage.getItem('feedGlobal')) || [];
        setFeedGlobal(feed);
      } catch (error) {
        console.error("Erro ao carregar o feed:", error);
      }
    };

    carregarFeed();
  }, []);

  const renderTreino = ({ item }) => (
    <View style={styles.treinoContainer}>
      <Text style={styles.usuario}>Usuário: {item.usuario}</Text>
      <Text>Tipo de Treino: {item.tipo}</Text>
      <Text>Início: {new Date(item.inicio).toLocaleString()}</Text>
      <Text>Fim: {new Date(item.fim).toLocaleString()}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/background-club.png')}
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Feed de Treinos</Text>
        <FlatList
          data={feedGlobal}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTreino}
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('ControlePonto')} // Navega para a tela de Cadastro
        >
          <Text style={styles.buttonText}>Registrar Novo Treino</Text>
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
    zIndex: 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  treinoContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  usuario: {
    fontWeight: 'bold',
    marginBottom: 5,
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
