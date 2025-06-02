"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compraRoutes_js_1 = __importDefault(require("./routes/compraRoutes.js"));
const fisicaRoutes_js_1 = __importDefault(require("./routes/fisicaRoutes.js"));
const juridicaRoutes_js_1 = __importDefault(require("./routes/juridicaRoutes.js"));
const materiaPrimaRoutes_js_1 = __importDefault(require("./routes/materiaPrimaRoutes.js"));
const modeloRoutes_js_1 = __importDefault(require("./routes/modeloRoutes.js"));
const pedidoRoutes_js_1 = __importDefault(require("./routes/pedidoRoutes.js"));
const pessoaRoutes_js_1 = __importDefault(require("./routes/pessoaRoutes.js"));
const producaoRoutes_js_1 = __importDefault(require("./routes/producaoRoutes.js"));
const produtoRoutes_js_1 = __importDefault(require("./routes/produtoRoutes.js"));
const itensProducaoRoutes_js_1 = __importDefault(require("./routes/relations/itensProducaoRoutes.js"));
const pedidoMateriaPrimaRoutes_js_1 = __importDefault(require("./routes/relations/pedidoMateriaPrimaRoutes.js"));
const pedidoProdutoRoutes_js_1 = __importDefault(require("./routes/relations/pedidoProdutoRoutes.js"));
const produtoMateriaPrimaRoutes_js_1 = __importDefault(require("./routes/relations/produtoMateriaPrimaRoutes.js"));
const autenticacaoRoute_js_1 = __importDefault(require("./routes/autenticacaoRoute.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const authMiddleware_js_1 = __importDefault(require("./middlewares/authMiddleware.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const databaseMiddleware_js_1 = require("./middlewares/databaseMiddleware.js");
dotenv_1.default.config();
const auth = new authMiddleware_js_1.default();
const app = (0, express_1.default)();
if (process.env.NODE_ENV === 'development') {
    console.log('Rodando em modo DESENVOLVIMENTO');
}
else {
    console.log('Rodando em modo PRODUÇÃO');
}
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(databaseMiddleware_js_1.databaseMiddleware);
app.use("/auth", autenticacaoRoute_js_1.default);
app.use(auth.validar);
app.use("/compra", compraRoutes_js_1.default);
app.use("/pessoa-fisica", fisicaRoutes_js_1.default);
app.use("/pessoa-juridica", juridicaRoutes_js_1.default);
app.use("/materiaPrima", materiaPrimaRoutes_js_1.default);
app.use("/modelo", modeloRoutes_js_1.default);
app.use("/pedido", pedidoRoutes_js_1.default);
app.use("/pessoa", pessoaRoutes_js_1.default);
app.use("/producao", producaoRoutes_js_1.default);
app.use("/produtos", produtoRoutes_js_1.default);
app.use("/itensProducao", itensProducaoRoutes_js_1.default);
app.use("/pedidoMateriaPrima", pedidoMateriaPrimaRoutes_js_1.default);
app.use("/pedidoProduto", pedidoProdutoRoutes_js_1.default);
app.use("/produtoMateriaPrima", produtoMateriaPrimaRoutes_js_1.default);
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const server = app.listen(PORT, function () {
    console.log(`Servidor web em funcionamento na porta ${PORT}!`);
});
const database_js_1 = __importDefault(require("./db/database.js"));
process.on('SIGINT', async () => {
    console.log('Encerrando o servidor...');
    try {
        await database_js_1.default.getInstance().closePool();
        console.log('Pool de conex�es fechado com sucesso');
        server.close(() => {
            console.log('Servidor encerrado com sucesso');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Erro ao encerrar o servidor:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=server.js.map