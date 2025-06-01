import { Request, Response } from 'express';
import MateriaPrimaRepository from '../repositories/materiaPrimaRepository';
import MateriaPrimaEntity from '../entities/materiaPrimaEntity';

export default class MateriaPrimaController {
    private validarParametros(req: Request) {
        const { nome, codigo } = req.body;
        if (!nome || !codigo) throw new Error("Parâmetros 'nome' e 'código' são obrigatórios!");
    }
    async listar(req: Request, res: Response) {
        try {
            const repo = new MateriaPrimaRepository();
            const { incluirInativos } = req.query;
            let lista = incluirInativos === 'true' ? await repo.listarTodos() : await repo.listar();
            res.status(200).json(lista);
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro interno: ${ex.message}` });
        }
    }
    async obter(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new MateriaPrimaRepository();
            const materiaPrima = await repo.obter(parseInt(id));
            res.status(200).json(materiaPrima || []);
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro ao buscar matéria-prima: ${ex.message}` });
        }
    }
    async inserir(req: Request, res: Response) {
        try {
            this.validarParametros(req);
            const { nome, descricao, qtdEstoque, unidadeMedida, preco, codigo } = req.body;
            const repo = new MateriaPrimaRepository();
            if (await repo.existeCodigo(codigo)) return res.status(400).json({ msg: "Já existe uma matéria-prima com esse código!" });
            const entidade = new MateriaPrimaEntity(0, nome, descricao || null, qtdEstoque || 0, unidadeMedida || null, preco, codigo);
            const result = await repo.inserir(entidade);
            if (result) res.status(201).json({ msg: "Matéria-prima cadastrada com sucesso!" });
            else throw new Error("Erro ao inserir matéria-prima no banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro ao inserir matéria-prima: ${ex.message}` });
        }
    }
    async atualizar(req: Request, res: Response) {
        try {
            const { id, nome, descricao, qtdEstoque, unidadeMedida, preco, codigo } = req.body;
            if (!id || !nome) return res.status(400).json({ msg: "Parâmetros 'id' e 'nome' são obrigatórios!" });
            const repo = new MateriaPrimaRepository();
            if (await repo.existeCodigoEmOutroId(codigo, id)) return res.status(400).json({ msg: "Já existe outra matéria-prima com esse código!" });
            const materiaPrimaExistente = await repo.obter(id);
            if (!materiaPrimaExistente) return res.status(404).json({ msg: "Matéria-prima não encontrada para atualização!" });
            const entidade = new MateriaPrimaEntity(id, nome, descricao || null, qtdEstoque || 0, unidadeMedida || null, preco, codigo);
            const result = await repo.atualizar(entidade);
            if (result) res.status(200).json({ msg: "Matéria-prima atualizada com sucesso!" });
            else throw new Error("Erro ao atualizar matéria-prima no banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro ao atualizar matéria-prima: ${ex.message}` });
        }
    }
    async deletar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new MateriaPrimaRepository();
            const materiaPrima = await repo.obter(parseInt(id));
            if (!materiaPrima) return res.status(404).json({ msg: "Matéria-prima não encontrada!" });
            const result = await repo.deletar(parseInt(id));
            if (result) res.status(200).json({ msg: "Matéria-prima deletada com sucesso!" });
            else throw new Error("Erro ao deletar matéria-prima do banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro ao deletar matéria-prima: ${ex.message}` });
        }
    }
    async restaurar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = new MateriaPrimaRepository();
            const result = await repo.restaurar(parseInt(id));
            if (result) res.status(200).json({ msg: "Matéria-prima restaurada com sucesso!" });
            else throw new Error("Erro ao restaurar matéria-prima do banco de dados");
        } catch (ex: any) {
            res.status(500).json({ msg: `Erro ao restaurar matéria-prima: ${ex.message}` });
        }
    }
}
