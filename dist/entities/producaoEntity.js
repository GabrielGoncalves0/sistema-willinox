"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("./baseEntity"));
class ProducaoEntity extends baseEntity_1.default {
    _id;
    _dataInicio;
    _dataFim;
    _status;
    _quantidade;
    _produtoId;
    _fisicaId;
    _produto;
    _fisica;
    constructor(id, dataInicio, dataFim, status, quantidade, produtoId, fisicaId, produto, fisica) {
        super();
        this._id = id;
        this._produtoId = produtoId;
        this._dataInicio = dataInicio;
        this._dataFim = dataFim;
        this._status = status;
        this._quantidade = quantidade;
        this._fisicaId = fisicaId;
        this._produto = produto;
        this._fisica = fisica;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get produtoId() {
        return this._produtoId;
    }
    set produtoId(value) {
        this._produtoId = value;
    }
    get dataInicio() {
        return this._dataInicio;
    }
    set dataInicio(value) {
        this._dataInicio = value;
    }
    get dataFim() {
        return this._dataFim;
    }
    set dataFim(value) {
        this._dataFim = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    get quantidade() {
        return this._quantidade;
    }
    set quantidade(value) {
        this._quantidade = value;
    }
    get fisicaId() {
        return this._fisicaId;
    }
    set fisicaId(value) {
        this._fisicaId = value;
    }
    get produto() {
        return this._produto;
    }
    get fisica() {
        return this._fisica;
    }
}
exports.default = ProducaoEntity;
//# sourceMappingURL=producaoEntity.js.map