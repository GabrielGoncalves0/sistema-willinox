import ItensCompraRepository from '../../repositories/relations/itensCompraRepository';
import ItensCompraEntity from '../../entities/relations/itensCompraEntity';
import { Request, Response } from 'express';

export default class ItensCompraController {
    async listar(_req: Request, res: Response) {
        try {
            const repo = new ItensCompraRepository();
            const lista = await repo.listar();
            if (lista && lista.length > 0) return res.status(200).json(lista);
            return res.status(404).json({ msg: 'Nenhum item de compra encontrado!' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req: Request, res: Response) {
        try {
            const { compraId, materiaPrimaId } = req.params;
            if (!compraId || !materiaPrimaId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new ItensCompraRepository();
            const item = await repo.obter(Number(compraId), Number(materiaPrimaId));
            if (item) return res.status(200).json(item);
            return res.status(404).json({ msg: 'Item de compra não encontrado' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async inserir(req: Request, res: Response) {
        try {
            const { compraId, materiaPrimaId, quantidade, preco } = req.body;
            if (!compraId || !materiaPrimaId || !quantidade || !preco) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new ItensCompraEntity(0, compraId, materiaPrimaId, quantidade, preco);
            const repo = new ItensCompraRepository();
            const resultado = await repo.inserir(entidade);
            if (resultado) return res.status(201).json({ msg: 'Item de compra cadastrado!' });
            throw new Error('Erro ao inserir item de compra no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id, compraId, materiaPrimaId, quantidade, preco } = req.body;
            if (!id || !compraId || !materiaPrimaId || !quantidade || !preco) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new ItensCompraRepository();
            const existente = await repo.obter(compraId, materiaPrimaId);
            if (!existente) return res.status(404).json({ msg: 'Nenhum item de compra encontrado para alteração!' });
            const entidade = new ItensCompraEntity(id, compraId, materiaPrimaId, quantidade, preco);
            const resultado = await repo.atualizar(entidade);
            if (resultado) return res.status(200).json({ msg: 'Atualização realizada com sucesso!' });
            throw new Error('Erro ao atualizar item de compra no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { compraId, materiaPrimaId } = req.params;
            if (!compraId || !materiaPrimaId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new ItensCompraRepository();
            const resultado = await repo.deletar(Number(compraId), Number(materiaPrimaId));
            if (resultado) return res.status(200).json({ msg: 'Item de compra deletado com sucesso!' });
            throw new Error('Erro ao deletar item de compra do banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }
}