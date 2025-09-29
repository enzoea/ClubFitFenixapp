import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  treinoContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 7,
    marginBottom: 20,
  },
  usuarioContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  usuarioFoto: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
  usuario: { fontWeight: 'bold', color: '#000' },
  fotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
  },
  noFotosText: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
    marginTop: 10,
  },
});