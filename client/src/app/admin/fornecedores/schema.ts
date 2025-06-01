import { fornecedorSchema } from '@/schemas/personSchemas';
import { getPersonJuridicaInitialValues } from '@/utils/initialValues';
import { CreateFornecedor, listarFornecedor, mapFornecedorToCreate } from './constants';

export const fornecedorFormSchema = fornecedorSchema;

export const fornecedorFormInitialValues = (initialData?: listarFornecedor): CreateFornecedor => {
  if (initialData) {
    return mapFornecedorToCreate(initialData);
  }

  return {
    ...getPersonJuridicaInitialValues(undefined, 'fornecedor'),
    cnpj: '',
  } as CreateFornecedor;
};
