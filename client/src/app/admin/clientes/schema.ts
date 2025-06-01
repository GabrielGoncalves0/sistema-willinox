import { clienteSchemaFisico, clienteSchemaJuridico } from '@/schemas/personSchemas';
import { getPersonFisicaInitialValues, getPersonJuridicaInitialValues } from '@/utils/initialValues';
import { CreateCliente, listarCliente, mapClienteToCreate } from './constants';

export const clientSchemaFisico = clienteSchemaFisico;
export const clientSchemaJuridico = clienteSchemaJuridico;

export const clienteFormInitialValues = (
  initialData?: listarCliente,
  tab: 'fisica' | 'juridica' = 'fisica'
): CreateCliente => {
  if (initialData) {
    return {
      ...mapClienteToCreate(initialData),
      dataNascimento: initialData.dataNascimento
        ? new Date(initialData.dataNascimento).toISOString()
        : undefined,
    };
  }

  if (tab === 'fisica') {
    return {
      ...getPersonFisicaInitialValues(),
      fisicaTipo: 'cliente',
    } as CreateCliente;
  } else {
    return {
      ...getPersonJuridicaInitialValues(undefined, 'cliente'),
      cnpj: '',
    } as CreateCliente;
  }
};
