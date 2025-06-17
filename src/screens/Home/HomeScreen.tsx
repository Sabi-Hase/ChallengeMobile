import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset, User } from '../../types';
import { v4 as uuidv4 } from 'uuid';

// Props esperadas, contendo o usuário atual
type Props = { user: User };

// Tela principal onde o usuário visualiza e gerencia seus ativos
export default function HomeScreen({ user }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]); // Lista de ativos
  const [modalVisible, setModalVisible] = useState(false); // Controle do modal
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null); // Ativo sendo editado (se houver)

  // Campos do formulário de ativo
  const [name, setName] = useState('');
  const [assetClass, setAssetClass] = useState<Asset['assetClass']>('Renda Fixa');
  const [description, setDescription] = useState('');
  const [risk, setRisk] = useState<Asset['risk']>('Médio');
  const [returnRate, setReturnRate] = useState('');
  const [liquidity, setLiquidity] = useState<Asset['liquidity']>('Média');
  const [investedAmount, setInvestedAmount] = useState('');

  // Carrega os ativos do usuário ao abrir a tela
  useEffect(() => {
    (async () => {
      const key = 'assets_' + user.email;
      const json = await AsyncStorage.getItem(key);
      setAssets(json ? JSON.parse(json) : []);
    })();
  }, [user.email]);

  // Salva os ativos no AsyncStorage e atualiza estado
  const persist = async (list: Asset[], action: string) => {
    await AsyncStorage.setItem('assets_' + user.email, JSON.stringify(list));
    setAssets(list);
    Alert.alert('Sucesso', `Ativo ${action} com sucesso.`);
  };

  // Prepara o modal para adicionar novo ativo
  const openAdd = () => {
    setEditingAsset(null);
    setName('');
    setAssetClass('Renda Fixa');
    setDescription('');
    setRisk('Médio');
    setReturnRate('');
    setLiquidity('Média');
    setInvestedAmount('');
    setModalVisible(true);
  };

  // Abre o modal com o primeiro ativo para edição (atalho)
  const openEdit = () => {
    setEditingAsset(assets[0] || null);
    setModalVisible(true);
  };

  // Salva um novo ativo ou edita um existente
  const saveAsset = () => {
    if (!name || !returnRate || !investedAmount) {
      return Alert.alert('Erro', 'Preencha nome, rentabilidade e valor investido.');
    }

    const rateNum = parseFloat(returnRate);
    const amountNum = parseFloat(investedAmount);

    if (editingAsset) {
      // Atualiza o ativo existente
      const updated = assets.map(a =>
        a.id === editingAsset.id
          ? { ...editingAsset, name, assetClass, description, risk, returnRate: rateNum, liquidity, investedAmount: amountNum }
          : a
      );
      persist(updated, 'editado');
    } else {
      // Cria novo ativo
      const novo: Asset = {
        id: uuidv4(),
        name,
        assetClass,
        description,
        risk,
        returnRate: rateNum,
        liquidity,
        investedAmount: amountNum,
      };
      persist([...assets, novo], 'adicionado');
    }

    setModalVisible(false);
  };

  // Exclui um ativo da lista
  const deleteAsset = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja remover este ativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const filtered = assets.filter(a => a.id !== id);
            persist(filtered, 'removido');
          },
        },
      ]
    );
  };

  // Preenche o formulário com os dados do ativo selecionado
  const selectToEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setName(asset.name);
    setAssetClass(asset.assetClass);
    setDescription(asset.description);
    setRisk(asset.risk);
    setReturnRate(asset.returnRate.toString());
    setLiquidity(asset.liquidity);
    setInvestedAmount(asset.investedAmount.toString());
    setModalVisible(true);
  };

  // Cálculo do resumo da carteira
  const totalInvestido = assets.reduce((acc, a) => acc + (a.investedAmount || 0), 0);
  const mediaRentabilidade =
    assets.length > 0 ? assets.reduce((acc, a) => acc + (a.returnRate || 0), 0) / assets.length : 0;
  const variacaoMensal = mediaRentabilidade / 12;
  const meta = Number(user.goal) || 0;
  const progresso = meta > 0 ? (totalInvestido / meta) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Cabeçalho com saudação */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Olá, {user.name}</Text>
      </View>

      {/* Resumo da carteira de investimentos */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Resumo da Carteira</Text>
        <Text style={styles.summaryText}>💰 Total Investido: R$ {totalInvestido.toFixed(2)}</Text>
        <Text style={[styles.summaryText, { color: mediaRentabilidade >= 0 ? 'green' : 'red' }]}>
          📈 Rentabilidade Média: {mediaRentabilidade.toFixed(2)}%
        </Text>
        <Text style={styles.summaryText}>📊 Variação Mensal: {variacaoMensal.toFixed(2)}%</Text>
        {meta > 0 && (
          <>
            <Text style={styles.summaryText}>🎯 Progresso da Meta: {progresso.toFixed(1)}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(progresso, 100)}%` }]} />
            </View>
          </>
        )}
      </View>

      {/* Botões para adicionar ou editar ativos */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={openAdd}>
          <Text style={styles.buttonText}>+ Adicionar Ativo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openEdit}>
          <Text style={styles.buttonText}>✎ Editar Ativos</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de ativos cadastrados */}
      {assets.length === 0 ? (
        <Text>(Ainda sem ativos)</Text>
      ) : (
        <FlatList
          data={assets}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => selectToEdit(item)}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text>Classe: {item.assetClass}</Text>
              <Text>Risco: {item.risk}</Text>
              <Text>Rentabilidade: {item.returnRate}%</Text>
              <Text>Liquidez: {item.liquidity}</Text>
              <Text>Valor investido: R$ {item.investedAmount.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.delBtn}
                onPress={() => deleteAsset(item.id)}
              >
                <Text style={styles.delText}>Excluir</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal para adicionar/editar ativos */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>
              {editingAsset ? 'Editar Ativo' : 'Novo Ativo'}
            </Text>

            {/* Campos do formulário */}
            <Text>Nome:</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text>Classe:</Text>
            <TextInput style={styles.input} value={assetClass} onChangeText={setAssetClass} />

            <Text>Descrição:</Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} />

            <Text>Risco:</Text>
            <TextInput style={styles.input} value={risk} onChangeText={setRisk} />

            <Text>Rentabilidade (%):</Text>
            <TextInput
              style={styles.input}
              value={returnRate}
              onChangeText={setReturnRate}
              keyboardType="numeric"
            />

            <Text>Liquidez:</Text>
            <TextInput style={styles.input} value={liquidity} onChangeText={setLiquidity} />

            <Text>Valor investido (R$):</Text>
            <TextInput
              style={styles.input}
              value={investedAmount}
              onChangeText={setInvestedAmount}
              keyboardType="numeric"
            />

            {/* Botões do modal */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={saveAsset}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { backgroundColor: '#006400', padding: 10, borderRadius: 5, marginBottom: 20 },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  actions: { flexDirection: 'row', marginBottom: 15 },
  button: { backgroundColor: '#006400', padding: 10, borderRadius: 5, marginRight: 10 },
  cancelButton: { backgroundColor: '#888' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 6, elevation: 1 },
  cardTitle: { fontWeight: 'bold', marginBottom: 5 },
  delBtn: { marginTop: 8, alignSelf: 'flex-end' },
  delText: { color: '#cc0000' },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 8 },
  modalLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  summary: { marginBottom: 20, backgroundColor: '#eef', padding: 15, borderRadius: 8 },
  summaryTitle: { fontWeight: 'bold', marginBottom: 10, fontSize: 16 },
  summaryText: { fontSize: 14, marginBottom: 4 },
  progressBar: { height: 10, backgroundColor: '#ccc', borderRadius: 5, overflow: 'hidden', marginTop: 5 },
  progressFill: { height: 10, backgroundColor: '#006400' },
});
