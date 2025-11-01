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
router.get('/', listarRespostas);
router.get('/usuario/:usuarioId', listarRespostasPorUsuario);
router.get('/media/:usuarioId/:exameId', calcularMediaPorExame);
router.get('/exame/:exameId/usuario/:usuarioId', listarRespostasPorExameEUsuario);
router.get('/exame/:exameId/usuario/:usuarioId/corretas', contarRespostasCorretasPorExameEUsuario);
router.get('/exame/:exameId/usuario/:usuarioId/erradas', contarRespostasErradasPorExameEUsuario);



export default router;
