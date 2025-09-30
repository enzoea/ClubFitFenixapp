import React from 'react';
import { View, Text, Image } from 'react-native';
import { useUser } from '../../context/UserContext';
import { styles } from './styles';
import type { ComentarioPerfilProps } from './types';

const ComentarioPerfil: React.FC<ComentarioPerfilProps> = ({ texto }) => {
  const { usuarioLogado } = useUser();

  return (
    <View style={styles.comentarioContainer}>
      <View style={styles.header}>
        <Image
          source={
            usuarioLogado?.fotoPerfil
              ? { uri: usuarioLogado.fotoPerfil }
              : require('../../../assets/logo.png')
          }
          style={styles.fotoPerfil}
        />
        <Text style={styles.nomeUsuario}>{usuarioLogado?.nome || 'Usuário Anônimo'}</Text>
      </View>
      <Text style={styles.textoComentario}>{texto}</Text>
    </View>
  );
};

export default ComentarioPerfil;