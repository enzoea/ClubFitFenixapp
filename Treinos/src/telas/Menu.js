import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BarraMenu from './componentes/BarraMenu';
import backgroundImage from '../../assets/background-club.png';

export default function Menu({ navigation }) {
  const [feedGlobal, setFeedGlobal] = useState([]);

  const carregarFeed = async () => {
    try {
      const response = await fetch('http://192.168.100.113:3000/trainings');
      const data = await response.json();
      setFeedGlobal(data);
    } catch (error) {
      console.error('Erro ao carregar o feed:', error);
      alert('Erro ao carregar os treinos.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarFeed();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image
          source={item.fotoPerfil ? { uri: item.fotoPerfil } : require('../../assets/logo.png')}
          style={styles.userImage}
        />
        <Text style={styles.userName}>{item.usuario || 'Usuário Desconhecido'}</Text>
      </View>
      <Text style={styles.postContent}>Treino: {item.tipo || 'Sem tipo'}</Text>
      <Text style={styles.postTimestamp}>
        Início: {item.inicio ? new Date(item.inicio).toLocaleString() : 'N/A'}
      </Text>
      <Text style={styles.postTimestamp}>
        Fim: {item.fim ? new Date(item.fim).toLocaleString() : 'N/A'}
      </Text>
      <TouchableOpacity style={styles.likeButton}>
        <Text style={styles.likeButtonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.imageBackground}>
      <View style={styles.container}>
        <BarraMenu />
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => navigation.navigate('ControlePonto')}
        >
          <Text style={styles.newPostButtonText}>Registrar Novo Treino</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Feed de Treinos</Text>
        <FlatList
          data={feedGlobal}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, width: '100%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#fff' },
  postContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  userImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userName: { fontWeight: 'bold', fontSize: 16, color: '#febc02' },
  postContent: { fontSize: 14, color: '#fff', marginBottom: 5 },
  postTimestamp: { fontSize: 12, color: '#bbb', marginBottom: 10 },
  likeButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#febc02',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  likeButtonText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  newPostButton: { backgroundColor: '#febc02', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 20, margin: 15 },
  newPostButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16},
});