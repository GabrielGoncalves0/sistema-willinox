import CompraEntity from "../entities/compraEntity.js";
import BaseRepository from "./baseRepository.js";
import Database from "../db/database.js";

export default class CompraRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<CompraEntity[]> {
        const sql = "SELECT * FROM tb_compra";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id: number): Promise<CompraEntity> {
        const sql = "SELECT * FROM tb_compra WHERE com_id = ?";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: CompraEntity): Promise<number> {
        const sql = "INSERT INTO tb_compra (com_data, com_status, com_valor_total, jur_id) VALUES (?, ?, ?, ?)";
        const valores = [
            entidade.data,
            entidade.status,
            entidade.valorTotal,
            entidade.juridicaId
        ];
        const compraId = await this.db.ExecutaComandoLastInserted(sql, valores);
        return compraId;
    }

    async atualizar(entidade: CompraEntity): Promise<boolean> {
        const sql = `UPDATE tb_compra
                    SET com_data = ?,
                        com_status = ?,
                        com_valor_total = ?,
                        jur_id = ?
                    WHERE com_id = ?`;
        const valores = [
            entidade.data,
            entidade.status,
            entidade.valorTotal,
            entidade.juridicaId,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id: number): Promise<boolean> {
        const sql = "DELETE FROM tb_compra WHERE com_id = ?";
        const valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    private toMap(rows: any): CompraEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): CompraEntity {
        return new CompraEntity(
            row["com_id"],
            new Date(row["com_data"]),
            row["com_status"],
            row["jur_id"],
            row["com_valor_total"]
        );
    }
}