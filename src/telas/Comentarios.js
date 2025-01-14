import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function Comentarios({ route, navigation }) {
  const { post, index } = route.params; // Recebe o post e índice via navegação
  const [comentarios, setComentarios] = useState(post.comments || []); // Lista de comentários
  const [novoComentario, setNovoComentario] = useState(''); // Novo comentário

  const adicionarComentario = () => {
    if (novoComentario.trim()) {
      setComentarios([...comentarios, novoComentario]);
      setNovoComentario('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentários</Text>
      <FlatList
        data={comentarios}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.comentario}>
            <Text>{item}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicione um comentário..."
          value={novoComentario}
          onChangeText={setNovoComentario}
        />
        <TouchableOpacity style={styles.button} onPress={adicionarComentario}>
          <Text style={styles.buttonText}>Enviar</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#febc02',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
