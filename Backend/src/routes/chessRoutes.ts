import {Router} from 'express';
import ChessService from '../services/chess.service';
import {API_BOARD_URL, API_KING_CHECK_URL, API_MOVE_PIECE_URL, API_POSSIBLES_MOVES_URL} from '../../../Shared/constants'

import {getPossibleMoves, movePiece} from '../controllers/chess.controller';

const router = Router();
const chessService = new ChessService();
router.get(API_BOARD_URL, (req, res) => {
    chessService.initializeStandardChess();
    const board = chessService.getBoard();
    res.json(board);
});
router.get(API_POSSIBLES_MOVES_URL, getPossibleMoves);

router.post(API_MOVE_PIECE_URL, movePiece);

router.get(API_KING_CHECK_URL, (req, res) => {
    const color = req.params.color;
    const board = chessService.getBoard();
    const isKingInCheck = chessService.isKingInCheck(color, board);
    res.json(isKingInCheck);
});


export default router;