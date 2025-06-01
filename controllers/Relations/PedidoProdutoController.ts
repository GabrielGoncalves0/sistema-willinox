import { Request, Response } from 'express';
import PedidoProdutoRepository from '../../repositories/relations/pedidoProdutoRepository';
import PedidoProdutoEntity from '../../entities/relations/pedidoProdutoEntity';

export default class PedidoProdutoController {
    async listar(_req: Request, res: Response) {
        try {
            const repo = new PedidoProdutoRepository();
            const lista = await repo.listar();
            if (lista && lista.length > 0) return res.status(200).json(lista);
            return res.status(404).json({ msg: 'Nenhum pedido de produto encontrado!' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req: Request, res: Response) {
        try {
            const { pedidoId, produtoId } = req.params;
            if (!pedidoId || !produtoId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new PedidoProdutoRepository();
            const pedidoProduto = await repo.obter(Number(pedidoId), Number(produtoId));
            if (pedidoProduto) return res.status(200).json(pedidoProduto);
            return res.status(404).json({ msg: 'Pedido de produto não encontrado' });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async inserir(req: Request, res: Response) {
        try {
            const { pedidoId, produtoId, quantidade, preco } = req.body;
            if (!pedidoId || !produtoId || !quantidade || !preco) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const entidade = new PedidoProdutoEntity(0, pedidoId, produtoId, quantidade, preco);
            const repo = new PedidoProdutoRepository();
            const result = await repo.inserir(entidade);
            if (result) return res.status(201).json({ msg: 'Pedido de produto cadastrado!' });
            throw new Error('Erro ao inserir pedido de produto no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id, pedidoId, produtoId, quantidade, preco } = req.body;
            if (!id || !pedidoId || !produtoId || !quantidade || !preco) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new PedidoProdutoRepository();
            const existente = await repo.obter(pedidoId, produtoId);
            if (!existente) return res.status(404).json({ msg: 'Nenhum pedido de produto encontrado para alteração!' });
            const entidade = new PedidoProdutoEntity(id, pedidoId, produtoId, quantidade, preco);
            const result = await repo.atualizar(entidade);
            if (result) return res.status(200).json({ msg: 'Atualização realizada com sucesso!' });
            throw new Error('Erro ao atualizar pedido de produto no banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { pedidoId, produtoId } = req.params;
            if (!pedidoId || !produtoId) return res.status(400).json({ msg: 'Parâmetros inválidos!' });
            const repo = new PedidoProdutoRepository();
            const result = await repo.deletar(Number(pedidoId), Number(produtoId));
            if (result) return res.status(200).json({ msg: 'Pedido de produto deletado com sucesso!' });
            throw new Error('Erro ao deletar pedido de produto do banco de dados');
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }
}