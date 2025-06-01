export interface Modelo {
    id: number;
    nome: string;
    descricao: string;
}

export interface Product {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    qtdEstoque: number;
    codigo: string;
    modelo: Modelo;
    ativo?: boolean;
}