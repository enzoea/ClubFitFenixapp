import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import BarraMenu from './componentes/BarraMenu';
import Post from './componentes/Post';

export default function Menu({ navigation }) {
  const [feedGlobal, setFeedGlobal] = useState([]);

  const carregarFeed = async () => {
    try {
      const response = await fetch('http://<IP_DO_SERVIDOR>:3000/trainings'); // Substitua pelo IP do servidor
      const data = await response.json();
      setFeedGlobal(data);
    } catch (error) {
      console.error('Erro ao carregar o feed:', error);
    }
  };

  useEffect(() => {
    carregarFeed();
  }, []);

  const handleLike = (index) => {
    const updatedFeed = [...feedGlobal];
    updatedFeed[index].liked = !updatedFeed[index].liked;
    setFeedGlobal(updatedFeed);
  };

  const handleComment = (index) => {
    const post = feedGlobal[index];
    navigation.navigate('Comentarios', { post, index });
  };

  return (
    <ImageBackground style={styles.imageBackground}>
      <View style={styles.container}>
        <BarraMenu />
        <Text style={styles.title}>Feed de Treinos</Text>
        <FlatList
          data={feedGlobal}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Post
              treino={item}
              onLike={() => handleLike(index)}
              onComment={() => handleComment(index)}
            />
          )}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ControlePonto')}
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
    marginVertical: 10,
    textAlign: 'center',
    color: 'rgb(0,0,0)',
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
