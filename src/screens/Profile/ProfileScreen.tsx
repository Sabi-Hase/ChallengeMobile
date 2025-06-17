import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types'; // importa o tipo User do módulo de tipos

type Props = {
  user: User;                  // Usuário atual logado
  setUser: (u: User | null) => void; // Função para atualizar o usuário no contexto/app
};

export default function ProfileScreen({ user, setUser }: Props) {
  // Estado para controlar modo de edição
  const [editing, setEditing] = useState(false);

  // Estados para campos editáveis
  const [name, setName] = useState(user.name);
  const [goal, setGoal] = useState(user.goal || '');

  // Alterna entre modo edição e visualização
  const toggleEditing = () => setEditing(!editing);

  // Salva os dados atualizados no AsyncStorage e atualiza contexto global
  const handleSave = async () => {
    try {
      const updatedUser: User = { ...user, name, goal };

      // Atualiza usuário corrente no AsyncStorage
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));

      // Atualiza lista completa de usuários armazenados
      const json = await AsyncStorage.getItem('users');
      let users: User[] = json ? JSON.parse(json) : [];
      users = users.map(u => (u.email === user.email ? updatedUser : u));
      await AsyncStorage.setItem('users', JSON.stringify(users));

      setUser(updatedUser);   // Atualiza estado global do usuário
      setEditing(false);      // Sai do modo edição
      Alert.alert('Sucesso', 'Dados pessoais atualizados.');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar alterações.');
    }
  };

  // Função para deslogar usuário, removendo dados do AsyncStorage
  const logout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setUser(null);           // Remove usuário do contexto/global state
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Dados Pessoais</Text>

      <Text style={styles.label}>Nome completo:</Text>
      {editing ? (
        // Campo editável para nome
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      ) : (
        // Exibição estática do nome
        <Text style={styles.value}>{name}</Text>
      )}

      <Text style={styles.label}>E-mail (não editável):</Text>
      <Text style={styles.value}>{user.email}</Text> {/* Email sempre só leitura */}

      <Text style={styles.label}>Objetivo de Investimento:</Text>
      {editing ? (
        // Campo editável para meta de investimento
        <TextInput
          style={styles.input}
          value={goal}
          onChangeText={setGoal}
          placeholder="Valor alvo em R$"
          keyboardType="numeric"
        />
      ) : (
        // Exibição estática da meta ou mensagem padrão
        <Text style={styles.value}>{goal || 'Não definido'}</Text>
      )}

      {editing ? (
        // Botão para salvar alterações
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar alterações</Text>
        </TouchableOpacity>
      ) : (
        // Botão para entrar no modo edição
        <TouchableOpacity style={styles.editBtn} onPress={toggleEditing}>
          <Text style={styles.buttonText}>Editar dados</Text>
        </TouchableOpacity>
      )}

      {/* Botão para deslogar o usuário */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.buttonText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, padding: 20 },
  sectionTitle:  { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  label:         { fontWeight: '600', marginTop: 15 },
  value:         { marginTop: 5, fontSize: 16 },
  input:         {
    borderWidth: 1, borderColor: '#ccc',
    padding: 8, borderRadius: 5, marginTop: 5
  },
  editBtn:       {
    backgroundColor: '#006400',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center'
  },
  saveBtn:       {
    backgroundColor: '#006400',
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center'
  },
  logoutBtn:     {
    backgroundColor: '#cc0000',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center'
  },
  buttonText:    { color: '#fff', fontWeight: 'bold' }
});
