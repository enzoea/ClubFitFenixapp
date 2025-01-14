import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Menu({ navigation }) {
  const [feedGlobal, setFeedGlobal] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: 'Mateus Lopes',
    profilePicture: '../../assets/logo.png', // Substitua pela URL da foto real
  });

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
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="heart-outline" size={24} color="gray" />
          <Text>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="chatbubble-outline" size={24} color="gray" />
          <Text>0</Text>
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
        {/* Barra de Menu */}
        <View style={styles.menuBar}>
          <Image source={{ uri: userProfile.profilePicture }} style={styles.profilePicture} />
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <TouchableOpacity>
            <Icon name="menu" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Feed de Treinos</Text>
        <FlatList
          data={feedGlobal}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTreino}
        />

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
  },
  container: {
    flex: 1,
    padding: 20,
  },
  menuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'black',
    padding: 15,
    width: '100%',
    top: 0,
    bottom: 0,
    left: -20,
    height: 100,
    zIndex: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 100, // Ajuste para dar espaço para a barra de menu
    textAlign: 'center',
    color: '#ffffff',
  },
  treinoContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
