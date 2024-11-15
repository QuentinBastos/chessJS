import ChessService from '../chessService';
import {ChessColor, Pawn} from '../../interface';
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
});