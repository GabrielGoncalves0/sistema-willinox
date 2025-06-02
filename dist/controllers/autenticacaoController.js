"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_js_1 = __importDefault(require("../middlewares/authMiddleware.js"));
const fisicaRepository_js_1 = __importDefault(require("../repositories/fisicaRepository.js"));
class AutenticacaoController {
    async token(req, res) {
        try {
            const { login, senha } = req.body;
            if (login && senha) {
                const repo = new fisicaRepository_js_1.default();
                const pessoa = await repo.validarAcesso(login, senha);
                if (pessoa) {
                    const auth = new authMiddleware_js_1.default();
                    const token = auth.gerarToken(pessoa.id, pessoa.cpf, pessoa.dataNascimento, pessoa.fisicaTipo, pessoa.login || '');
                    res.cookie("token", token, { httpOnly: true });
                    res.status(200).json({ token });
                }
                else {
                    res.status(404).json({ msg: "Credenciais inválidas!" });
                }
            }
            else {
                res.status(400).json({ msg: "As credenciais não foram fornecidas corretamente!" });
            }
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });
            res.status(200).json({ msg: "Logout realizado com sucesso!" });
        }
        catch (ex) {
            res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }
}
exports.default = AutenticacaoController;
//# sourceMappingURL=autenticacaoController.js.map