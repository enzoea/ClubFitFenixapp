import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from '../context/UserContext'; // Importa o contexto de usuário
import Icon from 'react-native-vector-icons/Ionicons'; // Ícone de envio

export default function Comentarios({ route, navigation }) {
  const { post } = route.params; // Recebe o post via navegação
  const [comentarios, setComentarios] = useState(post.comments || []); // Lista de comentários
  const [novoComentario, setNovoComentario] = useState(''); // Novo comentário
  const { usuarioLogado } = useUser(); // Acessa as informações do usuário logado
  const [feedGlobal, setFeedGlobal] = useState([]); // Adicionando o estado para feedGlobal

  useEffect(() => {
    console.log('Dados no Menu:', feedGlobal); // Verifique os dados de feedGlobal
  
    if (route.params?.feedAtualizado) {
      const fotosPassadas = route.params.fotos;
      setFeedGlobal((prevFeed) => [
        ...prevFeed,
        { fotos: fotosPassadas },
      ]);
    }
  }, [route.params?.feedAtualizado]); // O useEffect depende da atualização de feedAtualizado

  const adicionarComentario = async () => {
    if (novoComentario.trim()) {
      try {
        const response = await fetch('http://192.168.1.4:3000/comentarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            treino_id: post.id,
            usuario_id: usuarioLogado?.id,
            comentario: novoComentario,
          }),
        });

        const text = await response.text();
        console.log('Resposta do backend (texto):', text);

        try {
          const data = JSON.parse(text);

          if (!response.ok) {
            alert(`Erro ao adicionar comentário: ${data.message || 'Erro desconhecido'}`);
            return;
          }

          const novoComentarioData = {
            texto: novoComentario,
            nomeUsuario: usuarioLogado?.nome || 'Usuário Anônimo',
            fotoPerfil: usuarioLogado?.fotoPerfil,
          };

          setComentarios((prev) => [...prev, novoComentarioData]);
          setNovoComentario('');
        } catch (jsonError) {
          console.error('Erro ao analisar JSON:', jsonError);
          alert('O servidor retornou um formato inesperado.');
        }
      } catch (error) {
        console.error('Erro no fetch:', error);
        alert(`Erro ao adicionar comentário: ${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Exibição do Post */}
      <View style={styles.postContainer}>
        <Text style={styles.usuario}>{post.usuario}</Text>
        <Text style={styles.treinoDetails}>Tipo de Treino: {post.tipo}</Text>
<Text style={styles.treinoDetails}>Início: {new Date(post.inicio).toLocaleString()}</Text>
<Text style={styles.treinoDetails}>Fim: {new Date(post.fim).toLocaleString()}</Text>

        {post.imagem && <Image source={{ uri: post.imagem }} style={styles.postImage} />}
        {post.legenda && <Text style={styles.legenda}>{post.legenda}</Text>} {/* Exibe a legenda do post */}
        {Array.isArray(post.fotos) && post.fotos.length > 0 ? (
          <View style={styles.fotosContainer}>
            {post.fotos.map((foto, index) => (
              <Image
                key={index}
                source={{ uri: foto }}
                style={styles.postImage}
                onError={() => console.warn(`Erro ao carregar a imagem: ${foto}`)}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.noImageText}>Sem fotos disponíveis.</Text>
        )}
      </View>

      {/* Lista de Comentários */}
      <Text style={styles.title}>Comentários</Text>
      <FlatList
        data={comentarios}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => (
          <View style={styles.comentario}>
            <View style={styles.headerComentario}>
              <Image
                source={
                  item.fotoPerfil
                    ? { uri: item.fotoPerfil }
                    : require('../../assets/logo.png')
                }
                style={styles.fotoPerfil}
              />
              <Text style={styles.nomeUsuario}>{item.nomeUsuario}</Text>
            </View>
            <Text>{item.texto}</Text>
          </View>
        )}
      />

      {/* Campo de Digitação de Comentário */}
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
    backgroundColor: '#121212', // Fundo escuro
  },
  postContainer: {
    backgroundColor: '#1e1e1e', // Cor de fundo do post
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: '#333', // Bordas mais sutis
  },
  usuario: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff', // Texto branco para contraste
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  legenda: {
    fontStyle: 'italic',
    marginTop: 15,
    fontSize: 18,
    color: '#bbb', // Texto claro
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff', // Cor do título em branco
    marginBottom: 15,
    textAlign: 'center',
  },
  comentario: {
    padding: 15,
    backgroundColor: '#333', // Fundo escuro para o comentário
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#111',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  headerComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nomeUsuario: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff', // Nome do usuário em branco
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    backgroundColor: '#1e1e1e', // Fundo escuro no footer
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#444', // Cor de borda mais suave
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: 15,
    fontSize: 18,
    color: '#fff', // Texto claro no campo de input
  },
  sendButton: {
    backgroundColor: '#febc02',
    padding: 15,
    borderRadius: 30,
    marginLeft: 10,
    shadowColor: '#febc02',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  // Adicionando estilo para os detalhes do treino
  treinoDetails: {
    fontSize: 16,
    color: '#fff', // Cor branca para os detalhes do treino
    marginBottom: 8,
  },
});
