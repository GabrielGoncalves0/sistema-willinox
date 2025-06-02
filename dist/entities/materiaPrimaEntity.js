"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("./baseEntity"));
class MateriaPrimaEntity extends baseEntity_1.default {
    _id;
    _nome;
    _descricao;
    _qtdEstoque;
    _unidadeMedida;
    _preco;
    _codigo;
    _ativo;
    constructor(id, nome, descricao, qtdEstoque, unidadeMedida, preco, codigo, ativo = true) {
        super();
        this._id = id;
        this._nome = nome;
        this._descricao = descricao;
        this._qtdEstoque = qtdEstoque;
        this._unidadeMedida = unidadeMedida;
        this._preco = preco;
        this._codigo = codigo;
        this._ativo = ativo;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this.id = value;
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
    get qtdEstoque() {
        return this._qtdEstoque;
    }
    set qtdEstoque(value) {
        this._qtdEstoque = value;
    }
    get unidadeMedida() {
        return this._unidadeMedida;
    }
    set unidadeMedida(value) {
        this._unidadeMedida = value;
    }
    get preco() {
        return this._preco;
    }
    set preco(value) {
        this._preco = value;
    }
    get codigo() {
        return this._codigo;
    }
    set codigo(value) {
        this._codigo = value;
    }
    get ativo() {
        return this._ativo;
    }
    set ativo(value) {
        this._ativo = value;
    }
}
exports.default = MateriaPrimaEntity;
//# sourceMappingURL=materiaPrimaEntity.js.map