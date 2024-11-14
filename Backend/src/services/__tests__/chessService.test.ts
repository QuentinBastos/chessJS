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

    test('should not move a piece to an invalid position', () => {
        const from: [number, number] = [0, 1];
        const to: [number, number] = [0, 8]; // Invalid position
        const success = chessService.movePiece(from, to);
        expect(success).toBe(false);
    });

    test('should capture an opponent\'s piece', () => {
        const from: [number, number] = [0, 1];
        const to: [number, number] = [0, 6]; // Position with a black pawn
        chessService.movePiece([0, 6], [0, 5]); // Move black pawn out of the way
        const success = chessService.movePiece(from, to);
        expect(success).toBe(true);
        const board = chessService.getBoard();
        expect(board[0][6]?.color).toBe(ChessColor.White);
        expect(board[0][1]).toBeNull();
    });

    test('should not move a piece outside the board boundaries', () => {
        const from: [number, number] = [0, 1];
        const to: [number, number] = [-1, 1]; // Outside the board
        const success = chessService.movePiece(from, to);
        expect(success).toBe(false);
    });
});