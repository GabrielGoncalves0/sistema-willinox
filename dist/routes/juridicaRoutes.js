"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JuridicaController_1 = __importDefault(require("../controllers/JuridicaController"));
const router = express_1.default.Router();
const ctrl = new JuridicaController_1.default();
router.get("/clientes", (req, res) => {
    ctrl.listarJuridicaClientes(req, res);
});
router.get("/", (req, res) => {
    ctrl.listar(req, res);
});
router.get("/:id", (req, res) => {
    ctrl.obter(req, res);
});
router.get("/cliente/:id", (req, res) => {
    ctrl.obterJuridicaCliente(req, res);
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
exports.default = router;
//# sourceMappingURL=juridicaRoutes.js.map