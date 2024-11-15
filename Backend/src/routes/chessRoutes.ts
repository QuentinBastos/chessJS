import { Router } from 'express';
import ChessService from '../services/chessService';

import { movePiece } from '../controllers/chess.controller';

const router = Router();
const chessService = new ChessService();

router.post('/move', movePiece);
router.get('/board', (req, res) => {
    const board = chessService.getBoard();
    res.json(board);
});

export default router;