import BaseEntity from '../baseEntity';

export default class PedidoMateriaPrimaEntity extends BaseEntity {
    private _id: number;
    private _pedidoId: number;
    private _materiaPrimaId: number;
    private _quantidade: number;
    private _preco: number;

    constructor(
        id: number,
        pedidoId: number,
        materiaPrimaId: number,
        quantidade: number,
        preco: number
    ) {
        super();
        this._id = id;
        this._pedidoId = pedidoId;
        this._materiaPrimaId = materiaPrimaId;
        this._quantidade = quantidade;
        this._preco = preco;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get pedidoId(): number {
        return this._pedidoId;
    }

    set pedidoId(value: number) {
        this._pedidoId = value;
    }

    get materiaPrimaId(): number {
        return this._materiaPrimaId;
    }

    set materiaPrimaId(value: number) {
        this._materiaPrimaId = value;
    }

    get quantidade(): number {
        return this._quantidade;
    }

    set quantidade(value: number) {
        this._quantidade = value;
    }

    get preco(): number {
        return this._preco;
    }

    set preco(value: number) {
        this._preco = value;
    }
}