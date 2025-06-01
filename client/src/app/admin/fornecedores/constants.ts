export interface CreateFornecedor {
  id?: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  tipo: 'juridica';
  cnpj: string;
  juridicaTipo: 'fornecedor';
  pessoaId?: number;
}

export interface listarFornecedor {
  id: number;
  cnpj: string;
  juridicaTipo: string;
  ativo?: boolean;
  pessoa: {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    tipo: string;
    ativo?: boolean;
  }
}

export function mapFornecedorToCreate(fornecedor: listarFornecedor): CreateFornecedor {
  return {
    cnpj: fornecedor.cnpj,
    juridicaTipo: 'fornecedor',
    pessoaId: fornecedor.pessoa.id,
    nome: fornecedor.pessoa.nome,
    endereco: fornecedor.pessoa.endereco,
    telefone: fornecedor.pessoa.telefone,
    email: fornecedor.pessoa.email,
    tipo: 'juridica'
  };
}