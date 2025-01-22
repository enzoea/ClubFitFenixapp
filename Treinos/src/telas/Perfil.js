import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil() {
  const { usuarioLogado, setUsuarioLogado } = useUser();
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Carrega os dados do usuário logado
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const id = usuarioLogado?.id;
        if (!id) {
          console.error('Usuário não está logado ou ID ausente.');
          return;
        }

        const response = await fetch(`http://192.168.1.6:3000/user/${id}`);
        if (response.ok) {
          const data = await response.json();
          setDadosUsuario(data);
          setForm(data);
        } else {
          console.error('Erro ao buscar dados do usuário:', response.status);
        }
      } catch (error) {
        console.error('Erro de conexão ao buscar usuário:', error);
      }
    };

    if (usuarioLogado?.id) {
      carregarDadosUsuario();
    }
  }, [usuarioLogado]);

  const handleSalvar = async () => {
    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.1.6:3000/user/${usuarioLogado?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, senha: novaSenha || undefined }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        setEditando(false);
        setNovaSenha('');
        setConfirmarSenha('');
        const data = await response.json();
        setDadosUsuario(data);
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar os dados.');
      }
    } catch (error) {
      console.error('Erro de conexão ao atualizar dados:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.fotoPerfil}
      />
      {dadosUsuario ? (
        <View style={styles.infoContainer}>
          {['nome', 'telefone', 'email', 'dataNascimento', 'objetivo'].map((campo) => (
            <View key={campo} style={styles.fieldContainer}>
              <Text style={styles.label}>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</Text>
              {editando ? (
                <TextInput
                  style={styles.input}
                  value={form[campo] || ''}
                  onChangeText={(value) => setForm({ ...form, [campo]: value })}
                />
              ) : (
                <Text style={styles.info}>{dadosUsuario[campo] || 'Não informado'}</Text>
              )}
            </View>
          ))}
          {editando && (
            <>
              <Text style={styles.label}>Nova Senha:</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={novaSenha}
                onChangeText={setNovaSenha}
              />
              <Text style={styles.label}>Confirmar Nova Senha:</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            </>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={editando ? handleSalvar : () => setEditando(true)}
          >
            <Text style={styles.buttonText}>{editando ? 'Salvar' : 'Editar Dados'}</Text>
          </TouchableOpacity>
          {editando && (
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={() => setEditando(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text style={styles.loading}>Carregando dados...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#febc02',
    marginBottom: 20,
  },
  fotoPerfil: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#febc02',
  },
  infoContainer: {
    marginTop: 30,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#febc02',
  },
  info: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#febc02',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#febc02',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonCancel: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});
