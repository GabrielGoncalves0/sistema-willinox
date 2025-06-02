"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("./baseEntity"));
class CompraEntity extends baseEntity_1.default {
    _id;
    _data;
    _status;
    _juridicaId;
    _valorTotal;
    constructor(id, data, status, juridicaId, valorTOtal) {
        super();
        this._id = id;
        this._data = data;
        this._status = status;
        this._juridicaId = juridicaId;
        this._valorTotal = valorTOtal;
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
    get juridicaId() {
        return this._juridicaId;
    }
    set juridicaId(value) {
        this._juridicaId = value;
    }
    get valorTotal() {
        return this._valorTotal;
    }
    set valorTotal(value) {
        this._valorTotal = value;
    }
}
exports.default = CompraEntity;
//# sourceMappingURL=compraEntity.js.map