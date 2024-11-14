import { ChessFigure, Rook, Knight, Bishop, Queen, King, Pawn, ChessColor } from '../interface';

class ChessService {
    private readonly board: (ChessFigure | null)[][];

    constructor() {
        this.board = this.createEmptyBoard();
        this.initializeStandardChess();
    }

    private createEmptyBoard(): (ChessFigure | null)[][] {
        const board: (ChessFigure | null)[][] = [];
        for (let i = 0; i < 8; i++) {
            board[i] = new Array(8).fill(null);
        }
        return board;
    }

    private initializeStandardChess(): void {
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

    public getBoard(): (ChessFigure | null)[][] {
        return this.board;
    }

    public movePiece(from: [number, number], to: [number, number]): boolean {
        if (!this.isValidPosition(to)) {
            return false;
        }

        const piece = this.board[from[0]][from[1]];
        if (piece) {
            this.board[to[0]][to[1]] = piece;
            this.board[from[0]][from[1]] = null;
            piece.move(to);
            return true;
        }
        return false;
    }

    public deletePiece(position: [number, number]): boolean {
        if (!this.isValidPosition(position)) {
            return false;
        }

        const [file, rank] = position;
        if (this.board[file][rank] !== null) {
            this.board[file][rank] = null;
            return true;
        }
        return false;
    }

    private isValidPosition(position: [number, number]): boolean {
        const [file, rank] = position;
        return file >= 0 && file < 8 && rank >= 0 && rank < 8;
    }
}

export default ChessService;