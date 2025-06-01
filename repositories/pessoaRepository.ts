import PessoaEntity from "../entities/pessoaEntity.js";
import BaseRepository from "./baseRepository.js";
import Database from "../db/database.js";

export default class PessoaRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<PessoaEntity[]> {
        const sql = "SELECT * FROM tb_pessoa WHERE ativo = 1 ORDER BY pes_id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id: number): Promise<PessoaEntity> {
        const sql = "SELECT * FROM tb_pessoa WHERE pes_id = ? AND ativo = 1";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: PessoaEntity): Promise<number> {
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

    async atualizar(entidade: PessoaEntity): Promise<boolean> {
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

    async deletar(id: number): Promise<boolean> {
        const sql = "UPDATE tb_pessoa SET ativo = 0 WHERE pes_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    /**
     * Restaura uma pessoa que foi excluída logicamente
     * @param id ID da pessoa a ser restaurada
     * @returns true se a restauração foi bem-sucedida, false caso contrário
     */
    async restaurar(id: number): Promise<boolean> {
        return await this.restaurarItem("tb_pessoa", "pes_id", id);
    }

    /**
     * Lista todas as pessoas, incluindo as inativas
     * @returns Lista de todas as pessoas
     */
    async listarTodos(): Promise<PessoaEntity[]> {
        const sql = "SELECT * FROM tb_pessoa";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    private toMap(rows: any): PessoaEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): PessoaEntity {
        return new PessoaEntity(
            row["pes_id"],
            row["pes_nome"],
            row["pes_endereco"],
            row["pes_telefone"],
            row["pes_email"],
            row["pes_tipo"],
            row["ativo"]
        );
    }
}