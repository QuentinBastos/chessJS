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

        this.placePiece(new Rook(idCounter++, ROOK, [0, 0], ChessColor.White, false));
        this.placePiece(new Knight(idCounter++, KNIGHT, [1, 0], ChessColor.White, false));
        this.placePiece(new Bishop(idCounter++, BISHOP, [2, 0], ChessColor.White, false));
        this.placePiece(new Queen(idCounter++, QUEEN, [3, 0], ChessColor.White, false));
        this.placePiece(new King(idCounter++, KING, [4, 0], ChessColor.White, false));
        this.placePiece(new Bishop(idCounter++, BISHOP, [5, 0], ChessColor.White, false));
        this.placePiece(new Knight(idCounter++, KNIGHT, [6, 0], ChessColor.White, false));
        this.placePiece(new Rook(idCounter++, ROOK, [7, 0], ChessColor.White, false));

        for (let i = 0; i < 8; i++) {
            this.placePiece(new Pawn(idCounter++, PAWN, [i, 1], ChessColor.White, false));
        }

        this.placePiece(new Rook(idCounter++, ROOK, [0, 7], ChessColor.Black, false));
        this.placePiece(new Knight(idCounter++, KNIGHT, [1, 7], ChessColor.Black, false));
        this.placePiece(new Bishop(idCounter++, BISHOP, [2, 7], ChessColor.Black, false));
        this.placePiece(new Queen(idCounter++, QUEEN, [3, 7], ChessColor.Black, false));
        this.placePiece(new King(idCounter++, KING, [4, 7], ChessColor.Black, false));
        this.placePiece(new Bishop(idCounter++, BISHOP, [5, 7], ChessColor.Black, false));
        this.placePiece(new Knight(idCounter++, KNIGHT, [6, 7], ChessColor.Black, false));
        this.placePiece(new Rook(idCounter++, ROOK, [7, 7], ChessColor.Black, false));

        for (let i = 0; i < 8; i++) {
            this.placePiece(new Pawn(idCounter++, PAWN, [i, 6], ChessColor.Black, false));
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

        if (piece.type === KING) {
            const castlingPositions = this.getCastlingPositions(piece);
            availablePositions.push(...castlingPositions);
            console.log('castlingPositions', castlingPositions);
        }
        console.log('availablePositions', availablePositions);
        return availablePositions;
    }

    private getCastlingPositions(king: ChessFigure): [number, number][] {
        const castlingPositions: [number, number][] = [];

        if (this.canCastle(king, 'king-side')) {
            castlingPositions.push([king.position[0], king.position[1] + 2]);
        }

        if (this.canCastle(king, 'queen-side')) {
            castlingPositions.push([king.position[0], king.position[1] - 2]);
        }

        return castlingPositions;
    }

    private canCastle(king: ChessFigure, side: 'king-side' | 'queen-side'): boolean {

        //TODO change the way that i get the rook
        const [kingRow, kingCol] = king.position;
        const rookCol = side === 'king-side' ? 7 : 0;
        const rook = this.board[kingRow][rookCol];

        console.log('Checking castling for king at', king.position, 'and rook at', [kingRow, rookCol]);
        console.log('Rook found:', rook);

        if (!rook) {
            console.log('No rook found at position', [kingRow, rookCol]);
            return false;
        }
        if (rook.type !== ROOK) {
            console.log('Piece at position is not a rook', rook);
            return false;
        }
        if (rook.hasMoved) {
            console.log('Rook has already moved', rook);
            return false;
        }
        if (king.hasMoved) {
            console.log('King has already moved', king);
            return false;
        }

        const step = side === 'king-side' ? 1 : -1;
        for (let col = kingCol + step; col !== rookCol; col += step) {
            if (this.board[kingRow][col] !== null) {
                return false;
            }
        }

        const positionsToCheck: [number, number][] = [
            [kingRow, kingCol],
            [kingRow, kingCol + step],
            [kingRow, kingCol + 2 * step]
        ];

        console.log('positionsToCheck', positionsToCheck);
        for (const pos of positionsToCheck) {
            console.log('pos', pos);
            if (this.isSquareUnderAttack(pos, king.color)) {
                return false;
            }
        }

        return true;
    }

    private isSquareUnderAttack([row, col]: [number, number], color: ChessColor): boolean {
        for (let r = 0; r < this.board.length; r++) {
            for (let c = 0; c < this.board[r].length; c++) {
                const piece = this.board[r][c];
                if (piece && piece.color !== color && piece.isValidMove([row, col], this.board)) {
                    return true;
                }
            }
        }
        return false;
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

            this.currentTurn = this.currentTurn === ChessColor.White ? ChessColor.Black : ChessColor.White;
            this.review.push(pieceId + ':' + to);

            if (isPromotion) {
                return { success: true, board: this.board, capturedPieces: this.capturedPieces, promotion: true };
            }

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
                newPiece = new Rook(piece.id, ROOK, [file, rank], piece.color, false);
                break;
            case KNIGHT:
                newPiece = new Knight(piece.id, KNIGHT, [file, rank], piece.color, false);
                break;
            case BISHOP:
                newPiece = new Bishop(piece.id, BISHOP, [file, rank], piece.color, false);
                break;
            case QUEEN:
                newPiece = new Queen(piece.id, QUEEN, [file, rank], piece.color, false);
                break;
            default:
                return { success: false, message: 'Invalid piece type' };
        }

        this.board[file][rank] = newPiece;
        return { success: true, board: this.board };
    }
}

export default ChessService;