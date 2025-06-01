import express from 'express'
import compraRoute from './routes/compraRoutes.js'
import fisicaRoute from './routes/fisicaRoutes.js'
import juridicaRoute from './routes/juridicaRoutes.js'
import materiaPrimaRoute from './routes/materiaPrimaRoutes.js'
import modeloRoute from './routes/modeloRoutes.js'
import pedidoRoute from './routes/pedidoRoutes.js'
import pessoaRoute from './routes/pessoaRoutes.js'
import producaoRoute from './routes/producaoRoutes.js'
import produtoRoute from './routes/produtoRoutes.js'
import itensProducaoRoute from './routes/relations/itensProducaoRoutes.js'
import pedidoMateriaPrimaRoute from './routes/relations/pedidoMateriaPrimaRoutes.js'
import pedidoProdutoRoute from './routes/relations/pedidoProdutoRoutes.js'
import produtoMateriaPrimaRoute from './routes/relations/produtoMateriaPrimaRoutes.js'
import autenticacaoRoute from './routes/autenticacaoRoute.js'
import dotenv from 'dotenv';

import cors from 'cors'
import AuthMiddleware from './middlewares/authMiddleware.js'
import cookieParser from 'cookie-parser'
import { databaseMiddleware } from './middlewares/databaseMiddleware.js'

dotenv.config();

const auth = new AuthMiddleware();
const app = express();

if (process.env.NODE_ENV === 'development') {
  console.log('Rodando em modo DESENVOLVIMENTO');
} else {
  console.log('Rodando em modo PRODUÇÃO');
}

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use(databaseMiddleware);

app.use("/auth", autenticacaoRoute);

app.use(auth.validar);

app.use("/compra", compraRoute);
app.use("/pessoa-fisica", fisicaRoute);
app.use("/pessoa-juridica", juridicaRoute);
app.use("/materiaPrima", materiaPrimaRoute);
app.use("/modelo", modeloRoute);
app.use("/pedido", pedidoRoute);
app.use("/pessoa", pessoaRoute);
app.use("/producao", producaoRoute);
app.use("/produtos", produtoRoute);
app.use("/itensProducao", itensProducaoRoute);
app.use("/pedidoMateriaPrima", pedidoMateriaPrimaRoute);
app.use("/pedidoProduto", pedidoProdutoRoute);
app.use("/produtoMateriaPrima", produtoMateriaPrimaRoute);


const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const server = app.listen(PORT, function() {
    console.log(`Servidor web em funcionamento na porta ${PORT}!`);
});

import Database from './db/database.js';

process.on('SIGINT', async () => {
    console.log('Encerrando o servidor...');

    try {
        await Database.getInstance().closePool();
        console.log('Pool de conex�es fechado com sucesso');

        server.close(() => {
            console.log('Servidor encerrado com sucesso');
            process.exit(0);
        });
    } catch (error) {
        console.error('Erro ao encerrar o servidor:', error);
        process.exit(1);
    }
});