export const getPersonFisicaInitialValues = (initialData?: any) => ({
  nome: initialData?.nome || '',
  endereco: initialData?.endereco || '',
  telefone: initialData?.telefone || '',
  email: initialData?.email || '',
  cpf: initialData?.cpf || '',
  dataNascimento: initialData?.dataNascimento
    ? new Date(initialData.dataNascimento).toISOString()
    : undefined,
  tipo: 'fisica' as const,
  fisicaTipo: initialData?.fisicaTipo || 'cliente' as const,
});

export const getPersonJuridicaInitialValues = (initialData?: any, juridicaTipo: 'cliente' | 'fornecedor' = 'cliente') => ({
  nome: initialData?.nome || '',
  endereco: initialData?.endereco || '',
  telefone: initialData?.telefone || '',
  email: initialData?.email || '',
  cnpj: initialData?.cnpj || '',
  tipo: 'juridica' as const,
  juridicaTipo,
});

export const getFuncionarioInitialValues = (initialData?: any) => ({
  ...getPersonFisicaInitialValues(initialData),
  fisicaTipo: 'funcionario' as const,
  login: initialData?.login || '',
  senha: initialData?.senha || '',
  hasAccess: Boolean(initialData?.login),
});

export const getProductInitialValues = (initialData?: any) => ({
  codigo: initialData?.codigo || '',
  nome: initialData?.nome || '',
  descricao: initialData?.descricao || '',
  preco: initialData?.preco || '',
  qtdEstoque: initialData?.qtdEstoque || 0,
  modelo: {
    id: initialData?.modelo?.id || '',
  },
  materiasPrimas: initialData?.materiasPrimas || [],
});

export const getModeloInitialValues = (initialData?: any) => ({
  nome: initialData?.nome || '',
  descricao: initialData?.descricao || '',
});

export const getMateriaPrimaInitialValues = (initialData?: any) => ({
  codigo: initialData?.codigo || '',
  nome: initialData?.nome || '',
  descricao: initialData?.descricao || '',
  unidadeMedida: initialData?.unidadeMedida || '',
  qtdEstoque: initialData?.qtdEstoque || 0,
  preco: initialData?.preco || '',
});

export const getCompraInitialValues = (initialData?: any) => ({
  fornecedorId: initialData?.fornecedorId || '',
  data: initialData?.data ? new Date(initialData.data) : new Date(),
  status: initialData?.status || 'pendente',
  itens: initialData?.itens || [
    {
      materiaPrimaId: '',
      quantidade: 1,
      preco: 0,
    }
  ],
});

export const getPedidoInitialValues = (initialData?: any) => ({
  clienteId: initialData?.clienteId || '',
  dataInicio: initialData?.dataInicio ? new Date(initialData.dataInicio) : new Date(),
  status: initialData?.status || 'pendente',
  valorEntrada: initialData?.valorEntrada || 0,
  temEntrada: Boolean(initialData?.valorEntrada && initialData.valorEntrada > 0),
  itens: initialData?.itens || [
    {
      produtoId: '',
      quantidade: 1,
      valorUnitario: 0,
    }
  ],
});

export const getProducaoInitialValues = (initialData?: any) => ({
  funcionarioId: initialData?.funcionarioId || '',
  dataInicio: initialData?.dataInicio ? new Date(initialData.dataInicio) : new Date(),
  dataFim: initialData?.dataFim ? new Date(initialData.dataFim) : null,
  status: initialData?.status || 'em_andamento',
  itens: initialData?.itens || [
    {
      produtoId: '',
      quantidade: 1,
    }
  ],
});

export const getReportFilterInitialValues = () => ({
  codigo: '',
  dataInicio: null,
  dataFim: null,
  status: '',
  clienteId: '',
  fornecedorId: '',
  funcionarioId: '',
  produtoId: '',
  materiaPrimaId: '',
});
