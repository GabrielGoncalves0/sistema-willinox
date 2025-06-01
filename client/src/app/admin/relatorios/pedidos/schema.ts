import * as Yup from 'yup';
import { PedidoStatus } from '../../pedidos/constants';

export const pedidoReportFilterSchema = Yup.object().shape({
  clienteId: Yup.string().optional(),
  status: Yup.string().optional(),
  dataInicio: Yup.date().nullable().optional(),
  dataFim: Yup.date().nullable().optional(),
});

export const pedidoReportFilterInitialValues: PedidoReportFilters = {
  clienteId: '',
  status: '',
  dataInicio: null,
  dataFim: null,
};

export interface PedidoReportFilters {
  clienteId: string;
  status: string;
  dataInicio: Date | null;
  dataFim: Date | null;
}

export interface ItemProduto {
  produtoId: number;
  quantidade: number;
  preco: number;
  produto?: {
    id: number;
    nome: string;
    descricao?: string;
    preco?: number;
    codigo?: string;
  };
}

export interface ItemMateriaPrima {
  materiaPrimaId: number;
  quantidade: number;
  preco: number;
  materiaPrima?: {
    id: number;
    nome: string;
    descricao?: string;
    preco?: number;
    unidadeMedida?: string;
    codigo?: string;
  };
}

export interface PedidoReport {
  id: string;
  codigo: string;
  dataInicio: string;
  dataFim: string | null;
  status: PedidoStatus;
  valorEntrada: number;
  valorTotal: number;
  cliente: {
    id: string;
    nome: string;
  };
  produtos?: ItemProduto[];
  materiasPrimas?: ItemMateriaPrima[];
}

export interface PedidoAPI {
  pedido?: {
    id: number;
    data: string;
    status: PedidoStatus;
    pessoaId: number;
    valorEntrada?: number;
  };
  produtos?: ItemProduto[];
  materiasPrimas?: ItemMateriaPrima[];
  valorTotal?: number;
}

export interface Cliente {
  id: string;
  nome: string;
}
