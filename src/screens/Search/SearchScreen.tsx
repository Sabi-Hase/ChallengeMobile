import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types'; // importa o tipo User do módulo de tipos

interface Investment {
  id: number;      // Identificador único do investimento
  name: string;    // Nome do investimento
  amount: number;  // Quantidade/investimento aplicado
}

type Props = {
  user: User;      // Usuário atual logado
};

export const SearchScreen: React.FC<Props> = ({ user }) => {
  // Estado da query de busca
  const [query, setQuery] = useState('');
  // Lista completa de investimentos carregada do storage
  const [investments, setInvestments] = useState<Investment[]>([]);
  // Lista filtrada conforme busca
  const [filtered, setFiltered] = useState<Investment[]>([]);

  // Carrega investimentos armazenados ao montar o componente ou trocar usuário
  useEffect(() => {
    (async () => {
      const key = `investments_${user.email}`; // Chave específica para o usuário
      const json = await AsyncStorage.getItem(key);
      const invs: Investment[] = json ? JSON.parse(json) : [];
      setInvestments(invs); // Salva lista completa
      setFiltered(invs);    // Inicializa lista filtrada com todos
    })();
  }, [user.email]);

  // Atualiza a lista filtrada sempre que a query ou os investimentos mudam
  useEffect(() => {
    const f = investments.filter(i =>
      i.name.toLowerCase().includes(query.toLowerCase()) // Busca case insensitive
    );
    setFiltered(f);
  }, [query, investments]);

  return (
    <View style={styles.container}>
      {/* Input de busca */}
      <TextInput
        placeholder="Buscar investimento"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />
      {/* Lista de investimentos filtrados */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Quantidade: {item.amount}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum ativo encontrado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  name: { fontWeight: 'bold' }
});
