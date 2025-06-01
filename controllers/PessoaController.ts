import { Request, Response } from 'express';
import PessoaRepository from '../repositories/pessoaRepository';
import PessoaEntity from '../entities/pessoaEntity';

export default class PessoaController {
    async listar(req: Request, res: Response) {
        try {
            const repo = new PessoaRepository();
            const { incluirInativos } = req.query;
            let lista = incluirInativos === 'true' ? await repo.listarTodos() : await repo.listar();
            if (lista && lista.length > 0) res.status(200).json(lista);
            else res.status(404).json({ msg: "Nenhuma pessoa encontrada!" });
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new PessoaRepository();
            const pessoa = await repo.obter(parseInt(id));
            if (pessoa) res.status(200).json(pessoa);
            else res.status(404).json({ msg: "Pessoa não encontrada" });
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async inserir(req: Request, res: Response) {
        try {
            const { nome, endereco, telefone, email, tipo } = req.body;
            if (!(nome && tipo)) return res.status(400).json({ msg: "Parâmetros inválidos!" });
            const pessoaRepo = new PessoaRepository();
            const pessoaEntidade = new PessoaEntity(0, nome, endereco || null, telefone || null, email || null, tipo);
            const result = await pessoaRepo.inserir(pessoaEntidade);
            if (result) return res.status(201).json({ msg: "Pessoa cadastrada!" });
            throw new Error("Erro ao inserir pessoa no banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const { id, nome, endereco, telefone, email, tipo } = req.body;
            if (!(id && nome && tipo)) return res.status(400).json({ msg: "Parâmetros inválidos" });
            const repo = new PessoaRepository();
            if (await repo.obter(id)) {
                const entidade = new PessoaEntity(id, nome, endereco || null, telefone || null, email || null, tipo);
                const result = await repo.atualizar(entidade);
                if (result) res.status(200).json({ msg: "Atualização realizada com sucesso!" });
                else throw new Error("Erro ao atualizar pessoa no banco de dados");
            } else {
                res.status(404).json({ msg: "Nenhuma pessoa encontrada para alteração!" });
            }
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new PessoaRepository();
            const result = await repo.deletar(parseInt(id));
            if (result) res.status(200).json({ msg: "Pessoa deletada com sucesso!" });
            else throw new Error("Erro ao deletar pessoa do banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async restaurar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new PessoaRepository();
            const result = await repo.restaurar(parseInt(id));
            if (result) res.status(200).json({ msg: "Pessoa restaurada com sucesso!" });
            else throw new Error("Erro ao restaurar pessoa do banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }
}