"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pedidoEntity_js_1 = __importDefault(require("../entities/pedidoEntity.js"));
const baseRepository_js_1 = __importDefault(require("./baseRepository.js"));
class PedidoRepository extends baseRepository_js_1.default {
    constructor(db) {
        super(db);
    }
    async listar() {
        const sql = "SELECT * FROM tb_pedido ORDER BY ped_id DESC";
        const rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }
    async obter(id) {
        const sql = "SELECT * FROM tb_pedido WHERE ped_id = ?";
        const valores = [id];
        const rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows)[0];
    }
    async inserir(entidade) {
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
    async atualizar(entidade) {
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
    async deletar(id) {
        try {
            const sqlProdutos = "DELETE FROM tb_pedido_produto WHERE ped_id = ?";
            await this.db.ExecutaComandoNonQuery(sqlProdutos, [id]);
            const sqlMateriasPrimas = "DELETE FROM tb_pedido_materiaPrima WHERE ped_id = ?";
            await this.db.ExecutaComandoNonQuery(sqlMateriasPrimas, [id]);
            const sqlPedido = "DELETE FROM tb_pedido WHERE ped_id = ?";
            return await this.db.ExecutaComandoNonQuery(sqlPedido, [id]);
        }
        catch (error) {
            console.error("Erro ao deletar pedido:", error);
            return false;
        }
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
        return new pedidoEntity_js_1.default(row["ped_id"], new Date(row["ped_data"]), row["ped_status"], row["pes_id"], row["ped_valor_entrada"] || 0);
    }
}
exports.default = PedidoRepository;
//# sourceMappingURL=pedidoRepository.js.map