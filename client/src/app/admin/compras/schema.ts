import { compraSchema } from '@/schemas/productSchemas';
import { CompraDetalhada, CompraComItens } from '@/hooks/useCompra';

export const compraFormSchema = compraSchema;

export const compraFormInitialValues = (initialData?: CompraDetalhada): CompraComItens => {
  if (initialData) {
    return {
      data: initialData.compra.data,
      juridicaId: initialData.compra.juridicaId,
      valorTotal: initialData.compra.valorTotal,
      itens: initialData.itens,
    };
  }

  return {
    data: new Date().toISOString().split('T')[0],
    juridicaId: 0,
    valorTotal: 0,
    itens: [],
  };
};
