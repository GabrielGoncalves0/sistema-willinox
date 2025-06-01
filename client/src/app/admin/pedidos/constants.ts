export enum PedidoStatus {
  PENDENTE = 'pendente',
  PROCESSADO = 'processado',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}

export const getStatusColor = (status: PedidoStatus) => {
  switch (status) {
    case PedidoStatus.PENDENTE:
      return 'warning.main';
    case PedidoStatus.PROCESSADO:
      return 'info.main';
    case PedidoStatus.CONCLUIDO:
      return 'success.main';
    case PedidoStatus.CANCELADO:
      return 'error.main';
    default:
      return 'text.primary';
  }
};

export const getStatusText = (status: PedidoStatus) => {
  switch (status) {
    case PedidoStatus.PENDENTE:
      return 'Pendente';
    case PedidoStatus.PROCESSADO:
      return 'Processando';
    case PedidoStatus.CONCLUIDO:
      return 'Concluído';
    case PedidoStatus.CANCELADO:
      return 'Cancelado';
    default:
      return status;
  }
};

export interface ItemProduto {
  produtoId: number;
  quantidade: number;
  preco: number;
  produto?: {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    codigo: string;
    qtdEstoque?: number;
  };
}

export interface ItemMateriaPrima {
  materiaPrimaId: number;
  quantidade: number;
  preco: number;
  materiaPrima?: {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    unidadeMedida: string;
    codigo: string;
    qtdEstoque?: number;
  };
}

export interface Pedido {
  id: number;
  data: string;
  status: PedidoStatus;
  pessoaId: number;
  valorEntrada?: number;
  pessoa?: {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    tipo: string;
  };
}

export interface PedidoDetalhado {
  pedido: Pedido;
  produtos: ItemProduto[];
  materiasPrimas: ItemMateriaPrima[];
  valorTotal: number;
}

export interface PedidoComItens {
  data: string;
  pessoaId: number;
  valorEntrada?: number;
  produtos?: ItemProduto[];
  materiasPrimas?: ItemMateriaPrima[];
}

export interface PedidoComItensUpdate extends PedidoComItens {
  id: number;
  status?: PedidoStatus;
}
