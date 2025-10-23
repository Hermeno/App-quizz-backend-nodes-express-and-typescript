import express from 'express';
import { criarPagamento, listarPagamentos, atualizarStatusPagamento } from '../controllers/pagamentoController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, criarPagamento);
router.get('/', listarPagamentos);
router.patch('/:id/status', verifyToken, atualizarStatusPagamento);

export default router;
