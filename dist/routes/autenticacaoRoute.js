"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const autenticacaoController_1 = __importDefault(require("../controllers/autenticacaoController"));
const router = express_1.default.Router();
const ctrl = new autenticacaoController_1.default();
router.post("/token", (req, res) => {
    ctrl.token(req, res);
});
router.post("/logout", (req, res) => {
    ctrl.logout(req, res);
});
exports.default = router;
//# sourceMappingURL=autenticacaoRoute.js.map