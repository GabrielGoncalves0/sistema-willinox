"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const produtoMateriaPrimaRepository_1 = __importDefault(require("../../repositories/relations/produtoMateriaPrimaRepository"));
const produtoMateriaPrimaEntity_1 = __importDefault(require("../../entities/relations/produtoMateriaPrimaEntity"));
class ProdutoMateriaPrimaController {
    async listar(req, res) {
        try {
            const { produtoId } = req.params;
            if (!produtoId)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new produtoMateriaPrimaRepository_1.default();
            const lista = await repo.listar(Number(produtoId));
            if (lista?.length)
                return res.status(200).json(lista);
            return res.status(404).json({ msg: 'Nenhuma relação produto-matéria prima encontrada!' });
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async obter(req, res) {
        try {
            const { produtoId } = req.params;
            if (!produtoId)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new produtoMateriaPrimaRepository_1.default();
            const produtoMateriaPrima = await repo.obter(Number(produtoId));
            if (produtoMateriaPrima)
                return res.status(200).json(produtoMateriaPrima);
            return res.status(404).json({ msg: 'Relação produto-matéria prima não encontrada' });
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async inserir(req, res) {
        try {
            const { produtoId, materiaPrimaId, quantidade } = req.body;
            if (!produtoId || !materiaPrimaId || !quantidade)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new produtoMateriaPrimaEntity_1.default(0, produtoId, materiaPrimaId, quantidade);
            const repo = new produtoMateriaPrimaRepository_1.default();
            const result = await repo.inserir(entidade);
            if (result)
                return res.status(201).json({ msg: 'Relação produto-matéria prima cadastrada!' });
            throw new Error('Erro ao inserir relação produto-matéria prima no banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async atualizar(req, res) {
        try {
            const { produtoId, materiaPrimaId, quantidade } = req.body;
            if (!produtoId || !materiaPrimaId || !quantidade)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new produtoMateriaPrimaEntity_1.default(0, produtoId, materiaPrimaId, quantidade);
            const repo = new produtoMateriaPrimaRepository_1.default();
            const result = await repo.atualizar(entidade);
            if (result)
                return res.status(200).json({ msg: 'Relação produto-matéria prima atualizada!' });
            throw new Error('Erro ao atualizar relação produto-matéria prima no banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
    async deletar(req, res) {
        try {
            const { produtoId, materiaPrimaId } = req.params;
            if (!produtoId || !materiaPrimaId)
                return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new produtoMateriaPrimaRepository_1.default();
            const result = await repo.deletar(Number(produtoId), Number(materiaPrimaId));
            if (result)
                return res.status(200).json({ msg: 'Relação produto-matéria prima deletada com sucesso!' });
            throw new Error('Erro ao deletar relação produto-matéria prima do banco de dados');
        }
        catch (ex) {
            return res.status(500).json({ msg: ex.message });
        }
    }
}
exports.default = ProdutoMateriaPrimaController;
//# sourceMappingURL=ProdutoMateriaPrimaController.js.map