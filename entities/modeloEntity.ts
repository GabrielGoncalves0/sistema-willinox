import BaseEntity from './baseEntity';

export default class ModeloEntity extends BaseEntity {
    private _id: number;
    private _nome: string;
    private _descricao: string;
    private _ativo: boolean;

    constructor(
        id: number,
        nome: string,
        descricao: string,
        ativo: boolean = true
    ) {
        super();
        this._id = id;
        this._nome = nome;
        this._descricao = descricao;
        this._ativo = ativo;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
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

    get ativo(): boolean {
        return this._ativo;
    }

    set ativo(value: boolean) {
        this._ativo = value;
    }
}