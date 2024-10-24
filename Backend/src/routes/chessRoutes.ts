import { Router } from 'express';
import chessController from '../controllers/chessController';

const router = Router();

router.post('/move', chessController.movePiece);
router.get('/board', chessController.getBoard);

export default router;