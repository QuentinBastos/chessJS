import {Router} from 'express';
import {
    API_BOARD_URL,
    API_END_GAME_URL,
    API_INIT_BOARD_URL,
    API_KING_CHECK_URL,
    API_MOVE_PIECE_URL,
    API_POSSIBLES_MOVES_URL, API_PROMOTION_URL
} from '../constants'

import {getBoard, getPossibleMoves, getInitBoard, getStateGame, doMovePiece, doEndGame, doPromotion} from '../controllers/chess.controller';

const router = Router();

router.get(API_BOARD_URL, getBoard);
router.get(API_INIT_BOARD_URL, getInitBoard);
router.get(API_POSSIBLES_MOVES_URL, getPossibleMoves);
router.get(API_KING_CHECK_URL, getStateGame);

router.post(API_MOVE_PIECE_URL, doMovePiece);
router.post(API_END_GAME_URL, doEndGame);
router.post(API_PROMOTION_URL, doPromotion);


export default router;