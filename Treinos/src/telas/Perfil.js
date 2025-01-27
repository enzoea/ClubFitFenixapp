import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useUser } from '../context/UserContext';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil({ navigation }) {
  const { usuarioLogado, setUsuarioLogado } = useUser();
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const formatarDataParaUsuario = (data) => {
    if (!data) return '';
    const dataAjustada = data.split('T')[0];
    const [ano, mes, dia] = dataAjustada.split('-');
    return `${dia}${mes}${ano}`;
  };

  const formatarDataParaBanco = (data) => {
    if (!data) return '';
    return data.replace(/(\d{2})(\d{2})(\d{4})/, '$3-$2-$1');
  };

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const id = usuarioLogado?.id;
        if (!id) {
          console.error('Usuário não está logado ou ID ausente.');
          return;
        }

        const response = await fetch(`http://192.168.100.2:3000/user/${id}`);
        if (response.ok) {
          const data = await response.json();
          data.dataNascimento = formatarDataParaUsuario(data.dataNascimento);
          setDadosUsuario(data);
          setForm(data);
          setFotoPerfil(data.fotoPerfil);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioId'); // Remove o ID do AsyncStorage
      setUsuarioLogado(null); // Reseta o estado global
      navigation.navigate('Login'); // Redireciona para a página de login
    } catch (error) {
      console.error('Erro ao deslogar:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  const handleEscolherFoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para alterar a foto.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setFotoPerfil(pickerResult.assets[0].uri);
    }
  };

  const handleSalvar = async () => {
    if (novaSenha && novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    const dataFormatada = formatarDataParaBanco(form.dataNascimento);

    const dadosParaAtualizar = {
      nome: form.nome,
      email: form.email,
      senha: novaSenha || form.senha,
      objetivo: form.objetivo,
      telefone: form.telefone,
      dataNascimento: dataFormatada,
      fotoPerfil,
    };

    console.log('Enviando dados para o backend:', dadosParaAtualizar);

    try {
      const response = await fetch(`http://192.168.100.2:3000/user/${usuarioLogado?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaAtualizar),
      });

      if (response.ok) {
        const data = await response.json();
        data.dataNascimento = formatarDataParaUsuario(data.dataNascimento);
        setDadosUsuario(data);
        setUsuarioLogado(data); // Atualiza o estado global
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        setEditando(false);
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        const errorResponse = await response.json();
        Alert.alert('Erro', errorResponse.error || 'Não foi possível atualizar os dados.');
      }
    } catch (error) {
      console.error('Erro de conexão ao atualizar dados:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Perfil</Text>
          <TouchableOpacity onPress={handleEscolherFoto}>
            <Image
              source={fotoPerfil ? { uri: fotoPerfil } : require('../../assets/logo.png')}
              style={styles.fotoPerfil}
            />
          </TouchableOpacity>
          {dadosUsuario ? (
            <View style={styles.infoContainer}>
              {['nome', 'telefone', 'email', 'dataNascimento', 'objetivo'].map((campo) => (
                <View key={campo} style={styles.fieldContainer}>
                  <Text style={styles.label}>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</Text>
                  {editando ? (
                    <TextInput
                      style={styles.input}
                      value={form[campo] || ''}
                      onChangeText={(value) =>
                        setForm({
                          ...form,
                          [campo]: campo === 'dataNascimento' ? value.replace(/\D/g, '') : value,
                        })
                      }
                      keyboardType={campo === 'dataNascimento' ? 'numeric' : 'default'}
                    />
                  ) : (
                    <Text style={styles.info}>
                      {campo === 'dataNascimento' ? form[campo] : dadosUsuario[campo] || 'Não informado'}
                    </Text>
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
                <TouchableOpacity style={styles.buttonCancel} onPress={() => setEditando(false)}>
                  <Text style={styles.buttonText2}>Cancelar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.loading}>Carregando dados...</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#febc02', marginBottom: 20 },
  fotoPerfil: { width: 150, height: 150, borderRadius: 75, alignSelf: 'center', borderWidth: 2, borderColor: '#febc02' },
  infoContainer: { marginTop: 30 },
  fieldContainer: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#febc02' },
  info: { fontSize: 16, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#febc02', backgroundColor: '#1c1c1c', borderRadius: 5, padding: 10, fontSize: 16, color: '#fff' },
  button: { backgroundColor: '#febc02', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  buttonCancel: { borderColor: '#febc02', borderWidth: 2, padding: 15, marginTop: 16, marginBottom: 32, borderRadius: 5, alignItems: 'center' },
  logoutButton: { borderColor: '#febc02', borderWidth: 2, padding: 15, marginTop: 16, marginBottom: 32, borderRadius: 5, alignItems: 'center', },
  logoutButtonText: { color: '#febc02', fontSize: 16, fontWeight: 'bold' },
  buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  buttonText2: { color: '#febc02', fontSize: 16, fontWeight: 'bold' },
  loading: { color: '#fff', textAlign: 'center', marginTop: 20 },
});
