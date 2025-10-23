import express from 'express';
import { criarExame, listarExames, obterExame, atualizarExame, excluirExame, listarExamesPorCriador } from '../controllers/exameController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, criarExame);
router.get('/', listarExames);
router.get('/:id', obterExame);
router.put('/:id', verifyToken, atualizarExame);
router.delete('/:id', verifyToken, excluirExame);
router.get('/criador/:criadorId', listarExamesPorCriador);

export default router;
