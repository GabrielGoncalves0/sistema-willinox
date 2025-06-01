import { FormatDate } from "@/utils/formatDate";

export interface CreateFuncionario {
  id?: number;
  cpf: string;
  dataNascimento?: string;
  tipo: 'fisica';
  fisicaTipo: 'funcionario';
  pessoaId?: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  login?: string;
  senha?: string;
}

export interface listarFuncionario {
  id: number;
  cpf: string;
  dataNascimento?: string;
  tipo: string
  fisicaTipo: string;
  login: string;
  senha: string;
  ativo?: boolean;
  pessoa: {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    ativo?: boolean;
  }
}

export function mapFuncionarioToCreate(funcionario: listarFuncionario): CreateFuncionario {
  return {
    cpf: funcionario.cpf,
    tipo: 'fisica',
    fisicaTipo: 'funcionario',
    pessoaId: funcionario.pessoa.id,
    nome: funcionario.pessoa.nome,
    endereco: funcionario.pessoa.endereco,
    telefone: funcionario.pessoa.telefone,
    email: funcionario.pessoa.email,
    login: funcionario.login,
    senha: funcionario.senha,
    dataNascimento: funcionario.dataNascimento
      ? FormatDate.dateISO(funcionario.dataNascimento)
      : undefined
  };
}