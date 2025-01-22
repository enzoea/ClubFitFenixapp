import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const id = await AsyncStorage.getItem('usuarioId');
        if (id) {
          const response = await fetch(`http://192.168.100.113:3000/user/${id}`);
          if (response.ok) {
            const usuario = await response.json();
            setUsuarioLogado(usuario);
          } else {
            console.error('Erro ao carregar dados do usuário:', response.status);
          }
        }
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