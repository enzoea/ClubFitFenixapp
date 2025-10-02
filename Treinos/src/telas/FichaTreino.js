import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import backgroundImage from '../../assets/background-club.png';  // Manter o fundo de imagem que você já está usando
import { apiGet } from '../lib/api';

export default function GerenciarFichas({ navigation }) {
  const [fichas, setFichas] = useState([]);

  useEffect(() => {
    carregarFichas();
  }, []);

  const carregarFichas = async () => {
    try {
      console.log("🔄 Carregando treinos para gerenciamento...");
      const data = await apiGet('/api/trainings');
      console.log('✅ Dados paginados recebidos do servidor:', data);
      setFichas(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      console.error('❌ Erro ao carregar os treinos:', error);
      alert('Erro de conexão ao carregar os treinos.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.fichaContainer}>
      <Text style={styles.fichaTitulo}>Usuário: {item.usuario || 'Sem nome'}</Text>
      <Text style={styles.fichaData}>Tipo: {item.tipo}</Text>
      <Text style={styles.fichaData}>Início: {new Date(item.inicio).toLocaleString()}</Text>
      <Text style={styles.fichaData}>Fim: {item.fim ? new Date(item.fim).toLocaleString() : '—'}</Text>
      <Text style={styles.fichaStatus}>Legenda: {item.legenda || 'Sem legenda'}</Text>

      {item.fotos && item.fotos.length > 0 ? (
        <View style={styles.fotosContainer}>
          {item.fotos.map((foto, idx) => (
            <Image key={idx} source={{ uri: foto }} style={styles.foto} />
          ))}
        </View>
      ) : (
        <Text style={styles.noDataText}>Sem fotos disponíveis.</Text>
      )}
    </View>
  );


  return (
    <ImageBackground source={backgroundImage} style={styles.imageBackground}>
      <View style={styles.container}>
        <Text style={styles.title}>Gerenciar Fichas de Treino</Text>

        <FlatList
          data={fichas}
          keyExtractor={(item) => item.id.toString()}
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
  container: {
    flex: 1,
    width: '100%',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  fichaContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  fichaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#febc02',
  },
  fichaData: {
    fontSize: 14,
    color: '#bbb',
    marginVertical: 5,
  },
  fichaStatus: {
    fontSize: 14,
    color: '#bbb',
    marginBottom: 10,
  },
  fotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  editarButton: {
    backgroundColor: '#febc02',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  deletarButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});
