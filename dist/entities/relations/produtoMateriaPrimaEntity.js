"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("../baseEntity"));
class ProdutoMateriaPrimaEntity extends baseEntity_1.default {
    _id;
    _produtoId;
    _materiaPrimaId;
    _quantidade;
    _materiaPrima;
    constructor(id, produtoId, materiaPrimaId, quantidade, materiaPrima = []) {
        super();
        this._id = id;
        this._produtoId = produtoId;
        this._materiaPrimaId = materiaPrimaId;
        this._quantidade = quantidade;
        this._materiaPrima = materiaPrima;
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
    get materiaPrima() {
        return this._materiaPrima;
    }
}
exports.default = ProdutoMateriaPrimaEntity;
//# sourceMappingURL=produtoMateriaPrimaEntity.js.map