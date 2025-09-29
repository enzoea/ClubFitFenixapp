import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    paddingVertical: 30,
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