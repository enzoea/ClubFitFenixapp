import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
/*import { launchCamera, launchImageLibrary } from 'react-native-image-picker';*/

export default function ControlePonto({ navigation, route }) {
  const [treinoTipo, setTreinoTipo] = useState('');
  const [inicioTreino, setInicioTreino] = useState(null);
  const [fimTreino, setFimTreino] = useState(null);
  /*const [imagem, setImagem] = useState(null); // Estado para armazenar a imagem*/
  const [treinosSemana, setTreinosSemana] = useState(0);
  const [treinoFinalizado, setTreinoFinalizado] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [treinoAnterior, setTreinoAnterior] = useState(null);
  const { atualizarFeed } = route.params || {}; // Recebe o callback para atualizar o feed

  useEffect(() => {
    const carregarTreinos = async () => {
      try {
        const treinoAtual = JSON.parse(await AsyncStorage.getItem('treinoAtual'));
        const treinosRealizados = await AsyncStorage.getItem('treinosSemana');
        const treinoAnterior = await AsyncStorage.getItem('treinoAnterior');

        if (treinoAtual && !treinoAtual.fim) {
          setInicioTreino(new Date(treinoAtual.inicio));
          setTreinoTipo(treinoAtual.tipo);
        }

        if (treinosRealizados) {
          setTreinosSemana(JSON.parse(treinosRealizados).length);
        }

        if (treinoAnterior) {
          setTreinoAnterior(JSON.parse(treinoAnterior));
        }
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
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
      console.error('Erro ao armazenar o treino atual:', error);
    }
  };

  // função da imagem
  /*const handleSelecionarImagem = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('Usuário cancelou a seleção de imagem');
        } else if (response.errorCode) {
          console.error(`Erro (${response.errorCode}): ${response.errorMessage}`);
          Alert.alert('Erro', 'Não foi possível acessar a galeria. Verifique as permissões.');
        } else if (response.assets && response.assets.length > 0) {
          const source = { uri: response.assets[0].uri };
          setImagem(source); // Salva a URI da imagem no estado
          console.log('Imagem selecionada:', source);
        } else {
          console.error('Nenhuma imagem retornada');
        }
      }
    );
  };*/
  


  const handleFinalizarTreino = async () => {
    const now = new Date();
    setFimTreino(now);

    try {
      const treino = JSON.parse(await AsyncStorage.getItem('treinoAtual'));
      treino.fim = now.toISOString();
      treino.imagem = imagem?.uri; // Adiciona a imagem ao treino

      const usuarioAtual = await AsyncStorage.getItem('usuarioLogado');
      treino.usuario = usuarioAtual;

      let treinosRealizados = JSON.parse(await AsyncStorage.getItem('treinosSemana')) || [];
      treinosRealizados.push(treino);
      await AsyncStorage.setItem('treinosSemana', JSON.stringify(treinosRealizados));

      let feedGlobal = JSON.parse(await AsyncStorage.getItem('feedGlobal')) || [];
      feedGlobal.push(treino);
      await AsyncStorage.setItem('feedGlobal', JSON.stringify(feedGlobal));

      setTreinosSemana(treinosRealizados.length);
      setTreinoFinalizado(true);
      setMensagem('Treino finalizado! Ele está visível para outros usuários.');

      await AsyncStorage.removeItem('treinoAtual'); // Remove o treino atual ao finalizar

      if (atualizarFeed) {
        atualizarFeed(feedGlobal); // Atualiza o feed no Menu
      }

      navigation.goBack(); // Retorna ao menu após finalizar o treino
    } catch (error) {
      console.error('Erro ao finalizar o treino:', error);
    }
  };

  return (
    <ImageBackground
      
      style={styles.imageBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Controle de Ponto</Text>
        <Text style={styles.title2}>Por favor, selecione a categoria do treino de hoje</Text>
        {/*<TouchableOpacity style={styles.button} onPress={handleSelecionarImagem}>
        <Text style={styles.buttonText}>
          {imagem ? 'Alterar Imagem' : 'Adicionar Imagem'}
        </Text>
      </TouchableOpacity>*/}

      {/*{imagem && (
        <Image source={imagem} style={{ width: 100, height: 100, marginBottom: 20 }} />
      )}*/}
        <Picker
          selectedValue={treinoTipo}
          style={styles.picker}
          onValueChange={(itemValue) => setTreinoTipo(itemValue)}
          enabled={!inicioTreino} // Desativa o Picker se o treino já foi iniciado
        >
          <Picker.Item label="Selecione o tipo de treino" value="" />
          <Picker.Item label="Academia" value="academia" />
          <Picker.Item label="Futebol" value="futebol" />
          <Picker.Item label="Natação" value="natacao" />
          <Picker.Item label="Corrida/Caminhada" value="corrida" />
          <Picker.Item label="Esporte Radical" value="esporteRadical" />
        </Picker>
        

        <Text style={styles.texto}>
          {inicioTreino ? `Início: ${inicioTreino.toLocaleString()}` : 'Nenhum treino iniciado'}
        </Text>
        <Text style={styles.texto}>
          {fimTreino ? `Fim: ${fimTreino.toLocaleString()}` : 'Treino não finalizado'}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={inicioTreino ? handleFinalizarTreino : handleIniciarTreino}
          disabled={treinoFinalizado}
        >
          <Text style={styles.buttonText}>
            {inicioTreino ? 'Finalizar Treino' : 'Iniciar Treino'}
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
    zIndex: 0,
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
    color: '#rgb(0,0,0)',
  },
  title2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#rgb(0,0,0)',
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
    color: '#rgb(0,0,0)',
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
    color: '#rgb(0,0,0)',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
