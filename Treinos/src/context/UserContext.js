import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet } from '../lib/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const id = await AsyncStorage.getItem('usuarioId');
        if (!id) {
          console.log('Nenhum usuário encontrado no AsyncStorage');
          return;
        }
        const usuario = await apiGet(`/api/user/${id}`);
        setUsuarioLogado(usuario);
      } catch (error) {
        console.error('Erro ao carregar usuário logado:', error);
      }
    };
    carregarUsuario();
  }, []);  

  return (
    <UserContext.Provider value={{ usuarioLogado, setUsuarioLogado }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);