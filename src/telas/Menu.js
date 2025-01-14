import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Menu({ navigation }) {
  const [feedGlobal, setFeedGlobal] = useState([]);

  const carregarFeed = async () => {
    try {
      const feed = JSON.parse(await AsyncStorage.getItem('feedGlobal')) || [];
      setFeedGlobal(feed);
    } catch (error) {
      console.error('Erro ao carregar o feed:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarFeed();
    }, [])
  );

  // Constantes para adicionar curtidas e comentários
  const handleLike = (index) => {
    const updatedFeed = [...feedGlobal];
    updatedFeed[index].liked = !updatedFeed[index].liked;
    setFeedGlobal(updatedFeed);
  };

  const handleComment = (index) => {
    const updatedFeed = [...feedGlobal];
    updatedFeed[index].comments = (updatedFeed[index].comments || 0) + 1;
    setFeedGlobal(updatedFeed);
  };

  const renderTreino = ({ item, index }) => (
    <View style={styles.treinoContainer}>
      <Text style={styles.usuario}>{item.usuario}</Text>
      <Text>Tipo de Treino: {item.tipo}</Text>
      <Text>Início: {new Date(item.inicio).toLocaleString()}</Text>
      <Text>Fim: {new Date(item.fim).toLocaleString()}</Text>
      {item.imagem && (
        <Image
          source={{ uri: item.imagem }}
          style={{ width: 100, height: 100, marginTop: 10 }}
        />
      )}

      {/* Botões de Interação */}
      <View style={styles.interactionContainer}>
        <TouchableOpacity onPress={() => handleLike(index)} style={styles.iconButton}>
          <Icon
            name={item.liked ? 'heart' : 'heart-outline'}
            size={24}
            color={item.liked ? 'red' : 'gray'}
          />
          <Text>{item.liked ? 1 : 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleComment(index)} style={styles.iconButton}>
          <Icon name="chatbubble-outline" size={24} color="gray" />
          <Text>{item.comments || 0}</Text>
        </TouchableOpacity>
      </View>
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
        
        {/* Botão para redirecionar para a tela de perfil */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Text style={styles.buttonText}>Ir para o Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('ControlePonto', {
              atualizarFeed: setFeedGlobal,
            })
          }
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 100,
  },
  usuario: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#febc02',
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
