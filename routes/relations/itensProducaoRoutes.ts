import express from 'express';
import ItensProducaoController from '../../controllers/Relations/ItensProducaoController';

const router = express.Router();
const ctrl = new ItensProducaoController();

router.get("/", (req, res) => {
    ctrl.listar(req, res);
});

router.get("/:id", (req, res) => {
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