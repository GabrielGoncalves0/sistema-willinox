import BaseEntity from './baseEntity';
import { FisicaTipo } from './enum/types';
import PessoaEntity from './pessoaEntity';
export default class FisicaEntity extends BaseEntity {
    private _id: number;
    private _cpf: string;
    private _dataNascimento: Date;
    private _fisicaTipo: FisicaTipo;
    private _pessoaId: number;
    private _login?: string;
    private _senha?: string;
    private _pessoa?: PessoaEntity;
    private _ativo: boolean;

    constructor(
        id: number,
        cpf: string,
        dataNascimento: Date,
        pessoaId: number,
        fisicaTipo: FisicaTipo,
        login?: string,
        senha?: string,
        pessoa?: PessoaEntity,
        ativo: boolean = true
    ) {
        super();
        this._id = id;
        this._cpf = cpf;
        this._dataNascimento = dataNascimento;
        this._pessoaId = pessoaId;
        this._fisicaTipo = fisicaTipo;
        this._login = login;
        this._senha = senha;
        this._pessoa = pessoa;
        this._ativo = ativo;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get cpf(): string {
        return this._cpf;
    }

    set cpf(value: string) {
        this._cpf = value;
    }

    get dataNascimento(): Date {
        return this._dataNascimento;
    }

    set dataNascimento(value: Date) {
        this._dataNascimento = value;
    }

    get pessoaId(): number {
        return this._pessoaId;
    }

    set pessoaId(value: number) {
        this._pessoaId = value;
    }

    get fisicaTipo(): FisicaTipo {
        return this._fisicaTipo;
    }

    set fisicaTipo(value: FisicaTipo) {
        this._fisicaTipo = value;
    }

    get login(): string | undefined {
        return this._login;
    }

    set login(value: string | undefined) {
        this._login = value;
    }

    get senha(): string | undefined {
        return this._senha;
    }

    set senha(value: string | undefined) {
        this._senha = value;
    }

    get pessoa(): PessoaEntity | undefined {
        return this._pessoa;
    }

    get ativo(): boolean {
        return this._ativo;
    }

    set ativo(value: boolean) {
        this._ativo = value;
    }
}