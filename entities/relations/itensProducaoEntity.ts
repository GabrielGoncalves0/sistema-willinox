import BaseEntity from '../baseEntity';

export default class ItensProducaoEntity extends BaseEntity {
    private _id: number;
    private _materiaPrimaId: number;
    private _producaoId: number;
    private _quantidade: number;

    constructor(
        id: number,
        materiaPrimaId: number,
        producaoId: number,
        quantidade: number
    ) {
        super();
        this._id = id;
        this._materiaPrimaId = materiaPrimaId;
        this._producaoId = producaoId;
        this._quantidade = quantidade;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }
    
    get materiaPrimaId(): number {
        return this._materiaPrimaId;
    }

    set materiaPrimaId(value: number) {
        this._materiaPrimaId = value;
    }

    get producaoId(): number {
        return this._producaoId;
    }

    set producaoId(value: number) {
        this._producaoId = value;
    }

    get quantidade(): number {
        return this._quantidade;
    }

    set quantidade(value: number) {
        this._quantidade = value;
    }
}