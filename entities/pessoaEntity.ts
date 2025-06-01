import BaseEntity from './baseEntity';
import { PessoaTipo } from './enum/types';

export default class PessoaEntity extends BaseEntity {
    private _id: number;
    private _nome: string;
    private _endereco: string;
    private _telefone: string;
    private _email: string;
    private _tipo: PessoaTipo;
    private _ativo: boolean;

    constructor(
        id: number,
        nome: string,
        endereco: string,
        telefone: string,
        email: string,
        tipo: PessoaTipo,
        ativo: boolean = true
    ) {
        super();
        this._id = id;
        this._nome = nome;
        this._endereco = endereco;
        this._telefone = telefone;
        this._email = email;
        this._tipo = tipo;
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

    get endereco(): string {
        return this._endereco;
    }

    set endereco(value: string) {
        this._endereco = value;
    }

    get telefone(): string {
        return this._telefone;
    }

    set telefone(value: string) {
        this._telefone = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get tipo(): PessoaTipo {
        return this._tipo;
    }

    set tipo(value: PessoaTipo) {
        this._tipo = value;
    }

    get ativo(): boolean {
        return this._ativo;
    }

    set ativo(value: boolean) {
        this._ativo = value;
    }
}