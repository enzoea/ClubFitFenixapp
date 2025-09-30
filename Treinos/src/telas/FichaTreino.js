import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import backgroundImage from '../../assets/background-club.png';  // Manter o fundo de imagem que você já está usando
import { apiGet, apiDelete } from '../lib/api';

export default function GerenciarFichas({ navigation }) {
  const [fichas, setFichas] = useState([]);

  useEffect(() => {
    carregarFichas();
  }, []);

  const carregarFichas = async () => {
    try {
      console.log("🔄 Carregando fichas de treino...");
      const data = await apiGet('/fichas');
      console.log('✅ Fichas recebidas:', data);
      setFichas(data);
    } catch (error) {
      console.error('❌ Erro ao carregar as fichas:', error);
      alert('Erro de conexão ao carregar as fichas.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.fichaContainer}>
      <Text style={styles.fichaTitulo}>Objetivo: {item.objetivo || 'Sem objetivo definido'}</Text>
      <Text style={styles.fichaData}>Criado em: {new Date(item.criado_em).toLocaleString()}</Text>
      <Text style={styles.fichaStatus}>Status: {item.status === 'ativa' ? 'Ativa' : 'Inativa'}</Text>

      <TouchableOpacity
        style={styles.editarButton}
        onPress={() => navigation.navigate('EditarFicha', { fichaId: item.id })}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deletarButton}
        onPress={() => excluirFicha(item.id)}
      >
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  const excluirFicha = async (id) => {
    try {
      await apiDelete(`/fichas/${id}`);
      setFichas(fichas.filter(ficha => ficha.id !== id));
      alert('Ficha excluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao excluir ficha:', error);
      alert('Erro de conexão ao excluir a ficha.');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.imageBackground}>
      <View style={styles.container}>
        <Text style={styles.title}>Gerenciar Fichas de Treino</Text>

        <FlatList
          data={fichas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text style={styles.noDataText}>Nenhuma ficha disponível no momento.</Text>
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
