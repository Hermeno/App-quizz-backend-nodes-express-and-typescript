import express from 'express';
import { 
    registrarResposta, 
    listarRespostas, 
    listarRespostasPorUsuario, 
    calcularMediaPorExame, 
    listarRespostasPorExameEUsuario,
    contarRespostasCorretasPorExameEUsuario,
    contarRespostasErradasPorExameEUsuario 
} from '../controllers/respostaController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, registrarResposta);
router.get('/', verifyToken, listarRespostas);
router.get('/usuario', verifyToken, listarRespostasPorUsuario);
router.get('/media/:exameId/:tentativaId', verifyToken, calcularMediaPorExame);
router.get('/exame/:exameId/:tentativaId', verifyToken, listarRespostasPorExameEUsuario);
router.get('/exame/:exameId/:tentativaId/corretas', verifyToken, contarRespostasCorretasPorExameEUsuario);
router.get('/exame/:exameId/:tentativaId/erradas', verifyToken, contarRespostasErradasPorExameEUsuario);



export default router;
