"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("./baseEntity"));
class ProdutoEntity extends baseEntity_1.default {
    _id;
    _nome;
    _descricao;
    _preco;
    _qtdEstoque;
    _codigo;
    _modelo;
    _materiaPrima = [];
    _ativo;
    constructor(id, nome, descricao, preco, qtdEstoque, codigo, modelo, materiaPrima = [], ativo = true) {
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
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get nome() {
        return this._nome;
    }
    set nome(value) {
        this._nome = value;
    }
    get descricao() {
        return this._descricao;
    }
    set descricao(value) {
        this._descricao = value;
    }
    get preco() {
        return this._preco;
    }
    set preco(value) {
        this._preco = value;
    }
    get qtdEstoque() {
        return this._qtdEstoque;
    }
    set qtdEstoque(value) {
        this._qtdEstoque = value;
    }
    get codigo() {
        return this._codigo;
    }
    set codigo(value) {
        this._codigo = value;
    }
    get modelo() {
        return this._modelo;
    }
    set modelo(value) {
        this._modelo = value;
    }
    get materiaPrima() {
        return this._materiaPrima;
    }
    set materiaPrima(value) {
        this._materiaPrima = value;
    }
    get ativo() {
        return this._ativo;
    }
    set ativo(value) {
        this._ativo = value;
    }
}
exports.default = ProdutoEntity;
//# sourceMappingURL=produtoEntity.js.map