"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pedidoMateriaPrimaEntity_js_1 = __importDefault(require("../../entities/relations/pedidoMateriaPrimaEntity.js"));
const baseRepository_js_1 = __importDefault(require("../baseRepository.js"));
class PedidoMateriaPrimaRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_pedido_materiaPrima ORDER BY id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarPorPedido(pedidoId) {
        const sql = "SELECT * FROM tb_pedido_materiaPrima WHERE ped_id = ?";
        const valores = [pedidoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }
    async obter(pedidoId, materiaPrimaId) {
        const sql = "SELECT * FROM tb_pedido_materiaPrima WHERE ped_id = ? AND matpri_id = ?";
        const valores = [pedidoId, materiaPrimaId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_pedido_materiaPrima (ped_id, matpri_id, qtd_materia_prima, mat_preco) VALUES (?, ?, ?, ?)";
        const valores = [
            entidade.pedidoId,
            entidade.materiaPrimaId,
            entidade.quantidade,
            entidade.preco
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async atualizar(entidade) {
        const sql = `UPDATE tb_pedido_materiaPrima
                    SET qtd_materia_prima = ?,
                        mat_preco = ?
                    WHERE ped_id = ? AND matpri_id = ?`;
        const valores = [
            entidade.quantidade,
            entidade.preco,
            entidade.pedidoId,
            entidade.materiaPrimaId
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletar(pedidoId, materiaPrimaId) {
        const sql = "DELETE FROM tb_pedido_materiaPrima WHERE ped_id = ? AND matpri_id = ?";
        const valores = [pedidoId, materiaPrimaId];
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
        return new pedidoMateriaPrimaEntity_js_1.default(row["id"], row["ped_id"], row["matpri_id"], row["qtd_materia_prima"], row["mat_preco"]);
    }
}
exports.default = PedidoMateriaPrimaRepository;
//# sourceMappingURL=pedidoMateriaPrimaRepository.js.map