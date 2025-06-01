import express from 'express';
import FisicaController from '../controllers/FisicaController';

const router = express.Router();
const ctrl = new FisicaController();

router.get("/", (req, res) => {
    ctrl.listar(req, res);
});

router.get("/clientes", (req, res) => {
    ctrl.listarClientes(req, res);
});

router.get("/funcionarios", (req, res) => {
    ctrl.listarFuncionarios(req, res);
});

router.get("/:id", (req, res) => {
    ctrl.obter(req, res);
});

router.get("/cliente/:id", (req, res) => {
    ctrl.obterCliente(req, res);
});

router.get("/funcionario/:id", (req, res) => {
    ctrl.obterFuncionario(req, res);
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

router.put("/restaurar/:id", (req, res) => {
    ctrl.restaurar(req, res);
});

export default router;