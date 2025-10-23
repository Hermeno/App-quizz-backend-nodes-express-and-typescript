import express from 'express';
import { criarPergunta, listarPerguntas, obterPergunta, atualizarPergunta, excluirPergunta, listarPerguntasPorExame } from '../controllers/perguntaController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, criarPergunta);
router.get('/', listarPerguntas);
router.get('/:id', obterPergunta);
router.put('/:id', verifyToken, atualizarPergunta);
router.delete('/:id', verifyToken, excluirPergunta);
router.get('/exame/:exameId', listarPerguntasPorExame);

export default router;
