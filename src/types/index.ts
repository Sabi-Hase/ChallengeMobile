// Define o tipo para um ativo financeiro
export type Asset = {
  id: string; // Identificador único do ativo
  name: string; // Nome do ativo
  // Classe do ativo, podendo ser valores fixos ou outros tipos (string genérico)
  assetClass: 'Renda Fixa' | 'Renda Variável' | 'Fundo' | string;
  description: string; // Descrição detalhada do ativo
  // Grau de risco associado ao ativo
  risk: 'Baixo' | 'Médio' | 'Alto' | string;
  returnRate: number; // Taxa de retorno percentual anual
  // Grau de liquidez do ativo
  liquidity: 'Baixa' | 'Média' | 'Alta' | string;
  investedAmount: number; // Quantia investida no ativo (em moeda)
};

// Define o tipo para o usuário do sistema
export type User = {
  name: string; // Nome completo do usuário
  email: string; // Email do usuário (usado como identificador único)
  password: string; // Senha de acesso do usuário
  cpf?: string; // CPF opcional do usuário
  goal?: string; // Meta financeira opcional do usuário
  socialName?: string; // Nome social opcional do usuário (para saudação, ex.)
};
