import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/HomeScreen';
import { SearchScreen } from '../screens/Search/SearchScreen';
import { NotificationScreen } from '../screens/Notifications/NotificationScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// Interface que representa o usuário logado
interface User {
  name: string;
  email: string;
  password: string;
  goal?: string;
  socialName?: string;
}

// Props esperadas pelo componente de navegação principal
type Props = {
  user: User;
  setUser: (u: User | null) => void;
};

// Tipos das rotas do Tab Navigator (nenhuma recebe parâmetros)
type TabParamList = {
  Início: undefined;
  Busca: undefined;
  Notificações: undefined;
  Perfil: undefined;
};

// Criação do Tab Navigator
const Tab = createBottomTabNavigator<TabParamList>();

// Componente que define a navegação principal com abas inferiores
export default function AppNavigator({ user, setUser }: Props) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Exibe ou oculta o cabeçalho dependendo da rota
        headerShown: route.name !== 'Início',
        tabBarActiveTintColor: '#006400', // Cor do ícone ativo
        tabBarInactiveTintColor: 'gray',  // Cor do ícone inativo
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        },
        tabBarLabelStyle: { fontSize: 12 },
        // Define ícones diferentes para cada rota
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';

          switch (route.name) {
            case 'Início':
              iconName = 'home';
              break;
            case 'Busca':
              iconName = 'search';
              break;
            case 'Notificações':
              iconName = 'notifications';
              break;
            case 'Perfil':
              iconName = 'person';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Tela inicial (Home), recebe o usuário como prop */}
      <Tab.Screen
        name="Início"
        children={() => <HomeScreen user={user} />}
        options={{ headerTitle: `Olá, ${user.socialName || user.name}` }}
      />

      {/* Tela de busca de investimentos */}
      <Tab.Screen
        name="Busca"
        children={() => <SearchScreen user={user} />}
      />

      {/* Tela de notificações */}
      <Tab.Screen
        name="Notificações"
        children={() => <NotificationScreen user={user} />}
      />

      {/* Tela de perfil, com função de logout (usa setUser) */}
      <Tab.Screen
        name="Perfil"
        children={() => <ProfileScreen user={user} setUser={setUser} />}
      />
    </Tab.Navigator>
  );
}
