// React
import React from 'react';

// React Native
import { View, Text, TouchableOpacity, Linking, Modal } from 'react-native';

// Tipos
import type { MenuPopupProps } from './types';

// Estilos
import { styles } from './styles';

const MenuPopup: React.FC<MenuPopupProps> = ({ visible, onClose, navigation, onLogout }) => {
  const handleContato = () => {
    Linking.openURL('https://api.whatsapp.com/message/36VADIWV7XUWO1?autoload=1&app_absent=0');
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} disabled>
            <Text style={styles.menuItemText}>Ver fichas (em breve)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} disabled>
            <Text style={styles.menuItemText}>Ver dieta (em breve)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose();
              navigation.navigate('Perfil');
            }}
          >
            <Text style={styles.menuItemText}>Ver perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose();
              onLogout();
            }}
          >
            <Text style={styles.menuItemText}>Sair da conta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleContato}>
            <Text style={styles.menuItemText}>Entrar em contato</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MenuPopup;