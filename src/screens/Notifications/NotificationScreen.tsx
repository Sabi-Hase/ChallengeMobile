import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

// Define a estrutura esperada para o usuário
interface User {
  email: string;
}

// Define a estrutura de uma notificação
interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

// Props esperadas pela tela: recebe o usuário logado
type Props = {
  user: User;
};

// Tela de notificações, renderiza mensagens associadas ao usuário
export const NotificationScreen: React.FC<Props> = ({ user }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]); // Lista de notificações

  useEffect(() => {
    // Simula o carregamento de notificações relacionadas ao usuário
    const fakeData: Notification[] = [
      {
        id: 1,
        message: `Investimento atualizado para ${user.email}.`,
        timestamp: '2025-06-15',
      },
      {
        id: 2,
        message: 'Seu perfil foi atualizado com sucesso.',
        timestamp: '2025-06-14',
      },
    ];

    setNotifications(fakeData);
  }, [user.email]); // Reexecuta o efeito se o e-mail mudar

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={notifications} // Fonte de dados
        keyExtractor={(item) => item.id.toString()} // Gera chave única por item
        renderItem={({ item }) => (
          // Renderiza cada notificação
          <View style={{ marginBottom: 10 }}>
            <Text>{item.message}</Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>{item.timestamp}</Text>
          </View>
        )}
        ListEmptyComponent={
          // Caso não haja notificações
          <Text>Nenhuma notificação encontrada.</Text>
        }
      />
    </View>
  );
};
