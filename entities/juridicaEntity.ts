import BaseEntity from './baseEntity';
import { JuridicaTipo } from './enum/types';
import PessoaEntity from './pessoaEntity';
export default class JuridicaEntity extends BaseEntity {
    private _id: number;
    private _cnpj: string;
    private _pessoaId: number;
    private _juridicaTipo: JuridicaTipo;
    private _pessoa?: PessoaEntity;
    private _ativo: boolean;

    constructor(
        id: number,
        cnpj: string,
        pessoaId: number,
        juridicaTipo: JuridicaTipo,
        pessoa?: PessoaEntity,
        ativo: boolean = true
    ) {
        super();
        this._id = id;
        this._cnpj = cnpj;
        this._pessoaId = pessoaId;
        this._juridicaTipo = juridicaTipo;
        this._pessoa = pessoa;
        this._ativo = ativo;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get cnpj(): string {
        return this._cnpj;
    }

    set cnpj(value: string) {
        this._cnpj = value;
    }

    get pessoaId(): number {
        return this._pessoaId;
    }

    set pessoaId(value: number) {
        this._pessoaId = value;
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

    get juridicaTipo(): JuridicaTipo {
        return this._juridicaTipo;
    }

    set juridicaTipo(value: JuridicaTipo) {
        this._juridicaTipo = value;
    }
}