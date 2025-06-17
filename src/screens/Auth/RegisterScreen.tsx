import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface User { name: string; email: string; password: string; goal?: string; }
type AuthStackParamList = { Login: undefined; Register: undefined };
type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
  setUser: (u: User) => void;
};

export default function RegisterScreen({ navigation, setUser }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    try {
      const json = await AsyncStorage.getItem('users');
      const users: User[] = json ? JSON.parse(json) : [];
      if (users.find(u => u.email === email)) {
        Alert.alert('Erro', 'Email já cadastrado.');
        return;
      }
      const newUser: User = { name, email, password, goal: '' };
      const updated = [...users, newUser];
      await AsyncStorage.setItem('users', JSON.stringify(updated));
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Registro falhou', error);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:20 }}>
      <Text>Nome:</Text>
      <TextInput
        style={{borderWidth:1, marginBottom:10, padding:5}}
        value={name}
        onChangeText={setName}
      />
      <Text>Email:</Text>
      <TextInput
        style={{borderWidth:1, marginBottom:10, padding:5}}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Text>Senha:</Text>
      <TextInput
        style={{borderWidth:1, marginBottom:10, padding:5}}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={{ backgroundColor:'#006400', padding:10, alignItems:'center' }}
        onPress={handleRegister}
      >
        <Text style={{color:'#fff'}}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ marginTop: 15, textAlign:'center' }}>
          Já tem conta? Faça login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
