import ItensCompraEntity from "../../entities/relations/itensCompraEntity.js";
import BaseRepository from "../baseRepository.js";
import Database from "../../db/database.js";

export default class ItensCompraRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<ItensCompraEntity[]> {
        const sql = "SELECT * FROM tb_itens_compra ORDER BY id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async listarPorCompra(compraId: number): Promise<ItensCompraEntity[]> {
        const sql = "SELECT * FROM tb_itens_compra WHERE com_id = ?";
        const valores = [compraId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }

    async obter(compraId: number, materiaPrimaId: number): Promise<ItensCompraEntity> {
        const sql = "SELECT * FROM tb_itens_compra WHERE com_id = ? AND matpri_id = ?";
        const valores = [compraId, materiaPrimaId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: ItensCompraEntity): Promise<boolean> {
        const sql = "INSERT INTO tb_itens_compra (com_id, matpri_id, qtd_materia_prima, mat_preco) VALUES (?, ?, ?, ?)";
        const valores = [
            entidade.compraId,
            entidade.materiaPrimaId,
            entidade.quantidade,
            entidade.preco
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar(entidade: ItensCompraEntity): Promise<boolean> {
        const sql = `UPDATE tb_itens_compra
                    SET qtd_materia_prima = ?,
                        mat_preco = ?
                    WHERE com_id = ? AND matpri_id = ?`;
        const valores = [
            entidade.quantidade,
            entidade.preco,
            entidade.compraId,
            entidade.materiaPrimaId
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(compraId: number, materiaPrimaId: number): Promise<boolean> {
        const sql = "DELETE FROM tb_itens_compra WHERE com_id = ? AND matpri_id = ?";
        const valores = [compraId, materiaPrimaId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }


    private toMap(rows: any): ItensCompraEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): ItensCompraEntity {
        return new ItensCompraEntity(
            row["id"],
            row["com_id"],
            row["matpri_id"],
            row["qtd_materia_prima"],
            row["mat_preco"]
        );
    }
}