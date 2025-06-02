"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modeloEntity_js_1 = __importDefault(require("../entities/modeloEntity.js"));
const baseRepository_js_1 = __importDefault(require("./baseRepository.js"));
class ModeloRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_modelo WHERE ativo = 1 ORDER BY mod_id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async obter(id) {
        const sql = "SELECT * FROM tb_modelo WHERE mod_id = ? AND ativo = 1";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_modelo (mod_nome, mod_descricao, ativo) VALUES (?, ?, 1)";
        const valores = [entidade.nome, entidade.descricao];
        const modeloId = await this.db.ExecutaComandoNonQuery(sql, valores);
        return modeloId;
    }
    async atualizar(entidade) {
        const sql = `UPDATE tb_modelo
                    SET mod_nome = ?,
                        mod_descricao = ?
                    WHERE mod_id = ? AND ativo = 1`;
        const valores = [
            entidade.nome,
            entidade.descricao,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletar(id) {
        const sql = "UPDATE tb_modelo SET ativo = 0 WHERE mod_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async restaurar(id) {
        return await this.restaurarItem("tb_modelo", "mod_id", id);
    }
    async listarTodos() {
        const sql = "SELECT * FROM tb_modelo";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async existePorNome(nome, ignorarId) {
        let sql = "SELECT COUNT(*) AS total FROM tb_modelo WHERE mod_nome = ? AND ativo = 1";
        const valores = [nome];
        if (ignorarId) {
            sql += " AND mod_id != ?";
            valores.push(ignorarId.toString());
        }
        const [row] = await this.db.ExecutaComando(sql, valores);
        return row?.total > 0;
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
        return new modeloEntity_js_1.default(row["mod_id"], row["mod_nome"], row["mod_descricao"], row["ativo"]);
    }
}
exports.default = ModeloRepository;
//# sourceMappingURL=modeloRepository.js.map