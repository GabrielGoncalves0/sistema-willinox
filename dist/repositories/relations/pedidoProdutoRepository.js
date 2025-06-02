"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pedidoProdutoEntity_js_1 = __importDefault(require("../../entities/relations/pedidoProdutoEntity.js"));
const baseRepository_js_1 = __importDefault(require("../baseRepository.js"));
class PedidoProdutoRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_pedido_produto";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async listarPorPedido(pedidoId) {
        const sql = "SELECT * FROM tb_pedido_produto WHERE ped_id = ?";
        const valores = [pedidoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }
    async obter(pedidoId, produtoId) {
        const sql = "SELECT * FROM tb_pedido_produto WHERE ped_id = ? AND pro_id = ?";
        const valores = [pedidoId, produtoId];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
        const sql = "INSERT INTO tb_pedido_produto (ped_id, pro_id, qtd_produto, pro_preco) VALUES (?, ?, ?, ?)";
        const valores = [
            entidade.pedidoId,
            entidade.produtoId,
            entidade.quantidade,
            entidade.preco
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
    async atualizar(entidade) {
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
    async deletar(pedidoId, produtoId) {
        const sql = "DELETE FROM tb_pedido_produto WHERE ped_id = ? AND pro_id = ?";
        const valores = [pedidoId, produtoId];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
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
        return new pedidoProdutoEntity_js_1.default(row["id"], row["ped_id"], row["pro_id"], row["qtd_produto"], row['pro_preco']);
    }
}
exports.default = PedidoProdutoRepository;
//# sourceMappingURL=pedidoProdutoRepository.js.map