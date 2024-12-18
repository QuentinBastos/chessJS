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
    hasMoved: boolean = false;

    protected constructor(id: number, type: number,  position: [number, number], color: ChessColor, hasMoved: boolean) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.color = color;
        this.hasMoved = hasMoved;
    }

    move(toPosition: [number, number], board: (ChessFigure|null)[][]): void {
        if (this.isValidMove(toPosition, board) && this.isKingSafeAfterMove(toPosition, board)) {
            this.position = toPosition;
            this.hasMoved = true;
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

    public isKingInCheck(color: ChessColor, board: (ChessFigure | null)[][]): boolean {
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