import AsyncStorage from '@react-native-async-storage/async-storage';

// Prefixo para evitar colisão nas chaves do AsyncStorage
const PREFIX = '@FundBuddy:';

// Função genérica para salvar um valor serializado no AsyncStorage
export async function saveItem<T>(key: string, value: T): Promise<void> {
  try {
    // Converte valor para JSON
    const json = JSON.stringify(value);
    // Salva com chave prefixada para organização
    await AsyncStorage.setItem(PREFIX + key, json);
  } catch (error) {
    // Loga erro ao salvar
    console.error('Erro ao salvar', key, error);
  }
}

// Função genérica para recuperar e desserializar valor do AsyncStorage
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    // Busca valor serializado pelo prefixo + chave
    const json = await AsyncStorage.getItem(PREFIX + key);
    // Retorna valor desserializado ou null se não existir
    return json != null ? (JSON.parse(json) as T) : null;
  } catch (error) {
    // Loga erro ao ler e retorna null
    console.error('Erro ao ler', key, error);
    return null;
  }
}
