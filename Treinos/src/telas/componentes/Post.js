import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Post = ({ treino, onLike, onComment }) => {
  return (
    <View style={styles.treinoContainer}>
      <View style={styles.usuarioContainer}>
        {treino.usuarioFoto ? (
          <Image
            source={
              treino.usuarioFoto.startsWith('http')
                ? { uri: treino.usuarioFoto }
                : require('../../../assets/exercicios/perfil.png') // Imagem local
            }
            style={styles.usuarioFoto}
          />
        ) : (
          <Text style={styles.usuario}>Sem foto</Text>
        )}
        <Text style={styles.usuario}>{treino.usuario || 'Anônimo'}</Text>
      </View>
      <Text>Tipo de Treino: {treino.tipo}</Text>
      <Text>Início: {new Date(treino.inicio).toLocaleString()}</Text>
      <Text>Fim: {new Date(treino.fim).toLocaleString()}</Text>

      <View style={styles.interactionContainer}>
        <TouchableOpacity onPress={onLike} style={styles.iconButton}>
          <Icon
            name={treino.liked ? 'heart' : 'heart-outline'}
            size={24}
            color={treino.liked ? 'red' : 'gray'}
          />
          <Text>{treino.liked ? 1 : 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onComment} style={styles.iconButton}>
          <Icon name="chatbubble-outline" size={24} color="gray" />
          <Text>{treino.comments || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  treinoContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 7,
    marginBottom: 20,
  },
  usuarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  usuarioFoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  usuario: {
    fontWeight: 'bold',
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
});

export default Post;
