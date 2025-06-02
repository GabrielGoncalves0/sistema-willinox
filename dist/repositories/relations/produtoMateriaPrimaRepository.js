"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const produtoMateriaPrimaEntity_js_1 = __importDefault(require("../../entities/relations/produtoMateriaPrimaEntity.js"));
const baseRepository_js_1 = __importDefault(require("../baseRepository.js"));
const materiaPrimaEntity_js_1 = __importDefault(require("../../entities/materiaPrimaEntity.js"));
class ProdutoMateriaPrimaRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar(produtoId) {
        const sql = "SELECT * FROM tb_produto_materiaPrima pmt inner join tb_materiaPrima mat ON pmt.matpri_id = mat.matpri_id where pmt.pro_id = ? ORDER BY pmt.id DESC;";
        const valores = [produtoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }
    async obter(produtoId) {
        const sql = "SELECT * FROM tb_produto_materiaPrima WHERE pro_id = ?";
        const valores = [produtoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_produto_materiaPrima (pro_id, matpri_id, qtd_materia_prima) VALUES (?, ?, ?)";
        const valores = [
            entidade.produtoId,
            entidade.materiaPrimaId,
            entidade.quantidade
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async removerMateriaPrimaPorProdutoId(produtoId) {
        const sql = "DELETE FROM tb_produto_materiaPrima WHERE pro_id = ?";
        const valores = [produtoId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async atualizar(entidade) {
        const sql = `UPDATE tb_produto_materiaPrima 
                    SET qtd_materia_prima = ?
                    WHERE pro_id = ? AND matpri_id = ?`;
        const valores = [
            entidade.quantidade,
            entidade.produtoId,
            entidade.materiaPrimaId
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletar(produtoId, materiaPrimaId) {
        const sql = "DELETE FROM tb_produto_materiaPrima WHERE pro_id = ? AND matpri_id = ?";
        const valores = [produtoId, materiaPrimaId];
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
        const materiaPrima = [new materiaPrimaEntity_js_1.default(row["matpri_id"], row["matpri_nome"], row["matpri_descricao"], row["matpri_qtd_estoque"], row["matpri_unidade_medida"], row["matpri_preco"], row["matpri_codigo"])];
        return new produtoMateriaPrimaEntity_js_1.default(row["id"], row["pro_id"], row["matpri_id"], row["qtd_materia_prima"], materiaPrima);
    }
}
exports.default = ProdutoMateriaPrimaRepository;
//# sourceMappingURL=produtoMateriaPrimaRepository.js.map