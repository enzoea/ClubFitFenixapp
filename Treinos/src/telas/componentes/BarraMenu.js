import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // Importação para navegação
import { useUser } from '../../context/UserContext'; // Atualize o caminho, se necessário

const BarraMenu = () => {
  const navigation = useNavigation(); // Hook de navegação
  const { usuarioLogado } = useUser(); // Obtém o usuário logado do contexto

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        {/* Ícone do menu */}
        <TouchableOpacity onPress={() => console.log('Menu aberto')}>
          <Icon name="menu" size={28} color="white" />
        </TouchableOpacity>

        {/* Nome do usuário */}
        <Text style={styles.nomeUsuario}>
          {usuarioLogado?.nome || 'Usuário'}
        </Text>

        {/* Ícone de foto que redireciona para a página Perfil */}
        <TouchableOpacity
          style={styles.fotoContainer}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Image
            source={
              usuarioLogado?.fotoPerfil
                ? { uri: usuarioLogado.fotoPerfil }
                : require('../../../assets/logo.png') // Caminho da imagem padrão
            }
            style={styles.fotoPerfil}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  nomeUsuario: {
    color: '#febc02',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fotoContainer: {
    marginLeft: 10,
  },
  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#febc02',
  },
});

export default BarraMenu;
