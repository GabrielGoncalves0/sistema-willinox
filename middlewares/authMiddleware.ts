import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import FisicaRepository from '../repositories/fisicaRepository.js';
import { FisicaTipo } from '../entities/enum/types.js';

const SEGREDO = "AX2ZVN21OXCZ78!@#$%¨&*())(&¨&#$@!";

interface FisicaPayload {
    id: number;
    cpf: string;
    dataNascimento: Date;
    tipo: FisicaTipo;
    login: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        usuarioLogado?: any;
    }
}

export default class AuthMiddleware {

    gerarToken(id: number, cpf: string, dataNascimento: Date, tipo: FisicaTipo, login: string): string {
        return jwt.sign({
            id: id,
            cpf: cpf,
            dataNascimento: dataNascimento,
            tipo: tipo,
            login: login
        } as FisicaPayload, SEGREDO, { expiresIn: 8 * 3600 });
    }

    async validar(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { token } = req.cookies;

        if (!token) {
            res.status(401).json({ msg: "Token não fornecido!" });
            return;
        }

        try {
            const objUsuario = jwt.verify(token, SEGREDO, { ignoreExpiration: true }) as FisicaPayload;

            const decoded = jwt.decode(token) as { exp?: number };
            const isExpired = decoded.exp ? decoded.exp < Math.floor(Date.now() / 1000) : true;

            const repo = new FisicaRepository();
            const usuario = await repo.obter(objUsuario.id);

            if (!usuario) {
                res.clearCookie("token");
                res.status(401).json({ msg: "Funcionário não encontrado!" });
                return;
            }

            const MAX_REFRESH_TIME = 2 * 60 * 60;
            const tokenExpiredTime = decoded.exp ? Math.floor(Date.now() / 1000) - decoded.exp : 0;

            if (isExpired) {
                if (tokenExpiredTime > MAX_REFRESH_TIME) {
                    res.clearCookie("token");
                    res.status(401).json({ msg: "Sua sessão expirou há mais de 2 horas. Faça login novamente." });
                    return;
                }

                const tokenNovo = this.gerarToken(
                    objUsuario.id,
                    objUsuario.cpf,
                    objUsuario.dataNascimento,
                    objUsuario.tipo,
                    objUsuario.login
                );

                res.cookie("token", tokenNovo, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
            }

            req.usuarioLogado = usuario;
            next();
        } catch (ex: any) {
            console.error("Erro na validação do token:", ex);

            res.clearCookie("token");
            res.status(401).json({ msg: "Token inválido! Faça login novamente." });
        }
    }
}