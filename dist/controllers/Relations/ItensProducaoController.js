"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const itensProducaoRepository_1 = __importDefault(require("../../repositories/relations/itensProducaoRepository"));
const itensProducaoEntity_1 = __importDefault(require("../../entities/relations/itensProducaoEntity"));
class ItensProducaoController {
    async listar(_req, res) {
        try {
            const repo = new itensProducaoRepository_1.default();
            const lista = await repo.listar();
            if (lista && lista.length > 0)
                return res.status(200).json(lista);
            return res.status(404).json({ msg: 'Nenhum item de produção encontrado!' });
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async obter(req, res) {
        try {
            const { materiaPrimaId, producaoId } = req.params;
            if (!materiaPrimaId || !producaoId)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new itensProducaoRepository_1.default();
            const itemProducao = await repo.obter(Number(materiaPrimaId), Number(producaoId));
            if (itemProducao)
                return res.status(200).json(itemProducao);
            return res.status(404).json({ msg: 'Item de produção não encontrado' });
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async inserir(req, res) {
        try {
            const { materiaPrimaId, producaoId, quantidade } = req.body;
            if (!materiaPrimaId || !producaoId || !quantidade)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new itensProducaoEntity_1.default(0, materiaPrimaId, producaoId, quantidade);
            const repo = new itensProducaoRepository_1.default();
            const result = await repo.inserir(entidade);
            if (result)
                return res.status(201).json({ msg: 'Item de produção cadastrado!' });
            throw new Error('Erro ao inserir item de produção no banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async atualizar(req, res) {
        try {
            const { id, materiaPrimaId, producaoId, quantidade } = req.body;
            if (!id || !materiaPrimaId || !producaoId || !quantidade)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new itensProducaoRepository_1.default();
            const existente = await repo.obter(materiaPrimaId, producaoId);
            if (!existente)
                return res.status(404).json({ msg: 'Nenhum item de produção encontrado para alteração!' });
            const entidade = new itensProducaoEntity_1.default(id, materiaPrimaId, producaoId, quantidade);
            const result = await repo.atualizar(entidade);
            if (result)
                return res.status(200).json({ msg: 'Atualização realizada com sucesso!' });
            throw new Error('Erro ao atualizar item de produção no banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async deletar(req, res) {
        try {
            const { materiaPrimaId, producaoId } = req.params;
            if (!materiaPrimaId || !producaoId)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new itensProducaoRepository_1.default();
            const result = await repo.deletar(Number(materiaPrimaId), Number(producaoId));
            if (result)
                return res.status(200).json({ msg: 'Item de produção deletado com sucesso!' });
            throw new Error('Erro ao deletar item de produção do banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
}
exports.default = ItensProducaoController;
//# sourceMappingURL=ItensProducaoController.js.map