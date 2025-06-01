import express from 'express';
import AutenticacaoController from '../controllers/autenticacaoController';

const router = express.Router();

const ctrl = new AutenticacaoController();
router.post("/token", (req, res) => {
    ctrl.token(req, res);
});

router.post("/logout", (req, res) => {
    ctrl.logout(req, res);
});

export default router;