"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("./baseEntity"));
class PedidoEntity extends baseEntity_1.default {
    _id;
    _data;
    _status;
    _pessoaId;
    _valorEntrada;
    constructor(id, data, status, pessoaId, valorEntrada = 0) {
        super();
        this._id = id;
        this._data = data;
        this._status = status;
        this._pessoaId = pessoaId;
        this._valorEntrada = valorEntrada;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    get pessoaId() {
        return this._pessoaId;
    }
    set pessoaId(value) {
        this._pessoaId = value;
    }
    get valorEntrada() {
        return this._valorEntrada;
    }
    set valorEntrada(value) {
        this._valorEntrada = value;
    }
}
exports.default = PedidoEntity;
//# sourceMappingURL=pedidoEntity.js.map