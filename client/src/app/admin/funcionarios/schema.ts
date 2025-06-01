import { funcionarioSchema } from '@/schemas/personSchemas';
import { getPersonFisicaInitialValues } from '@/utils/initialValues';
import { CreateFuncionario, listarFuncionario, mapFuncionarioToCreate } from './constants';

export const funcionarioFormSchema = funcionarioSchema;

export const funcionarioFormInitialValues = (initialData?: listarFuncionario): CreateFuncionario => {
  if (initialData) {
    return {
      ...mapFuncionarioToCreate(initialData),
      dataNascimento: initialData.dataNascimento
        ? new Date(initialData.dataNascimento).toISOString()
        : undefined,
    };
  }

  return {
    ...getPersonFisicaInitialValues(),
    fisicaTipo: 'funcionario',
    dataNascimento: undefined,
  } as CreateFuncionario;
};
