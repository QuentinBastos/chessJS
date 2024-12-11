import {Bishop, ChessColor, ChessFigure, King, Knight, Pawn, Queen, Rook} from '../interface';
import {BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK} from '../constants';

class ChessService {
    private readonly board: (ChessFigure | null)[][];
    private capturedPieces: ChessFigure[];
    private review: string[] = [];
    private currentTurn: ChessColor;
    private isGameStarted: boolean;

    constructor() {
        this.board = this.createEmptyBoard();
        this.initializeStandardChess();
        this.capturedPieces = [];
        this.review = [];
        this.currentTurn = ChessColor.White;
        this.isGameStarted = false;
    }

    private createEmptyBoard(): (ChessFigure | null)[][] {
        const board: (ChessFigure | null)[][] = [];
        for (let i = 0; i < 8; i++) {
            board[i] = new Array(8).fill(null);
        }
        return board;
    }

    initializeStandardChess(): void {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.board[i][j] = null;
            }
        }

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

    public getCapturedPieces(): ChessFigure[] {
        return this.capturedPieces;
    }

    public setCapturedPieces(capturedPieces: ChessFigure[]): void {
        this.capturedPieces = capturedPieces;
    }

    public getReview(): string[] {
        return this.review;
    }

    public setReview(review: string[]): void {
        this.review = review;
    }

    public getCurrentTurn(): ChessColor {
        return this.currentTurn;
    }

    public setCurrentTurn(currentTurn: ChessColor): void {
        this.currentTurn = currentTurn;
    }

    public getIsGameStarted(): boolean {
        return this.isGameStarted;
    }

    public setIsGameStarted(isGameStarted: boolean): void {
        this.isGameStarted = isGameStarted;
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
        board?: (ChessFigure | null)[][],
        capturedPieces?: ChessFigure[],
        promotion?: boolean,
    } {
        const piece = this.getPieceById(pieceId);
        if (!piece) {
            return { success: false, message: 'Piece not found' };
        }

        const [toFile, toRank] = to;
        const [fromFile, fromRank] = piece.position;
        const isPromotion = piece.type === PAWN && ((piece.color === ChessColor.White && toRank === 7) || (piece.color === ChessColor.Black && toRank === 0));

        if (!piece.isValidMove(to, this.board) || !piece.isKingSafeAfterMove(to, this.board)) {
            return { success: false, message: 'Invalid move' };
        }

        try {
            this.capturePieceIfAny(to);
            piece.move(to, this.board);
            this.board[toFile][toRank] = piece;
            this.board[fromFile][fromRank] = null;

            if (isPromotion) {
                return { success: true, board: this.board, capturedPieces: this.capturedPieces, promotion: true };
            }

            this.currentTurn = this.currentTurn === ChessColor.White ? ChessColor.Black : ChessColor.White;
            this.review.push(pieceId + ':' + to);

            return { success: true, board: this.board, capturedPieces: this.capturedPieces };
        } catch (error) {
            console.error('Error moving piece:', error);
            return { success: false, message: 'Internal Server Error' };
        }
    }

    public capturePieceIfAny(toPosition: [number, number]): ChessFigure | null {
        const [toFile, toRank] = toPosition;
        const targetPiece = this.board[toFile][toRank];
        if (targetPiece) {
            this.capturedPieces.push(targetPiece);
        }
        return targetPiece;
    }

    public stateGame(color: ChessColor, board: (ChessFigure | null)[][]): [boolean, boolean] {
        let king: King | null = null;

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const piece = board[row][col];
                if (piece && piece.type === KING && piece.color === color) {
                    king = piece as King;
                    break;
                }
            }
            if (king) break;
        }

        if (!king) {
            throw new Error(`King of color ${color} not found`);
        }

        const isInCheck = king.isKingInCheck(color, board);

        let movePossible = false;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const piece = board[row][col];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < board.length; toRow++) {
                        for (let toCol = 0; toCol < board[toRow].length; toCol++) {
                            const toPosition: [number, number] = [toRow, toCol];
                            if (piece.isValidMove(toPosition, board) && piece.isKingSafeAfterMove(toPosition, board)) {
                                movePossible = true;
                                break;
                            }
                        }
                        if (movePossible) break;
                    }
                }
                if (movePossible) break;
            }
            if (movePossible) break;
        }
        return [isInCheck, movePossible];
    }

    public promotion(pieceId: number, type: number): { success: boolean, message?: string, board?: any } {
        const piece = this.getPieceById(pieceId);

        if (!piece) {
            return { success: false, message: 'Piece not found' };
        }

        let newPiece: ChessFigure;
        const [file, rank] = piece.position;

        switch (type) {
            case ROOK:
                newPiece = new Rook(piece.id, ROOK, [file, rank], piece.color);
                break;
            case KNIGHT:
                newPiece = new Knight(piece.id, KNIGHT, [file, rank], piece.color);
                break;
            case BISHOP:
                newPiece = new Bishop(piece.id, BISHOP, [file, rank], piece.color);
                break;
            case QUEEN:
                newPiece = new Queen(piece.id, QUEEN, [file, rank], piece.color);
                break;
            default:
                return { success: false, message: 'Invalid piece type' };
        }

        this.board[file][rank] = newPiece;
        return { success: true, board: this.board };
    }
}

export default ChessService;