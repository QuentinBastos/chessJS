import {Router} from 'express';
import {
    API_BOARD_URL,
    API_INIT_BOARD_URL,
    API_KING_CHECK_URL,
    API_MOVE_PIECE_URL,
    API_POSSIBLES_MOVES_URL
} from '../constants'

import {getBoard, getPossibleMoves, initBoard, stateGame, movePiece} from '../controllers/chess.controller';

const router = Router();

router.get(API_BOARD_URL, getBoard);

router.get(API_INIT_BOARD_URL, initBoard);

router.get(API_POSSIBLES_MOVES_URL, getPossibleMoves);

router.post(API_MOVE_PIECE_URL, movePiece);

router.get(API_KING_CHECK_URL, stateGame);


export default router;