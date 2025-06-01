import BaseEntity from './baseEntity';
import { CompraStatus } from '../entities/enum/types';

export default class CompraEntity extends BaseEntity {
    private _id: number;
    private _data: Date;
    private _status: CompraStatus;
    private _juridicaId: number;
    private _valorTotal: number;

    constructor(
        id: number,
        data: Date,
        status: CompraStatus,
        juridicaId: number,
        valorTOtal: number  
    ) {
        super();
        this._id = id;
        this._data = data;
        this._status = status;
        this._juridicaId = juridicaId;
        this._valorTotal = valorTOtal;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get data(): Date {
        return this._data;
    }

    set data(value: Date) {
        this._data = value;
    }

    get status(): CompraStatus {
        return this._status;
    }

    set status(value: CompraStatus) {
        this._status = value;
    }

    get juridicaId(): number {
        return this._juridicaId;
    }

    set juridicaId(value: number) {
        this._juridicaId = value;
    }

    get valorTotal(): number {
        return this._valorTotal;
    }

    set valorTotal(value: number) {
        this._valorTotal = value;
    }
}