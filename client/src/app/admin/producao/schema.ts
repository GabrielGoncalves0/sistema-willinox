import { producaoSchema } from '@/schemas/orderSchemas';
import { ListarProducao, CreateProducao } from './constants';

export const producaoFormSchema = producaoSchema;

export const producaoFormInitialValues = (initialData?: ListarProducao): CreateProducao => {
  if (initialData) {
    return {
      fisicaId: initialData.fisica.id,
      produtoId: initialData.produto.id,
      dataInicio: initialData.dataInicio,
      dataFim: initialData.dataFim || undefined,
      status: initialData.status,
      quantidade: initialData.quantidade,
    };
  }

  return {
    fisicaId: 0,
    produtoId: 0,
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: undefined,
    status: 'em_andamento',
    quantidade: 1,
  };
};