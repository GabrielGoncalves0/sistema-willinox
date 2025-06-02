"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modeloRepository_1 = __importDefault(require("../repositories/modeloRepository"));
const modeloEntity_1 = __importDefault(require("../entities/modeloEntity"));
class ModeloController {
    async listar(req, res) {
        try {
            const repo = new modeloRepository_1.default();
            const { incluirInativos } = req.query;
            let lista = incluirInativos === 'true' ? await repo.listarTodos() : await repo.listar();
            res.status(200).json(lista);
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async obter(req, res) {
        try {
            const { id } = req.params;
            const repo = new modeloRepository_1.default();
            const modelo = await repo.obter(parseInt(id));
            res.status(200).json(modelo || []);
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro ao buscar modelo: ${ex.message}` });
        }
    }
    async inserir(req, res) {
        try {
            const { nome, descricao } = req.body;
            if (!nome)
                return res.status(400).json({ msg: "Parâmetros inválidos!" });
            const repo = new modeloRepository_1.default();
            if (await repo.existePorNome(nome))
                return res.status(400).json({ msg: "Já existe um modelo com esse nome!" });
            const entidade = new modeloEntity_1.default(0, nome, descricao || null);
            const result = await repo.inserir(entidade);
            if (result)
                res.status(201).json({ msg: "Modelo cadastrado!" });
            else
                throw new Error("Erro ao inserir modelo no banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async atualizar(req, res) {
        try {
            const { id, nome, descricao } = req.body;
            if (!(id && nome))
                return res.status(400).json({ msg: "Parâmetros inválidos" });
            const repo = new modeloRepository_1.default();
            const modeloExistente = await repo.obter(id);
            if (!modeloExistente)
                return res.status(404).json({ msg: "Nenhum modelo encontrado para alteração!" });
            if (await repo.existePorNome(nome, id))
                return res.status(400).json({ msg: "Já existe um modelo com esse nome!" });
            const entidade = new modeloEntity_1.default(id, nome, descricao || null);
            const result = await repo.atualizar(entidade);
            if (result)
                res.status(200).json({ msg: "Atualização realizada com sucesso!" });
            else
                throw new Error("Erro ao atualizar modelo no banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            const repo = new modeloRepository_1.default();
            const result = await repo.deletar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Modelo deletado com sucesso!" });
            else
                throw new Error("Erro ao deletar modelo do banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async restaurar(req, res) {
        try {
            const { id } = req.params;
            const repo = new modeloRepository_1.default();
            const result = await repo.restaurar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Modelo restaurado com sucesso!" });
            else
                throw new Error("Erro ao restaurar modelo do banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
}
exports.default = ModeloController;
//# sourceMappingURL=ModeloController.js.map