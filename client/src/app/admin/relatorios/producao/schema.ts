import * as Yup from 'yup';

export const producaoReportFilterSchema = Yup.object().shape({
  codigo: Yup.string().optional(),
  funcionarioId: Yup.string().optional(),
  produtoId: Yup.string().optional(),
  status: Yup.string().optional(),
  dataInicio: Yup.date().nullable().optional(),
  dataFim: Yup.date().nullable().optional(),
});

export const producaoReportFilterInitialValues: ProducaoReportFilters = {
  codigo: '',
  funcionarioId: '',
  produtoId: '',
  status: '',
  dataInicio: null,
  dataFim: null,
};

export interface ProducaoReportFilters {
  codigo: string;
  funcionarioId: string;
  produtoId: string;
  status: string;
  dataInicio: Date | null;
  dataFim: Date | null;
}

export interface Funcionario {
  id: string;
  nome: string;
}

export interface Produto {
  id: string;
  nome: string;
}

export interface MateriaPrimaProducao {
  materiaPrimaId: string;
  materiaPrima?: { nome: string };
  quantidade: number;
}

export interface ProducaoReport {
  id: string;
  codigo: string;
  dataInicio: string;
  dataFim: string | null;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  quantidade: number;
  funcionario: {
    id: string;
    nome: string;
  };
  produto: {
    id: string;
    nome: string;
  };
  materiasPrimas?: MateriaPrimaProducao[];
}

export interface ProducaoAPI {
  id: number;
  fisicaId: number;
  produtoId: number;
  dataInicio?: string;
  dataFim?: string | null;
  status?: string;
  quantidade?: number;
  produto?: {
    id: number;
    nome: string;
  };
}

export const getStatusText = (status: string) => {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'em_andamento':
      return 'Em Andamento';
    case 'concluido':
      return 'Concluído';
    case 'cancelado':
      return 'Cancelado';
    default:
      return 'Desconhecido';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendente':
      return 'warning';
    case 'em_andamento':
      return 'info';
    case 'concluido':
      return 'success';
    case 'cancelado':
      return 'error';
    default:
      return 'default';
  }
};
