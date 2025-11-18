import express from 'express';
import { criarPergunta, listarPerguntas, obterPergunta, atualizarPergunta, excluirPergunta, baixarImagens, listarPerguntasPorExame, upload } from '../controllers/perguntaController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// aceitar upload de imagem no campo 'imagemPergunta'
router.post('/', verifyToken, upload.single('imagemPergunta'), criarPergunta);
router.get('/', listarPerguntas);
// rota específica deve vir antes de '/:id'
router.get('/exame/:exameId', listarPerguntasPorExame);
router.get('/:id', obterPergunta);
router.put('/:id', verifyToken, upload.single('imagemPergunta'), atualizarPergunta);
router.delete('/:id', verifyToken, excluirPergunta);
router.get("/download/imagens", baixarImagens);

export default router;
