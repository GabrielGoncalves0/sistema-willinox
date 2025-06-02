"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const juridicaEntity_js_1 = __importDefault(require("../entities/juridicaEntity.js"));
const baseRepository_js_1 = __importDefault(require("./baseRepository.js"));
const pessoaEntity_js_1 = __importDefault(require("../entities/pessoaEntity.js"));
class JuridicaRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jur_tipo='fornecedor' AND jus.ativo = 1 ORDER BY jus.jur_id DESC;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarJuridicaClientes() {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jus.jur_tipo='cliente' AND jus.ativo = 1;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async obter(id) {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jus.jur_id = ? AND jur_tipo='fornecedor' AND jus.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async obterJuridicaCliente(id) {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jus.jur_id = ? AND jus.jur_tipo='cliente' AND jus.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_juridica (jur_cnpj, pes_id, jur_tipo, ativo) VALUES (?, ?, ?, 1)";
        const valores = [
            entidade.cnpj,
            entidade.pessoaId,
            entidade.juridicaTipo
        ];
        const juridicaId = await this.db.ExecutaComandoLastInserted(sql, valores);
        return juridicaId > 0;
    }
    async atualizar(entidade) {
        const sql = `UPDATE tb_juridica
                    SET jur_cnpj = ?,
                        pes_id = ?,
                        jur_tipo = ?
                    WHERE jur_id = ? AND ativo = 1`;
        const valores = [
            entidade.cnpj,
            entidade.pessoaId,
            entidade.juridicaTipo,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletar(id) {
        const getPessoaIdSql = "SELECT pes_id FROM tb_juridica WHERE jur_id = ?";
        const pessoaIdResult = await this.db.ExecutaComando(getPessoaIdSql, [id]);
        if (!pessoaIdResult || pessoaIdResult.length === 0) {
            return false;
        }
        const pessoaId = pessoaIdResult[0].pes_id;
        const juridicaSql = "UPDATE tb_juridica SET ativo = 0 WHERE jur_id = ?";
        const juridicaResult = await this.db.ExecutaComandoNonQuery(juridicaSql, [id]);
        if (!juridicaResult) {
            return false;
        }
        const pessoaSql = "UPDATE tb_pessoa SET ativo = 0 WHERE pes_id = ?";
        return await this.db.ExecutaComandoNonQuery(pessoaSql, [pessoaId]);
    }
    async restaurar(id) {
        const getPessoaIdSql = "SELECT pes_id FROM tb_juridica WHERE jur_id = ?";
        const pessoaIdResult = await this.db.ExecutaComando(getPessoaIdSql, [id]);
        if (!pessoaIdResult || pessoaIdResult.length === 0) {
            return false;
        }
        const pessoaId = pessoaIdResult[0].pes_id;
        const juridicaResult = await this.restaurarItem("tb_juridica", "jur_id", id);
        if (!juridicaResult) {
            return false;
        }
        return await this.restaurarItem("tb_pessoa", "pes_id", pessoaId);
    }
    async listarTodos() {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jur_tipo='fornecedor'";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarTodosJuridicaClientes() {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jus.jur_tipo='cliente'";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async existeCNPJ(cnpj, juridicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_juridica
            WHERE jur_cnpj = ? AND jur_tipo = ? AND ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [cnpj, juridicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeCNPJEmOutroId(cnpj, idAtual, juridicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_juridica
            WHERE jur_cnpj = ? AND jur_id <> ? AND jur_tipo = ? AND ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [cnpj, idAtual, juridicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeNomeEndereco(nome, endereco, juridicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND p.pes_endereco = ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, endereco, juridicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeNomeTelefone(nome, telefone, juridicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND p.pes_telefone = ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, telefone, juridicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeNomeEnderecoEmOutroId(nome, endereco, idAtual, juridicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND p.pes_endereco = ? AND j.jur_id <> ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, endereco, idAtual, juridicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeNomeTelefoneEmOutroId(nome, telefone, idAtual, juridicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND p.pes_telefone = ? AND j.jur_id <> ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, telefone, idAtual, juridicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeNome(nome, juridicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, juridicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeNomeEmOutroId(nome, idAtual, juridicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND j.jur_id <> ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, idAtual, juridicaTipo]);
        return rows[0]?.total > 0;
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
        const pessoa = new pessoaEntity_js_1.default(row["pes_id"], row["pes_nome"], row["pes_endereco"], row["pes_telefone"], row["pes_email"], row["pes_tipo"], row["pes_ativo"] === 1 || row["pes_ativo"] === true);
        const ativoValue = row["jur_ativo"] !== undefined ? row["jur_ativo"] : row["ativo"];
        const ativo = ativoValue === 1 || ativoValue === true;
        return new juridicaEntity_js_1.default(row["jur_id"], row["jur_cnpj"], row["pes_id"], row["jur_tipo"], pessoa, ativo);
    }
}
exports.default = JuridicaRepository;
//# sourceMappingURL=juridicaRepository.js.map