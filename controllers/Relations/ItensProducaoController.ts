import { Request, Response } from 'express';
import ItensProducaoRepository from '../../repositories/relations/itensProducaoRepository';
import ItensProducaoEntity from '../../entities/relations/itensProducaoEntity';

export default class ItensProducaoController {
    async listar(_req: Request, res: Response) {
        try {
            const repo = new ItensProducaoRepository();
            const lista = await repo.listar();
            if (lista && lista.length > 0) return res.status(200).json(lista);
            return res.status(404).json({ msg: 'Nenhum item de produção encontrado!' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req: Request, res: Response) {
        try {
            const { materiaPrimaId, producaoId } = req.params;
            if (!materiaPrimaId || !producaoId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new ItensProducaoRepository();
            const itemProducao = await repo.obter(Number(materiaPrimaId), Number(producaoId));
            if (itemProducao) return res.status(200).json(itemProducao);
            return res.status(404).json({ msg: 'Item de produção não encontrado' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async inserir(req: Request, res: Response) {
        try {
            const { materiaPrimaId, producaoId, quantidade } = req.body;
            if (!materiaPrimaId || !producaoId || !quantidade) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new ItensProducaoEntity(0, materiaPrimaId, producaoId, quantidade);
            const repo = new ItensProducaoRepository();
            const result = await repo.inserir(entidade);
            if (result) return res.status(201).json({ msg: 'Item de produção cadastrado!' });
            throw new Error('Erro ao inserir item de produção no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id, materiaPrimaId, producaoId, quantidade } = req.body;
            if (!id || !materiaPrimaId || !producaoId || !quantidade) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new ItensProducaoRepository();
            const existente = await repo.obter(materiaPrimaId, producaoId);
            if (!existente) return res.status(404).json({ msg: 'Nenhum item de produção encontrado para alteração!' });
            const entidade = new ItensProducaoEntity(id, materiaPrimaId, producaoId, quantidade);
            const result = await repo.atualizar(entidade);
            if (result) return res.status(200).json({ msg: 'Atualização realizada com sucesso!' });
            throw new Error('Erro ao atualizar item de produção no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { materiaPrimaId, producaoId } = req.params;
            if (!materiaPrimaId || !producaoId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new ItensProducaoRepository();
            const result = await repo.deletar(Number(materiaPrimaId), Number(producaoId));
            if (result) return res.status(200).json({ msg: 'Item de produção deletado com sucesso!' });
            throw new Error('Erro ao deletar item de produção do banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }
}