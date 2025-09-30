// React
import React, { useState } from 'react';

// React Native
import { View, Text, TouchableOpacity, Image } from 'react-native';

// Navegação
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from './types';

// Contexto
import { useUser } from '../../context/UserContext';

// Componentes
import MenuPopup from '../MenuPopup';

// Estilos
import { styles } from './styles';

const BarraMenu: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { usuarioLogado, setUsuarioLogado } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    setUsuarioLogado(null);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuIconContainer} onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuIcon}>☰</Text>
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

export default BarraMenu;