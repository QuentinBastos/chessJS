import { Request, Response } from 'express';
import ChessService from '../services/chessService';

const chessService = new ChessService();


export const getBoard = (req: Request, res: Response) => {
    chessService.initializeStandardChess();
    const board = chessService.getBoard();
    res.status(200).send(board);
};

export const getPossibleMoves = (req: Request, res: Response) => {
    const pieceId = parseInt(req.params.id, 10);
    const piece = chessService.getPieceById(pieceId);

    if (!piece) {
        return res.status(404).json({ message: 'Piece not found' });
    }

    const possibleMoves = chessService.checkMove(piece);
    res.json(possibleMoves);
};

export const movePiece = (req: Request, res: Response) => {
    const { pieceId, toPosition } = req.body;
    const moveResult = chessService.movePiece(pieceId, toPosition);

    if (moveResult.success) {
        res.json({
            success: true,
            board: chessService.getBoard(),
        });
    } else {
        res.json({
            success: false,
            message: moveResult.message,
        });
    }
};
