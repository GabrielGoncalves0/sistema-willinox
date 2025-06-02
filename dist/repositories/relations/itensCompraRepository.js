"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itensCompraEntity_js_1 = __importDefault(require("../../entities/relations/itensCompraEntity.js"));
const baseRepository_js_1 = __importDefault(require("../baseRepository.js"));
class ItensCompraRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_itens_compra ORDER BY id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarPorCompra(compraId) {
        const sql = "SELECT * FROM tb_itens_compra WHERE com_id = ?";
        const valores = [compraId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }
    async obter(compraId, materiaPrimaId) {
        const sql = "SELECT * FROM tb_itens_compra WHERE com_id = ? AND matpri_id = ?";
        const valores = [compraId, materiaPrimaId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_itens_compra (com_id, matpri_id, qtd_materia_prima, mat_preco) VALUES (?, ?, ?, ?)";
        const valores = [
            entidade.compraId,
            entidade.materiaPrimaId,
            entidade.quantidade,
            entidade.preco
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async atualizar(entidade) {
        const sql = `UPDATE tb_itens_compra
                    SET qtd_materia_prima = ?,
                        mat_preco = ?
                    WHERE com_id = ? AND matpri_id = ?`;
        const valores = [
            entidade.quantidade,
            entidade.preco,
            entidade.compraId,
            entidade.materiaPrimaId
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletar(compraId, materiaPrimaId) {
        const sql = "DELETE FROM tb_itens_compra WHERE com_id = ? AND matpri_id = ?";
        const valores = [compraId, materiaPrimaId];
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
        return new itensCompraEntity_js_1.default(row["id"], row["com_id"], row["matpri_id"], row["qtd_materia_prima"], row["mat_preco"]);
    }
}
exports.default = ItensCompraRepository;
//# sourceMappingURL=itensCompraRepository.js.map