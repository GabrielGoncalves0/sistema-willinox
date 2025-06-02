"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("./baseEntity"));
class JuridicaEntity extends baseEntity_1.default {
    _id;
    _cnpj;
    _pessoaId;
    _juridicaTipo;
    _pessoa;
    _ativo;
    constructor(id, cnpj, pessoaId, juridicaTipo, pessoa, ativo = true) {
        super();
        this._id = id;
        this._cnpj = cnpj;
        this._pessoaId = pessoaId;
        this._juridicaTipo = juridicaTipo;
        this._pessoa = pessoa;
        this._ativo = ativo;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get cnpj() {
        return this._cnpj;
    }
    set cnpj(value) {
        this._cnpj = value;
    }
    get pessoaId() {
        return this._pessoaId;
    }
    set pessoaId(value) {
        this._pessoaId = value;
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
    get juridicaTipo() {
        return this._juridicaTipo;
    }
    set juridicaTipo(value) {
        this._juridicaTipo = value;
    }
}
exports.default = JuridicaEntity;
//# sourceMappingURL=juridicaEntity.js.map