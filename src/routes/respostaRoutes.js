import express from 'express';
import { registrarResposta, listarRespostas, listarRespostasPorUsuario } from '../controllers/respostaController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, registrarResposta);
router.get('/', listarRespostas);
router.get('/usuario/:usuarioId', listarRespostasPorUsuario);

export default router;
