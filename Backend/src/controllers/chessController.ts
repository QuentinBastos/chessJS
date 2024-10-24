import { Request, Response } from 'express';
import chessService from '../services/chessService';

class ChessController {
    public movePiece(req: Request, res: Response): void {
        const { from, to } = req.body;
        const success = chessService.movePiece(from, to);
        if (success) {
            res.status(200).send('Move successful');
        } else {
            res.status(400).send('Invalid move');
        }
    }

    public getBoard(req: Request, res: Response): void {
        const board = chessService.getBoard();
        res.status(200).json(board);
    }
}

export default new ChessController();