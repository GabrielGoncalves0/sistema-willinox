import { Request, Response } from 'express';
import AuthMiddleware from "../middlewares/authMiddleware.js";
import FisicaRepository from "../repositories/fisicaRepository.js";

export default class AutenticacaoController {
    async token(req: Request, res: Response): Promise<void> {
        try {
            const { login, senha } = req.body;
            if (login && senha) {
                const repo = new FisicaRepository();
                const pessoa = await repo.validarAcesso(login, senha);
                if (pessoa) {
                    const auth = new AuthMiddleware();
                    const token = auth.gerarToken(
                        pessoa.id,
                        pessoa.cpf,
                        pessoa.dataNascimento,
                        pessoa.fisicaTipo,
                        pessoa.login || ''
                    );
                    res.cookie("token", token, { httpOnly: true });
                    res.status(200).json({ token });
                } else {
                    res.status(404).json({ msg: "Credenciais inválidas!" });
                }
            } else {
                res.status(400).json({ msg: "As credenciais não foram fornecidas corretamente!" });
            }
        } catch (ex: any) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });
            res.status(200).json({ msg: "Logout realizado com sucesso!" });
        } catch (ex: any) {
            res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }
}