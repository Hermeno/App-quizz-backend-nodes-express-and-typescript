import express from 'express';
import { listarUsuarios, obterUsuario, atualizarUsuario, excluirUsuario } from '../controllers/usuarioController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', listarUsuarios);
router.get("/obterUsuario", verifyToken, obterUsuario);
router.put('/atualizar', verifyToken, atualizarUsuario);
router.delete('/:id', verifyToken, excluirUsuario);

export default router;
