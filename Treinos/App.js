import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/telas/Login';
import Cadastro from './src/telas/Cadastro';
import Menu from './src/telas/Menu';
import ControlePonto from './src/telas/ControlePonto';
import Perfil from './src/telas/Perfil';
import Comentarios from './src/telas/Comentarios';
import ComentarioProf from './src/telas/CadastroProf';
import { UserProvider } from './src/context/UserContext';
import CadastroProf from './src/telas/CadastroProf';
import Nutricionista from './src/telas/Nutricionista';
import Personal from './src/telas/Personal';


const Stack = createStackNavigator();

export default function App() {
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
          <Stack.Screen name= "CadastroProf" component={CadastroProf} options={{title: 'CadastroProf'}} />
          <Stack.Screen name='Nutricionista' component={Nutricionista} options={{title:'Nutricionista'}} />
          <Stack.Screen name='Personal' component={Personal} options={{title: 'Personal'}} />

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
