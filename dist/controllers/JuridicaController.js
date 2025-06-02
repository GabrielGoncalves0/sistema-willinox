"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const juridicaRepository_1 = __importDefault(require("../repositories/juridicaRepository"));
const juridicaEntity_1 = __importDefault(require("../entities/juridicaEntity"));
const types_1 = require("../entities/enum/types");
const pessoaEntity_1 = __importDefault(require("../entities/pessoaEntity"));
const pessoaRepository_1 = __importDefault(require("../repositories/pessoaRepository"));
class JuridicaController {
    async listar(req, res) {
        try {
            const repo = new juridicaRepository_1.default();
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
            const repo = new juridicaRepository_1.default();
            const juridica = await repo.obter(parseInt(id));
            res.status(200).json(juridica || []);
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async listarJuridicaClientes(req, res) {
        try {
            const repo = new juridicaRepository_1.default();
            const { incluirInativos } = req.query;
            let lista = incluirInativos === 'true' ? await repo.listarTodosJuridicaClientes() : await repo.listarJuridicaClientes();
            res.status(200).json(lista);
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async obterJuridicaCliente(req, res) {
        try {
            const { id } = req.params;
            const repo = new juridicaRepository_1.default();
            const fisica = await repo.obterJuridicaCliente(parseInt(id));
            res.status(200).json(fisica || []);
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async inserir(req, res) {
        try {
            let { nome, endereco, telefone, email, tipo, cnpj, juridicaTipo } = req.body;
            nome = nome?.trim();
            endereco = endereco?.trim();
            telefone = telefone?.trim();
            email = email?.trim();
            cnpj = cnpj?.trim();
            if (!nome || !endereco || !telefone || !email || tipo === undefined || !cnpj || !juridicaTipo) {
                return res.status(400).json({ msg: "Parâmetros obrigatórios ausentes!" });
            }
            if (!Object.values(types_1.JuridicaTipo).includes(juridicaTipo)) {
                return res.status(400).json({ msg: "Tipo de pessoa jurídica inválido!" });
            }
            const repoPessoa = new pessoaRepository_1.default();
            const repoJuridica = new juridicaRepository_1.default();
            if (await repoJuridica.existeNome(nome, juridicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${juridicaTipo} com o mesmo nome!` });
            }
            if (await repoJuridica.existeCNPJ(cnpj, juridicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${juridicaTipo} com o mesmo CNPJ!` });
            }
            const entidadePessoa = new pessoaEntity_1.default(0, nome, endereco || null, telefone || null, email || null, tipo);
            const pessoaId = await repoPessoa.inserir(entidadePessoa);
            if (!pessoaId)
                return res.status(500).json({ msg: "Erro ao inserir pessoa!" });
            const entidadeJuridica = new juridicaEntity_1.default(0, cnpj, pessoaId, juridicaTipo);
            const result = await repoJuridica.inserir(entidadeJuridica);
            if (result)
                return res.status(201).json({ msg: "Pessoa jurídica cadastrada com sucesso!" });
            throw new Error("Erro ao inserir pessoa jurídica no banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro interno: ${ex.message}` });
        }
    }
    async atualizar(req, res) {
        try {
            let { id, cnpj, juridicaTipo, pessoaId, nome, endereco, telefone, email, tipo } = req.body;
            nome = nome?.trim();
            endereco = endereco?.trim();
            telefone = telefone?.trim();
            email = email?.trim();
            cnpj = cnpj?.trim();
            if (!id || !cnpj || !juridicaTipo || !pessoaId || !nome || !endereco || !telefone || !email || !tipo) {
                return res.status(400).json({ msg: "Parâmetros obrigatórios ausentes ou inválidos!" });
            }
            if (!Object.values(types_1.JuridicaTipo).includes(juridicaTipo)) {
                return res.status(400).json({ msg: "Tipo de pessoa jurídica inválido!" });
            }
            const juridicaRepo = new juridicaRepository_1.default();
            const pessoaRepo = new pessoaRepository_1.default();
            if (await juridicaRepo.existeNomeEmOutroId(nome, id, juridicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${juridicaTipo} com o mesmo nome!` });
            }
            if (await juridicaRepo.existeCNPJEmOutroId(cnpj, id, juridicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${juridicaTipo} com o mesmo CNPJ!` });
            }
            const entidadeJuridica = new juridicaEntity_1.default(id, cnpj, pessoaId, juridicaTipo);
            const juridicaAtualizada = await juridicaRepo.atualizar(entidadeJuridica);
            if (!juridicaAtualizada)
                return res.status(500).json({ msg: "Erro ao atualizar pessoa jurídica!" });
            const entidadePessoa = new pessoaEntity_1.default(pessoaId, nome, endereco || null, telefone || null, email || null, tipo);
            const pessoaAtualizada = await pessoaRepo.atualizar(entidadePessoa);
            if (!pessoaAtualizada)
                return res.status(500).json({ msg: "Erro ao atualizar dados da pessoa!" });
            return res.status(200).json({ msg: "Pessoa jurídica atualizada com sucesso!" });
        }
        catch (ex) {
            return res.status(500).json({ msg: `Erro interno: ${ex.message}` });
        }
    }
    async deletar(req, res) {
        try {
            const { id } = req.params;
            const repo = new juridicaRepository_1.default();
            const result = await repo.deletar(parseInt(id));
            if (result)
                res.status(200).json({ msg: "Pessoa jurídica deletada com sucesso!" });
            else
                throw new Error("Erro ao deletar pessoa jurídica do banco de dados");
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async restaurar(req, res) {
        try {
            const { id } = req.params;
            const repoJuridica = new juridicaRepository_1.default();
            const juridica = await repoJuridica.restaurar(parseInt(id));
            if (!juridica)
                return res.status(500).json({ msg: "Erro ao restaurar pessoa jurídica!" });
            const sql = "SELECT * FROM tb_juridica WHERE jur_id = ?";
            const rows = await repoJuridica.db.ExecutaComando(sql, [parseInt(id)]);
            if (rows && rows.length > 0 && rows[0].pes_id) {
                const pessoaId = rows[0].pes_id;
                const repoPessoa = new pessoaRepository_1.default();
                const pessoa = await repoPessoa.restaurar(pessoaId);
                if (!pessoa)
                    return res.status(500).json({ msg: "Erro ao restaurar pessoa associada!" });
            }
            res.status(200).json({ msg: "Pessoa jurídica restaurada com sucesso!" });
        }
        catch (ex) {
            res.status(500).json({ msg: `Erro interno: ${ex.message}` });
        }
    }
}
exports.default = JuridicaController;
//# sourceMappingURL=JuridicaController.js.map