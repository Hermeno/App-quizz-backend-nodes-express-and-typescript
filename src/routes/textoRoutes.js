import express from 'express';
import {
  criarTexto,
  listarTextos,
  listarTextosPorExame,
  obterTexto,
  atualizarTexto,
  deletarTexto,
} from '../controllers/textoController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Coloca rotas específicas ANTES das rotas com parâmetros
router.get('/exame/:exameId', verifyToken, listarTextosPorExame);

router.post('/', verifyToken, criarTexto);
router.get('/', verifyToken, listarTextos);
router.get('/:id', verifyToken, obterTexto);
router.put('/:id', verifyToken, atualizarTexto);
router.delete('/:id', verifyToken, deletarTexto);

export default router;
