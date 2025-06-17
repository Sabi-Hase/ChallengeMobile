// App.tsx – Componente raiz que gerencia a autenticação e navegação principal
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';

// Definição do tipo User com campos necessários
interface User { name: string; email: string; password: string; goal?: string; }

// Cria pilha de navegação nativa
const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User|null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega usuário salvo no AsyncStorage ao iniciar o app
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('currentUser');
        if (json) setUser(JSON.parse(json)); // Atualiza estado se usuário existe
      } catch (error) {
        console.error('Erro ao carregar usuário', error);
      }
      setIsLoading(false); // Indica fim do carregamento
    })();
  }, []);

  // Exibe indicador de carregamento enquanto busca usuário
  if (isLoading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // Container principal da navegação
    <NavigationContainer>
      {user ? (
        // Usuário logado: mostra a navegação de abas principal
        <MainTabs user={user} setUser={setUser} />
      ) : (
        // Usuário não logado: mostra pilha com telas de autenticação
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ title: 'Entrar' }}>
            {props => <LoginScreen {...props} setUser={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="Register" options={{ title: 'Registrar' }}>
            {props => <RegisterScreen {...props} setUser={setUser} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
