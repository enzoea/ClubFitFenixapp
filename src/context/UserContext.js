import React, { createContext, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../telas/Login';
import Cadastro from '../telas/Cadastro';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  return (
    <UserContext.Provider value={{ usuarios, setUsuarios }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login">
            {(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="Cadastro" component={Cadastro} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
