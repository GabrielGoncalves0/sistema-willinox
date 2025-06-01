import PedidoEntity from "../entities/pedidoEntity.js";
import BaseRepository from "./baseRepository.js";
import Database from "../db/database.js";

export default class PedidoRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<PedidoEntity[]> {
        const sql = "SELECT * FROM tb_pedido ORDER BY ped_id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id: number): Promise<PedidoEntity> {
        const sql = "SELECT * FROM tb_pedido WHERE ped_id = ?";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: PedidoEntity): Promise<number> {
        const sql = "INSERT INTO tb_pedido (ped_data, ped_status, pes_id, ped_valor_entrada) VALUES (?, ?, ?, ?)";
        const valores = [
            entidade.data,
            entidade.status,
            entidade.pessoaId,
            entidade.valorEntrada
        ];

        const pedidoId = await this.db.ExecutaComandoLastInserted(sql, valores);
        return pedidoId;
    }

    async atualizar(entidade: PedidoEntity): Promise<boolean> {
        const sql = `UPDATE tb_pedido
                    SET ped_data = ?,
                        ped_status = ?,
                        pes_id = ?,
                        ped_valor_entrada = ?
                    WHERE ped_id = ?`;
        const valores = [
            entidade.data,
            entidade.status,
            entidade.pessoaId,
            entidade.valorEntrada,
            entidade.id
        ];

        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id: number): Promise<boolean> {
        try {
            const sqlProdutos = "DELETE FROM tb_pedido_produto WHERE ped_id = ?";
            await this.db.ExecutaComandoNonQuery(sqlProdutos, [id]);

            const sqlMateriasPrimas = "DELETE FROM tb_pedido_materiaPrima WHERE ped_id = ?";
            await this.db.ExecutaComandoNonQuery(sqlMateriasPrimas, [id]);

            const sqlPedido = "DELETE FROM tb_pedido WHERE ped_id = ?";
            return await this.db.ExecutaComandoNonQuery(sqlPedido, [id]);
        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
            return false;
        }
    }

    private toMap(rows: any): PedidoEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): PedidoEntity {
        return new PedidoEntity(
            row["ped_id"],
            new Date(row["ped_data"]),
            row["ped_status"],
            row["pes_id"],
            row["ped_valor_entrada"] || 0
        );
    }
}