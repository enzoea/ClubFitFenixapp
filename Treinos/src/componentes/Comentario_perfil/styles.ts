import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  comentarioContainer: {
    marginBottom: 15,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fotoPerfil: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nomeUsuario: {
    fontSize: 16,
    color: '#febc02',
    fontWeight: 'bold',
  },
  textoComentario: {
    fontSize: 14,
    color: '#fff',
  },
});