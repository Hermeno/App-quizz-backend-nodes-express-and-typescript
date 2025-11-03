import express from 'express';
import { iniciarTentativa , buscarTentativaPorExame} from '../controllers/tentativaController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, iniciarTentativa);
router.get('/:exameId', verifyToken, buscarTentativaPorExame);


export default router;
