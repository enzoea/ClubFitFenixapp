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
      <Text>Legenda: {treino.legenda}</Text>

      {/* Exibição das fotos */}
      {treino.fotos && treino.fotos.length > 0 ? (
        <View style={styles.fotosContainer}>
          {treino.fotos.map((foto, index) => (
            <Image
              key={index}
              source={{ uri: foto }}
              style={styles.foto}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.noFotosText}>Sem fotos disponíveis.</Text>
      )}

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
  fotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
  },
  noFotosText: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Post;