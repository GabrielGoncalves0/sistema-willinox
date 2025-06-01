import { Request, Response } from 'express';
import ProdutoMateriaPrimaRepository from '../../repositories/relations/produtoMateriaPrimaRepository';
import ProdutoMateriaPrimaEntity from '../../entities/relations/produtoMateriaPrimaEntity';

export default class ProdutoMateriaPrimaController {
    async listar(req: Request, res: Response) {
        try {
            const { produtoId } = req.params;
            if (!produtoId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new ProdutoMateriaPrimaRepository();
            const lista = await repo.listar(Number(produtoId));
            if (lista?.length) return res.status(200).json(lista);
            return res.status(404).json({ msg: 'Nenhuma relação produto-matéria prima encontrada!' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req: Request, res: Response) {
        try {
            const { produtoId } = req.params;
            if (!produtoId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new ProdutoMateriaPrimaRepository();
            const produtoMateriaPrima = await repo.obter(Number(produtoId));
            if (produtoMateriaPrima) return res.status(200).json(produtoMateriaPrima);
            return res.status(404).json({ msg: 'Relação produto-matéria prima não encontrada' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async inserir(req: Request, res: Response) {
        try {
            const { produtoId, materiaPrimaId, quantidade } = req.body;
            if (!produtoId || !materiaPrimaId || !quantidade) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new ProdutoMateriaPrimaEntity(0, produtoId, materiaPrimaId, quantidade);
            const repo = new ProdutoMateriaPrimaRepository();
            const result = await repo.inserir(entidade);
            if (result) return res.status(201).json({ msg: 'Relação produto-matéria prima cadastrada!' });
            throw new Error('Erro ao inserir relação produto-matéria prima no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { produtoId, materiaPrimaId, quantidade } = req.body;
            if (!produtoId || !materiaPrimaId || !quantidade) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new ProdutoMateriaPrimaEntity(0, produtoId, materiaPrimaId, quantidade);
            const repo = new ProdutoMateriaPrimaRepository();
            const result = await repo.atualizar(entidade);
            if (result) return res.status(200).json({ msg: 'Relação produto-matéria prima atualizada!' });
            throw new Error('Erro ao atualizar relação produto-matéria prima no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { produtoId, materiaPrimaId } = req.params;
            if (!produtoId || !materiaPrimaId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new ProdutoMateriaPrimaRepository();
            const result = await repo.deletar(Number(produtoId), Number(materiaPrimaId));
            if (result) return res.status(200).json({ msg: 'Relação produto-matéria prima deletada com sucesso!' });
            throw new Error('Erro ao deletar relação produto-matéria prima do banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }
}