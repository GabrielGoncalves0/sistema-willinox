"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("../baseEntity"));
class PedidoMateriaPrimaEntity extends baseEntity_1.default {
    _id;
    _pedidoId;
    _materiaPrimaId;
    _quantidade;
    _preco;
    constructor(id, pedidoId, materiaPrimaId, quantidade, preco) {
        super();
        this._id = id;
        this._pedidoId = pedidoId;
        this._materiaPrimaId = materiaPrimaId;
        this._quantidade = quantidade;
        this._preco = preco;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get pedidoId() {
        return this._pedidoId;
    }
    set pedidoId(value) {
        this._pedidoId = value;
    }
    get materiaPrimaId() {
        return this._materiaPrimaId;
    }
    set materiaPrimaId(value) {
        this._materiaPrimaId = value;
    }
    get quantidade() {
        return this._quantidade;
    }
    set quantidade(value) {
        this._quantidade = value;
    }
    get preco() {
        return this._preco;
    }
    set preco(value) {
        this._preco = value;
    }
}
exports.default = PedidoMateriaPrimaEntity;
//# sourceMappingURL=pedidoMateriaPrimaEntity.js.map