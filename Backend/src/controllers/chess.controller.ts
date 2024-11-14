import { Request, Response } from 'express';
import ChessService from '../services/chessService';

const chessService = new ChessService();

export const movePiece = (req: Request, res: Response) => {
    const { from, to } = req.body;
    const success = chessService.movePiece(from, to);
    if (success) {
        res.status(200).send({ message: 'Piece moved successfully' });
    } else {
        res.status(400).send({ message: 'Invalid move' });
    }
};

export const getBoard = (req: Request, res: Response) => {
    const board = chessService.getBoard();
    res.status(200).send(board);
};