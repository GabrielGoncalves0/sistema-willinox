"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const materiaPrimaRepository_1 = __importDefault(require("../repositories/materiaPrimaRepository"));
const materiaPrimaEntity_1 = __importDefault(require("../entities/materiaPrimaEntity"));
class MateriaPrimaController {
    validarParametros(req) {
        const { nome, codigo } = req.body;
        if (!nome || !codigo)
            throw new Error("Parâmetros 'nome' e 'código' são obrigatórios!");
    }
    async listar(req, res) {
        try {
            const repo = new materiaPrimaRepository_1.default();
            const { incluirInativos } = req.query;
            let lista = incluirInativos === 'true' ? await repo.listarTodos() : await repo.listar();
            res.status(200).json(lista);
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro interno: ${ex.message}` });
        }
    }
    async obter(req, res) {
        try {
            const { id } = req.params;
            const repo = new materiaPrimaRepository_1.default();
            const materiaPrima = await repo.obter(parseInt(id));
            res.status(200).json(materiaPrima || []);
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro ao buscar matéria-prima: ${ex.message}` });
        }
    }
    async inserir(req, res) {
        try {
            this.validarParametros(req);
            const { nome, descricao, qtdEstoque, unidadeMedida, preco, codigo } = req.body;
            const repo = new materiaPrimaRepository_1.default();
            if (await repo.existeCodigo(codigo))
                return res.status(400).json({ msg: "Já existe uma matéria-prima com esse código!" });
            const entidade = new materiaPrimaEntity_1.default(0, nome, descricao || null, qtdEstoque || 0, unidadeMedida || null, preco, codigo);
            const result = await repo.inserir(entidade);
            if (result)
                res.status(201).json({ msg: "Matéria-prima cadastrada com sucesso!" });
            else
                throw new Error("Erro ao inserir matéria-prima no banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro ao inserir matéria-prima: ${ex.message}` });
        }
    }
    async atualizar(req, res) {
        try {
            const { id, nome, descricao, qtdEstoque, unidadeMedida, preco, codigo } = req.body;
            if (!id || !nome)
                return res.status(400).json({ msg: "Parâmetros 'id' e 'nome' são obrigatórios!" });
            const repo = new materiaPrimaRepository_1.default();
            if (await repo.existeCodigoEmOutroId(codigo, id))
                return res.status(400).json({ msg: "Já existe outra matéria-prima com esse código!" });
            const materiaPrimaExistente = await repo.obter(id);
            if (!materiaPrimaExistente)
                return res.status(404).json({ msg: "Matéria-prima não encontrada para atualização!" });
            const entidade = new materiaPrimaEntity_1.default(id, nome, descricao || null, qtdEstoque || 0, unidadeMedida || null, preco, codigo);
            const result = await repo.atualizar(entidade);
            if (result)
                res.status(200).json({ msg: "Matéria-prima atualizada com sucesso!" });
            else
                throw new Error("Erro ao atualizar matéria-prima no banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro ao atualizar matéria-prima: ${ex.message}` });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            const repo = new materiaPrimaRepository_1.default();
            const materiaPrima = await repo.obter(parseInt(id));
            if (!materiaPrima)
                return res.status(404).json({ msg: "Matéria-prima não encontrada!" });
            const result = await repo.deletar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Matéria-prima deletada com sucesso!" });
            else
                throw new Error("Erro ao deletar matéria-prima do banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro ao deletar matéria-prima: ${ex.message}` });
        }
    }
    async restaurar(req, res) {
        try {
            const { id } = req.params;
            const repo = new materiaPrimaRepository_1.default();
            const result = await repo.restaurar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Matéria-prima restaurada com sucesso!" });
            else
                throw new Error("Erro ao restaurar matéria-prima do banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro ao restaurar matéria-prima: ${ex.message}` });
        }
    }
}
exports.default = MateriaPrimaController;
//# sourceMappingURL=MateriaPrimaController.js.map