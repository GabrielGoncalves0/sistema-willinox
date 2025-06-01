import * as Yup from 'yup';

export const itemPedidoSchema = Yup.object().shape({
  produtoId: Yup.string().required("Produto é obrigatório"),
  quantidade: Yup.number()
    .min(1, "Quantidade deve ser maior que zero")
    .required("Quantidade é obrigatória"),
  valorUnitario: Yup.number()
    .min(0.01, "Valor unitário deve ser maior que zero")
    .required("Valor unitário é obrigatório"),
});

export const pedidoSchema = Yup.object().shape({
  clienteId: Yup.string().required("Cliente é obrigatório"),
  dataInicio: Yup.date().required("Data de início é obrigatória"),
  status: Yup.string()
    .oneOf(['pendente', 'em_producao', 'concluido', 'cancelado'])
    .required("Status é obrigatório"),
  valorEntrada: Yup.number()
    .min(0, "Valor de entrada deve ser maior ou igual a zero")
    .nullable(),
  temEntrada: Yup.boolean().required(),
  itens: Yup.array()
    .of(itemPedidoSchema)
    .min(1, "Pelo menos um item deve ser adicionado"),
});

export const producaoSchema = Yup.object().shape({
  funcionarioId: Yup.string().required("Funcionário é obrigatório"),
  dataInicio: Yup.date().required("Data de início é obrigatória"),
  dataFim: Yup.date()
    .nullable()
    .when('status', {
      is: 'concluido',
      then: (schema) => schema.required("Data de fim é obrigatória quando status é concluído"),
      otherwise: (schema) => schema.nullable(),
    }),
  status: Yup.string()
    .oneOf(['em_andamento', 'concluido', 'cancelado'])
    .required("Status é obrigatório"),
  itens: Yup.array()
    .of(
      Yup.object().shape({
        produtoId: Yup.string().required("Produto é obrigatório"),
        quantidade: Yup.number()
          .min(1, "Quantidade deve ser maior que zero")
          .required("Quantidade é obrigatória"),
      })
    )
    .min(1, "Pelo menos um item deve ser adicionado"),
});
