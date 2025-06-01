export enum PessoaTipo {
    JURIDICA = 'juridica',
    FISICA = 'fisica'
}

export enum FisicaTipo {
    CLIENTE = 'cliente',
    FUNCIONARIO = 'funcionario'
}

export enum JuridicaTipo {
    FORNECEDOR = 'fornecedor',
    CLIENTE = 'cliente'
}

export enum PedidoStatus { 
    PENDENTE = 'pendente',
    PROCESSADO = 'processado',
    CONCLUIDO = 'concluido',
    CANCELADO = 'cancelado'
}

export enum CompraStatus { 
    PENDENTE = 'pendente',
    PROCESSANDO = 'processando',
    CONCLUIDO = 'concluido',
    CANCELADO = 'cancelado'
}
export enum ProducaoStatus { 
    PENDENTE = 'pendente',
    EM_ANDAMENTO = 'em_andamento',
    CONCLUIDO = 'concluido',
    CANCELADO = 'cancelado'
}