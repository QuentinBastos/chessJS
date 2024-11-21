import {KING} from "../constants";

export enum ChessColor {
    White = "white",
    Black = "black",
}

export abstract class ChessFigure {
    id: number;
    type: number;
    position: [number, number];
    color: ChessColor;

    protected constructor(id: number, type: number,  position: [number, number], color: ChessColor) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.color = color;
    }

    move(toPosition: [number, number], board: (ChessFigure|null)[][]): void {
        if (this.isValidMove(toPosition, board) && this.isKingSafeAfterMove(toPosition, board)) {
            this.position = toPosition;
        } else {
            throw new Error("Invalid move");
        }
    }

    isKingSafeAfterMove(toPosition: [number, number], board: (ChessFigure | null)[][]): boolean {
        const originalPosition = this.position;
        const targetPiece = board[toPosition[0]][toPosition[1]];

        board[originalPosition[0]][originalPosition[1]] = null;
        board[toPosition[0]][toPosition[1]] = this;
        this.position = toPosition;


        const kingSafe = !this.isKingInCheck(this.color, board);

        this.position = originalPosition;
        board[toPosition[0]][toPosition[1]] = targetPiece;
        board[originalPosition[0]][originalPosition[1]] = this;

        return kingSafe;
    }

    protected isKingInCheck(color: ChessColor, board: (ChessFigure | null)[][]): boolean {
        // Find the king's position
        let kingPosition: [number, number] | null = null;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const piece = board[i][j];
                if (piece && piece.type === KING && piece.color === color) {
                    kingPosition = [i, j];
                    break;
                }
            }
            if (kingPosition) break;
        }

        if (!kingPosition) {
            throw new Error(`King of color ${color} not found on the board`);
        }

        // Check for threats from opponent pieces
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const piece = board[i][j];
                if (piece && piece.color !== color && piece.isValidMove(kingPosition, board)) {
                    return true;
                }
            }
        }
        return false;
    }



    abstract isValidMove(toPosition: [number, number], board: (ChessFigure|null)[][]): boolean;
}