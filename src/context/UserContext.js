import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token); // Autenticado se existir um token
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }
  };

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, checkAuthentication }}>
      {children}
    </UserContext.Provider>
  );
};


// Ele esta definindo e gerenciando o contexto de usuario para autentiação no app do react
// o "UserProvider" envolve o aplicativo, fornecendo funções comom login, logout, checkAuthentication, e o estado isAuthenticates
//O AsyncStorage é usado para armazenar o teken de autenticação no disposito, permitindo persistir o estado do usuario mesmo que ele feche o app