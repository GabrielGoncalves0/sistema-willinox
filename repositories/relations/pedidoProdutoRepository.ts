import PedidoProdutoEntity from "../../entities/relations/pedidoProdutoEntity.js";
import BaseRepository from "../baseRepository.js";
import Database from "../../db/database.js";

export default class PedidoProdutoRepository extends BaseRepository {
    constructor(db?: Database) {
        super(db);
    }

    async listar(): Promise<PedidoProdutoEntity[]> {
        const sql = "SELECT * FROM tb_pedido_produto";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async listarPorPedido(pedidoId: number): Promise<PedidoProdutoEntity[]> {
        const sql = "SELECT * FROM tb_pedido_produto WHERE ped_id = ?";
        const valores = [pedidoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }

    async obter(pedidoId: number, produtoId: number): Promise<PedidoProdutoEntity> {
        const sql = "SELECT * FROM tb_pedido_produto WHERE ped_id = ? AND pro_id = ?";
        const valores = [pedidoId, produtoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }

    async inserir(entidade: PedidoProdutoEntity): Promise<boolean> {
        const sql = "INSERT INTO tb_pedido_produto (ped_id, pro_id, qtd_produto, pro_preco) VALUES (?, ?, ?, ?)";
        const valores = [
            entidade.pedidoId,
            entidade.produtoId,
            entidade.quantidade,
            entidade.preco
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar(entidade: PedidoProdutoEntity): Promise<boolean> {
        const sql = `UPDATE tb_pedido_produto
                    SET qtd_produto = ?,
                        pro_preco = ?
                    WHERE ped_id = ? AND pro_id = ?`;
        const valores = [
            entidade.quantidade,
            entidade.preco,
            entidade.pedidoId,
            entidade.produtoId
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(pedidoId: number, produtoId: number): Promise<boolean> {
        const sql = "DELETE FROM tb_pedido_produto WHERE ped_id = ? AND pro_id = ?";
        const valores = [pedidoId, produtoId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    private toMap(rows: any): PedidoProdutoEntity[] {
        if (Array.isArray(rows)) {
            return rows.map(this.mapToEntity.bind(this));
        } else {
            return [this.mapToEntity(rows)];
        }
    }

    private mapToEntity(row: any): PedidoProdutoEntity {
        return new PedidoProdutoEntity(
            row["id"],
            row["ped_id"],
            row["pro_id"],
            row["qtd_produto"],
            row['pro_preco']
        );
    }
}