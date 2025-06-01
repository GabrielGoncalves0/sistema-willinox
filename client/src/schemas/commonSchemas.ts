import * as Yup from 'yup';
import { FormatString } from '@/utils/formatString';

export const commonFields = {
  nome: Yup.string()
    .matches(FormatString.nome, 'O nome deve conter apenas letras e espaços')
    .required('Nome é obrigatório'),
  
  endereco: Yup.string()
    .matches(FormatString.endereco, 'O endereço deve conter apenas letras, números, vírgula e espaços'),
  
  telefone: Yup.string()
    .matches(
      /^(?:\(\d{2}\)\s?\d{5}-\d{4}|\d{10})$/,
      'Telefone inválido. Exemplo: (99) 99999-9999'
    )
    .required('Telefone é obrigatório'),
  
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email inválido. Exemplo: email@dominio.com'
    )
    .required('Email é obrigatório'),
  
  cpf: Yup.string()
    .test('valid-cpf', 'CPF inválido.', (value) => {
      return FormatString.isValidCPF(value || '');
    })
    .required('CPF é obrigatório'),
  
  cnpj: Yup.string()
    .test('valid-cnpj', 'CNPJ inválido.', (value) => {
      return FormatString.isValidCNPJ(value || '');
    })
    .required('CNPJ é obrigatório'),
  
  descricao: Yup.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  dataNascimento: Yup.string()
    .required('Data de nascimento é obrigatória'),
  
  senha: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  
  login: Yup.string()
    .min(3, 'O login deve ter pelo menos 3 caracteres')
    .required('Login é obrigatório'),
};

export const baseEntitySchema = Yup.object().shape({
  nome: commonFields.nome,
  descricao: commonFields.descricao,
});

export const dateRangeSchema = Yup.object().shape({
  dataInicio: Yup.date().nullable(),
  dataFim: Yup.date()
    .nullable()
    .when('dataInicio', (dataInicio, schema) => {
      return dataInicio 
        ? schema.min(dataInicio, 'Data fim deve ser posterior à data início')
        : schema;
    }),
});
