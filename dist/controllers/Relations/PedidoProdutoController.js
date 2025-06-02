"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pedidoProdutoRepository_1 = __importDefault(require("../../repositories/relations/pedidoProdutoRepository"));
const pedidoProdutoEntity_1 = __importDefault(require("../../entities/relations/pedidoProdutoEntity"));
class PedidoProdutoController {
    async listar(_req, res) {
        try {
            const repo = new pedidoProdutoRepository_1.default();
            const lista = await repo.listar();
            if (lista && lista.length > 0)
                return res.status(200).json(lista);
            return res.status(404).json({ msg: 'Nenhum pedido de produto encontrado!' });
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async obter(req, res) {
        try {
            const { pedidoId, produtoId } = req.params;
            if (!pedidoId || !produtoId)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new pedidoProdutoRepository_1.default();
            const pedidoProduto = await repo.obter(Number(pedidoId), Number(produtoId));
            if (pedidoProduto)
                return res.status(200).json(pedidoProduto);
            return res.status(404).json({ msg: 'Pedido de produto não encontrado' });
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async inserir(req, res) {
        try {
            const { pedidoId, produtoId, quantidade, preco } = req.body;
            if (!pedidoId || !produtoId || !quantidade || !preco)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new pedidoProdutoEntity_1.default(0, pedidoId, produtoId, quantidade, preco);
            const repo = new pedidoProdutoRepository_1.default();
            const result = await repo.inserir(entidade);
            if (result)
                return res.status(201).json({ msg: 'Pedido de produto cadastrado!' });
            throw new Error('Erro ao inserir pedido de produto no banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async atualizar(req, res) {
        try {
            const { id, pedidoId, produtoId, quantidade, preco } = req.body;
            if (!id || !pedidoId || !produtoId || !quantidade || !preco)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new pedidoProdutoRepository_1.default();
            const existente = await repo.obter(pedidoId, produtoId);
            if (!existente)
                return res.status(404).json({ msg: 'Nenhum pedido de produto encontrado para alteração!' });
            const entidade = new pedidoProdutoEntity_1.default(id, pedidoId, produtoId, quantidade, preco);
            const result = await repo.atualizar(entidade);
            if (result)
                return res.status(200).json({ msg: 'Atualização realizada com sucesso!' });
            throw new Error('Erro ao atualizar pedido de produto no banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async deletar(req, res) {
        try {
            const { pedidoId, produtoId } = req.params;
            if (!pedidoId || !produtoId)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new pedidoProdutoRepository_1.default();
            const result = await repo.deletar(Number(pedidoId), Number(produtoId));
            if (result)
                return res.status(200).json({ msg: 'Pedido de produto deletado com sucesso!' });
            throw new Error('Erro ao deletar pedido de produto do banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
}
exports.default = PedidoProdutoController;
//# sourceMappingURL=PedidoProdutoController.js.map