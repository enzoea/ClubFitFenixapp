import React from 'react';
import { View, Text, Image } from 'react-native';
import type { PostProps } from './types';
import { styles } from './styles';

const Post: React.FC<PostProps> = ({ treino }) => {
  return (
    <View style={styles.treinoContainer}>
      <View style={styles.usuarioContainer}>
        <Image
          source={
            treino.fotoPerfil && treino.fotoPerfil.startsWith('http')
              ? { uri: treino.fotoPerfil }
              : require('../../../assets/logo.png')
          }
          style={styles.usuarioFoto}
        />
        <Text style={styles.usuario}>{treino.usuario || 'Anônimo'}</Text>
      </View>
      <Text>Tipo de Treino: {treino.tipo}</Text>
      <Text>Início: {new Date(treino.inicio).toLocaleString()}</Text>
      <Text>Fim: {new Date(treino.fim).toLocaleString()}</Text>
      <Text>Legenda: {treino.legenda}</Text>

      {treino.fotos && treino.fotos.length > 0 ? (
        <View style={styles.fotosContainer}>
          {treino.fotos.map((foto, index) => (
              <Image
                key={index}
                source={foto.startsWith('http') ? { uri: foto } : require('../../../assets/logo.png')}
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

export default Post;