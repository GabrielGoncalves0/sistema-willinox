import * as Yup from 'yup';
import { commonFields } from './commonSchemas';

export const modeloSchema = Yup.object().shape({
  nome: commonFields.nome.max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: commonFields.descricao,
});

export const materiaPrimaSchema = Yup.object().shape({
  codigo: Yup.string()
    .max(50, "Código deve ter no máximo 50 caracteres")
    .required("Código é obrigatório"),
  nome: commonFields.nome.max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: commonFields.descricao,
  unidadeMedida: Yup.string()
    .max(50, "Unidade de medida deve ter no máximo 50 caracteres")
    .required("Unidade de medida é obrigatória"),
  qtdEstoque: Yup.number()
    .min(0, "Quantidade em estoque deve ser maior ou igual a 0")
    .required("Quantidade em estoque é obrigatória"),
  preco: Yup.number()
    .min(0.01, "Preço deve ser maior que zero")
    .required("Preço é obrigatório"),
});

export const productSchema = Yup.object().shape({
  codigo: Yup.string()
    .max(50, "Código deve ter no máximo 50 caracteres")
    .required("Código é obrigatório"),
  nome: commonFields.nome.max(255, "Nome deve ter no máximo 255 caracteres"),
  descricao: commonFields.descricao,
  preco: Yup.number()
    .min(0.01, "Preço deve ser maior que zero")
    .required("Preço é obrigatório"),
  qtdEstoque: Yup.number()
    .min(0, "Quantidade em estoque deve ser maior ou igual a 0")
    .required("Quantidade em estoque é obrigatória"),
  modelo: Yup.object().shape({
    id: Yup.string().required("Modelo é obrigatório"),
  }),
  materiasPrimas: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required("Matéria-prima é obrigatória"),
      quantidade: Yup.number()
        .min(0.01, "Quantidade deve ser maior que zero")
        .required("Quantidade é obrigatória"),
    })
  ).min(1, "Pelo menos uma matéria-prima deve ser selecionada"),
});

export const itemCompraSchema = Yup.object().shape({
  materiaPrimaId: Yup.string().required("Matéria-prima é obrigatória"),
  quantidade: Yup.number()
    .min(0.01, "Quantidade deve ser maior que zero")
    .required("Quantidade é obrigatória"),
  preco: Yup.number()
    .min(0.01, "Preço deve ser maior que zero")
    .required("Preço é obrigatório"),
});

export const compraSchema = Yup.object().shape({
  fornecedorId: Yup.string().required("Fornecedor é obrigatório"),
  data: Yup.date().required("Data é obrigatória"),
  status: Yup.string()
    .oneOf(['pendente', 'processando', 'concluido', 'cancelado'])
    .required("Status é obrigatório"),
  itens: Yup.array()
    .of(itemCompraSchema)
    .min(1, "Pelo menos um item deve ser adicionado"),
});
