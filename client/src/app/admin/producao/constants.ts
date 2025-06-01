export interface CreateProducao {
    fisicaId: number;
    produtoId: number;
    status: string;
    quantidade?: number;
    dataInicio?: string;
    dataFim?: string;
}

export interface ListarProducao {
    id: number;
    produtoId: number;
    dataInicio: string;
    dataFim: string | null;
    status: "pendente" | "em_andamento" | "concluido" | "cancelado";
    fisicaId: number;
    quantidade?: number;
    produto: {
        id: number;
        nome: string;
        descricao: string;
        preco: string;
        qtdEstoque: number;
        codigo: string;
        modelo: {
            id: number;
            nome: string;
            descricao: string | null;
            ativo: number;
        };
        materiaPrima: any[];
        ativo: number;
    };
    fisica: {
        id: number;
        cpf: string;
        dataNascimento: string;
        pessoaId: number;
        fisicaTipo: string;
        login: string;
        senha: string;
        pessoa: {
            id: number;
            nome: string;
            endereco: string;
            telefone: string;
            email: string;
            tipo: string;
            ativo: number;
        };
        ativo: number;
    };
}

export function mapProducaoToCreate(producao: ListarProducao): CreateProducao {
    return {
        fisicaId: producao.fisicaId,
        produtoId: producao.produtoId,
        status: producao.status,
        quantidade: producao.quantidade,
        dataInicio: producao.dataInicio,
        dataFim: producao.dataFim || undefined
    };
}