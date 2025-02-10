import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Personal({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, Personal Trainer!</Text>
      <Text style={styles.text}>Aqui você pode criar planos de treino, acompanhar o progresso dos alunos e muito mais.</Text>

      {/* Botão para acessar alguma funcionalidade */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CriarTreino')}>
        <Text style={styles.buttonText}>Criar Plano de Treino</Text>
      </TouchableOpacity>

      {/* Botão para acessar o perfil */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Perfil')}>
        <Text style={styles.buttonText}>Ver Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#febc02', padding: 15, borderRadius: 5, marginBottom: 10, width: 250, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
