import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import BarraMenu from './componentes/BarraMenu'; // Importa o componente BarraMenu

export default function Menu({ navigation }) {
  const [feedGlobal, setFeedGlobal] = useState([]);
  const [userProfile, setUserProfile] = useState({
    profilePicture: '',
    name: 'Usuário',
  });

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const profile = JSON.parse(await AsyncStorage.getItem('userProfile'));
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Erro ao carregar o perfil do usuário:', error);
      }
    };

    carregarPerfil();
  }, []);

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
      
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        {/* Utiliza o componente BarraMenu */}
        <BarraMenu userProfile={userProfile} />

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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10, // Ajuste para dar espaço para a barra de menu
    textAlign: 'center',
    color: 'rgb(0,0,0)',
  },
  treinoContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 7,
    marginBottom: 20,
  },
  usuario: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'rgb(0,0,0)',
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
