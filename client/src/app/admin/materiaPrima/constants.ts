export interface MateriaPrima {
  id: number;
  nome: string;
  descricao: string;
  qtdEstoque: number;
  unidadeMedida: string;
  preco: number;
  codigo: string;
  ativo?: boolean;
}