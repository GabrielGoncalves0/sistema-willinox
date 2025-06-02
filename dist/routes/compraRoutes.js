"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CompraController_1 = __importDefault(require("../controllers/CompraController"));
const router = express_1.default.Router();
const ctrl = new CompraController_1.default();
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
exports.default = router;
//# sourceMappingURL=compraRoutes.js.map