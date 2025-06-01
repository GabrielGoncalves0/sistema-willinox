import { Request, Response } from 'express';
import PedidoMateriaPrimaRepository from '../../repositories/relations/pedidoMateriaPrimaRepository';
import PedidoMateriaPrimaEntity from '../../entities/relations/pedidoMateriaPrimaEntity';

export default class PedidoMateriaPrimaController {
    async listar(_req: Request, res: Response) {
        try {
            const repo = new PedidoMateriaPrimaRepository();
            const lista = await repo.listar();
            if (lista && lista.length > 0) return res.status(200).json(lista);
            return res.status(404).json({ msg: 'Nenhum pedido de matéria-prima encontrado!' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req: Request, res: Response) {
        try {
            const { pedidoId, materiaPrimaId } = req.params;
            if (!pedidoId || !materiaPrimaId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new PedidoMateriaPrimaRepository();
            const pedidoMateriaPrima = await repo.obter(Number(pedidoId), Number(materiaPrimaId));
            if (pedidoMateriaPrima) return res.status(200).json(pedidoMateriaPrima);
            return res.status(404).json({ msg: 'Pedido de matéria-prima não encontrado' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async inserir(req: Request, res: Response) {
        try {
            const { pedidoId, materiaPrimaId, quantidade, preco } = req.body;
            if (!pedidoId || !materiaPrimaId || !quantidade || !preco) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new PedidoMateriaPrimaEntity(0, pedidoId, materiaPrimaId, quantidade, preco);
            const repo = new PedidoMateriaPrimaRepository();
            const result = await repo.inserir(entidade);
            if (result) return res.status(201).json({ msg: 'Pedido de matéria-prima cadastrado!' });
            throw new Error('Erro ao inserir pedido de matéria-prima no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id, pedidoId, materiaPrimaId, quantidade, preco } = req.body;
            if (!id || !pedidoId || !materiaPrimaId || !quantidade || !preco) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new PedidoMateriaPrimaRepository();
            const existente = await repo.obter(pedidoId, materiaPrimaId);
            if (!existente) return res.status(404).json({ msg: 'Nenhum pedido de matéria-prima encontrado para alteração!' });
            const entidade = new PedidoMateriaPrimaEntity(id, pedidoId, materiaPrimaId, quantidade, preco);
            const result = await repo.atualizar(entidade);
            if (result) return res.status(200).json({ msg: 'Atualização realizada com sucesso!' });
            throw new Error('Erro ao atualizar pedido de matéria-prima no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { pedidoId, materiaPrimaId } = req.params;
            if (!pedidoId || !materiaPrimaId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new PedidoMateriaPrimaRepository();
            const result = await repo.deletar(Number(pedidoId), Number(materiaPrimaId));
            if (result) return res.status(200).json({ msg: 'Pedido de matéria-prima deletado com sucesso!' });
            throw new Error('Erro ao deletar pedido de matéria-prima do banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }
}