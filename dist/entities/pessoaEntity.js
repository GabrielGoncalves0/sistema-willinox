"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("./baseEntity"));
class PessoaEntity extends baseEntity_1.default {
    _id;
    _nome;
    _endereco;
    _telefone;
    _email;
    _tipo;
    _ativo;
    constructor(id, nome, endereco, telefone, email, tipo, ativo = true) {
        super();
        this._id = id;
        this._nome = nome;
        this._endereco = endereco;
        this._telefone = telefone;
        this._email = email;
        this._tipo = tipo;
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
    get endereco() {
        return this._endereco;
    }
    set endereco(value) {
        this._endereco = value;
    }
    get telefone() {
        return this._telefone;
    }
    set telefone(value) {
        this._telefone = value;
    }
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
    get tipo() {
        return this._tipo;
    }
    set tipo(value) {
        this._tipo = value;
    }
    get ativo() {
        return this._ativo;
    }
    set ativo(value) {
        this._ativo = value;
    }
}
exports.default = PessoaEntity;
//# sourceMappingURL=pessoaEntity.js.map