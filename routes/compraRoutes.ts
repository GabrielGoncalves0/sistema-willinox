import express from 'express';
import CompraController from '../controllers/CompraController';

const router = express.Router();
const ctrl = new CompraController();

router.get("/", (req, res) => {
    ctrl.listar(req, res);
});

router.get("/relatorio", (req, res) => {
    ctrl.listarParaRelatorio(req, res);
});

router.get("/:id", (req, res) => {
    ctrl.obter(req, res);
});

router.post("/", (req, res) => {
    ctrl.inserirComItens(req, res);
});

router.put("/", (req, res) => {
    ctrl.atualizarComItens(req, res);
});

router.delete("/:id", (req, res) => {
    ctrl.deletar(req, res);
});

export default router;