import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [pontos, setPontos] = useState([]);

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const usuariosSalvos = await AsyncStorage.getItem('usuarios');
        if (usuariosSalvos) {
          setUsuarios(JSON.parse(usuariosSalvos));
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };

    carregarUsuarios();
  }, []);

  const addPonto = async (descricao) => {
    try {
      const novoPonto = {
        id: Date.now().toString(),
        usuario: usuarioLogado?.nome || 'Anônimo',
        descricao,
        data: new Date().toLocaleDateString(),
      };
      const novosPontos = [...pontos, novoPonto];
      setPontos(novosPontos);
      await AsyncStorage.setItem('pontos', JSON.stringify(novosPontos));
    } catch (error) {
      console.error('Erro ao adicionar ponto:', error);
    }
  };

  const atualizarFotoPerfil = async (fotoUri) => {
    if (usuarioLogado) {
      const usuarioAtualizado = { ...usuarioLogado, fotoPerfil: fotoUri };
      setUsuarioLogado(usuarioAtualizado);

      // Atualizar a lista de usuários
      const usuariosAtualizados = usuarios.map((usuario) =>
        usuario.email === usuarioLogado.email ? usuarioAtualizado : usuario
      );
      setUsuarios(usuariosAtualizados);

      // Salvar no AsyncStorage
      try {
        await AsyncStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
      } catch (error) {
        console.error('Erro ao salvar foto no AsyncStorage:', error);
      }
    }
  };

  const addUsuario = async (usuario) => {
    try {
      const novosUsuarios = [...usuarios, usuario];
      setUsuarios(novosUsuarios);
      await AsyncStorage.setItem('usuarios', JSON.stringify(novosUsuarios));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const loginUsuario = (email, senha) => {
    const usuarioEncontrado = usuarios.find(
      (usuario) => usuario.email === email && usuario.senha === senha
    );
    if (usuarioEncontrado) {
      setUsuarioLogado(usuarioEncontrado);
      setIsAuthenticated(true);
      return true;
    } else {
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        usuarios,
        addUsuario,
        usuarioLogado,
        setUsuarioLogado,
        loginUsuario,
        pontos,
        addPonto,
        atualizarFotoPerfil,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
