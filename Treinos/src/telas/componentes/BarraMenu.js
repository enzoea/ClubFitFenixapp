import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../context/UserContext'; // Atualize o caminho, se necessário

const BarraMenu = () => {
  const { usuarioLogado } = useUser(); // Obtém o usuário logado do contexto

  return (
    <View style={styles.container}>
      <Text style={styles.nomeUsuario}>
        <TouchableOpacity>
            <Icon name="menu" size={28} color="white" />
        </TouchableOpacity>
        {usuarioLogado?.nome || 'Fênix'} {/* Exibe o nome do usuário ou um texto padrão */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
    width: '100%', // Garante que ocupe toda a largura da tela
    justifyContent: 'center',
  },
  nomeUsuario: {
    color: '#febc02',
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



export default BarraMenu;
