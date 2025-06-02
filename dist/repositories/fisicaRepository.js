"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fisicaEntity_js_1 = __importDefault(require("../entities/fisicaEntity.js"));
const baseRepository_js_1 = __importDefault(require("./baseRepository.js"));
const pessoaEntity_js_1 = __importDefault(require("../entities/pessoaEntity.js"));
class FisicaRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.ativo = 1 ORDER BY fis.fis_id DESC;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarClientes() {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_tipo = 'cliente' OR fis.fis_tipo = 'fornecedor' AND fis.ativo = 1;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarFuncionarios() {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_tipo = 'funcionario' AND fis.ativo = 1;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async obter(id) {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_id = ? AND fis.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async obterCliente(id) {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_id = ? AND fis.fis_tipo = 'cliente' OR fis.fis_tipo = 'fornecedor' AND fis.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async obterFuncionario(id) {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_id = ? AND fis.fis_tipo = 'funcionario' AND fis.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_fisica (fis_cpf, fis_data_nascimento, fis_tipo, pes_id, fun_login, fun_senha, ativo) VALUES (?, ?, ?, ?, ?, ?, 1)";
        const valores = [
            entidade.cpf,
            entidade.dataNascimento,
            entidade.fisicaTipo,
            entidade.pessoaId,
            entidade.login,
            entidade.senha
        ];
        const fisicaId = await this.db.ExecutaComandoNonQuery(sql, valores);
        return fisicaId;
    }
    async atualizar(entidade) {
        const sql = `UPDATE tb_fisica
                    SET fis_cpf = ?,
                        fis_data_nascimento = ?,
                        fis_tipo = ?,
                        fun_login = ?,
                        fun_senha = ?,
                        pes_id = ?
                    WHERE fis_id = ? AND ativo = 1`;
        const valores = [
            entidade.cpf,
            entidade.dataNascimento,
            entidade.fisicaTipo,
            entidade.login,
            entidade.senha,
            entidade.pessoaId,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async deletar(id) {
        const getPessoaIdSql = "SELECT pes_id FROM tb_fisica WHERE fis_id = ?";
        const pessoaIdResult = await this.db.ExecutaComando(getPessoaIdSql, [id]);
        if (!pessoaIdResult || pessoaIdResult.length === 0) {
            return false;
        }
        const pessoaId = pessoaIdResult[0].pes_id;
        const fisicaSql = "UPDATE tb_fisica SET ativo = 0 WHERE fis_id = ?";
        const fisicaResult = await this.db.ExecutaComandoNonQuery(fisicaSql, [id]);
        if (!fisicaResult) {
            return false;
        }
        const pessoaSql = "UPDATE tb_pessoa SET ativo = 0 WHERE pes_id = ?";
        return await this.db.ExecutaComandoNonQuery(pessoaSql, [pessoaId]);
    }
    async restaurar(id) {
        const getPessoaIdSql = "SELECT pes_id FROM tb_fisica WHERE fis_id = ?";
        const pessoaIdResult = await this.db.ExecutaComando(getPessoaIdSql, [id]);
        if (!pessoaIdResult || pessoaIdResult.length === 0) {
            return false;
        }
        const pessoaId = pessoaIdResult[0].pes_id;
        const fisicaResult = await this.restaurarItem("tb_fisica", "fis_id", id);
        if (!fisicaResult) {
            return false;
        }
        return await this.restaurarItem("tb_pessoa", "pes_id", pessoaId);
    }
    async listarTodos() {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarTodosClientes() {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_tipo = 'cliente' OR fis.fis_tipo = 'fornecedor'";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarTodosFuncionarios() {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_tipo = 'funcionario'";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async existeNomeEndereco(nome, endereco, fisicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_fisica f ON p.pes_id = f.pes_id
            WHERE p.pes_nome = ? AND p.pes_endereco = ? AND f.fis_tipo = ? AND f.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [nome, endereco, fisicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeNomeTelefone(nome, telefone, fisicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_fisica f ON p.pes_id = f.pes_id
            WHERE p.pes_nome = ? AND p.pes_telefone = ? AND f.fis_tipo = ? AND f.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [nome, telefone, fisicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeCpf(cpf, fisicaTipo) {
        const sql = `
        SELECT COUNT(*) as total
        FROM tb_fisica
        WHERE fis_cpf = ? AND fis_tipo = ? AND ativo = 1
    `;
        const rows = await this.db.ExecutaComando(sql, [cpf, fisicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeCpfEmOutroId(cpf, idAtual, fisicaTipo) {
        const sql = `
        SELECT COUNT(*) as total
        FROM tb_fisica
        WHERE fis_cpf = ? AND fis_id <> ? AND fis_tipo = ? AND ativo = 1
    `;
        const rows = await this.db.ExecutaComando(sql, [cpf, idAtual, fisicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeNomeEnderecoEmOutroId(nome, endereco, idAtual, fisicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_fisica f ON p.pes_id = f.pes_id
            WHERE p.pes_nome = ? AND p.pes_endereco = ? AND f.fis_id <> ? AND f.fis_tipo = ? AND f.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [nome, endereco, idAtual, fisicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeNomeTelefoneEmOutroId(nome, telefone, idAtual, fisicaTipo) {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_fisica f ON p.pes_id = f.pes_id
            WHERE p.pes_nome = ? AND p.pes_telefone = ? AND f.fis_id <> ? AND f.fis_tipo = ? AND f.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [nome, telefone, idAtual, fisicaTipo]);
        return rows[0]?.total > 0;
    }
    async existeLogin(login) {
        const sql = `
            SELECT COUNT(*) as count
            FROM tb_fisica f
            INNER JOIN tb_pessoa p ON f.pes_id = p.pes_id
            WHERE f.fun_login = ? AND f.ativo = 1 AND p.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [login]);
        return rows[0]?.count > 0;
    }
    async existeLoginEmOutroId(login, idAtual) {
        const sql = `
            SELECT COUNT(*) as count
            FROM tb_fisica f
            INNER JOIN tb_pessoa p ON f.pes_id = p.pes_id
            WHERE f.fun_login = ? AND f.fis_id <> ? AND f.ativo = 1 AND p.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [login, idAtual]);
        return rows[0]?.count > 0;
    }
    async validarAcesso(login, senha) {
        const sql = `
            SELECT f.*, p.*
            FROM tb_fisica f
            INNER JOIN tb_pessoa p ON f.pes_id = p.pes_id
            WHERE f.fun_login = ? AND f.fun_senha = ? AND f.ativo = 1 AND p.ativo = 1;
        `;
        const valores = [login, senha];
        const rows = await this.db.ExecutaComando(sql, valores);
        if (rows.length > 0) {
            return this.mapToEntity(rows[0]);
        }
        else {
            return null;
        }
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
        const pessoa = new pessoaEntity_js_1.default(row["pes_id"], row["pes_nome"], row["pes_endereco"], row["pes_telefone"], row["pes_email"], row["pes_tipo"]);
        return new fisicaEntity_js_1.default(row["fis_id"], row["fis_cpf"], row["fis_data_nascimento"], row["pes_id"], row["fis_tipo"], row["fun_login"], row["fun_senha"], pessoa, row["ativo"]);
    }
}
exports.default = FisicaRepository;
//# sourceMappingURL=fisicaRepository.js.map