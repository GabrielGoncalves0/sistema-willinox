import BaseEntity from './baseEntity';
import ModeloEntity from './modeloEntity';
import ProdutoMateriaPrimaEntity from './relations/produtoMateriaPrimaEntity';

export default class ProdutoEntity extends BaseEntity {
    private _id: number;
    private _nome: string;
    private _descricao: string;
    private _preco: number;
    private _qtdEstoque: number;
    private _codigo: string;
    private _modelo: ModeloEntity;
    private _materiaPrima: ProdutoMateriaPrimaEntity[] = [];
    private _ativo: boolean;

    constructor(
        id: number,
        nome: string,
        descricao: string,
        preco: number,
        qtdEstoque: number,
        codigo: string,
        modelo: ModeloEntity,
        materiaPrima: ProdutoMateriaPrimaEntity[] = [],
        ativo: boolean = true
    ) {
        super();
        this._id = id;
        this._nome = nome;
        this._descricao = descricao;
        this._preco = preco;
        this._qtdEstoque = qtdEstoque;
        this._codigo = codigo;
        this._modelo = modelo;
        this._materiaPrima = materiaPrima;
        this._ativo = ativo;
    }

    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
    get nome(): string {
        return this._nome;
    }
    set nome(value: string) {
        this._nome = value;
    }
    get descricao(): string {
        return this._descricao;
    }
    set descricao(value: string) {
        this._descricao = value;
    }
    get preco(): number {
        return this._preco;
    }
    set preco(value: number) {
        this._preco = value;
    }
    get qtdEstoque(): number {
        return this._qtdEstoque;
    }
    set qtdEstoque(value: number) {
        this._qtdEstoque = value;
    }
    get codigo(): string {
        return this._codigo;
    }
    set codigo(value: string) {
        this._codigo = value;
    }
    get modelo(): ModeloEntity {
        return this._modelo;
    }
    set modelo(value: ModeloEntity) {
        this._modelo = value;
    }
    get materiaPrima(): ProdutoMateriaPrimaEntity[] {
        return this._materiaPrima;
    }
    set materiaPrima(value: ProdutoMateriaPrimaEntity[]) {
        this._materiaPrima = value;
    }
    get ativo(): boolean {
        return this._ativo;
    }
    set ativo(value: boolean) {
        this._ativo = value;
    }
}