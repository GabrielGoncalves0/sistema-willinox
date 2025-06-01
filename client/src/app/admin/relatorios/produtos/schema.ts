import * as Yup from 'yup';

export const produtoReportFilterSchema = Yup.object().shape({
  codigo: Yup.string().optional(),
  modeloId: Yup.string().optional(),
  status: Yup.string()
    .oneOf(['ativos', 'inativos', 'todos'])
    .default('ativos'),
});

export const produtoReportFilterInitialValues: ProdutoReportFilters = {
  codigo: '',
  modeloId: '',
  status: 'ativos',
};

export interface ProdutoReportFilters {
  codigo: string;
  modeloId: string;
  status: 'ativos' | 'inativos' | 'todos';
}

export interface ProdutoReport {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  preco: number;
  qtdEstoque: number;
  modelo: {
    id: string;
    nome: string;
  };
  ativo: boolean;
}

export interface ProdutoPorModelo {
  modelo: string;
  quantidade: number;
  valorEstoque: number;
}
