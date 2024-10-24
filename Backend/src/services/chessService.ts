import { ChessFigure, Rook, Knight, Bishop, Queen, King, Pawn, ChessColor } from '../interface';

class ChessService {
    private readonly board: ChessFigure[][];

    constructor() {
        this.board = this.createEmptyBoard();
        this.initializeStandardChess();
    }

    private createEmptyBoard(): ChessFigure[][] {
        const board: ChessFigure[][] = [];
        for (let i = 0; i < 8; i++) {
            board[i] = new Array(8).fill(null);
        }
        return board;
    }

    private initializeStandardChess(): void {
        // Place the chess pieces in their standard positions
        this.placePiece(new Rook([0, 0], ChessColor.White));
        this.placePiece(new Knight([1, 0], ChessColor.White));
        this.placePiece(new Bishop([2, 0], ChessColor.White));
        this.placePiece(new Queen([3, 0], ChessColor.White));
        this.placePiece(new King([4, 0], ChessColor.White));
        this.placePiece(new Bishop([5, 0], ChessColor.White));
        this.placePiece(new Knight([6, 0], ChessColor.White));
        this.placePiece(new Rook([7, 0], ChessColor.White));

        for (let i = 0; i < 8; i++) {
            this.placePiece(new Pawn([i, 1], ChessColor.White));
        }

        this.placePiece(new Rook([0, 7], ChessColor.Black));
        this.placePiece(new Knight([1, 7], ChessColor.Black));
        this.placePiece(new Bishop([2, 7], ChessColor.Black));
        this.placePiece(new Queen([3, 7], ChessColor.Black));
        this.placePiece(new King([4, 7], ChessColor.Black));
        this.placePiece(new Bishop([5, 7], ChessColor.Black));
        this.placePiece(new Knight([6, 7], ChessColor.Black));
        this.placePiece(new Rook([7, 7], ChessColor.Black));

        for (let i = 0; i < 8; i++) {
            this.placePiece(new Pawn([i, 6], ChessColor.Black));
        }
    }

    private placePiece(piece: ChessFigure): void {
        const [file, rank] = piece.position;
        this.board[file][rank] = piece;
    }

    public getBoard(): ChessFigure[][] {
        return this.board;
    }

    public movePiece(from: [number, number], to: [number, number]): boolean {
        // Implement the logic to move a piece
        return true;
    }
}

export default ChessService;