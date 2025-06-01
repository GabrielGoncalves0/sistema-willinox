import JuridicaEntity from "../entities/juridicaEntity.js";
import BaseRepository from "./baseRepository.js";
import Database from "../db/database.js";
import PessoaEntity from "../entities/pessoaEntity.js";

export default class JuridicaRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<JuridicaEntity[]> {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jur_tipo='fornecedor' AND jus.ativo = 1 ORDER BY jus.jur_id DESC;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async listarJuridicaClientes(): Promise<JuridicaEntity[]> {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jus.jur_tipo='cliente' AND jus.ativo = 1;";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id: number): Promise<JuridicaEntity> {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jus.jur_id = ? AND jur_tipo='fornecedor' AND jus.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async obterJuridicaCliente(id: number): Promise<JuridicaEntity> {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jus.jur_id = ? AND jus.jur_tipo='cliente' AND jus.ativo = 1;";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: JuridicaEntity): Promise<boolean> {
        const sql = "INSERT INTO tb_juridica (jur_cnpj, pes_id, jur_tipo, ativo) VALUES (?, ?, ?, 1)";
        const valores = [
            entidade.cnpj,
            entidade.pessoaId,
            entidade.juridicaTipo
        ];
        const juridicaId = await this.db.ExecutaComandoLastInserted(sql, valores);
        return juridicaId > 0;
    }

    async atualizar(entidade: JuridicaEntity): Promise<boolean> {
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

    async deletar(id: number): Promise<boolean> {
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

    async restaurar(id: number): Promise<boolean> {
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

    async listarTodos(): Promise<JuridicaEntity[]> {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jur_tipo='fornecedor'";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async listarTodosJuridicaClientes(): Promise<JuridicaEntity[]> {
        const sql = "SELECT jus.*, jus.ativo AS jur_ativo, pes.* FROM tb_juridica jus INNER JOIN tb_pessoa pes ON jus.pes_id = pes.pes_id WHERE jus.jur_tipo='cliente'";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async existeCNPJ(cnpj: string, juridicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_juridica
            WHERE jur_cnpj = ? AND jur_tipo = ? AND ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [cnpj, juridicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeCNPJEmOutroId(cnpj: string, idAtual: number, juridicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_juridica
            WHERE jur_cnpj = ? AND jur_id <> ? AND jur_tipo = ? AND ativo = 1
        `;
        const rows = await this.db.ExecutaComando(sql, [cnpj, idAtual, juridicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeNomeEndereco(nome: string, endereco: string, juridicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND p.pes_endereco = ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, endereco, juridicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeNomeTelefone(nome: string, telefone: string, juridicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND p.pes_telefone = ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, telefone, juridicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeNomeEnderecoEmOutroId(nome: string, endereco: string, idAtual: number, juridicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND p.pes_endereco = ? AND j.jur_id <> ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, endereco, idAtual, juridicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeNomeTelefoneEmOutroId(nome: string, telefone: string, idAtual: number, juridicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND p.pes_telefone = ? AND j.jur_id <> ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, telefone, idAtual, juridicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeNome(nome: string, juridicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, juridicaTipo]);
        return rows[0]?.total > 0;
    }

    async existeNomeEmOutroId(nome: string, idAtual: number, juridicaTipo: string): Promise<boolean> {
        const sql = `
            SELECT COUNT(*) as total
            FROM tb_pessoa p
            INNER JOIN tb_juridica j ON p.pes_id = j.pes_id
            WHERE p.pes_nome = ? AND j.jur_id <> ? AND j.jur_tipo = ? AND j.ativo = 1`;
        const rows = await this.db.ExecutaComando(sql, [nome, idAtual, juridicaTipo]);
        return rows[0]?.total > 0;
    }

    private toMap(rows: any): JuridicaEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): JuridicaEntity {
        const pessoa = new PessoaEntity(
            row["pes_id"],
            row["pes_nome"],
            row["pes_endereco"],
            row["pes_telefone"],
            row["pes_email"],
            row["pes_tipo"],
            row["pes_ativo"] === 1 || row["pes_ativo"] === true
        );

        const ativoValue = row["jur_ativo"] !== undefined ? row["jur_ativo"] : row["ativo"];
        const ativo = ativoValue === 1 || ativoValue === true;

        return new JuridicaEntity(
            row["jur_id"],
            row["jur_cnpj"],
            row["pes_id"],
            row["jur_tipo"],
            pessoa,
            ativo
        );
    }
}