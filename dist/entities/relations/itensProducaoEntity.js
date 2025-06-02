"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseEntity_1 = __importDefault(require("../baseEntity"));
class ItensProducaoEntity extends baseEntity_1.default {
    _id;
    _materiaPrimaId;
    _producaoId;
    _quantidade;
    constructor(id, materiaPrimaId, producaoId, quantidade) {
        super();
        this._id = id;
        this._materiaPrimaId = materiaPrimaId;
        this._producaoId = producaoId;
        this._quantidade = quantidade;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get materiaPrimaId() {
        return this._materiaPrimaId;
    }
    set materiaPrimaId(value) {
        this._materiaPrimaId = value;
    }
    get producaoId() {
        return this._producaoId;
    }
    set producaoId(value) {
        this._producaoId = value;
    }
    get quantidade() {
        return this._quantidade;
    }
    set quantidade(value) {
        this._quantidade = value;
    }
}
exports.default = ItensProducaoEntity;
//# sourceMappingURL=itensProducaoEntity.js.map