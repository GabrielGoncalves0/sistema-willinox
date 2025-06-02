"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("../baseEntity"));
class ItensCompraEntity extends baseEntity_1.default {
    _id;
    _compraId;
    _materiaPrimaId;
    _quantidade;
    _preco;
    constructor(id, compraId, materiaPrimaId, quantidade, preco) {
        super();
        this._id = id;
        this._compraId = compraId;
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
    get compraId() {
        return this._compraId;
    }
    set compraId(value) {
        this._compraId = value;
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
exports.default = ItensCompraEntity;
//# sourceMappingURL=itensCompraEntity.js.map