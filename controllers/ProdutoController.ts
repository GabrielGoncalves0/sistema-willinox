import { Request, Response } from 'express';
import ProdutoRepository from '../repositories/produtoRepository';
import ProdutoEntity from '../entities/produtoEntity';
import ProdutoMateriaPrimaRepository from '../repositories/relations/produtoMateriaPrimaRepository';
import ProdutoMateriaPrimaEntity from '../entities/relations/produtoMateriaPrimaEntity';

export default class ProdutoController {
    async listar(req: Request, res: Response) {
        try {
            const repo = new ProdutoRepository();
            const { incluirInativos } = req.query;
            let listaProdutos = incluirInativos === 'true' ? await repo.listarTodos() : await repo.listar();
            const materiaPrima = new ProdutoMateriaPrimaRepository();
            for (const produto of listaProdutos) {
                produto.materiaPrima = await materiaPrima.listar(produto.id);
            }
            res.status(200).json(listaProdutos);
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { incluirInativos } = req.query;
            const repo = new ProdutoRepository();
            const produto = await repo.obter(parseInt(id), incluirInativos === 'true');
            if (!produto) return res.status(404).json({ msg: "Produto não encontrado" });
            const materiaPrima = new ProdutoMateriaPrimaRepository();
            produto.materiaPrima = await materiaPrima.listar(produto.id);
            res.status(200).json(produto);
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro ao buscar produto: ${ex.message}` });
        }
    }

    async inserir(req: Request, res: Response) {
        const repo = new ProdutoRepository();
        const db = repo.db;
        try {
            const { nome, descricao, preco, qtdEstoque, codigo, modelo, materiasPrimas } = req.body;
            if (!(nome && preco && qtdEstoque && codigo && modelo)) {
                return res.status(400).json({ msg: "Parâmetros inválidos!" });
            }
            const entidade = new ProdutoEntity(0, nome, descricao || null, preco, qtdEstoque || 0, codigo, modelo);
            await db.AbreTransacao();
            if (await repo.existeCodigo(codigo)) {
                await db.Rollback();
                return res.status(400).json({ msg: "Já existe um produto com esse código!" });
            }
            const produtoId = await repo.inserir(entidade);
            if (!produtoId) throw new Error("Erro ao inserir produto no banco de dados");
            if (Array.isArray(materiasPrimas) && materiasPrimas.length > 0) {
                const ids = materiasPrimas.map((item: any) => item.id);
                if (ids.length !== new Set(ids).size) {
                    await db.Rollback();
                    return res.status(400).json({ msg: "Existem matérias-primas duplicadas na lista!" });
                }
                const produtoMateriaRepo = new ProdutoMateriaPrimaRepository();
                for (const item of materiasPrimas) {
                    const entidadeRelacionamento = new ProdutoMateriaPrimaEntity(0, produtoId, item.id, item.quantidade);
                    await produtoMateriaRepo.inserir(entidadeRelacionamento);
                }
            }
            await db.Commit();
            res.status(201).json({ msg: "Produto cadastrado!" });
        } catch (ex: any) {
            await repo.db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        const repo = new ProdutoRepository();
        const db = repo.db;
        try {
            const { id, nome, descricao, preco, qtdEstoque, codigo, modelo, materiasPrimas } = req.body;
            if (!(id && nome && preco && qtdEstoque && codigo && modelo)) {
                return res.status(400).json({ msg: "Parâmetros inválidos" });
            }
            await db.AbreTransacao();
            if (await repo.existeCodigoEmOutroId(codigo, id)) {
                await db.Rollback();
                return res.status(400).json({ msg: "Já existe outro produto com esse código!" });
            }
            if (!await repo.obter(id)) {
                await db.Rollback();
                return res.status(404).json({ msg: "Nenhum produto encontrado para alteração!" });
            }
            const entidade = new ProdutoEntity(id, nome, descricao || null, preco, qtdEstoque || 0, codigo, modelo);
            if (!await repo.atualizar(entidade)) throw new Error("Erro ao atualizar produto no banco de dados");
            if (Array.isArray(materiasPrimas)) {
                const ids = materiasPrimas.map((item: any) => item.id);
                if (ids.length !== new Set(ids).size) {
                    await db.Rollback();
                    return res.status(400).json({ msg: "Existem matérias-primas duplicadas na lista!" });
                }
                const produtoMateriaRepo = new ProdutoMateriaPrimaRepository();
                await produtoMateriaRepo.removerMateriaPrimaPorProdutoId(id);
                for (const item of materiasPrimas) {
                    const entidadeRelacionamento = new ProdutoMateriaPrimaEntity(0, id, item.id, item.quantidade);
                    await produtoMateriaRepo.inserir(entidadeRelacionamento);
                }
            }
            await db.Commit();
            res.status(200).json({ msg: "Atualização realizada com sucesso!" });
        } catch (ex: any) {
            await repo.db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new ProdutoRepository();
            const result = await repo.deletar(parseInt(id));
            if (result) res.status(200).json({ msg: "Produto deletado com sucesso!" });
            else throw new Error("Erro ao deletar produto do banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async restaurar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new ProdutoRepository();
            const result = await repo.restaurar(parseInt(id));
            if (result) res.status(200).json({ msg: "Produto restaurado com sucesso!" });
            else throw new Error("Erro ao restaurar produto do banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }
}