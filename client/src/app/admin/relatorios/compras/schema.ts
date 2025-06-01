import * as Yup from 'yup';

export const compraReportFilterSchema = Yup.object().shape({
  codigo: Yup.string().optional(),
  fornecedorId: Yup.string().optional(),
  status: Yup.string().optional(),
  dataInicio: Yup.date().nullable().optional(),
  dataFim: Yup.date().nullable().optional(),
});

export const compraReportFilterInitialValues: CompraReportFilters = {
  codigo: '',
  fornecedorId: '',
  status: '',
  dataInicio: null,
  dataFim: null,
};

export interface CompraReportFilters {
  codigo: string;
  fornecedorId: string;
  status: string;
  dataInicio: Date | null;
  dataFim: Date | null;
}

export interface Fornecedor {
  id: string;
  nome: string;
}

export interface MateriaPrima {
  id: string;
  nome: string;
}

export interface ItemCompra {
  id: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  materiaPrima: {
    id: string;
    nome: string;
  };
}

export interface Compra {
  id: string;
  codigo: string;
  data: string;
  status: string;
  valorTotal: number;
  fornecedor: {
    id: string;
    nome: string;
  };
  itens: ItemCompra[];
}

export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pendente':
      return 'Pendente';
    case 'processando':
      return 'Processando';
    case 'concluido':
      return 'Concluído';
    case 'cancelado':
      return 'Cancelado';
    default:
      return 'Desconhecido';
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pendente':
      return 'warning';
    case 'processando':
      return 'info';
    case 'concluido':
      return 'success';
    case 'cancelado':
      return 'error';
    default:
      return 'default';
  }
};
