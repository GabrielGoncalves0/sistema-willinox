import express from 'express';
import ProdutoMateriaPrimaController from '../../controllers/Relations/ProdutoMateriaPrimaController';

const router = express.Router();
const ctrl = new ProdutoMateriaPrimaController();

router.get("/produto/:produtoId", (req, res) => {
    ctrl.listar(req, res);
});

router.get("/:produtoId", (req, res) => {
    ctrl.obter(req, res);
});

router.post("/", (req, res) => {
    ctrl.inserir(req, res);
});

router.put("/", (req, res) => {
    ctrl.atualizar(req, res);
});

router.delete("/:id", (req, res) => {
    ctrl.deletar(req, res);
});

export default router;