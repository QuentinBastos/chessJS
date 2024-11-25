import {ChessFigure, Rook, Knight, Bishop, Queen, King, Pawn, ChessColor} from '../interface';
import {ROOK, KNIGHT, BISHOP, QUEEN, KING, PAWN} from '../constants';

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

    initializeStandardChess(): void {
        let idCounter = 1;

        this.placePiece(new Rook(idCounter++, ROOK, [0, 0], ChessColor.White));
        this.placePiece(new Knight(idCounter++, KNIGHT, [1, 0], ChessColor.White));
        this.placePiece(new Bishop(idCounter++, BISHOP, [2, 0], ChessColor.White));
        this.placePiece(new Queen(idCounter++, QUEEN, [3, 0], ChessColor.White));
        this.placePiece(new King(idCounter++, KING, [4, 0], ChessColor.White));
        this.placePiece(new Bishop(idCounter++, BISHOP, [5, 0], ChessColor.White));
        this.placePiece(new Knight(idCounter++, KNIGHT, [6, 0], ChessColor.White));
        this.placePiece(new Rook(idCounter++, ROOK, [7, 0], ChessColor.White));

        for (let i = 0; i < 8; i++) {
            this.placePiece(new Pawn(idCounter++, PAWN, [i, 1], ChessColor.White));
        }

        this.placePiece(new Rook(idCounter++, ROOK, [0, 7], ChessColor.Black));
        this.placePiece(new Knight(idCounter++, KNIGHT, [1, 7], ChessColor.Black));
        this.placePiece(new Bishop(idCounter++, BISHOP, [2, 7], ChessColor.Black));
        this.placePiece(new Queen(idCounter++, QUEEN, [3, 7], ChessColor.Black));
        this.placePiece(new King(idCounter++, KING, [4, 7], ChessColor.Black));
        this.placePiece(new Bishop(idCounter++, BISHOP, [5, 7], ChessColor.Black));
        this.placePiece(new Knight(idCounter++, KNIGHT, [6, 7], ChessColor.Black));
        this.placePiece(new Rook(idCounter++, ROOK, [7, 7], ChessColor.Black));

        for (let i = 0; i < 8; i++) {
            this.placePiece(new Pawn(idCounter++, PAWN, [i, 6], ChessColor.Black));
        }
    }

    private placePiece(piece: ChessFigure): void {
        const [file, rank] = piece.position;
        this.board[file][rank] = piece;
    }

    public getBoard(): (ChessFigure | null)[][] {
        return this.board;
    }

    public getPieceById(id: number): ChessFigure | null {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const piece = this.board[row][col];
                if (piece && piece.id === id) {
                    return piece;
                }
            }
        }
        return null;
    }

    public checkMove(piece: ChessFigure): [number, number][] {
        const availablePositions: [number, number][] = [];

        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                const toPosition: [number, number] = [row, col];
                if (piece.isValidMove(toPosition, this.board) && piece.isKingSafeAfterMove(toPosition, this.board)) {
                    availablePositions.push(toPosition);
                }
            }
        }

        return availablePositions;
    }

    public movePiece(pieceId: number, to: [number, number]): {
        success: boolean,
        message?: string,
        board?: (ChessFigure | null)[][]
    } {
        const piece = this.getPieceById(pieceId);
        if (!piece) {
            return {success: false, message: 'Piece not found'};
        }

        const [toFile, toRank] = to;
        const [fromFile, fromRank] = piece.position;

        if (!piece.isValidMove(to, this.board) || !piece.isKingSafeAfterMove(to, this.board)) {
            return {success: false, message: 'Invalid move'};
        }

        try {
            piece.move(to, this.board);
            this.board[toFile][toRank] = piece;
            this.board[fromFile][fromRank] = null;
            return {success: true, board: this.board};
        } catch (error) {
            console.error('Error moving piece:', error);
            return {success: false, message: 'Internal Server Error'};
        }
    }

    public isKingInCheck(color: string, board: (ChessFigure | null)[][]): boolean {
        // TODO IMPLEMENT BY USING METHOD isKingInCheck in -> chessFigure

        return false;
    }
}

export default ChessService;