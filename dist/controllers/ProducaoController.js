"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const producaoRepository_js_1 = __importDefault(require("../repositories/producaoRepository.js"));
const producaoEntity_js_1 = __importDefault(require("../entities/producaoEntity.js"));
const types_js_1 = require("../entities/enum/types.js");
const itensProducaoRepository_js_1 = __importDefault(require("../repositories/relations/itensProducaoRepository.js"));
const materiaPrimaRepository_js_1 = __importDefault(require("../repositories/materiaPrimaRepository.js"));
const itensProducaoEntity_js_1 = __importDefault(require("../entities/relations/itensProducaoEntity.js"));
const produtoMateriaPrimaRepository_js_1 = __importDefault(require("../repositories/relations/produtoMateriaPrimaRepository.js"));
const produtoRepository_js_1 = __importDefault(require("../repositories/produtoRepository.js"));
class ProducaoController {
    async listar(req, res) {
        try {
            const repo = new producaoRepository_js_1.default();
            const lista = await repo.listar();
            res.status(200).json(lista);
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async obter(req, res) {
        try {
            const { id } = req.params;
            const repo = new producaoRepository_js_1.default();
            const producao = await repo.obter(parseInt(id));
            res.status(200).json(producao);
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async inserir(req, res) {
        const repo = new producaoRepository_js_1.default();
        const db = repo.db;
        try {
            const { produtoId, status, fisicaId, quantidade, dataInicio, itens } = req.body;
            if (!(produtoId && status && fisicaId)) {
                return res.status(400).json({ msg: "Parâmetros inválidos!" });
            }
            const entidade = new producaoEntity_js_1.default(0, new Date(dataInicio), null, status || types_js_1.ProducaoStatus.PENDENTE, quantidade, produtoId, fisicaId);
            await db.AbreTransacao();
            const result = await repo.inserir(entidade);
            if (!result)
                throw new Error("Erro ao inserir produção no banco de dados");
            const producoes = await repo.listar();
            const producaoInserida = producoes.filter(p => p.produtoId === produtoId && p.fisicaId === fisicaId).sort((a, b) => b.id - a.id)[0];
            if (!producaoInserida)
                throw new Error("Erro ao obter a produção inserida");
            const producaoId = producaoInserida.id;
            if (itens && Array.isArray(itens) && itens.length > 0) {
                const itensProducaoRepo = new itensProducaoRepository_js_1.default();
                for (const item of itens) {
                    const itemEntity = new itensProducaoEntity_js_1.default(0, item.materiaPrimaId, producaoId, item.quantidade);
                    await itensProducaoRepo.inserir(itemEntity);
                }
            }
            try {
                await this.diminuirEstoqueMateriaPrima(producaoId);
                await db.Commit();
                return res.status(201).json({ msg: "Produção cadastrada com sucesso! Estoque de matéria prima atualizado.", producaoId });
            }
            catch (estoqueError) {
                await db.Rollback();
                return res.status(400).json({ msg: estoqueError.message, erro: "ESTOQUE_INSUFICIENTE" });
            }
        }
        catch (ex) {
            await db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }
    async atualizar(req, res) {
        const repo = new producaoRepository_js_1.default();
        const db = repo.db;
        try {
            const { id, dataInicio, dataFim, status, fisicaId, produtoId, quantidade } = req.body;
            if (!(id && dataInicio && fisicaId && produtoId)) {
                return res.status(400).json({ msg: "Parâmetros inválidos" });
            }
            const producaoExistente = await repo.obter(id);
            const novaDataFim = status === types_js_1.ProducaoStatus.CONCLUIDO ? (dataFim ? new Date(dataFim) : new Date()) : null;
            if (!producaoExistente) {
                return res.status(404).json({ msg: "Nenhuma produção encontrada para alteração!" });
            }
            const entidade = new producaoEntity_js_1.default(id, new Date(dataInicio), novaDataFim, status || types_js_1.ProducaoStatus.PENDENTE, quantidade, produtoId, fisicaId);
            await db.AbreTransacao();
            const result = await repo.atualizar(entidade);
            if (!result)
                throw new Error("Erro ao atualizar produção no banco de dados");
            if (status === types_js_1.ProducaoStatus.CONCLUIDO && producaoExistente.status !== types_js_1.ProducaoStatus.CONCLUIDO) {
                try {
                    await this.diminuirEstoqueMateriaPrima(id);
                    const produtoRepo = new produtoRepository_js_1.default();
                    await produtoRepo.aumentarEstoque(produtoId, quantidade);
                    await db.Commit();
                    return res.status(200).json({ msg: "Produção finalizada com sucesso! Estoque de matéria prima diminuído e estoque do produto aumentado." });
                }
                catch (estoqueError) {
                    await db.Rollback();
                    const entidadeRevertida = new producaoEntity_js_1.default(id, new Date(dataInicio), null, producaoExistente.status, quantidade, produtoId, fisicaId);
                    await repo.atualizar(entidadeRevertida);
                    return res.status(400).json({ msg: estoqueError.message, erro: "ESTOQUE_INSUFICIENTE" });
                }
            }
            else {
                await db.Commit();
                res.status(200).json({ msg: "Atualização realizada com sucesso!" });
            }
        }
        catch (ex) {
            await db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }
    async diminuirEstoqueMateriaPrima(producaoId) {
        const itensProducaoRepo = new itensProducaoRepository_js_1.default();
        const materiaPrimaRepo = new materiaPrimaRepository_js_1.default();
        const producaoRepo = new producaoRepository_js_1.default();
        const produtoMateriaPrimaRepo = new produtoMateriaPrimaRepository_js_1.default();
        const producao = await producaoRepo.obter(producaoId);
        if (!producao)
            throw new Error(`Produção com ID ${producaoId} não encontrada`);
        const itensDaProducao = await itensProducaoRepo.listarPorProducao(producaoId);
        if (!itensDaProducao || itensDaProducao.length === 0) {
            const materiasPrimasDoProduto = await produtoMateriaPrimaRepo.listar(producao.produtoId);
            if (!materiasPrimasDoProduto || materiasPrimasDoProduto.length === 0)
                return;
            for (const materiaPrimaProduto of materiasPrimasDoProduto) {
                const materiaPrima = await materiaPrimaRepo.obter(materiaPrimaProduto.materiaPrimaId);
                if (!materiaPrima) {
                    const materiaPrimaInativa = await this.verificarMateriaPrimaInativa(materiaPrimaProduto.materiaPrimaId);
                    if (materiaPrimaInativa)
                        throw new Error(`A matéria-prima "${materiaPrimaInativa.nome}" está inativa. Atualize a fórmula do produto.`);
                    else
                        throw new Error(`Matéria-prima com ID ${materiaPrimaProduto.materiaPrimaId} não encontrada`);
                }
                const quantidadeNecessaria = materiaPrimaProduto.quantidade * producao.quantidade;
                if (materiaPrima.qtdEstoque < quantidadeNecessaria)
                    throw new Error(`Estoque insuficiente para a matéria-prima ${materiaPrima.nome}. Disponível: ${materiaPrima.qtdEstoque}, Necessário: ${quantidadeNecessaria}`);
            }
            for (const materiaPrimaProduto of materiasPrimasDoProduto) {
                const quantidadeNecessaria = materiaPrimaProduto.quantidade * producao.quantidade;
                await materiaPrimaRepo.diminuirEstoque(materiaPrimaProduto.materiaPrimaId, quantidadeNecessaria);
                const itemEntity = new itensProducaoEntity_js_1.default(0, materiaPrimaProduto.materiaPrimaId, producaoId, quantidadeNecessaria);
                await itensProducaoRepo.inserir(itemEntity);
            }
        }
        else {
            for (const item of itensDaProducao) {
                await materiaPrimaRepo.diminuirEstoque(item.materiaPrimaId, item.quantidade);
            }
        }
    }
    async verificarMateriaPrimaInativa(materiaPrimaId) {
        const materiaPrimaRepo = new materiaPrimaRepository_js_1.default();
        const sql = "SELECT * FROM tb_materiaPrima WHERE matpri_id = ?";
        const rows = await materiaPrimaRepo.db.ExecutaComando(sql, [materiaPrimaId]);
        if (rows && rows.length > 0) {
            const materiaPrima = rows[0];
            if (materiaPrima.ativo === 0) {
                return { id: materiaPrima.matpri_id, nome: materiaPrima.matpri_nome, ativo: materiaPrima.ativo };
            }
        }
        return null;
    }
    async deletar(req, res) {
        const repo = new producaoRepository_js_1.default();
        const itensProducaoRepo = new itensProducaoRepository_js_1.default();
        const db = repo.db;
        try {
            const { id } = req.params;
            await db.AbreTransacao();
            await itensProducaoRepo.deletarPorProducaoId(parseInt(id));
            const result = await repo.deletar(parseInt(id));
            if (result) {
                await db.Commit();
                res.status(200).json({ msg: "Produção deletada com sucesso!" });
            }
            else {
                await db.Rollback();
                throw new Error("Erro ao deletar produção do banco de dados");
            }
        }
        catch (ex) {
            await db.Rollback();
            res.status(500).json({ msg: ex.message });
        }
    }
}
exports.default = ProducaoController;
//# sourceMappingURL=ProducaoController.js.map