
export enum CompraStatus {
  PENDENTE = 'pendente',
  PROCESSANDO = 'processando',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}

export const getStatusColor = (status: CompraStatus) => {
  switch (status) {
    case CompraStatus.PENDENTE:
      return 'warning.main';
    case CompraStatus.PROCESSANDO:
      return 'info.main';
    case CompraStatus.CONCLUIDO:
      return 'success.main';
    case CompraStatus.CANCELADO:
      return 'error.main';
    default:
      return 'text.primary';
  }
};

export const getStatusText = (status: CompraStatus) => {
  switch (status) {
    case CompraStatus.PENDENTE:
      return 'Pendente';
    case CompraStatus.PROCESSANDO:
      return 'Processando';
    case CompraStatus.CONCLUIDO:
      return 'Concluído';
    case CompraStatus.CANCELADO:
      return 'Cancelado';
    default:
      return status;
  }
};
