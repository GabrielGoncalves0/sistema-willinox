"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PedidoController_1 = __importDefault(require("../controllers/PedidoController"));
const router = express_1.default.Router();
const ctrl = new PedidoController_1.default();
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
exports.default = router;
//# sourceMappingURL=pedidoRoutes.js.map