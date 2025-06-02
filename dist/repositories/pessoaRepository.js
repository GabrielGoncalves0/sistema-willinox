"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pessoaEntity_js_1 = __importDefault(require("../entities/pessoaEntity.js"));
const baseRepository_js_1 = __importDefault(require("./baseRepository.js"));
class PessoaRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_pessoa WHERE ativo = 1 ORDER BY pes_id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async obter(id) {
        const sql = "SELECT * FROM tb_pessoa WHERE pes_id = ? AND ativo = 1";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_pessoa (pes_nome, pes_endereco, pes_telefone, pes_email, pes_tipo, ativo) VALUES (?, ?, ?, ?, ?, 1)";
        const valores = [
            entidade.nome,
            entidade.endereco,
            entidade.telefone,
            entidade.email,
            entidade.tipo
        ];
        const pessoaId = await this.db.ExecutaComandoLastInserted(sql, valores);
        return pessoaId;
    }
    async atualizar(entidade) {
        const sql = `UPDATE tb_pessoa
                    SET pes_nome = ?,
                        pes_endereco = ?,
                        pes_telefone = ?,
                        pes_email = ?,
                        pes_tipo = ?
                    WHERE pes_id = ? AND ativo = 1`;
        const valores = [
            entidade.nome,
            entidade.endereco,
            entidade.telefone,
            entidade.email,
            entidade.tipo,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletar(id) {
        const sql = "UPDATE tb_pessoa SET ativo = 0 WHERE pes_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    /**
     * Restaura uma pessoa que foi excluída logicamente
     * @param id ID da pessoa a ser restaurada
     * @returns true se a restauração foi bem-sucedida, false caso contrário
     */
    async restaurar(id) {
        return await this.restaurarItem("tb_pessoa", "pes_id", id);
    }
    /**
     * Lista todas as pessoas, incluindo as inativas
     * @returns Lista de todas as pessoas
     */
    async listarTodos() {
        const sql = "SELECT * FROM tb_pessoa";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
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
        return new pessoaEntity_js_1.default(row["pes_id"], row["pes_nome"], row["pes_endereco"], row["pes_telefone"], row["pes_email"], row["pes_tipo"], row["ativo"]);
    }
}
exports.default = PessoaRepository;
//# sourceMappingURL=pessoaRepository.js.map