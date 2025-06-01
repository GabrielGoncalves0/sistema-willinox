import { pedidoSchema } from '@/schemas/orderSchemas';
import { PedidoDetalhado, PedidoComItens } from './constants';

export const pedidoFormSchema = pedidoSchema;

export const pedidoFormInitialValues = (initialData?: PedidoDetalhado): PedidoComItens => {
  if (initialData) {
    return {
      data: initialData.pedido.data,
      pessoaId: initialData.pedido.pessoaId,
      valorEntrada: initialData.pedido.valorEntrada,
      produtos: initialData.produtos,
      materiasPrimas: initialData.materiasPrimas,
    };
  }

  return {
    data: new Date().toISOString().split('T')[0],
    pessoaId: 0,
    valorEntrada: 0,
    produtos: [],
    materiasPrimas: [],
  };
};
