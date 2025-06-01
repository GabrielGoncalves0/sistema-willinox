import BaseEntity from './baseEntity';

export default class MateriaPrimaEntity extends BaseEntity {
    private _id: number;
    private _nome: string;
    private _descricao: string;
    private _qtdEstoque: number;
    private _unidadeMedida: string;
    private _preco: number;
    private _codigo: string;
    private _ativo: boolean;

    constructor(
        id: number,
        nome: string,
        descricao: string,
        qtdEstoque: number,
        unidadeMedida: string,
        preco: number,
        codigo: string,
        ativo: boolean = true
    ) {
        super();
        this._id = id;
        this._nome = nome;
        this._descricao = descricao;
        this._qtdEstoque = qtdEstoque;
        this._unidadeMedida = unidadeMedida;
        this._preco = preco;
        this._codigo = codigo;
        this._ativo = ativo;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this.id = value;
    }

    get nome(): string {
        return this._nome;
    }

    set nome(value: string) {
        this._nome = value;
    }

    get descricao(): string {
        return this._descricao;
    }

    set descricao(value: string) {
        this._descricao = value;
    }

    get qtdEstoque(): number {
        return this._qtdEstoque;
    }

    set qtdEstoque(value: number) {
        this._qtdEstoque = value;
    }

    get unidadeMedida(): string {
        return this._unidadeMedida;
    }

    set unidadeMedida(value: string) {
        this._unidadeMedida = value;
    }

    get preco(): number {
        return this._preco;
    }

    set preco(value: number) {
        this._preco = value;
    }

    get codigo(): string {
        return this._codigo;
    }

    set codigo(value: string) {
        this._codigo = value;
    }

    get ativo(): boolean {
        return this._ativo;
    }

    set ativo(value: boolean) {
        this._ativo = value;
    }
}