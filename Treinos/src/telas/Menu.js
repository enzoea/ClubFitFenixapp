import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BarraMenu from '../componentes/BarraMenu';
import backgroundImage from '../../assets/background-club.png';
import PostHeader from '../componentes/PostHeader';
import ButtonPrimary from '../componentes/ButtonPrimary';
import EmptyState from '../componentes/EmptyState';
import { apiGet } from '../lib/api';

export default function Menu({ route, navigation }) {
  const [feedGlobal, setFeedGlobal] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('Dados no Menu:', feedGlobal);
  }, [feedGlobal]);

  const carregarFeed = async (reset = false) => {
    if (loading) return;
    try {
      setLoading(true);
      const targetPage = reset ? 1 : page;
      const data = await apiGet(`/api/trainings?page=${targetPage}&limit=${limit}`);
      console.log('✅ Dados paginados recebidos do servidor:', data);

      const newItems = Array.isArray(data?.items) ? data.items : [];
      setFeedGlobal((prev) => (reset ? newItems : [...prev, ...newItems]));
      setHasMore(Boolean(data?.hasMore));
      setPage(targetPage + 1);
    } catch (error) {
      console.error('❌ Erro ao carregar o feed:', error);
      alert('Erro ao carregar os treinos. Problema de conexão.');
    } finally {
      setLoading(false);
      if (reset) setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Resetar o feed ao focar a tela
      setFeedGlobal([]);
      setPage(1);
      setHasMore(true);
      carregarFeed(true);
    }, [])
  );

  const onEndReached = () => {
    if (hasMore && !loading) {
      carregarFeed(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setFeedGlobal([]);
    setPage(1);
    setHasMore(true);
    carregarFeed(true);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.postContainer}>
      <PostHeader nome={item.usuario} foto={item.fotoPerfil} />

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

        <ButtonPrimary
          title="Registrar Novo Treino"
          onPress={() => navigation.navigate('ControlePonto')}
          style={styles.newPostButton}
        />

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
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={() => (
            <EmptyState message="Nenhum treino disponível no momento." />
          )}
          ListFooterComponent={() => (
            loading ? <Text style={styles.noDataText}>Carregando...</Text> : (!hasMore ? <Text style={styles.noDataText}>Fim do feed</Text> : null)
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
