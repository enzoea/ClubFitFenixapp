import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Modal } from 'react-native';

const MenuPopup = ({ visible, onClose, navigation, onLogout }) => {
  const handleContato = () => {
    Linking.openURL('https://api.whatsapp.com/message/36VADIWV7XUWO1?autoload=1&app_absent=0');
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  menuContainer: {
    backgroundColor: '#1c1c1c',
    height: '100%',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 100,
    right: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#febc02',
    fontWeight: 'bold',
  },
  menuItem: {
    paddingVertical:30,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  menuItemText: {
    fontSize: 16,
    color: '#febc02',
    textAlign: 'left',
  },
});

export default MenuPopup;
