import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Post = ({ treino }) => {
  return (
    <View style={styles.treinoContainer}>
      <View style={styles.usuarioContainer}>
        <Image
          source={treino.fotoPerfil ? { uri: treino.fotoPerfil } : require('../../../assets/logo.png')}
          style={styles.usuarioFoto}
        />
        <Text style={styles.usuario}>{treino.usuario || 'Anônimo'}</Text>
      </View>
      <Text>Tipo de Treino: {treino.tipo}</Text>
      <Text>Início: {new Date(treino.inicio).toLocaleString()}</Text>
      <Text>Fim: {new Date(treino.fim).toLocaleString()}</Text>
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
  usuarioContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  usuarioFoto: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
  usuario: { fontWeight: 'bold', color: '#000' },
});

export default Post;
