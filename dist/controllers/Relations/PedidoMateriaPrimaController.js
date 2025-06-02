"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pedidoMateriaPrimaRepository_1 = __importDefault(require("../../repositories/relations/pedidoMateriaPrimaRepository"));
const pedidoMateriaPrimaEntity_1 = __importDefault(require("../../entities/relations/pedidoMateriaPrimaEntity"));
class PedidoMateriaPrimaController {
    async listar(_req, res) {
        try {
            const repo = new pedidoMateriaPrimaRepository_1.default();
            const lista = await repo.listar();
            if (lista && lista.length > 0)
                return res.status(200).json(lista);
            return res.status(404).json({ msg: 'Nenhum pedido de matéria-prima encontrado!' });
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async obter(req, res) {
        try {
            const { pedidoId, materiaPrimaId } = req.params;
            if (!pedidoId || !materiaPrimaId)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new pedidoMateriaPrimaRepository_1.default();
            const pedidoMateriaPrima = await repo.obter(Number(pedidoId), Number(materiaPrimaId));
            if (pedidoMateriaPrima)
                return res.status(200).json(pedidoMateriaPrima);
            return res.status(404).json({ msg: 'Pedido de matéria-prima não encontrado' });
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async inserir(req, res) {
        try {
            const { pedidoId, materiaPrimaId, quantidade, preco } = req.body;
            if (!pedidoId || !materiaPrimaId || !quantidade || !preco)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new pedidoMateriaPrimaEntity_1.default(0, pedidoId, materiaPrimaId, quantidade, preco);
            const repo = new pedidoMateriaPrimaRepository_1.default();
            const result = await repo.inserir(entidade);
            if (result)
                return res.status(201).json({ msg: 'Pedido de matéria-prima cadastrado!' });
            throw new Error('Erro ao inserir pedido de matéria-prima no banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async atualizar(req, res) {
        try {
            const { id, pedidoId, materiaPrimaId, quantidade, preco } = req.body;
            if (!id || !pedidoId || !materiaPrimaId || !quantidade || !preco)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new pedidoMateriaPrimaRepository_1.default();
            const existente = await repo.obter(pedidoId, materiaPrimaId);
            if (!existente)
                return res.status(404).json({ msg: 'Nenhum pedido de matéria-prima encontrado para alteração!' });
            const entidade = new pedidoMateriaPrimaEntity_1.default(id, pedidoId, materiaPrimaId, quantidade, preco);
            const result = await repo.atualizar(entidade);
            if (result)
                return res.status(200).json({ msg: 'Atualização realizada com sucesso!' });
            throw new Error('Erro ao atualizar pedido de matéria-prima no banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async deletar(req, res) {
        try {
            const { pedidoId, materiaPrimaId } = req.params;
            if (!pedidoId || !materiaPrimaId)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new pedidoMateriaPrimaRepository_1.default();
            const result = await repo.deletar(Number(pedidoId), Number(materiaPrimaId));
            if (result)
                return res.status(200).json({ msg: 'Pedido de matéria-prima deletado com sucesso!' });
            throw new Error('Erro ao deletar pedido de matéria-prima do banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
}
exports.default = PedidoMateriaPrimaController;
//# sourceMappingURL=PedidoMateriaPrimaController.js.map