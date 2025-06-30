import { FormatDate } from "@/utils/formatDate";

export interface CreateCliente {
    id?: number;
    pessoaId?: number;
    nome: string;
    endereco: string;
    telefone: string;
    email?: string;
    tipo: 'fisica' | 'juridica';
    fisicaTipo?: 'cliente';
    juridicaTipo?: 'cliente';
    cpf?: string;
    dataNascimento?: string;
    cnpj?: string;
}

export interface listarCliente {
    id: number;
    tipo: 'fisica' | 'juridica';
    fisicaTipo?: string;
    juridicaTipo?: string;
    cpf?: string;
    dataNascimento?: string;
    cnpj?: string;
    ativo?: boolean;
    pessoa: {
        id: number;
        nome: string;
        endereco: string;
        telefone: string;
        email: string;
        ativo?: boolean;
    };
}

export function mapClienteToCreate(cliente: listarCliente): CreateCliente {
    if (cliente.tipo === 'fisica') {
        return {
            tipo: 'fisica',
            fisicaTipo: 'cliente',
            pessoaId: cliente.pessoa.id,
            nome: cliente.pessoa.nome,
            endereco: cliente.pessoa.endereco,
            telefone: cliente.pessoa.telefone,
            email: cliente.pessoa.email,
            cpf: cliente.cpf,
            dataNascimento: cliente.dataNascimento
                ? FormatDate.dateISO(cliente.dataNascimento)
                : undefined,
        };
    } else if (cliente.tipo === 'juridica') {
        return {
            tipo: 'juridica',
            juridicaTipo: 'cliente',
            pessoaId: cliente.pessoa.id,
            nome: cliente.pessoa.nome,
            endereco: cliente.pessoa.endereco,
            telefone: cliente.pessoa.telefone,
            email: cliente.pessoa.email,
            cnpj: cliente.cnpj,
        };
    }

    throw new Error("Tipo de cliente inválido");
}