import ChessService from '../chessService';
import { ChessColor } from '../../interface';

describe('ChessService', () => {
    let chessService: ChessService;

    beforeEach(() => {
        chessService = new ChessService();
    });

    test('should initialize the board correctly', () => {
        const board = chessService.getBoard();
        expect(board[0][0]?.color).toBe(ChessColor.White);
        expect(board[7][7]?.color).toBe(ChessColor.Black);
    });

    test('should move a piece correctly', () => {
        const from: [number, number] = [0, 1];
        const to: [number, number] = [0, 2];
        const success = chessService.movePiece(from, to);
        expect(success).toBe(true);
        const board = chessService.getBoard();
        expect(board[0][2]?.color).toBe(ChessColor.White);
        expect(board[0][1]).toBeNull();
    });
});