import { Request, Response } from 'express';
import CompraRepository from '../repositories/compraRepository';
import CompraEntity from '../entities/compraEntity';
import { CompraStatus } from '../entities/enum/types';
import ItensCompraRepository from '../repositories/relations/itensCompraRepository';
import MateriaPrimaRepository from '../repositories/materiaPrimaRepository';
import ItensCompraEntity from '../entities/relations/itensCompraEntity';
import JuridicaRepository from '../repositories/juridicaRepository';

function createLocalDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

interface ItemCompraRequest {
    materiaPrimaId: number;
    quantidade: number;
    preco: number;
}

interface CompraComItensRequest {
    data: string;
    status?: CompraStatus;
    juridicaId: number;
    valorTotal: number;
    itens: ItemCompraRequest[];
}

interface CompraComItensUpdateRequest {
    id: number;
    data: string;
    status?: CompraStatus;
    juridicaId: number;
    valorTotal: number;
    itens: ItemCompraRequest[];
}

export default class CompraController {
    async listar(req: Request, res: Response) {
        try {
            const compraRepo = new CompraRepository();
            const itensCompraRepo = new ItensCompraRepository();
            const listaCompras = await compraRepo.listar();
            if (listaCompras && listaCompras.length > 0) {
                const comprasComItens = await Promise.all(
                    listaCompras.map(async (compra) => {
                        const itens = await itensCompraRepo.listarPorCompra(compra.id);
                        return { compra, itens: itens || [] };
                    })
                );
                return res.status(200).json(comprasComItens);
            }
            return res.status(200).json([]);
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async listarParaRelatorio(req: Request, res: Response) {
        try {
            const compraRepo = new CompraRepository();
            const itensCompraRepo = new ItensCompraRepository();
            const materiaPrimaRepo = new MateriaPrimaRepository();
            const juridicaRepo = new JuridicaRepository();
            const listaCompras = await compraRepo.listar();
            if (listaCompras && listaCompras.length > 0) {
                const comprasDetalhadas = await Promise.all(
                    listaCompras.map(async (compra) => {
                        const itens = await itensCompraRepo.listarPorCompra(compra.id);
                        const fornecedor = await juridicaRepo.obter(compra.juridicaId);
                        const itensDetalhados = await Promise.all(
                            (itens || []).map(async (item) => {
                                const materiaPrima = await materiaPrimaRepo.obter(item.materiaPrimaId);
                                return {
                                    id: item.id,
                                    quantidade: item.quantidade,
                                    preco: item.preco,
                                    valorTotal: item.quantidade * item.preco,
                                    materiaPrima: materiaPrima ? {
                                        id: materiaPrima.id,
                                        nome: materiaPrima.nome,
                                        codigo: materiaPrima.codigo
                                    } : null
                                };
                            })
                        );
                        return {
                            id: compra.id,
                            codigo: compra.id.toString(),
                            data: compra.data,
                            status: compra.status,
                            valorTotal: compra.valorTotal,
                            fornecedor: fornecedor && fornecedor.pessoa ? {
                                id: fornecedor.id,
                                nome: fornecedor.pessoa.nome
                            } : null,
                            itens: itensDetalhados
                        };
                    })
                );
                return res.status(200).json(comprasDetalhadas);
            }
            return res.status(200).json([]);
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const compraId = parseInt(id);
            const compraRepo = new CompraRepository();
            const compra = await compraRepo.obter(compraId);
            if (!compra) return res.status(200).json(null);
            const itensCompraRepo = new ItensCompraRepository();
            const itens = await itensCompraRepo.listarPorCompra(compraId);
            return res.status(200).json({ compra, itens });
        } catch (ex: any) {
            return res.status(500).json({ msg: ex.message });
        }
    }

    async inserirComItens(req: Request, res: Response) {
        const db = new CompraRepository().db;
        try {
            const { data, juridicaId, valorTotal, itens } = req.body as CompraComItensRequest;
            if (!data || !juridicaId || !itens || !Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({ msg: 'Parâmetros inválidos! É necessário fornecer data, juridicaId e pelo menos um item.' });
            }
            await db.AbreTransacao();
            const compraEntity = new CompraEntity(0, createLocalDate(data), CompraStatus.PENDENTE, juridicaId, valorTotal);
            const compraRepo = new CompraRepository();
            const compraId = await compraRepo.inserir(compraEntity);
            if (!compraId) throw new Error('Erro ao inserir compra no banco de dados');
            const itensCompraRepo = new ItensCompraRepository();
            for (const item of itens) {
                const itemEntity = new ItensCompraEntity(0, compraId, item.materiaPrimaId, item.quantidade, item.preco);
                const itemInserido = await itensCompraRepo.inserir(itemEntity);
                if (!itemInserido) throw new Error(`Erro ao inserir item ${item.materiaPrimaId} na compra.`);
            }
            await db.Commit();
            return res.status(201).json({ msg: 'Compra cadastrada com sucesso!', compraId });
        } catch (ex: any) {
            await db.Rollback();
            return res.status(500).json({ msg: ex.message });
        }
    }

    async atualizarComItens(req: Request, res: Response) {
        const db = new CompraRepository().db;
        try {
            const { id, data, status, juridicaId, valorTotal, itens } = req.body as CompraComItensUpdateRequest;
            if (!id || !data || !juridicaId || !itens || !Array.isArray(itens)) {
                return res.status(400).json({ msg: 'Parâmetros inválidos! É necessário fornecer id, data, juridicaId e itens.' });
            }
            await db.AbreTransacao();
            const compraRepo = new CompraRepository();
            const compraAtual = await compraRepo.obter(id);
            if (!compraAtual) throw new Error('Compra não encontrada!');
            const compraEntity = new CompraEntity(id, createLocalDate(data), status || compraAtual.status, juridicaId, valorTotal);
            const compraAtualizada = await compraRepo.atualizar(compraEntity);
            if (!compraAtualizada) throw new Error('Erro ao atualizar compra no banco de dados');
            const itensCompraRepo = new ItensCompraRepository();
            const itensAtuais = await itensCompraRepo.listarPorCompra(id);
            const itensAtuaisMap = new Map(itensAtuais.map(item => [item.materiaPrimaId, item]));
            const itensNovosMap = new Map(itens.map(item => [item.materiaPrimaId, item]));
            for (const item of itens) {
                const itemAtual = itensAtuaisMap.get(item.materiaPrimaId);
                if (itemAtual) {
                    const itemEntity = new ItensCompraEntity(itemAtual.id, id, item.materiaPrimaId, item.quantidade, item.preco);
                    await itensCompraRepo.atualizar(itemEntity);
                } else {
                    const itemEntity = new ItensCompraEntity(0, id, item.materiaPrimaId, item.quantidade, item.preco);
                    await itensCompraRepo.inserir(itemEntity);
                }
            }
            for (const [materiaPrimaId] of itensAtuaisMap.entries()) {
                if (!itensNovosMap.has(materiaPrimaId)) {
                    await itensCompraRepo.deletar(id, materiaPrimaId);
                }
            }
            if (status === CompraStatus.CONCLUIDO && compraAtual.status !== CompraStatus.CONCLUIDO) {
                await this.aumentarEstoqueMateriaPrima(id);
                await db.Commit();
                return res.status(200).json({ msg: 'Compra e itens atualizados com sucesso! Estoque atualizado.', compraId: id });
            }
            await db.Commit();
            return res.status(200).json({ msg: 'Compra e itens atualizados com sucesso!', compraId: id });
        } catch (ex: any) {
            await db.Rollback();
            return res.status(500).json({ msg: ex.message });
        }
    }

    private async aumentarEstoqueMateriaPrima(compraId: number): Promise<void> {
        try {
            const itensCompraRepo = new ItensCompraRepository();
            const materiaPrimaRepo = new MateriaPrimaRepository();
            const itensCompra = await itensCompraRepo.listarPorCompra(compraId);
            for (const item of itensCompra) {
                await materiaPrimaRepo.aumentarEstoque(item.materiaPrimaId, item.quantidade);
            }
        } catch (error: any) {
            throw new Error(`Erro ao atualizar estoque de matéria prima: ${error.message}`);
        }
    }

    async deletar(req: Request, res: Response) {
        const db = new CompraRepository().db;
        try {
            const { id } = req.params;
            const compraId = parseInt(id);
            await db.AbreTransacao();
            const compraRepo = new CompraRepository();
            const compra = await compraRepo.obter(compraId);
            if (!compra) throw new Error('Compra não encontrada!');
            const itensCompraRepo = new ItensCompraRepository();
            const itens = await itensCompraRepo.listarPorCompra(compraId);
            if (itens && itens.length > 0) {
                for (const item of itens) {
                    await itensCompraRepo.deletar(compraId, item.materiaPrimaId);
                }
            }
            const result = await compraRepo.deletar(compraId);
            if (!result) throw new Error('Erro ao deletar compra do banco de dados');
            await db.Commit();
            return res.status(200).json({ msg: 'Compra e seus itens deletados com sucesso!' });
        } catch (ex: any) {
            await db.Rollback();
            return res.status(500).json({ msg: ex.message });
        }
    }
}