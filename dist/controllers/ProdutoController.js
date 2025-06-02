"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const produtoRepository_1 = __importDefault(require("../repositories/produtoRepository"));
const produtoEntity_1 = __importDefault(require("../entities/produtoEntity"));
const produtoMateriaPrimaRepository_1 = __importDefault(require("../repositories/relations/produtoMateriaPrimaRepository"));
const produtoMateriaPrimaEntity_1 = __importDefault(require("../entities/relations/produtoMateriaPrimaEntity"));
class ProdutoController {
    async listar(req, res) {
        try {
            const repo = new produtoRepository_1.default();
            const { incluirInativos } = req.query;
            let listaProdutos = incluirInativos === 'true' ? await repo.listarTodos() : await repo.listar();
            const materiaPrima = new produtoMateriaPrimaRepository_1.default();
            for (const produto of listaProdutos) {
                produto.materiaPrima = await materiaPrima.listar(produto.id);
            }
            res.status(200).json(listaProdutos);
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async obter(req, res) {
        try {
            const { id } = req.params;
            const { incluirInativos } = req.query;
            const repo = new produtoRepository_1.default();
            const produto = await repo.obter(parseInt(id), incluirInativos === 'true');
            if (!produto)
                return res.status(404).json({ msg: "Produto não encontrado" });
            const materiaPrima = new produtoMateriaPrimaRepository_1.default();
            produto.materiaPrima = await materiaPrima.listar(produto.id);
            res.status(200).json(produto);
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro ao buscar produto: ${ex.message}` });
        }
    }
    async inserir(req, res) {
        const repo = new produtoRepository_1.default();
        const db = repo.db;
        try {
            const { nome, descricao, preco, qtdEstoque, codigo, modelo, materiasPrimas } = req.body;
            if (!(nome && preco && qtdEstoque && codigo && modelo)) {
                return res.status(400).json({ msg: "Parâmetros inválidos!" });
            }
            const entidade = new produtoEntity_1.default(0, nome, descricao || null, preco, qtdEstoque || 0, codigo, modelo);
            await db.AbreTransacao();
            if (await repo.existeCodigo(codigo)) {
                await db.Rollback();
                return res.status(400).json({ msg: "Já existe um produto com esse código!" });
            }
            const produtoId = await repo.inserir(entidade);
            if (!produtoId)
                throw new Error("Erro ao inserir produto no banco de dados");
            if (Array.isArray(materiasPrimas) && materiasPrimas.length > 0) {
                const ids = materiasPrimas.map((item) => item.id);
                if (ids.length !== new Set(ids).size) {
                    await db.Rollback();
                    return res.status(400).json({ msg: "Existem matérias-primas duplicadas na lista!" });
                }
                const produtoMateriaRepo = new produtoMateriaPrimaRepository_1.default();
                for (const item of materiasPrimas) {
                    const entidadeRelacionamento = new produtoMateriaPrimaEntity_1.default(0, produtoId, item.id, item.quantidade);
                    await produtoMateriaRepo.inserir(entidadeRelacionamento);
                }
            }
            await db.Commit();
            res.status(201).json({ msg: "Produto cadastrado!" });
        }
        catch (ex) {
            await repo.db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }
    async atualizar(req, res) {
        const repo = new produtoRepository_1.default();
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
            const entidade = new produtoEntity_1.default(id, nome, descricao || null, preco, qtdEstoque || 0, codigo, modelo);
            if (!await repo.atualizar(entidade))
                throw new Error("Erro ao atualizar produto no banco de dados");
            if (Array.isArray(materiasPrimas)) {
                const ids = materiasPrimas.map((item) => item.id);
                if (ids.length !== new Set(ids).size) {
                    await db.Rollback();
                    return res.status(400).json({ msg: "Existem matérias-primas duplicadas na lista!" });
                }
                const produtoMateriaRepo = new produtoMateriaPrimaRepository_1.default();
                await produtoMateriaRepo.removerMateriaPrimaPorProdutoId(id);
                for (const item of materiasPrimas) {
                    const entidadeRelacionamento = new produtoMateriaPrimaEntity_1.default(0, id, item.id, item.quantidade);
                    await produtoMateriaRepo.inserir(entidadeRelacionamento);
                }
            }
            await db.Commit();
            res.status(200).json({ msg: "Atualização realizada com sucesso!" });
        }
        catch (ex) {
            await repo.db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            const repo = new produtoRepository_1.default();
            const result = await repo.deletar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Produto deletado com sucesso!" });
            else
                throw new Error("Erro ao deletar produto do banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async restaurar(req, res) {
        try {
            const { id } = req.params;
            const repo = new produtoRepository_1.default();
            const result = await repo.restaurar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Produto restaurado com sucesso!" });
            else
                throw new Error("Erro ao restaurar produto do banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
}
exports.default = ProdutoController;
//# sourceMappingURL=ProdutoController.js.map