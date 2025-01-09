import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ControlePonto() {
  const [treinoTipo, setTreinoTipo] = useState('');
  const [inicioTreino, setInicioTreino] = useState(null);
  const [fimTreino, setFimTreino] = useState(null);
  const [treinosSemana, setTreinosSemana] = useState(0);
  const [treinoFinalizado, setTreinoFinalizado] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [treinoAnterior, setTreinoAnterior] = useState(null);

  useEffect(() => {
    // Carrega os treinos realizados na semana e o treino anterior
    const carregarTreinos = async () => {
      try {
        const treinosRealizados = await AsyncStorage.getItem('treinosSemana');
        const treinoAnterior = await AsyncStorage.getItem('treinoAnterior');
        
        if (treinosRealizados) {
          setTreinosSemana(JSON.parse(treinosRealizados).length);
        }

        if (treinoAnterior) {
          setTreinoAnterior(JSON.parse(treinoAnterior));
        }
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };

    carregarTreinos();
  }, []);

  const handleIniciarTreino = async () => {
    if (!treinoTipo) {
      Alert.alert('Erro', 'Por favor, selecione a modalidade do treino antes de iniciar.');
      return;
    }

    const now = new Date();
    setInicioTreino(now);
    setFimTreino(null);
    setTreinoFinalizado(false);
    setMensagem('');

    const treino = {
      tipo: treinoTipo,
      inicio: now.toISOString(),
    };

    try {
      await AsyncStorage.setItem('treinoAtual', JSON.stringify(treino));
    } catch (error) {
      console.error("Erro ao armazenar o treino atual:", error);
    }
  };

  const handleFinalizarTreino = async () => {
    const now = new Date();
    setFimTreino(now);
  
    try {
      const treino = JSON.parse(await AsyncStorage.getItem('treinoAtual'));
      treino.fim = now.toISOString();
  
      // Adicione o nome do usuário ao treino (deve ser configurado na tela de login)
      const usuarioAtual = await AsyncStorage.getItem('usuarioAtual');
      treino.usuario = usuarioAtual;
  
      // Salvar nos treinos semanais do usuário
      let treinosRealizados = JSON.parse(await AsyncStorage.getItem('treinosSemana')) || [];
      treinosRealizados.push(treino);
      await AsyncStorage.setItem('treinosSemana', JSON.stringify(treinosRealizados));
  
      // Salvar no feed global
      let feedGlobal = JSON.parse(await AsyncStorage.getItem('feedGlobal')) || [];
      feedGlobal.push(treino);
      await AsyncStorage.setItem('feedGlobal', JSON.stringify(feedGlobal));
  
      setTreinosSemana(treinosRealizados.length);
      setTreinoFinalizado(true);
      setMensagem('Treino finalizado! Ele está visível para outros usuários.');
    } catch (error) {
      console.error("Erro ao finalizar o treino:", error);
    }
  };
  

  return (
    <ImageBackground
          source={require('../../assets/background-club.png')}
          style={styles.imageBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Controle de Ponto</Text>
        <Text style={styles.title2}>Por favor, selecione a categoria do treino de hoje</Text>
        <Picker
          selectedValue={treinoTipo}
          style={styles.picker}
          onValueChange={(itemValue) => setTreinoTipo(itemValue)}>
          <Picker.Item label="Selecione o tipo de treino" value="" />
          <Picker.Item label="Academia" value="academia" />
          <Picker.Item label="Futebol" value="futebol" />
          <Picker.Item label="Natação" value="natacao" />
          <Picker.Item label="Corrida/Caminhada" value="corrida" />
          <Picker.Item label="Esporte Radical" value="esporteRadical" />
        </Picker>

        <Text style={styles.texto}>
          {inicioTreino ? `Início: ${inicioTreino.toLocaleString()}` : "Nenhum treino iniciado"}
        </Text>
        <Text style={styles.texto}>
          {fimTreino ? `Fim: ${fimTreino.toLocaleString()}` : "Treino não finalizado"}
        </Text>

        <TouchableOpacity 
          style={styles.button} 
          onPress={inicioTreino ? handleFinalizarTreino : handleIniciarTreino}
          disabled={treinoFinalizado}>
          <Text style={styles.buttonText}>
            {inicioTreino ? "Finalizar Treino" : "Iniciar Treino"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.texto}>
          {`Treinos realizados nesta semana: ${treinosSemana}`}
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff'
  },
  title2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff'
  },
  picker: {
    width: 300,
    marginBottom: 20,
    borderRadius: 5,
    color: '#000',
    elevation: 3,
  },
  texto: {
    fontSize: 16,
    marginBottom: 10,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#febc02',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: 300,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
