import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import InputField from '../componentes/InputField';
import { useUser } from '../context/UserContext';
import { Picker } from '@react-native-picker/picker';
import { apiPost } from '../lib/api';


export default function CadastroProf({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [senha, setSenha] = useState('');
  const [registro, setRegistro] = useState('');
  const [profissao, setProfissao] = useState('Nutricionista');
  
  const handleCadastroProf = async () => {
    if (!nome || !email || !senha || !objetivo || !telefone || !dataNascimento || !registro || !profissao) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
  
    try {
      await apiPost('/api/prof/register', { nome, email, senha, objetivo, telefone, dataNascimento, registro, profissao });
      alert('Profissional cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Erro ao conectar ao servidor.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Cadastro Profissional</Text>
      <Text style={styles.text}>Nome</Text>
      <InputField label="Nome" style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <Text style={styles.text}>Telefone</Text>
      <InputField label="Telefone" style={styles.input} placeholder="Telefone" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
      <Text style={styles.text}>Email</Text>
      <InputField label="Email" style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Text style={styles.text}>Data de Nascimento</Text>
      <InputField label="Data de Nascimento" style={styles.input} placeholder="xx/xx/xxxx" value={dataNascimento} onChangeText={setDataNascimento} />
      <Text style={styles.text}>Objetivo na Academia</Text>
      <InputField label="Objetivo na Academia" style={styles.input} placeholder="Ex: Ajudar pacientes" value={objetivo} onChangeText={setObjetivo} />
      <Text style={styles.text}>Senha</Text>
      <InputField label="Senha" style={styles.input} placeholder="Senha" secure value={senha} onChangeText={setSenha} />
      <Text style={styles.text}>Registro Profissional</Text>
      <InputField label="Registro Profissional" style={styles.input} placeholder="CRM, CREF..." value={registro} onChangeText={setRegistro} />
      <Text style={styles.text}>Profissão</Text>
      <Picker selectedValue={profissao} onValueChange={(itemValue) => setProfissao(itemValue)} style={styles.input}>
        <Picker.Item label="Nutricionista" value="Nutricionista" />
        <Picker.Item label="Personal Trainer" value="Personal Trainer" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleCadastroProf}>
        <Text style={styles.buttonText}>Cadastrar Profissional</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  text: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#febc02', padding: 10, borderRadius: 5, marginBottom: 15, width: 300 },
  button: { backgroundColor: '#febc02', padding: 15, borderRadius: 5, alignItems: 'center', width: 300 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
