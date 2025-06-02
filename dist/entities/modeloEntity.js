"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("./baseEntity"));
class ModeloEntity extends baseEntity_1.default {
    _id;
    _nome;
    _descricao;
    _ativo;
    constructor(id, nome, descricao, ativo = true) {
        super();
        this._id = id;
        this._nome = nome;
        this._descricao = descricao;
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
    get ativo() {
        return this._ativo;
    }
    set ativo(value) {
        this._ativo = value;
    }
}
exports.default = ModeloEntity;
//# sourceMappingURL=modeloEntity.js.map