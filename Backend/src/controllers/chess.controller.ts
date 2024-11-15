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
    const pieceId = parseInt(req.body.pieceId, 10);
    const toPosition: [number, number] = req.body.toPosition;

    console.log('Received move request:', { pieceId, toPosition });

    const result = chessService.movePiece(pieceId, toPosition);

    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    res.json(result.board);
};