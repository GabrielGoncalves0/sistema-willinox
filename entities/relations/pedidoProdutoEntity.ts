import BaseEntity from '../baseEntity';

export default class PedidoProdutoEntity extends BaseEntity {
    private _id: number;
    private _pedidoId: number;
    private _produtoId: number;
    private _quantidade: number;
    private _preco: number;

    constructor(
        id: number,
        pedidoId: number,
        produtoId: number,
        quantidade: number,
        preco: number
    ) {
        super();
        this._id = id;
        this._pedidoId = pedidoId;
        this._produtoId = produtoId;
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

    get produtoId(): number {
        return this._produtoId;
    }

    set produtoId(value: number) {
        this._produtoId = value;
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