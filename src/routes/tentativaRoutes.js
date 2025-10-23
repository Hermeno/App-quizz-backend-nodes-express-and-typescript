import express from 'express';
import { iniciarTentativa, concluirTentativa, listarTentativasPorUsuario, listarTentativasPorExame } from '../controllers/tentativaController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, iniciarTentativa);
router.post('/:id/concluir', verifyToken, concluirTentativa);
router.get('/usuario/:usuarioId', listarTentativasPorUsuario);
router.get('/exame/:exameId', listarTentativasPorExame);

export default router;
