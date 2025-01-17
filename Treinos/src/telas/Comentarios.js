import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from '../context/UserContext'; // Importa o contexto de usuário
import Icon from 'react-native-vector-icons/Ionicons'; // Ícone de envio

export default function Comentarios({ route, navigation }) {
  const { post, index } = route.params; // Recebe o post e índice via navegação
  const [comentarios, setComentarios] = useState(post.comments || []); // Lista de comentários
  const [novoComentario, setNovoComentario] = useState(''); // Novo comentário
  const { usuarioLogado } = useUser(); // Acessa as informações do usuário logado

  const adicionarComentario = () => {
    if (novoComentario.trim()) {
      const novoComentarioData = {
        texto: novoComentario,
        nomeUsuario: usuarioLogado?.nome || 'Usuário Anônimo',
        fotoPerfil: usuarioLogado?.fotoPerfil,
      };
      const atualizado = [...comentarios, novoComentarioData];
      setComentarios(atualizado);
      setNovoComentario('');
      // Opcional: Atualizar o post no AsyncStorage ou em outro estado global, se necessário
    }
  };

  return (
    <View style={styles.container}>
      {/* Exibição do Post */}
      <View style={styles.postContainer}>
        <Text style={styles.usuario}>{post.usuario}</Text>
        <Text>Tipo de Treino: {post.tipo}</Text>
        <Text>Início: {new Date(post.inicio).toLocaleString()}</Text>
        <Text>Fim: {new Date(post.fim).toLocaleString()}</Text>
        {post.imagem && (
          <Image source={{ uri: post.imagem }} style={styles.postImage} />
        )}
      </View>

      {/* Lista de Comentários */}
      <Text style={styles.title}>Comentários</Text>
      <FlatList
        data={comentarios}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.comentario}>
            {/* Exibe nome do usuário e foto do perfil */}
            <View style={styles.headerComentario}>
              <Image
                source={
                  item.fotoPerfil
                    ? { uri: item.fotoPerfil }
                    : require('../../assets/logo.png') // Imagem de placeholder
                }
                style={styles.fotoPerfil}
              />
              <Text style={styles.nomeUsuario}>{item.nomeUsuario}</Text>
            </View>
            {/* Exibe o texto do comentário */}
            <Text>{item.texto}</Text>
          </View>
        )}
      />

      {/* Campo de Digitação de Comentário na Parte Inferior */}
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Adicione um comentário..."
          value={novoComentario}
          onChangeText={setNovoComentario}
        />
        <TouchableOpacity onPress={adicionarComentario} style={styles.sendButton}>
          <Icon name="arrow-forward" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  postContainer: {
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  usuario: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  postImage: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  comentario: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  fotoPerfil: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  nomeUsuario: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#febc02',
    padding: 10,
    borderRadius: 50,
  },
});
