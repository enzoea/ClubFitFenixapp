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
      setFeedGlobal(feed.reverse());
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
      <View style={styles.user}>
        <Image 
          source={require('../../assets/logo.png')} // Imagem local
          style={styles.image}
        />
        <Text style={styles.usuario}>{item.usuario}</Text>
      </View>
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
    
      <View style={styles.container}>
        {/* Utiliza o componente BarraMenu */}
        <BarraMenu userProfile={userProfile} />
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('ControlePonto', {
              atualizarFeed: (novoFeed) => setFeedGlobal([novoFeed, ...feedGlobal]),
            })
          }          
        >
          <Text style={styles.buttonText}>Registrar Novo Treino</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Feed de Treinos</Text>

        <FlatList
          data={feedGlobal}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTreino}
          style={styles.cardTreino}
        />

        
      </View>
  );
}

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row', // Alinha os itens na horizontal
    alignItems: 'center', // Centraliza verticalmente
    marginBottom: 10, // Espaçamento inferior
  },
  image: {
    width: 50, // Ajuste o tamanho da imagem
    height: 50,
    borderRadius: 25, // Deixa a imagem redonda
    marginRight: 10, // Espaço entre a imagem e o texto
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    color: 'rgb(0,0,0)',
  },
  treinoContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 7,
    marginBottom: 20,
    width: '100%', // Faz com que ocupe toda a largura da tela
    alignSelf: 'center', // Centraliza o container se houver margens externas
  },
  usuario: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgb(0,0,0)',
  },
  interactionContainer: {
    flexDirection: 'row',
    gap: 16,
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
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardTreino: {
    marginHorizontal: 16,
  },
  
});