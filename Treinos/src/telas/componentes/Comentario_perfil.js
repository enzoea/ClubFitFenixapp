import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useUser } from '../../context/UserContext'; // Importa o contexto de usuário

export default function Comentario({ texto }) {
  const { usuarioLogado } = useUser(); // Pega as informações do usuário logado

  return (
    <View style={styles.comentarioContainer}>
      <View style={styles.header}>
        {/* Exibe a foto de perfil do usuário logado */}
        <Image
          source={
            usuarioLogado?.fotoPerfil
              ? { uri: usuarioLogado.fotoPerfil }
              : require('../../../assets/logo.png') // Imagem de placeholder
          }
          style={styles.fotoPerfil}
        />
        <Text style={styles.nomeUsuario}>
          {usuarioLogado?.nome || 'Usuário Anônimo'}
        </Text>
      </View>
      {/* Exibe o texto do comentário */}
      <Text style={styles.textoComentario}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  comentarioContainer: {
    marginBottom: 15,
    backgroundColor: '#333', // Cor de fundo do comentário
    borderRadius: 8,
    padding: 10,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nomeUsuario: {
    fontSize: 16,
    color: '#febc02',
    fontWeight: 'bold',
  },
  textoComentario: {
    fontSize: 14,
    color: '#fff',
  },
});
