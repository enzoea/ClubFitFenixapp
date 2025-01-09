import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

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

  const addUsuario = async (usuario) => {
    try {
      const novosUsuarios = [...usuarios, usuario];
      setUsuarios(novosUsuarios);
      await AsyncStorage.setItem('usuarios', JSON.stringify(novosUsuarios));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        usuarios,
        addUsuario,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);