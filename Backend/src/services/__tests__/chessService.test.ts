import ChessService from '../chessService';
import { ChessColor, Pawn } from '../../interface';
import {PAWN} from "../../constants";

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

    test('should check if a move is valid', () => {
        const piece = chessService.getBoard()[0][1]; // White pawn
        const to: [number, number] = [0, 2];
        const isValid = chessService.checkMove(piece!, to);
        expect(isValid).toBe(true);
    });

    test('should check if a move is invalid', () => {
        const piece = chessService.getBoard()[0][1]; // White pawn
        const to: [number, number] = [0, 3]; // Invalid move for a pawn
        const isValid = chessService.checkMove(piece!, to);
        expect(isValid).toBe(false);
    });

    test('should check if a piece can be deleted', () => {
        const piece = chessService.getBoard()[0][1]; // White pawn
        const position: [number, number] = [0, 1];
        const canDelete = chessService.checkDelete(piece!, position);
        expect(canDelete).toBe(true);
    });

    test('should check if a piece cannot be deleted', () => {
        const piece = new Pawn(PAWN, [0, 2], ChessColor.White); // New pawn not on the board
        const position: [number, number] = [0, 1];
        const canDelete = chessService.checkDelete(piece, position);
        expect(canDelete).toBe(false);
    });
});