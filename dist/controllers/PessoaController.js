"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pessoaRepository_1 = __importDefault(require("../repositories/pessoaRepository"));
const pessoaEntity_1 = __importDefault(require("../entities/pessoaEntity"));
class PessoaController {
    async listar(req, res) {
        try {
            const repo = new pessoaRepository_1.default();
            const { incluirInativos } = req.query;
            let lista = incluirInativos === 'true' ? await repo.listarTodos() : await repo.listar();
            if (lista && lista.length > 0)
                res.status(200).json(lista);
            else
                res.status(404).json({ msg: "Nenhuma pessoa encontrada!" });
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async obter(req, res) {
        try {
            const { id } = req.params;
            const repo = new pessoaRepository_1.default();
            const pessoa = await repo.obter(parseInt(id));
            if (pessoa)
                res.status(200).json(pessoa);
            else
                res.status(404).json({ msg: "Pessoa não encontrada" });
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async inserir(req, res) {
        try {
            const { nome, endereco, telefone, email, tipo } = req.body;
            if (!(nome && tipo))
                return res.status(400).json({ msg: "Parâmetros inválidos!" });
            const pessoaRepo = new pessoaRepository_1.default();
            const pessoaEntidade = new pessoaEntity_1.default(0, nome, endereco || null, telefone || null, email || null, tipo);
            const result = await pessoaRepo.inserir(pessoaEntidade);
            if (result)
                return res.status(201).json({ msg: "Pessoa cadastrada!" });
            throw new Error("Erro ao inserir pessoa no banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async atualizar(req, res) {
        try {
            const { id, nome, endereco, telefone, email, tipo } = req.body;
            if (!(id && nome && tipo))
                return res.status(400).json({ msg: "Parâmetros inválidos" });
            const repo = new pessoaRepository_1.default();
            if (await repo.obter(id)) {
                const entidade = new pessoaEntity_1.default(id, nome, endereco || null, telefone || null, email || null, tipo);
                const result = await repo.atualizar(entidade);
                if (result)
                    res.status(200).json({ msg: "Atualização realizada com sucesso!" });
                else
                    throw new Error("Erro ao atualizar pessoa no banco de dados");
            }
            else {
                res.status(404).json({ msg: "Nenhuma pessoa encontrada para alteração!" });
            }
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            const repo = new pessoaRepository_1.default();
            const result = await repo.deletar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Pessoa deletada com sucesso!" });
            else
                throw new Error("Erro ao deletar pessoa do banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async restaurar(req, res) {
        try {
            const { id } = req.params;
            const repo = new pessoaRepository_1.default();
            const result = await repo.restaurar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Pessoa restaurada com sucesso!" });
            else
                throw new Error("Erro ao restaurar pessoa do banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
}
exports.default = PessoaController;
//# sourceMappingURL=PessoaController.js.map