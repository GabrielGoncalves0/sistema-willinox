"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compraEntity_js_1 = __importDefault(require("../entities/compraEntity.js"));
const baseRepository_js_1 = __importDefault(require("./baseRepository.js"));
class CompraRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_compra";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async obter(id) {
        const sql = "SELECT * FROM tb_compra WHERE com_id = ?";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_compra (com_data, com_status, com_valor_total, jur_id) VALUES (?, ?, ?, ?)";
        const valores = [
            entidade.data,
            entidade.status,
            entidade.valorTotal,
            entidade.juridicaId
        ];
        const compraId = await this.db.ExecutaComandoLastInserted(sql, valores);
        return compraId;
    }
    async atualizar(entidade) {
        const sql = `UPDATE tb_compra
                    SET com_data = ?,
                        com_status = ?,
                        com_valor_total = ?,
                        jur_id = ?
                    WHERE com_id = ?`;
        const valores = [
            entidade.data,
            entidade.status,
            entidade.valorTotal,
            entidade.juridicaId,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletar(id) {
        const sql = "DELETE FROM tb_compra WHERE com_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        }
        else {
            return [this.mapToEntity(rows)];
        }
    }
    mapToEntity(row) {
        return new compraEntity_js_1.default(row["com_id"], new Date(row["com_data"]), row["com_status"], row["jur_id"], row["com_valor_total"]);
    }
}
exports.default = CompraRepository;
//# sourceMappingURL=compraRepository.js.map