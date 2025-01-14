import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useUser } from '../context/UserContext'; // Assumindo que o contexto de usuário está configurado

export default function Perfil() {
  const { usuarioLogado } = useUser(); // Obtém os dados do usuário logado
  const [fotoPerfil, setFotoPerfil] = useState(null); // Estado para a foto do perfil
  const { atualizarFotoPerfil } = useUser();

const selecionarImagem = () => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      quality: 1,
    },
    (response) => {
      if (response.didCancel) {
        console.log('Seleção de imagem cancelada.');
      } else if (response.errorMessage) {
        console.error('Erro ao selecionar imagem:', response.errorMessage);
      } else {
        const { uri } = response.assets[0];
        setFotoPerfil(uri);
        atualizarFotoPerfil(uri); // Atualiza a foto no contexto
      }
    }
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {/* Exibe a foto de perfil ou um placeholder */}
      <TouchableOpacity onPress={selecionarImagem}>
        <Image
          source={
            fotoPerfil
              ? { uri: fotoPerfil }
              : require('../../assets/logo.png') // Substitua pelo caminho do placeholder
          }
          style={styles.fotoPerfil}
        />
      </TouchableOpacity>
      <Text style={styles.subTitle}>Toque na imagem para alterar</Text>

      {/* Exibição dos dados do usuário */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.info}>{usuarioLogado?.nome || 'Não informado'}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.info}>{usuarioLogado?.telefone || 'Não informado'}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{usuarioLogado?.email || 'Não informado'}</Text>

        <Text style={styles.label}>Data de Nascimento:</Text>
        <Text style={styles.info}>{usuarioLogado?.dataNascimento || 'Não informado'}</Text>

        <Text style={styles.label}>Objetivo:</Text>
        <Text style={styles.info}>{usuarioLogado?.objetivo || 'Não informado'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Fundo escuro para combinar com o tema
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#febc02',
    marginBottom: 20,
  },
  subTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
  },
  fotoPerfil: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#febc02',
  },
  infoContainer: {
    marginTop: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#febc02',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    color: '#fff',
  },
});
