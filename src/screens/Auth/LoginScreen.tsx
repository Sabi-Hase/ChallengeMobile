import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Interface que representa os dados do usuário
interface User {
  name: string;
  email: string;
  password: string;
  goal?: string;
}

// Tipos das rotas da pilha de autenticação
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Props esperadas pela tela de login
type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  setUser: (u: User) => void;
};

// Tela de login que permite ao usuário acessar sua conta
export default function LoginScreen({ navigation, setUser }: Props) {
  // Estado para armazenar os dados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Função que verifica as credenciais e realiza o login
  const handleLogin = async () => {
    try {
      // Recupera todos os usuários do AsyncStorage
      const json = await AsyncStorage.getItem('users');
      const users: User[] = json ? JSON.parse(json) : [];

      // Busca usuário com e-mail e senha correspondentes
      const found = users.find(u => u.email === email && u.password === password);

      if (found) {
        // Armazena usuário logado e atualiza o estado global
        await AsyncStorage.setItem('currentUser', JSON.stringify(found));
        setUser(found);
      } else {
        // Alerta em caso de falha de autenticação
        Alert.alert('Erro', 'Usuário ou senha inválidos.');
      }
    } catch (error) {
      console.error('Login falhou', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      {/* Campo de e-mail */}
      <Text>Email:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo de senha */}
      <Text>Senha:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Botão de login */}
      <TouchableOpacity
        style={{ backgroundColor: '#006400', padding: 10, alignItems: 'center' }}
        onPress={handleLogin}
      >
        <Text style={{ color: '#fff' }}>Entrar</Text>
      </TouchableOpacity>

      {/* Link para a tela de cadastro */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={{ marginTop: 15, textAlign: 'center' }}>
          Ainda não tem conta? Cadastre-se
        </Text>
      </TouchableOpacity>
    </View>
  );
}
