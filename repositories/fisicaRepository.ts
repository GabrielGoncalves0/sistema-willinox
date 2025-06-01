import FisicaEntity from "../entities/fisicaEntity.js";
import BaseRepository from "./baseRepository.js";
import Database from "../db/database.js";
import PessoaEntity from "../entities/pessoaEntity.js";

export default class FisicaRepository extends BaseRepository {

    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<FisicaEntity[]> {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.ativo = 1 ORDER BY fis.fis_id DESC;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async listarClientes(): Promise<FisicaEntity[]> {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_tipo = 'cliente' OR fis.fis_tipo = 'fornecedor' AND fis.ativo = 1;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async listarFuncionarios(): Promise<FisicaEntity[]> {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_tipo = 'funcionario' AND fis.ativo = 1;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id: number): Promise<FisicaEntity> {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_id = ? AND fis.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async obterCliente(id: number): Promise<FisicaEntity> {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_id = ? AND fis.fis_tipo = 'cliente' OR fis.fis_tipo = 'fornecedor' AND fis.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async obterFuncionario(id: number): Promise<FisicaEntity> {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_id = ? AND fis.fis_tipo = 'funcionario' AND fis.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: FisicaEntity): Promise<boolean> {
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

    async atualizar(entidade: FisicaEntity): Promise<boolean> {
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

    async deletar(id: number): Promise<boolean> {

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


    async restaurar(id: number): Promise<boolean> {

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


    async listarTodos(): Promise<FisicaEntity[]> {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }


    async listarTodosClientes(): Promise<FisicaEntity[]> {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_tipo = 'cliente' OR fis.fis_tipo = 'fornecedor'";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }


    async listarTodosFuncionarios(): Promise<FisicaEntity[]> {
        const sql = "SELECT * FROM tb_fisica fis INNER JOIN tb_pessoa pes ON fis.pes_id = pes.pes_id WHERE fis.fis_tipo = 'funcionario'";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async existeNomeEndereco(nome: string, endereco: string, fisicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_fisica f ON p.pes_id = f.pes_id
            WHERE p.pes_nome = ? AND p.pes_endereco = ? AND f.fis_tipo = ? AND f.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [nome, endereco, fisicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeNomeTelefone(nome: string, telefone: string, fisicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_fisica f ON p.pes_id = f.pes_id
            WHERE p.pes_nome = ? AND p.pes_telefone = ? AND f.fis_tipo = ? AND f.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [nome, telefone, fisicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeCpf(cpf: string, fisicaTipo: string): Promise<boolean> {
        const sql = `
        SELECT COUNT(*) as total
        FROM tb_fisica
        WHERE fis_cpf = ? AND fis_tipo = ? AND ativo = 1
    `;
        const rows = await this.db.ExecutaComando(sql, [cpf, fisicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeCpfEmOutroId(cpf: string, idAtual: number, fisicaTipo: string): Promise<boolean> {
        const sql = `
        SELECT COUNT(*) as total
        FROM tb_fisica
        WHERE fis_cpf = ? AND fis_id <> ? AND fis_tipo = ? AND ativo = 1
    `;
        const rows = await this.db.ExecutaComando(sql, [cpf, idAtual, fisicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeNomeEnderecoEmOutroId(nome: string, endereco: string, idAtual: number, fisicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_fisica f ON p.pes_id = f.pes_id
            WHERE p.pes_nome = ? AND p.pes_endereco = ? AND f.fis_id <> ? AND f.fis_tipo = ? AND f.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [nome, endereco, idAtual, fisicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeNomeTelefoneEmOutroId(nome: string, telefone: string, idAtual: number, fisicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_fisica f ON p.pes_id = f.pes_id
            WHERE p.pes_nome = ? AND p.pes_telefone = ? AND f.fis_id <> ? AND f.fis_tipo = ? AND f.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [nome, telefone, idAtual, fisicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeLogin(login: string): Promise<boolean> {

        const sql = `
            SELECT COUNT(*) as count
            FROM tb_fisica f
            INNER JOIN tb_pessoa p ON f.pes_id = p.pes_id
            WHERE f.fun_login = ? AND f.ativo = 1 AND p.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [login]);
        return rows[0]?.count > 0;
    }

    async existeLoginEmOutroId(login: string, idAtual: number): Promise<boolean> {

        const sql = `
            SELECT COUNT(*) as count
            FROM tb_fisica f
            INNER JOIN tb_pessoa p ON f.pes_id = p.pes_id
            WHERE f.fun_login = ? AND f.fis_id <> ? AND f.ativo = 1 AND p.ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [login, idAtual]);
        return rows[0]?.count > 0;
    }

    async validarAcesso(login: string, senha: string): Promise<FisicaEntity | null> {
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
        } else {
            return null;
        }
    }

    private toMap(rows: any): FisicaEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): FisicaEntity {
        const pessoa = new PessoaEntity(
            row["pes_id"],
            row["pes_nome"],
            row["pes_endereco"],
            row["pes_telefone"],
            row["pes_email"],
            row["pes_tipo"]
        );

        return new FisicaEntity(
            row["fis_id"],
            row["fis_cpf"],
            row["fis_data_nascimento"],
            row["pes_id"],
            row["fis_tipo"],
            row["fun_login"],
            row["fun_senha"],
            pessoa,
            row["ativo"]
        );
    }
}