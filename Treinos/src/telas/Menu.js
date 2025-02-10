import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BarraMenu from './componentes/BarraMenu';
import backgroundImage from '../../assets/background-club.png';

export default function Menu({ route, navigation }) {
  const [feedGlobal, setFeedGlobal] = useState([]);

  useEffect(() => {
    console.log('Dados no Menu:', feedGlobal);
    if (route.params?.feedAtualizado) {
      const fotosPassadas = route.params.fotos;
      setFeedGlobal((prevFeed) => [
        ...prevFeed,
        { fotos: fotosPassadas },
      ]);
    }
  }, [route.params?.feedAtualizado]);

  const carregarFeed = async () => {
    try {
      console.log("🔄 Solicitando treinos do servidor...");
      const response = await fetch('http://192.168.0.102:3000/trainings');
  
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        console.error(`❌ Erro HTTP: ${response.status} - ${response.statusText}`);
        alert(`Erro ao carregar os treinos: ${response.statusText}`);
        return;
      }
  
      // Obtém a resposta como texto para depuração
      const text = await response.text();
      console.log("📡 Resposta bruta do servidor:", text);
  
      // Tenta converter para JSON
      try {
        const data = JSON.parse(text);
        console.log('✅ Dados recebidos do servidor:', data);
        setFeedGlobal(data);
      } catch (jsonError) {
        console.error('❌ Erro ao analisar JSON:', jsonError);
        console.error('🚨 Resposta completa do servidor:', text);
        alert('Erro ao carregar os treinos. A resposta do servidor não é um JSON válido.');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar o feed:', error);
      alert('Erro ao carregar os treinos. Problema de conexão.');
    }
  };  

  useFocusEffect(
    React.useCallback(() => {
      carregarFeed();
    }, [])
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image
          source={
            item.fotoPerfil && item.fotoPerfil.startsWith("http")
              ? { uri: item.fotoPerfil }
              : require('../../assets/logo.png')
          }
          style={styles.userImage}
          onError={() => console.warn(`Erro ao carregar foto de perfil: ${item.fotoPerfil}`)}
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
      <Text style={styles.postContent}>{item.legenda || 'Sem legenda'}</Text>

      {item.fotos && Array.isArray(item.fotos) && item.fotos.length > 0 ? (
        <View style={styles.fotosContainer}>
          {item.fotos.map((foto, i) => (
            <Image
              key={i}
              source={{ uri: foto }}
              style={styles.postImage}
              onError={() => console.warn(`Erro ao carregar imagem: ${foto}`)}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.noImageText}>Sem fotos disponíveis.</Text>
      )}
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

        {/* Botões para as telas Nutricionista e Personal */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Nutricionista')}
          >
            <Text style={styles.buttonText}>Nutricionista</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Personal')}
          >
            <Text style={styles.buttonText}>Personal</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Feed de Treinos</Text>
        <FlatList
          data={feedGlobal}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text style={styles.noDataText}>Nenhum treino disponível no momento.</Text>
          )}
        />
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
  container: { flex: 1, width: '100%' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#febc02',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
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
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  newPostButton: {
    backgroundColor: '#febc02',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    margin: 15,
  },
  newPostButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
