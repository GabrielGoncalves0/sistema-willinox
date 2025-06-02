"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_js_1 = __importDefault(require("../db/database.js"));
class BaseRepository {
    #db;
    get db() {
        return this.#db;
    }
    constructor(db) {
        this.#db = db ? db : database_js_1.default.getInstance();
    }
    async restaurarItem(tableName, idColumnName, id) {
        const sql = `UPDATE ${tableName} SET ativo = 1 WHERE ${idColumnName} = ?`;
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
}
exports.default = BaseRepository;
//# sourceMappingURL=baseRepository.js.map