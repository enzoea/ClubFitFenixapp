import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import MenuPopup from './MenuPopup'; // Importe o novo componente

const BarraMenu = () => {
  const navigation = useNavigation();
  const { usuarioLogado, setUsuarioLogado } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    // Limpa o estado global e redireciona para a tela de login
    setUsuarioLogado(null);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuIconContainer} onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuIcon}>☰</Text> {/* Ícone de menu simples */}
        </TouchableOpacity>
        <Text style={styles.nomeClub}>Club Fit Fênix</Text>
        <TouchableOpacity style={styles.fotoContainer} onPress={() => navigation.navigate('Perfil')}>
          <Image
            source={
              usuarioLogado?.fotoPerfil
                ? { uri: usuarioLogado.fotoPerfil }
                : require('../../../assets/logo.png')
            }
            style={styles.fotoPerfil}
          />
        </TouchableOpacity>
      </View>
      <MenuPopup
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
        onLogout={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#000', padding: 20, alignItems: 'center' },
  menu: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  menuIconContainer: { marginRight: 10 },
  menuIcon: { fontSize: 24, color: '#febc02', fontWeight: 'bold' },
  nomeClub: { color: '#febc02', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  fotoContainer: { marginLeft: 10 },
  fotoPerfil: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#febc02' },
});

export default BarraMenu;