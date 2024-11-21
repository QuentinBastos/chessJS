import {Router} from 'express';
import ChessService from '../services/chessService';

import {getPossibleMoves, movePiece} from '../controllers/chess.controller';

const router = Router();
const chessService = new ChessService();
router.get('/board', (req, res) => {
    chessService.initializeStandardChess();
    const board = chessService.getBoard();
    res.json(board);
});
router.get('/possible-moves/:id', getPossibleMoves);

router.post('/move-piece', movePiece);


export default router;