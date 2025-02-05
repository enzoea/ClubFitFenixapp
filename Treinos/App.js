import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/telas/Login';
import Cadastro from './src/telas/Cadastro';
import Menu from './src/telas/Menu';
import ControlePonto from './src/telas/ControlePonto';
import Perfil from './src/telas/Perfil';
import Comentarios from './src/telas/Comentarios';
import { UserProvider } from './src/context/UserContext';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    async function requestPermissions() {
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
      }
    }

    requestPermissions();

    // Configurar como o app lida com notificações quando está aberto
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="Menu" component={Menu} options={{ title: 'Menu' }} />
          <Stack.Screen name="ControlePonto" component={ControlePonto} options={{ title: 'Controle de Ponto' }} />
          <Stack.Screen name="Perfil" component={Perfil} options={{ title: 'Perfil' }} />
          <Stack.Screen name="Comentarios" component={Comentarios} options={{ title: 'Comentarios' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
