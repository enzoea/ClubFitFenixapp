// React
import React from 'react';

// React Native
import { View, Image, Text } from 'react-native';

// Estilos
import { styles } from './styles';

// Tipos
import type { PostHeaderProps } from './types';

const PostHeader: React.FC<PostHeaderProps> = ({ nome, foto }) => {
  const imageSource = foto && foto.startsWith('http') ? { uri: foto } : require('../../../assets/logo.png');

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.avatar} />
      <Text style={styles.nome}>{nome || 'Usuário Desconhecido'}</Text>
    </View>
  );
};

export default PostHeader;