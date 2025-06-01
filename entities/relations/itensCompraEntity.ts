import BaseEntity from '../baseEntity';

export default class ItensCompraEntity extends BaseEntity {
    private _id: number;
    private _compraId: number;
    private _materiaPrimaId: number;
    private _quantidade: number;
    private _preco: number;

    constructor(
        id: number,
        compraId: number,
        materiaPrimaId: number,
        quantidade: number,
        preco: number
    ) {
        super();
        this._id = id;
        this._compraId = compraId;
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

    get compraId(): number {
        return this._compraId;
    }

    set compraId(value: number) {
        this._compraId = value;
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