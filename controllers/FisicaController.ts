import { Request, Response } from 'express';
import FisicaRepository from '../repositories/fisicaRepository';
import FisicaEntity from '../entities/fisicaEntity';
import { FisicaTipo } from '../entities/enum/types';
import PessoaRepository from '../repositories/pessoaRepository';
import PessoaEntity from '../entities/pessoaEntity';

export default class FisicaController {
    async listar(req: Request, res: Response) {
        try {
            const repo = new FisicaRepository();
            const { incluirInativos } = req.query;
            let lista = incluirInativos === 'true' ? await repo.listarTodos() : await repo.listar();
            res.status(200).json(lista);
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async listarClientes(req: Request, res: Response) {
        try {
            const repo = new FisicaRepository();
            const { incluirInativos } = req.query;
            let lista = incluirInativos === 'true' ? await repo.listarTodosClientes() : await repo.listarClientes();
            res.status(200).json(lista);
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async listarFuncionarios(req: Request, res: Response) {
        try {
            const repo = new FisicaRepository();
            const { incluirInativos } = req.query;
            let lista = incluirInativos === 'true' ? await repo.listarTodosFuncionarios() : await repo.listarFuncionarios();
            res.status(200).json(lista);
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async obter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new FisicaRepository();
            const fisica = await repo.obter(parseInt(id));
            res.status(200).json(fisica || []);
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async obterCliente(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new FisicaRepository();
            const fisica = await repo.obterCliente(parseInt(id));
            res.status(200).json(fisica || []);
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async obterFuncionario(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new FisicaRepository();
            const fisica = await repo.obterFuncionario(parseInt(id));
            res.status(200).json(fisica || []);
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async inserir(req: Request, res: Response) {
        try {
            let { nome, endereco, telefone, email, tipo, cpf, dataNascimento, login, senha, fisicaTipo } = req.body;
            nome = nome?.trim();
            endereco = endereco?.trim();
            telefone = telefone?.trim();
            email = email?.trim();
            cpf = cpf?.trim();
            login = login?.trim();
            if (!cpf || !fisicaTipo || !Object.values(FisicaTipo).includes(fisicaTipo)) {
                return res.status(400).json({ msg: "Parâmetros obrigatórios ausentes ou inválidos!" });
            }
            const repoPessoa = new PessoaRepository();
            const repoFisica = new FisicaRepository();
            if (await repoFisica.existeCpf(cpf, fisicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${fisicaTipo} com o mesmo CPF!` });
            }
            if (await repoFisica.existeNomeEndereco(nome, endereco, fisicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${fisicaTipo} com o mesmo nome e endereço!` });
            }
            if (await repoFisica.existeNomeTelefone(nome, telefone, fisicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${fisicaTipo} com o mesmo nome e telefone!` });
            }
            if (fisicaTipo === FisicaTipo.FUNCIONARIO) {
                if ((login && !senha) || (!login && senha)) {
                    return res.status(400).json({ msg: "Login e senha devem ser fornecidos juntos!" });
                }
                if (login && await repoFisica.existeLogin(login)) {
                    return res.status(400).json({ msg: "Login já cadastrado!" });
                }
            }
            const entidadePessoa = new PessoaEntity(0, nome, endereco || null, telefone || null, email || null, tipo);
            const pessoaId = await repoPessoa.inserir(entidadePessoa);
            if (!pessoaId) return res.status(500).json({ msg: "Erro ao inserir pessoa!" });
            const entidadeFisica = new FisicaEntity(0, cpf, new Date(dataNascimento), pessoaId, fisicaTipo, fisicaTipo === FisicaTipo.FUNCIONARIO ? login : undefined, fisicaTipo === FisicaTipo.FUNCIONARIO ? senha : undefined);
            const result = await repoFisica.inserir(entidadeFisica);
            if (!result) return res.status(500).json({ msg: "Erro ao inserir pessoa física no banco de dados!" });
            res.status(201).json({ msg: "Pessoa física cadastrada com sucesso!" });
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro interno: ${ex.message}` });
        }
    }
    async atualizar(req: Request, res: Response) {
        try {
            let { id, cpf, dataNascimento, pessoaId, fisicaTipo, login, senha, nome, endereco, telefone, email, tipo } = req.body;
            nome = nome?.trim();
            endereco = endereco?.trim();
            telefone = telefone?.trim();
            email = email?.trim();
            cpf = cpf?.trim();
            login = login?.trim();
            if (!id || !cpf || !dataNascimento || !pessoaId || !tipo) {
                return res.status(400).json({ msg: "Parâmetros obrigatórios ausentes!" });
            }
            const fisicaRepo = new FisicaRepository();
            const pessoaRepo = new PessoaRepository();
            if (await fisicaRepo.existeCpfEmOutroId(cpf, id, fisicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${fisicaTipo} com o mesmo CPF!` });
            }
            if (await fisicaRepo.existeNomeEnderecoEmOutroId(nome, endereco, id, fisicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${fisicaTipo} com esse nome e endereço!` });
            }
            if (await fisicaRepo.existeNomeTelefoneEmOutroId(nome, telefone, id, fisicaTipo)) {
                return res.status(400).json({ msg: `Já existe um ${fisicaTipo} com esse nome e telefone!` });
            }
            if (fisicaTipo === FisicaTipo.FUNCIONARIO) {
                if ((login && !senha) || (!login && senha)) {
                    return res.status(400).json({ msg: "Login e senha devem ser fornecidos juntos!" });
                }
                if (login && await fisicaRepo.existeLoginEmOutroId(login, id)) {
                    return res.status(400).json({ msg: "Login já cadastrado!" });
                }
            }
            const fisicaEntidade = new FisicaEntity(id, cpf, new Date(dataNascimento), pessoaId, fisicaTipo, login, senha);
            const fisicaResult = await fisicaRepo.atualizar(fisicaEntidade);
            if (!fisicaResult) return res.status(500).json({ msg: "Erro ao atualizar pessoa física!" });
            if (nome || endereco || telefone || email || tipo) {
                const pessoaEntidade = new PessoaEntity(pessoaId, nome, endereco || null, telefone || null, email || null, tipo);
                const pessoaResult = await pessoaRepo.atualizar(pessoaEntidade);
                if (!pessoaResult) return res.status(500).json({ msg: "Erro ao atualizar pessoa!" });
            }
            res.status(200).json({ msg: "Pessoa física e dados pessoais atualizados com sucesso!" });
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro interno: ${ex.message}` });
        }
    }
    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repoFisica = new FisicaRepository();
            const obterFisica = await repoFisica.obter(parseInt(id));
            if (!obterFisica) return res.status(404).json({ msg: "Pessoa física não encontrada!" });
            const resultFisica = await repoFisica.deletar(parseInt(id));
            if (!resultFisica) return res.status(500).json({ msg: "Erro ao deletar pessoa física!" });
            const repoPessoa = new PessoaRepository();
            const resultPessoa = await repoPessoa.deletar(obterFisica.pessoaId);
            if (!resultPessoa) return res.status(500).json({ msg: "Erro ao deletar pessoa associada!" });
            res.status(200).json({ msg: "Pessoa física e associada deletadas com sucesso!" });
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro interno: ${ex.message}` });
        }
    }
    async restaurar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repoFisica = new FisicaRepository();
            const fisica = await repoFisica.restaurar(parseInt(id));
            if (!fisica) return res.status(500).json({ msg: "Erro ao restaurar pessoa física!" });
            const obterFisica = await repoFisica.obter(parseInt(id));
            if (obterFisica && obterFisica.pessoaId) {
                const repoPessoa = new PessoaRepository();
                const pessoa = await repoPessoa.restaurar(obterFisica.pessoaId);
                if (!pessoa) return res.status(500).json({ msg: "Erro ao restaurar pessoa associada!" });
            }
            res.status(200).json({ msg: "Pessoa física restaurada com sucesso!" });
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro interno: ${ex.message}` });
        }
    }
}