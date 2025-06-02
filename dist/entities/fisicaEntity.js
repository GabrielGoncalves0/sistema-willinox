"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("./baseEntity"));
class FisicaEntity extends baseEntity_1.default {
    _id;
    _cpf;
    _dataNascimento;
    _fisicaTipo;
    _pessoaId;
    _login;
    _senha;
    _pessoa;
    _ativo;
    constructor(id, cpf, dataNascimento, pessoaId, fisicaTipo, login, senha, pessoa, ativo = true) {
        super();
        this._id = id;
        this._cpf = cpf;
        this._dataNascimento = dataNascimento;
        this._pessoaId = pessoaId;
        this._fisicaTipo = fisicaTipo;
        this._login = login;
        this._senha = senha;
        this._pessoa = pessoa;
        this._ativo = ativo;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get cpf() {
        return this._cpf;
    }
    set cpf(value) {
        this._cpf = value;
    }
    get dataNascimento() {
        return this._dataNascimento;
    }
    set dataNascimento(value) {
        this._dataNascimento = value;
    }
    get pessoaId() {
        return this._pessoaId;
    }
    set pessoaId(value) {
        this._pessoaId = value;
    }
    get fisicaTipo() {
        return this._fisicaTipo;
    }
    set fisicaTipo(value) {
        this._fisicaTipo = value;
    }
    get login() {
        return this._login;
    }
    set login(value) {
        this._login = value;
    }
    get senha() {
        return this._senha;
    }
    set senha(value) {
        this._senha = value;
    }
    get pessoa() {
        return this._pessoa;
    }
    get ativo() {
        return this._ativo;
    }
    set ativo(value) {
        this._ativo = value;
    }
}
exports.default = FisicaEntity;
//# sourceMappingURL=fisicaEntity.js.map