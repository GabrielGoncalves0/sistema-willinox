"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itensProducaoEntity_js_1 = __importDefault(require("../../entities/relations/itensProducaoEntity.js"));
const baseRepository_js_1 = __importDefault(require("../baseRepository.js"));
class ItensProducaoRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_itens_producao ORDER BY id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarPorProducao(producaoId) {
        const sql = "SELECT * FROM tb_itens_producao WHERE producao_id = ?";
        const valores = [producaoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }
    async obter(materiaPrimaId, producaoId) {
        const sql = "SELECT * FROM tb_itens_producao WHERE matpri_id = ? AND producao_id = ?";
        const valores = [materiaPrimaId, producaoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_itens_producao (matpri_id, producao_id, pro_mat_quantidade) VALUES (?, ?, ?)";
        const valores = [
            entidade.materiaPrimaId,
            entidade.producaoId,
            entidade.quantidade
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async atualizar(entidade) {
        const sql = `UPDATE tb_itens_producao
                    SET pro_mat_quantidade = ?
                    WHERE matpri_id = ? AND producao_id = ?`;
        const valores = [
            entidade.quantidade,
            entidade.materiaPrimaId,
            entidade.producaoId
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletar(materiaPrimaId, producaoId) {
        const sql = "DELETE FROM tb_itens_producao WHERE matpri_id = ? AND producao_id = ?";
        const valores = [materiaPrimaId, producaoId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletarPorProducaoId(producaoId) {
        const sql = "DELETE FROM tb_itens_producao WHERE producao_id = ?";
        const valores = [producaoId];
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
        return new itensProducaoEntity_js_1.default(row["id"], row["matpri_id"], row["producao_id"], row["pro_mat_quantidade"]);
    }
}
exports.default = ItensProducaoRepository;
//# sourceMappingURL=itensProducaoRepository.js.map