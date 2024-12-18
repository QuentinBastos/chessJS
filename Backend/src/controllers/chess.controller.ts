import { Request, Response } from 'express';
import ChessService from '../services/chess.service';
import {ChessColor} from "../interface";

const chessService = new ChessService();


export const getBoard = (req: Request, res: Response) => {
    const board = chessService.getBoard();
    const capturedPieces = chessService.getCapturedPieces();
    const review = chessService.getReview();
    const currentTurn = chessService.getCurrentTurn();
    const isGameStarted = chessService.getIsGameStarted();
    res.json({ board, capturedPieces, review, currentTurn, isGameStarted });
};

export const getInitBoard = (req: Request, res: Response) => {
    chessService.initializeStandardChess();
    chessService.setReview([]);
    chessService.setCurrentTurn(ChessColor.White);
    chessService.setCapturedPieces([]);
    chessService.setIsGameStarted(true);
    const isGameStarted = chessService.getIsGameStarted();
    const board = chessService.getBoard();

    if (!board) {
        return res.status(404).json({ message: 'Board not found' });
    }

    res.json({ board, isGameStarted });
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

export const doMovePiece = (req: Request, res: Response) => {
    const { pieceId, toPosition } = req.body;
    const moveResult = chessService.movePiece(pieceId, toPosition);

    if (moveResult.success) {
        res.json({
            success: true,
            board: chessService.getBoard(),
            capturedPieces: chessService.getCapturedPieces(),
            currentTurn: chessService.getCurrentTurn(),
            review: chessService.getReview(),
            promotion: moveResult.promotion,
        });
    } else {
        res.json({
            success: false,
            message: moveResult.message,
        });
    }
};

export const getStateGame = (req: Request, res: Response) => {
    const color = req.params.color as ChessColor;
    const board = chessService.getBoard();
    const [isInCheck, movePossible] = chessService.stateGame(color, board);
    res.json({ isInCheck, movePossible});
};

export const doEndGame = (req: Request, res: Response) => {
    chessService.initializeStandardChess();
    chessService.setReview([]);
    chessService.setCurrentTurn(ChessColor.White);
    chessService.setCapturedPieces([]);
    chessService.setIsGameStarted(false);

    const isGameStarted = chessService.getIsGameStarted();

    res.json({ isGameStarted });
};

export const doPromotion = (req: Request, res: Response) => {
    const { pieceId, pieceType } = req.body;
    const promotionResult = chessService.promotion(pieceId, pieceType);
    if (promotionResult.success) {
        res.json({
            success: true,
            board: chessService.getBoard(),
            capturedPieces: chessService.getCapturedPieces(),
            currentTurn: chessService.getCurrentTurn(),
            review: chessService.getReview(),
        });
    } else {
        res.json({
            success: false,
            message: promotionResult.message,
        });
    }
}

