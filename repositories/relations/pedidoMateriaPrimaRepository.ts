import PedidoMateriaPrimaEntity from "../../entities/relations/pedidoMateriaPrimaEntity.js";
import BaseRepository from "../baseRepository.js";
import Database from "../../db/database.js";

export default class PedidoMateriaPrimaRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<PedidoMateriaPrimaEntity[]> {
        const sql = "SELECT * FROM tb_pedido_materiaPrima ORDER BY id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async listarPorPedido(pedidoId: number): Promise<PedidoMateriaPrimaEntity[]> {
        const sql = "SELECT * FROM tb_pedido_materiaPrima WHERE ped_id = ?";
        const valores = [pedidoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }

    async obter(pedidoId: number, materiaPrimaId: number): Promise<PedidoMateriaPrimaEntity> {
        const sql = "SELECT * FROM tb_pedido_materiaPrima WHERE ped_id = ? AND matpri_id = ?";
        const valores = [pedidoId, materiaPrimaId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: PedidoMateriaPrimaEntity): Promise<boolean> {
        const sql = "INSERT INTO tb_pedido_materiaPrima (ped_id, matpri_id, qtd_materia_prima, mat_preco) VALUES (?, ?, ?, ?)";
        const valores = [
            entidade.pedidoId,
            entidade.materiaPrimaId,
            entidade.quantidade,
            entidade.preco
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar(entidade: PedidoMateriaPrimaEntity): Promise<boolean> {
        const sql = `UPDATE tb_pedido_materiaPrima
                    SET qtd_materia_prima = ?,
                        mat_preco = ?
                    WHERE ped_id = ? AND matpri_id = ?`;
        const valores = [
            entidade.quantidade,
            entidade.preco,
            entidade.pedidoId,
            entidade.materiaPrimaId
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(pedidoId: number, materiaPrimaId: number): Promise<boolean> {
        const sql = "DELETE FROM tb_pedido_materiaPrima WHERE ped_id = ? AND matpri_id = ?";
        const valores = [pedidoId, materiaPrimaId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    private toMap(rows: any): PedidoMateriaPrimaEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): PedidoMateriaPrimaEntity {
        return new PedidoMateriaPrimaEntity(
            row["id"],
            row["ped_id"],
            row["matpri_id"],
            row["qtd_materia_prima"],
            row["mat_preco"]
        );
    }
}
