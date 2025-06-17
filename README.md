# FundBuddy

> Link para o Figma: [https://www.figma.com/design/3S2MKz3NNgusdgv2woXvq0/ChallengeMobile?node-id=0-1&t=FWsevRYAZ5WJ2eXM-1]

FundBuddy é um aplicativo mobile de gerenciamento de investimentos pessoais, desenvolvido como parte de um projeto interdisciplinar. Ele permite que usuários cadastrem, editem e visualizem seus ativos, acompanhem o progresso de sua meta financeira e recebam notificações relacionadas à sua carteira.

---

## Funcionalidades

- Registro e login de usuários com persistência local
- Adição, edição e remoção de ativos financeiros
- Resumo da carteira com total investido, rentabilidade média e progresso da meta
- Notificações personalizadas
- Perfil com edição de dados pessoais e definição de objetivo financeiro
- Interface responsiva e intuitiva

---

## Tecnologias Utilizadas

- React Native
- TypeScript
- AsyncStorage
- React Navigation
- Expo
- UUID (para identificação única dos ativos)

---

## Estrutura de Navegação

- Login/Register: acesso e criação de conta
- Início: resumo da carteira e lista de ativos
- Busca: interface para funcionalidades futuras de pesquisa
- Notificações: exibe notificações relevantes do usuário
- Perfil: permite editar nome e objetivo, além de fazer logout

---

## Organização do Código

```
src/
├── navigation/        # Configuração das rotas (tab navigation)
├── screens/           # Telas separadas por funcionalidade
│   ├── Auth/          # Telas de Login e Registro
│   ├── Home/          # Tela principal com os ativos
│   ├── Notifications/ # Tela de notificações
│   ├── Profile/       # Tela de perfil do usuário
│   └── Search/        # Tela de busca (estrutura pronta)
├── types.ts           # Tipagens globais (User, Asset)
```

---

## Armazenamento Local

Todos os dados são armazenados usando @react-native-async-storage/async-storage. O usuário atual é salvo com a chave `currentUser` e seus ativos são armazenados sob `assets_<email_do_usuário>`.

---

## Objetivos do Projeto

- Aplicar conceitos de armazenamento local em apps mobile
- Praticar navegação entre telas com dados persistentes
- Simular uma aplicação real de gerenciamento de finanças pessoais

---

## Integrantes

- Octávio Hernandez Chiste Cordeiro – RM 97894
- Rafael Perussi Caczan – RM 93092
- Sabrina Flores Varela de Morais – RM 550781

---

## Observações

Este projeto é puramente educacional e não representa uma aplicação de investimentos real. Todos os dados são fictícios e armazenados localmente no dispositivo.
