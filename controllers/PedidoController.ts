import { Request, Response } from 'express';
import PedidoRepository from '../repositories/pedidoRepository';
import PedidoEntity from '../entities/pedidoEntity';
import { PedidoStatus } from '../entities/enum/types';
import PedidoProdutoRepository from '../repositories/relations/pedidoProdutoRepository';
import PedidoMateriaPrimaRepository from '../repositories/relations/pedidoMateriaPrimaRepository';
import PedidoProdutoEntity from '../entities/relations/pedidoProdutoEntity';
import PedidoMateriaPrimaEntity from '../entities/relations/pedidoMateriaPrimaEntity';
import ProdutoRepository from '../repositories/produtoRepository';
import MateriaPrimaRepository from '../repositories/materiaPrimaRepository';

function createLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export default class PedidoController {
    async listar(_req: Request, res: Response) {
        try {
            const repo = new PedidoRepository();
            const lista = await repo.listar();
            if (!lista || lista.length === 0) return res.status(200).json([]);
            const pedidosDetalhados = await Promise.all(lista.map(async (pedido) => {
                const pedidoProdutoRepo = new PedidoProdutoRepository();
                const pedidoMateriaPrimaRepo = new PedidoMateriaPrimaRepository();
                const produtoRepo = new ProdutoRepository();
                const materiaPrimaRepo = new MateriaPrimaRepository();
                const produtosDoPedido = await pedidoProdutoRepo.listarPorPedido(pedido.id);
                const produtosDetalhados = await Promise.all((produtosDoPedido || []).map(async (item) => {
                    const produto = await produtoRepo.obter(item.produtoId, true);
                    return {
                        id: item.id,
                        pedidoId: item.pedidoId,
                        produtoId: item.produtoId,
                        quantidade: item.quantidade,
                        preco: item.preco,
                        produto: produto ? {
                            id: produto.id,
                            nome: produto.nome,
                            descricao: produto.descricao,
                            preco: produto.preco,
                            codigo: produto.codigo
                        } : null
                    };
                }));
                const materiasPrimasDoPedido = await pedidoMateriaPrimaRepo.listarPorPedido(pedido.id);
                const materiasPrimasDetalhadas = await Promise.all((materiasPrimasDoPedido || []).map(async (item) => {
                    const materiaPrima = await materiaPrimaRepo.obter(item.materiaPrimaId);
                    return {
                        id: item.id,
                        pedidoId: item.pedidoId,
                        materiaPrimaId: item.materiaPrimaId,
                        quantidade: item.quantidade,
                        preco: item.preco,
                        materiaPrima: materiaPrima ? {
                            id: materiaPrima.id,
                            nome: materiaPrima.nome,
                            descricao: materiaPrima.descricao,
                            preco: materiaPrima.preco,
                            unidadeMedida: materiaPrima.unidadeMedida,
                            codigo: materiaPrima.codigo
                        } : null
                    };
                }));
                const valorTotalProdutos = produtosDetalhados.reduce((total, item) => total + ((Number(item.quantidade) || 0) * (Number(item.preco) || 0)), 0);
                const valorTotalMateriasPrimas = materiasPrimasDetalhadas.reduce((total, item) => total + ((Number(item.quantidade) || 0) * (Number(item.preco) || 0)), 0);
                const valorTotal = valorTotalProdutos + valorTotalMateriasPrimas;
                return {
                    pedido,
                    produtos: produtosDetalhados,
                    materiasPrimas: materiasPrimasDetalhadas,
                    valorTotal
                };
            }));
            res.status(200).json(pedidosDetalhados);
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new PedidoRepository();
            const pedido = await repo.obter(parseInt(id));
            if (pedido) {
                res.status(200).json(pedido);
            } else {
                res.status(404).json({ msg: "Pedido não encontrado" });
            }
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async inserir(req: Request, res: Response) {
        try {
            const { data, status, pessoaId } = req.body;
            if (data && pessoaId) {
                const entidade = new PedidoEntity(
                    0,
                    createLocalDate(data),
                    status || PedidoStatus.PENDENTE,
                    pessoaId
                );

                const repo = new PedidoRepository();
                const pedidoId = await repo.inserir(entidade);
                if (pedidoId > 0) {
                    res.status(201).json({
                        msg: "Pedido cadastrado!",
                        pedidoId: pedidoId
                    });
                } else {
                    throw new Error("Erro ao inserir pedido no banco de dados");
                }
            } else {
                res.status(400).json({ msg: "Parâmetros inválidos!" });
            }
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id, data, status, pessoaId } = req.body;
            if (id && data && pessoaId) {
                const repo = new PedidoRepository();
                if (await repo.obter(id)) {
                    const entidade = new PedidoEntity(
                        id,
                        createLocalDate(data),
                        status || PedidoStatus.PENDENTE,
                        pessoaId
                    );

                    const result = await repo.atualizar(entidade);
                    if (result)
                        res.status(200).json({ msg: "Atualização realizada com sucesso!" });
                    else
                        throw new Error("Erro ao atualizar pedido no banco de dados");
                } else {
                    res.status(404).json({ msg: "Nenhum pedido encontrado para alteração!" });
                }
            } else {
                res.status(400).json({ msg: "Parâmetros inválidos" });
            }
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new PedidoRepository();
            const result = await repo.deletar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Pedido deletado com sucesso!" });
            else
                throw new Error("Erro ao deletar pedido do banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async criarPedidoComItens(req: Request, res: Response) {
        const db = new PedidoRepository().db;
        try {
            const { data, pessoaId, valorEntrada, produtos, materiasPrimas } = req.body;
            if (!data || !pessoaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos! É necessário fornecer data e pessoaId." });
            }
            if ((!produtos || produtos.length === 0) && (!materiasPrimas || materiasPrimas.length === 0)) {
                return res.status(400).json({ msg: "É necessário fornecer pelo menos um produto ou uma matéria-prima para o pedido." });
            }
            await db.AbreTransacao();
            const pedidoRepo = new PedidoRepository();
            const pedidoEntity = new PedidoEntity(
                0,
                createLocalDate(data),
                PedidoStatus.PENDENTE,
                pessoaId,
                valorEntrada || 0
            );
            const pedidoId = await pedidoRepo.inserir(pedidoEntity);
            if (pedidoId <= 0) throw new Error("Erro ao inserir pedido no banco de dados");
            if (produtos && produtos.length > 0) {
                const pedidoProdutoRepo = new PedidoProdutoRepository();
                const produtoRepo = new ProdutoRepository();
                for (const item of produtos) {
                    const produto = await produtoRepo.obter(item.produtoId);
                    if (!produto) throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
                    if (produto.qtdEstoque < item.quantidade) throw new Error(`Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.qtdEstoque}, Necessário: ${item.quantidade}`);
                    const pedidoProdutoEntity = new PedidoProdutoEntity(0, pedidoId, item.produtoId, item.quantidade, item.preco || produto.preco);
                    const itemInserido = await pedidoProdutoRepo.inserir(pedidoProdutoEntity);
                    if (!itemInserido) throw new Error(`Erro ao inserir produto ${item.produtoId} no pedido.`);
                }
            }
            if (materiasPrimas && materiasPrimas.length > 0) {
                const pedidoMateriaPrimaRepo = new PedidoMateriaPrimaRepository();
                const materiaPrimaRepo = new MateriaPrimaRepository();
                for (const item of materiasPrimas) {
                    const materiaPrima = await materiaPrimaRepo.obter(item.materiaPrimaId);
                    if (!materiaPrima) throw new Error(`Matéria-prima com ID ${item.materiaPrimaId} não encontrada.`);
                    if (materiaPrima.qtdEstoque < item.quantidade) throw new Error(`Estoque insuficiente para a matéria-prima ${materiaPrima.nome}. Disponível: ${materiaPrima.qtdEstoque}, Necessário: ${item.quantidade}`);
                    const pedidoMateriaPrimaEntity = new PedidoMateriaPrimaEntity(0, pedidoId, item.materiaPrimaId, item.quantidade, item.preco || materiaPrima.preco);
                    const itemInserido = await pedidoMateriaPrimaRepo.inserir(pedidoMateriaPrimaEntity);
                    if (!itemInserido) throw new Error(`Erro ao inserir matéria-prima ${item.materiaPrimaId} no pedido.`);
                }
            }
            await db.Commit();
            return res.status(201).json({ msg: "Pedido cadastrado com sucesso!", pedidoId });
        } catch (ex: any) {
            await db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }

    async atualizarPedidoComItens(req: Request, res: Response) {
        const db = new PedidoRepository().db;
        try {
            const { id, data, status, pessoaId, valorEntrada, produtos, materiasPrimas } = req.body;
            if (!id || !data || !pessoaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos! É necessário fornecer id, data e pessoaId." });
            }
            await db.AbreTransacao();
            const pedidoRepo = new PedidoRepository();
            const pedidoAtual = await pedidoRepo.obter(id);
            if (!pedidoAtual) throw new Error("Pedido não encontrado!");
            if (pedidoAtual.status === PedidoStatus.CONCLUIDO || pedidoAtual.status === PedidoStatus.CANCELADO) {
                throw new Error(`Não é possível alterar um pedido com status ${pedidoAtual.status}.`);
            }
            const pedidoEntity = new PedidoEntity(
                id,
                createLocalDate(data),
                status || pedidoAtual.status,
                pessoaId,
                valorEntrada !== undefined ? valorEntrada : pedidoAtual.valorEntrada
            );
            const result = await pedidoRepo.atualizar(pedidoEntity);
            if (!result) throw new Error("Erro ao atualizar pedido no banco de dados");
            const pedidoProdutoRepo = new PedidoProdutoRepository();
            const produtoRepo = new ProdutoRepository();
            const pedidoMateriaPrimaRepo = new PedidoMateriaPrimaRepository();
            const materiaPrimaRepo = new MateriaPrimaRepository();
            if (produtos && produtos.length > 0) {
                const produtosAtuais = await pedidoProdutoRepo.listarPorPedido(id);
                const produtosAtuaisMap = new Map(produtosAtuais.map((item: any) => [item.produtoId, item]));
                const produtosNovosMap = new Map(produtos.map((item: any) => [item.produtoId, item]));
                for (const item of produtos) {
                    const produtoAtual = produtosAtuaisMap.get(item.produtoId);
                    const produto = await produtoRepo.obter(item.produtoId);
                    if (!produto) throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
                    if (produtoAtual) {
                        const diferencaQuantidade = item.quantidade - produtoAtual.quantidade;
                        if (diferencaQuantidade > 0 && produto.qtdEstoque < diferencaQuantidade) {
                            throw new Error(`Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.qtdEstoque}, Necessário adicional: ${diferencaQuantidade}`);
                        }
                        const pedidoProdutoEntity = new PedidoProdutoEntity(produtoAtual.id, id, item.produtoId, item.quantidade, item.preco || produto.preco);
                        await pedidoProdutoRepo.atualizar(pedidoProdutoEntity);
                    } else {
                        if (produto.qtdEstoque < item.quantidade) {
                            throw new Error(`Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.qtdEstoque}, Necessário: ${item.quantidade}`);
                        }
                        const pedidoProdutoEntity = new PedidoProdutoEntity(0, id, item.produtoId, item.quantidade, item.preco || produto.preco);
                        await pedidoProdutoRepo.inserir(pedidoProdutoEntity);
                    }
                }
                for (const [produtoId] of produtosAtuaisMap.entries()) {
                    if (!produtosNovosMap.has(produtoId)) {
                        await pedidoProdutoRepo.deletar(id, produtoId);
                    }
                }
            }
            if (materiasPrimas && materiasPrimas.length > 0) {
                const materiasPrimasAtuais = await pedidoMateriaPrimaRepo.listarPorPedido(id);
                const materiasPrimasAtuaisMap = new Map(materiasPrimasAtuais.map((item: any) => [item.materiaPrimaId, item]));
                const materiasPrimasNovasMap = new Map(materiasPrimas.map((item: any) => [item.materiaPrimaId, item]));
                for (const item of materiasPrimas) {
                    const materiaPrimaAtual = materiasPrimasAtuaisMap.get(item.materiaPrimaId);
                    const materiaPrima = await materiaPrimaRepo.obter(item.materiaPrimaId);
                    if (!materiaPrima) throw new Error(`Matéria-prima com ID ${item.materiaPrimaId} não encontrada.`);
                    if (materiaPrimaAtual) {
                        const diferencaQuantidade = item.quantidade - materiaPrimaAtual.quantidade;
                        if (diferencaQuantidade > 0 && materiaPrima.qtdEstoque < diferencaQuantidade) {
                            throw new Error(`Estoque insuficiente para a matéria-prima ${materiaPrima.nome}. Disponível: ${materiaPrima.qtdEstoque}, Necessário adicional: ${diferencaQuantidade}`);
                        }
                        const pedidoMateriaPrimaEntity = new PedidoMateriaPrimaEntity(materiaPrimaAtual.id, id, item.materiaPrimaId, item.quantidade, item.preco || materiaPrima.preco);
                        await pedidoMateriaPrimaRepo.atualizar(pedidoMateriaPrimaEntity);
                    } else {
                        if (materiaPrima.qtdEstoque < item.quantidade) {
                            throw new Error(`Estoque insuficiente para a matéria-prima ${materiaPrima.nome}. Disponível: ${materiaPrima.qtdEstoque}, Necessário: ${item.quantidade}`);
                        }
                        const pedidoMateriaPrimaEntity = new PedidoMateriaPrimaEntity(0, id, item.materiaPrimaId, item.quantidade, item.preco || materiaPrima.preco);
                        await pedidoMateriaPrimaRepo.inserir(pedidoMateriaPrimaEntity);
                    }
                }
                for (const [materiaPrimaId] of materiasPrimasAtuaisMap.entries()) {
                    if (!materiasPrimasNovasMap.has(materiaPrimaId)) {
                        await pedidoMateriaPrimaRepo.deletar(id, materiaPrimaId);
                    }
                }
            }
            await db.Commit();
            return res.status(200).json({ msg: "Pedido e itens atualizados com sucesso!", pedidoId: id });
        } catch (ex: any) {
            await db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }

    async obterPedidoDetalhado(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pedidoId = parseInt(id);

            const pedidoRepo = new PedidoRepository();
            const pedido = await pedidoRepo.obter(pedidoId);

            if (!pedido) {
                return res.status(404).json({ msg: "Pedido não encontrado" });
            }

            const pedidoProdutoRepo = new PedidoProdutoRepository();
            const produtoRepo = new ProdutoRepository();
            const pedidoMateriaPrimaRepo = new PedidoMateriaPrimaRepository();
            const materiaPrimaRepo = new MateriaPrimaRepository();

            const produtosDoPedido = await pedidoProdutoRepo.listarPorPedido(pedidoId);

            const produtosDetalhados = await Promise.all((produtosDoPedido || []).map(async (item) => {
                const produto = await produtoRepo.obter(item.produtoId);

                return {
                    id: item.id,
                    pedidoId: item.pedidoId,
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    preco: item.preco,
                    produto: produto ? {
                        id: produto.id,
                        nome: produto.nome,
                        descricao: produto.descricao,
                        preco: produto.preco,
                        codigo: produto.codigo,
                        qtdEstoque: produto.qtdEstoque
                    } : null
                };
            }));

            const materiasPrimasDoPedido = await pedidoMateriaPrimaRepo.listarPorPedido(pedidoId);

            const materiasPrimasDetalhadas = await Promise.all((materiasPrimasDoPedido || []).map(async (item) => {
                const materiaPrima = await materiaPrimaRepo.obter(item.materiaPrimaId);

                return {
                    id: item.id,
                    pedidoId: item.pedidoId,
                    materiaPrimaId: item.materiaPrimaId,
                    quantidade: item.quantidade,
                    preco: item.preco,
                    materiaPrima: materiaPrima ? {
                        id: materiaPrima.id,
                        nome: materiaPrima.nome,
                        descricao: materiaPrima.descricao,
                        preco: materiaPrima.preco,
                        unidadeMedida: materiaPrima.unidadeMedida,
                        codigo: materiaPrima.codigo,
                        qtdEstoque: materiaPrima.qtdEstoque
                    } : null
                };
            }));

            const valorTotalProdutos = produtosDetalhados.reduce((total, item: any) => {
                const quantidade = Number(item.quantidade) || 0;
                const preco = Number(item.preco) || 0;
                return total + (quantidade * preco);
            }, 0);

            const valorTotalMateriasPrimas = materiasPrimasDetalhadas.reduce((total, item: any) => {
                const quantidade = Number(item.quantidade) || 0;
                const preco = Number(item.preco) || 0;
                return total + (quantidade * preco);
            }, 0);

            const valorTotal = valorTotalProdutos + valorTotalMateriasPrimas;

            res.status(200).json({
                pedido,
                produtos: produtosDetalhados,
                materiasPrimas: materiasPrimasDetalhadas,
                valorTotal
            });
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async criarPedidoProdutos(req: Request, res: Response) {
        const db = new PedidoRepository().db;
        try {
            const { data, pessoaId, valorEntrada, produtos } = req.body;

            if (!data || !pessoaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos! É necessário fornecer data e pessoaId." });
            }

            if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
                return res.status(400).json({ msg: "É necessário fornecer pelo menos um produto para o pedido." });
            }

            await db.AbreTransacao();

            const pedidoRepo = new PedidoRepository();
            const pedidoEntity = new PedidoEntity(
                0,
                createLocalDate(data),
                PedidoStatus.PENDENTE,
                pessoaId,
                valorEntrada || 0
            );

            const pedidoId = await pedidoRepo.inserir(pedidoEntity);
            if (pedidoId <= 0) {
                throw new Error("Erro ao inserir pedido no banco de dados");
            }

            const pedidoProdutoRepo = new PedidoProdutoRepository();
            const produtoRepo = new ProdutoRepository();

            for (const item of produtos) {
                const produto = await produtoRepo.obter(item.produtoId);
                if (!produto) {
                    throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
                }

                if (produto.qtdEstoque < item.quantidade) {
                    throw new Error(`Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.qtdEstoque}, Necessário: ${item.quantidade}`);
                }

                const pedidoProdutoEntity = new PedidoProdutoEntity(
                    0,
                    pedidoId,
                    item.produtoId,
                    item.quantidade,
                    item.preco || produto.preco
                );

                const itemInserido = await pedidoProdutoRepo.inserir(pedidoProdutoEntity);
                if (!itemInserido) {
                    throw new Error(`Erro ao inserir produto ${item.produtoId} no pedido.`);
                }
            }

            await db.Commit();

            return res.status(201).json({
                msg: "Pedido de produtos cadastrado com sucesso!",
                pedidoId: pedidoId
            });
        } catch (ex: any) {
            await db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }

    async criarPedidoMateriasPrimas(req: Request, res: Response) {
        const db = new PedidoRepository().db;
        try {
            const { data, pessoaId, valorEntrada, materiasPrimas } = req.body;

            if (!data || !pessoaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos! É necessário fornecer data e pessoaId." });
            }

            if (!materiasPrimas || !Array.isArray(materiasPrimas) || materiasPrimas.length === 0) {
                return res.status(400).json({ msg: "É necessário fornecer pelo menos uma matéria-prima para o pedido." });
            }

            await db.AbreTransacao();

            const pedidoRepo = new PedidoRepository();
            const pedidoEntity = new PedidoEntity(
                0,
                createLocalDate(data),
                PedidoStatus.PENDENTE,
                pessoaId,
                valorEntrada || 0
            );

            const pedidoId = await pedidoRepo.inserir(pedidoEntity);
            if (pedidoId <= 0) {
                throw new Error("Erro ao inserir pedido no banco de dados");
            }

            const pedidoMateriaPrimaRepo = new PedidoMateriaPrimaRepository();
            const materiaPrimaRepo = new MateriaPrimaRepository();

            for (const item of materiasPrimas) {
                const materiaPrima = await materiaPrimaRepo.obter(item.materiaPrimaId);
                if (!materiaPrima) {
                    throw new Error(`Matéria-prima com ID ${item.materiaPrimaId} não encontrada.`);
                }

                if (materiaPrima.qtdEstoque < item.quantidade) {
                    throw new Error(`Estoque insuficiente para a matéria-prima ${materiaPrima.nome}. Disponível: ${materiaPrima.qtdEstoque}, Necessário: ${item.quantidade}`);
                }

                const pedidoMateriaPrimaEntity = new PedidoMateriaPrimaEntity(
                    0,
                    pedidoId,
                    item.materiaPrimaId,
                    item.quantidade,
                    item.preco || materiaPrima.preco
                );

                const itemInserido = await pedidoMateriaPrimaRepo.inserir(pedidoMateriaPrimaEntity);
                if (!itemInserido) {
                    throw new Error(`Erro ao inserir matéria-prima ${item.materiaPrimaId} no pedido.`);
                }
            }

            await db.Commit();

            return res.status(201).json({
                msg: "Pedido de matérias-primas cadastrado com sucesso!",
                pedidoId: pedidoId
            });
        } catch (ex: any) {
            await db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }

    async atualizarPedidoProdutos(req: Request, res: Response) {
        try {
            const { id, data, status, pessoaId, valorEntrada, produtos } = req.body;

            if (!id || !data || !pessoaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos! É necessário fornecer id, data e pessoaId." });
            }

            if (!produtos || !Array.isArray(produtos)) {
                return res.status(400).json({ msg: "É necessário fornecer a lista de produtos, mesmo que vazia." });
            }

            const pedidoRepo = new PedidoRepository();
            const pedidoAtual = await pedidoRepo.obter(id);

            if (!pedidoAtual) {
                return res.status(400).json({ msg: "Pedido não encontrado!" });
            }

            if (pedidoAtual.status === PedidoStatus.CONCLUIDO || pedidoAtual.status === PedidoStatus.CANCELADO) {
                return res.status(400).json({ msg: `Não é possível alterar um pedido com status ${pedidoAtual.status}.` });
            }

            const pedidoEntity = new PedidoEntity(
                id,
                createLocalDate(data),
                status || pedidoAtual.status,
                pessoaId,
                valorEntrada !== undefined ? valorEntrada : pedidoAtual.valorEntrada
            );

            const result = await pedidoRepo.atualizar(pedidoEntity);
            if (!result) {
                throw new Error("Erro ao atualizar pedido no banco de dados");
            }

            const pedidoProdutoRepo = new PedidoProdutoRepository();
            const produtoRepo = new ProdutoRepository();

            const produtosAtuais = await pedidoProdutoRepo.listarPorPedido(id);

            const produtosAtuaisMap = new Map(produtosAtuais.map(item => [item.produtoId, item]));
            const produtosNovosMap = new Map(produtos.map(item => [item.produtoId, item]));

            for (const item of produtos) {
                const produtoAtual = produtosAtuaisMap.get(item.produtoId);

                const produto = await produtoRepo.obter(item.produtoId);
                if (!produto) {
                    return res.status(400).json({ msg: `Produto com ID ${item.produtoId} não encontrado.` });
                }

                if (produtoAtual) {
                    const diferencaQuantidade = item.quantidade - produtoAtual.quantidade;

                    if (diferencaQuantidade > 0) {
                        if (produto.qtdEstoque < diferencaQuantidade) {
                            return res.status(400).json({
                                msg: `Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.qtdEstoque}, Necessário adicional: ${diferencaQuantidade}`,
                                erro: "ESTOQUE_INSUFICIENTE"
                            });
                        }
                    }

                    const pedidoProdutoEntity = new PedidoProdutoEntity(
                        produtoAtual.id,
                        id,
                        item.produtoId,
                        item.quantidade,
                        item.preco || produto.preco
                    );

                    await pedidoProdutoRepo.atualizar(pedidoProdutoEntity);
                } else {
                    if (produto.qtdEstoque < item.quantidade) {
                        return res.status(400).json({
                            msg: `Estoque insuficiente para o produto ${produto.nome}. Disponível: ${produto.qtdEstoque}, Necessário: ${item.quantidade}`,
                            erro: "ESTOQUE_INSUFICIENTE"
                        });
                    }

                    const pedidoProdutoEntity = new PedidoProdutoEntity(
                        0,
                        id,
                        item.produtoId,
                        item.quantidade,
                        item.preco || produto.preco
                    );

                    await pedidoProdutoRepo.inserir(pedidoProdutoEntity);
                }
            }

            for (const [produtoId, _] of produtosAtuaisMap.entries()) {
                if (!produtosNovosMap.has(produtoId)) {
                    await pedidoProdutoRepo.deletar(id, produtoId);
                }
            }

            if (status === PedidoStatus.CONCLUIDO && String(pedidoAtual.status) !== String(PedidoStatus.CONCLUIDO)) {
                try {
                    await this.diminuirEstoqueProdutos(id);
                    return res.status(200).json({
                        msg: "Pedido de produtos atualizado com sucesso! Estoque atualizado.",
                        pedidoId: id
                    });
                } catch (estoqueError: any) {
                    const pedidoRevertido = new PedidoEntity(
                        id,
                        createLocalDate(data),
                        pedidoAtual.status,
                        pessoaId,
                        pedidoAtual.valorEntrada
                    );
                    await pedidoRepo.atualizar(pedidoRevertido);

                    return res.status(400).json({
                        msg: `Não foi possível concluir o pedido: ${estoqueError.message}`,
                        erro: "ESTOQUE_INSUFICIENTE"
                    });
                }
            }

            return res.status(200).json({
                msg: "Pedido de produtos atualizado com sucesso!",
                pedidoId: id
            });
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async atualizarPedidoMateriasPrimas(req: Request, res: Response) {
        const db = new PedidoRepository().db;
        try {
            const { id, data, status, pessoaId, valorEntrada, materiasPrimas } = req.body;

            if (!id || !data || !pessoaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos! É necessário fornecer id, data e pessoaId." });
            }

            if (!materiasPrimas || !Array.isArray(materiasPrimas)) {
                return res.status(400).json({ msg: "É necessário fornecer a lista de matérias-primas, mesmo que vazia." });
            }

            await db.AbreTransacao();

            const pedidoRepo = new PedidoRepository();
            const pedidoAtual = await pedidoRepo.obter(id);

            if (!pedidoAtual) {
                throw new Error("Pedido não encontrado!");
            }

            if (pedidoAtual.status === PedidoStatus.CONCLUIDO || pedidoAtual.status === PedidoStatus.CANCELADO) {
                throw new Error(`Não é possível alterar um pedido com status ${pedidoAtual.status}.`);
            }

            const pedidoEntity = new PedidoEntity(
                id,
                createLocalDate(data),
                status || pedidoAtual.status,
                pessoaId,
                valorEntrada !== undefined ? valorEntrada : pedidoAtual.valorEntrada
            );

            const result = await pedidoRepo.atualizar(pedidoEntity);
            if (!result) {
                throw new Error("Erro ao atualizar pedido no banco de dados");
            }

            const pedidoMateriaPrimaRepo = new PedidoMateriaPrimaRepository();
            const materiaPrimaRepo = new MateriaPrimaRepository();

            const materiasPrimasAtuais = await pedidoMateriaPrimaRepo.listarPorPedido(id);
            const materiasPrimasAtuaisMap = new Map(materiasPrimasAtuais.map(item => [item.materiaPrimaId, item]));
            const materiasPrimasNovasMap = new Map(materiasPrimas.map(item => [item.materiaPrimaId, item]));

            for (const item of materiasPrimas) {
                const materiaPrimaAtual = materiasPrimasAtuaisMap.get(item.materiaPrimaId);
                const materiaPrima = await materiaPrimaRepo.obter(item.materiaPrimaId);

                if (!materiaPrima) {
                    throw new Error(`Matéria-prima com ID ${item.materiaPrimaId} não encontrada.`);
                }

                if (materiaPrimaAtual) {
                    const diferencaQuantidade = item.quantidade - materiaPrimaAtual.quantidade;
                    if (diferencaQuantidade > 0 && materiaPrima.qtdEstoque < diferencaQuantidade) {
                        throw new Error(`Estoque insuficiente para a matéria-prima ${materiaPrima.nome}. Disponível: ${materiaPrima.qtdEstoque}, Necessário adicional: ${diferencaQuantidade}`);
                    }

                    const pedidoMateriaPrimaEntity = new PedidoMateriaPrimaEntity(
                        materiaPrimaAtual.id,
                        id,
                        item.materiaPrimaId,
                        item.quantidade,
                        item.preco || materiaPrima.preco
                    );

                    await pedidoMateriaPrimaRepo.atualizar(pedidoMateriaPrimaEntity);
                } else {
                    if (materiaPrima.qtdEstoque < item.quantidade) {
                        throw new Error(`Estoque insuficiente para a matéria-prima ${materiaPrima.nome}. Disponível: ${materiaPrima.qtdEstoque}, Necessário: ${item.quantidade}`);
                    }

                    const pedidoMateriaPrimaEntity = new PedidoMateriaPrimaEntity(
                        0,
                        id,
                        item.materiaPrimaId,
                        item.quantidade,
                        item.preco || materiaPrima.preco
                    );

                    await pedidoMateriaPrimaRepo.inserir(pedidoMateriaPrimaEntity);
                }
            }

            for (const [materiaPrimaId, _] of materiasPrimasAtuaisMap.entries()) {
                if (!materiasPrimasNovasMap.has(materiaPrimaId)) {
                    await pedidoMateriaPrimaRepo.deletar(id, materiaPrimaId);
                }
            }

            await db.Commit();

            return res.status(200).json({
                msg: "Pedido de matérias-primas atualizado com sucesso!",
                pedidoId: id
            });
        } catch (ex: any) {
            await db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }

    private async diminuirEstoque(pedidoId: number): Promise<void> {
        try {
            await this.diminuirEstoqueProdutos(pedidoId);
            await this.diminuirEstoqueMateriasPrimas(pedidoId);
        } catch (error: any) {
            throw new Error(`Erro ao diminuir estoque: ${error.message}`);
        }
    }

    private async diminuirEstoqueProdutos(pedidoId: number): Promise<void> {
        try {
            const pedidoProdutoRepo = new PedidoProdutoRepository();
            const produtoRepo = new ProdutoRepository();

            const produtosDoPedido = await pedidoProdutoRepo.listarPorPedido(pedidoId);
            if (produtosDoPedido && produtosDoPedido.length > 0) {
                for (const item of produtosDoPedido) {
                    await produtoRepo.diminuirEstoque(item.produtoId, item.quantidade);
                }
            }
        } catch (error: any) {
            throw new Error(`Erro ao diminuir estoque de produtos: ${error.message}`);
        }
    }

    private async diminuirEstoqueMateriasPrimas(pedidoId: number): Promise<void> {
        try {
            const pedidoMateriaPrimaRepo = new PedidoMateriaPrimaRepository();
            const materiaPrimaRepo = new MateriaPrimaRepository();

            const materiasPrimasDoPedido = await pedidoMateriaPrimaRepo.listarPorPedido(pedidoId);
            if (materiasPrimasDoPedido && materiasPrimasDoPedido.length > 0) {
                for (const item of materiasPrimasDoPedido) {
                    await materiaPrimaRepo.diminuirEstoque(item.materiaPrimaId, item.quantidade);
                }
            }
        } catch (error: any) {
            throw new Error(`Erro ao diminuir estoque de matérias-primas: ${error.message}`);
        }
    }
}