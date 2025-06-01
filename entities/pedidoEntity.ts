import BaseEntity from './baseEntity';
import { PedidoStatus } from './enum/types';

export default class PedidoEntity extends BaseEntity {
    private _id: number;
    private _data: Date;
    private _status: PedidoStatus;
    private _pessoaId: number;
    private _valorEntrada: number;

    constructor(
        id: number,
        data: Date,
        status: PedidoStatus,
        pessoaId: number,
        valorEntrada: number = 0
    ) {
        super();
        this._id = id;
        this._data = data;
        this._status = status;
        this._pessoaId = pessoaId;
        this._valorEntrada = valorEntrada;
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

    get status(): PedidoStatus {
        return this._status;
    }

    set status(value: PedidoStatus) {
        this._status = value;
    }

    get pessoaId(): number {
        return this._pessoaId;
    }

    set pessoaId(value: number) {
        this._pessoaId = value;
    }

    get valorEntrada(): number {
        return this._valorEntrada;
    }

    set valorEntrada(value: number) {
        this._valorEntrada = value;
    }
}