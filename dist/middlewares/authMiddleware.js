"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fisicaRepository_js_1 = __importDefault(require("../repositories/fisicaRepository.js"));
const SEGREDO = "AX2ZVN21OXCZ78!@#$%�&*())(&�&#$@!";
class AuthMiddleware {
    gerarToken(id, cpf, dataNascimento, tipo, login) {
        return jsonwebtoken_1.default.sign({
            id: id,
            cpf: cpf,
            dataNascimento: dataNascimento,
            tipo: tipo,
            login: login
        }, SEGREDO, { expiresIn: 8 * 3600 });
    }
    async validar(req, res, next) {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).json({ msg: "Token n�o fornecido!" });
            return;
        }
        try {
            const objUsuario = jsonwebtoken_1.default.verify(token, SEGREDO, { ignoreExpiration: true });
            const decoded = jsonwebtoken_1.default.decode(token);
            const isExpired = decoded.exp ? decoded.exp < Math.floor(Date.now() / 1000) : true;
            const repo = new fisicaRepository_js_1.default();
            const usuario = await repo.obter(objUsuario.id);
            if (!usuario) {
                res.clearCookie("token");
                res.status(401).json({ msg: "Funcion�rio n�o encontrado!" });
                return;
            }
            const MAX_REFRESH_TIME = 2 * 60 * 60;
            const tokenExpiredTime = decoded.exp ? Math.floor(Date.now() / 1000) - decoded.exp : 0;
            if (isExpired) {
                if (tokenExpiredTime > MAX_REFRESH_TIME) {
                    res.clearCookie("token");
                    res.status(401).json({ msg: "Sua sess�o expirou h� mais de 2 horas. Fa�a login novamente." });
                    return;
                }
                const tokenNovo = this.gerarToken(objUsuario.id, objUsuario.cpf, objUsuario.dataNascimento, objUsuario.tipo, objUsuario.login);
                res.cookie("token", tokenNovo, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });
            }
            req.usuarioLogado = usuario;
            next();
        }
        catch (ex) {
            console.error("Erro na valida��o do token:", ex);
            res.clearCookie("token");
            res.status(401).json({ msg: "Token inv�lido! Fa�a login novamente." });
        }
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=authMiddleware.js.map