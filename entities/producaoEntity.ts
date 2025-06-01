import BaseEntity from './baseEntity';
import { ProducaoStatus } from './enum/types';
import FisicaEntity from './fisicaEntity';
import ProdutoEntity from './produtoEntity';

export default class ProducaoEntity extends BaseEntity {
    private _id: number;
    private _dataInicio: Date;
    private _dataFim: Date | null;
    private _status: ProducaoStatus;
    private _quantidade: number
    private _produtoId: number;
    private _fisicaId: number;
    private _produto?: ProdutoEntity;
    private _fisica?: FisicaEntity;

    constructor(
        id: number,
        dataInicio: Date,
        dataFim: Date | null,
        status: ProducaoStatus,
        quantidade: number,
        produtoId: number,
        fisicaId: number,
        produto?: ProdutoEntity,
        fisica?: FisicaEntity
    ) {
        super();
        this._id = id;
        this._produtoId = produtoId;
        this._dataInicio = dataInicio;
        this._dataFim = dataFim;
        this._status = status;
        this._quantidade = quantidade;
        this._fisicaId = fisicaId;
        this._produto = produto;
        this._fisica = fisica;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get produtoId(): number {
        return this._produtoId;
    }

    set produtoId(value: number) {
        this._produtoId = value;
    }

    get dataInicio(): Date {
        return this._dataInicio;
    }

    set dataInicio(value: Date) {
        this._dataInicio = value;
    }

    get dataFim(): Date | null {
        return this._dataFim;
    }

    set dataFim(value: Date | null) {
        this._dataFim = value;
    }

    get status(): ProducaoStatus {
        return this._status;
    }

    set status(value: ProducaoStatus) {
        this._status = value;
    }

    get quantidade(): number {
        return this._quantidade;
    }

    set quantidade(value: number) {
        this._quantidade = value;
    }

    get fisicaId(): number {
        return this._fisicaId;
    }

    set fisicaId(value: number) {
        this._fisicaId = value;
    }

    get produto(): ProdutoEntity | undefined {
        return this._produto;
    }

    get fisica(): FisicaEntity | undefined {
        return this._fisica;
    }
}