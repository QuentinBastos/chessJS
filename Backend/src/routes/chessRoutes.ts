import { Router } from 'express';
import { movePiece, getBoard } from '../controllers/chess.controller';

const router = Router();

router.post('/move', movePiece);
router.get('/board', getBoard);

export default router;