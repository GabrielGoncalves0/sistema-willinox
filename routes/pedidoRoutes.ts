import express from 'express';
import PedidoController from '../controllers/PedidoController';

const router = express.Router();
const ctrl = new PedidoController();

router.get("/", (req, res) => {
    ctrl.listar(req, res);
});

router.get("/detalhado/:id", (req, res) => {
    ctrl.obterPedidoDetalhado(req, res);
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

router.post("/com-itens", (req, res) => {
    ctrl.criarPedidoComItens(req, res);
});

router.put("/com-itens", (req, res) => {
    ctrl.atualizarPedidoComItens(req, res);
});

router.post("/produtos", (req, res) => {
    ctrl.criarPedidoProdutos(req, res);
});

router.put("/produtos", (req, res) => {
    ctrl.atualizarPedidoProdutos(req, res);
});

router.post("/materias-primas", (req, res) => {
    ctrl.criarPedidoMateriasPrimas(req, res);
});

router.put("/materias-primas", (req, res) => {
    ctrl.atualizarPedidoMateriasPrimas(req, res);
});

export default router;