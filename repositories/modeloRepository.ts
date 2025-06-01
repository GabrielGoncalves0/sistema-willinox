import ModeloEntity from "../entities/modeloEntity.js";
import BaseRepository from "./baseRepository.js";
import Database from "../db/database.js";

export default class ModeloRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<ModeloEntity[]> {
        const sql = "SELECT * FROM tb_modelo WHERE ativo = 1 ORDER BY mod_id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id: number): Promise<ModeloEntity> {
        const sql = "SELECT * FROM tb_modelo WHERE mod_id = ? AND ativo = 1";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: ModeloEntity): Promise<boolean> {
        const sql = "INSERT INTO tb_modelo (mod_nome, mod_descricao, ativo) VALUES (?, ?, 1)";
        const valores = [entidade.nome, entidade.descricao];
        const modeloId = await this.db.ExecutaComandoNonQuery(sql, valores);
        return modeloId;
    }

    async atualizar(entidade: ModeloEntity): Promise<boolean> {
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

    async deletar(id: number): Promise<boolean> {
        const sql = "UPDATE tb_modelo SET ativo = 0 WHERE mod_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async restaurar(id: number): Promise<boolean> {
        return await this.restaurarItem("tb_modelo", "mod_id", id);
    }

    async listarTodos(): Promise<ModeloEntity[]> {
        const sql = "SELECT * FROM tb_modelo";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async existePorNome(nome: string, ignorarId?: number): Promise<boolean> {
        let sql = "SELECT COUNT(*) AS total FROM tb_modelo WHERE mod_nome = ? AND ativo = 1";
        const valores = [nome];

        if (ignorarId) {
            sql += " AND mod_id != ?";
            valores.push(ignorarId.toString());
        }

        const [row] = await this.db.ExecutaComando(sql, valores);
        return row?.total > 0;
    }

    private toMap(rows: any): ModeloEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): ModeloEntity {
        return new ModeloEntity(
            row["mod_id"],
            row["mod_nome"],
            row["mod_descricao"],
            row["ativo"]
        );
    }
}