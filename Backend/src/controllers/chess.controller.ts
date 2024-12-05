import { Request, Response } from 'express';
import ChessService from '../services/chess.service';
import {ChessColor} from "../interface";

const chessService = new ChessService();


export const getBoard = (req: Request, res: Response) => {
    const board = chessService.getBoard();
    res.status(200).json(board);
};

export const initBoard = (req: Request, res: Response) => {
    chessService.initializeStandardChess();

    const board = chessService.getBoard();
    res.status(200).json(board);
}

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

export const stateGame = (req: Request, res: Response) => {
    const color = req.params.color as ChessColor;
    const board = chessService.getBoard();
    const [isInCheck, movePossible] = chessService.stateGame(color, board);
    res.json({ isInCheck, movePossible});
};

