import BaseEntity from '../baseEntity';
import MateriaPrimaEntity from '../materiaPrimaEntity';

export default class ProdutoMateriaPrimaEntity extends BaseEntity {
    private _id: number;
    private _produtoId: number;
    private _materiaPrimaId: number;
    private _quantidade: number;
    private _materiaPrima: MateriaPrimaEntity[];

    constructor(
        id: number,
        produtoId: number,
        materiaPrimaId: number,
        quantidade: number,
        materiaPrima: MateriaPrimaEntity[] = []
    ) {
        super();
        this._id = id;
        this._produtoId = produtoId;
        this._materiaPrimaId = materiaPrimaId;
        this._quantidade = quantidade;
        this._materiaPrima = materiaPrima;
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

    get materiaPrima(): MateriaPrimaEntity[] {
        return this._materiaPrima;
    }
}