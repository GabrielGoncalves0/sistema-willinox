import * as Yup from 'yup';
import { commonFields } from './commonSchemas';

export const clienteSchemaFisico = Yup.object().shape({
  nome: commonFields.nome,
  endereco: commonFields.endereco,
  telefone: commonFields.telefone,
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email inválido. Exemplo: email@dominio.com'
    ),
  cpf: commonFields.cpf,
  dataNascimento: Yup.string(),
  tipo: Yup.string().oneOf(['fisica']).required(),
  fisicaTipo: Yup.string().oneOf(['cliente']).required(),
});

export const clienteSchemaJuridico = Yup.object().shape({
  nome: commonFields.nome,
  endereco: commonFields.endereco,
  telefone: commonFields.telefone,
  email: commonFields.email,
  cnpj: commonFields.cnpj,
  tipo: Yup.string().oneOf(['juridica']).required(),
  juridicaTipo: Yup.string().oneOf(['cliente']).required(),
});

export const fornecedorSchema = Yup.object().shape({
  nome: commonFields.nome,
  endereco: commonFields.endereco,
  telefone: commonFields.telefone,
  email: commonFields.email,
  cnpj: commonFields.cnpj,
  tipo: Yup.string().oneOf(['juridica']).required(),
  juridicaTipo: Yup.string().oneOf(['fornecedor']).required(),
});

export const funcionarioSchema = Yup.object().shape({
  nome: commonFields.nome,
  endereco: commonFields.endereco,
  telefone: commonFields.telefone,
  email: commonFields.email,
  cpf: commonFields.cpf,
  dataNascimento: commonFields.dataNascimento,
  tipo: Yup.string().oneOf(['fisica']).required(),
  fisicaTipo: Yup.string().oneOf(['funcionario']).required(),
  login: Yup.string().when('hasAccess', {
    is: true,
    then: (schema) => commonFields.login,
    otherwise: (schema) => schema.notRequired(),
  }),
  senha: Yup.string().when('hasAccess', {
    is: true,
    then: (schema) => commonFields.senha,
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const getPersonSchema = (tipo: 'cliente-fisico' | 'cliente-juridico' | 'fornecedor' | 'funcionario') => {
  switch (tipo) {
    case 'cliente-fisico':
      return clienteSchemaFisico;
    case 'cliente-juridico':
      return clienteSchemaJuridico;
    case 'fornecedor':
      return fornecedorSchema;
    case 'funcionario':
      return funcionarioSchema;
    default:
      return clienteSchemaFisico;
  }
};
