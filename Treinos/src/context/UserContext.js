import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Recuperar usuário do AsyncStorage ao inicializar
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const id = await AsyncStorage.getItem('usuarioId');
        if (id) {
          setUsuarioLogado({ id: parseInt(id, 10) });
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
