export interface Pessoa {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    tipo: 'fisica' | 'juridica';
}

export interface PessoaFisica extends Pessoa {
    fisicaId: number;
    cpf: string;
    dataNascimento: string;
    fisicaTipo: 'cliente' | 'funcionario';
    login?: string;
    senha?: string;
  }