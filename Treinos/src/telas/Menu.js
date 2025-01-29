import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BarraMenu from './componentes/BarraMenu';
import backgroundImage from '../../assets/background-club.png';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Menu({ route, navigation }) {
  const [feedGlobal, setFeedGlobal] = useState([]);

  // Usando useEffect para atualizar o feed com as fotos passadas de ControlePonto
  useEffect(() => {
    console.log('Dados no Menu:', feedGlobal);
    if (route.params?.feedAtualizado) {
      const fotosPassadas = route.params.fotos;
      setFeedGlobal((prevFeed) => [
        ...prevFeed,
        { fotos: fotosPassadas },
      ]);
    }
  }, [route.params?.feedAtualizado]);  // Reagindo à mudança dos parâmetros

  const carregarFeed = async () => {
    try {
      const response = await fetch('http://192.168.1.4:3000/trainings');
      const data = await response.json();
      console.log('Dados recebidos do servidor:', data); // Log para verificar o formato
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

  // Constantes para adicionar curtidas e comentários
  const handleLike = async (index) => {
    const post = feedGlobal[index];
    const usuarioId = 1;  // Aqui você deve pegar o ID do usuário logado
    
    try {
      if (post.liked) {
        // Se já está curtido, vamos remover a curtida
        await fetch(`http://192.168.1.4:3000/curtidas/${usuarioId}/${post.id}`, {
          method: 'DELETE',
        });
      } else {
        // Se não está curtido, vamos adicionar a curtida
        await fetch('http://192.168.1.4:3000/curtidas', {
          method: 'POST',
          body: JSON.stringify({
            usuario_id: usuarioId,
            treino_id: post.id,
            data_criacao: new Date(),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      // Atualizando o estado local para refletir a mudança
      const updatedFeed = [...feedGlobal];
      updatedFeed[index].liked = !updatedFeed[index].liked;
      setFeedGlobal(updatedFeed);
    } catch (error) {
      console.error('Erro ao lidar com a curtida:', error);
      alert('Erro ao curtir o post.');
    }
  };
  

  const handleComment = (index) => {
    const updatedFeed = [...feedGlobal];
    updatedFeed[index].comments = (updatedFeed[index].comments || 0) + 1;
    setFeedGlobal(updatedFeed);
    const post = feedGlobal[index];
    navigation.navigate('Comentarios', { post, index });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.postContainer}>
      {/* Cabeçalho do post (foto de perfil + nome do usuário) */}
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
  
      {/* Detalhes do treino */}
      <Text style={styles.postContent}>Treino: {item.tipo || 'Sem tipo'}</Text>
      <Text style={styles.postTimestamp}>
        Início: {item.inicio ? new Date(item.inicio).toLocaleString() : 'N/A'}
      </Text>
      <Text style={styles.postTimestamp}>
        Fim: {item.fim ? new Date(item.fim).toLocaleString() : 'N/A'}
      </Text>
      <Text style={styles.postContent}>{item.legenda || 'Sem legenda'}</Text>
  
      {/* Renderizando as fotos do treino */}
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
  
      {/* Ícones de curtidas e comentários */}
      <View style={styles.iconRow}>
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
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
    resizeMode: 'cover',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  noImageText: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  
  likeButtonText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
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
