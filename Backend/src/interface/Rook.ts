import {ChessColor, ChessFigure} from "./ChessFigure";

export class Rook extends ChessFigure {
    constructor(id: number, type: number, position: [number, number], color: ChessColor) {
        super(id, type, position, color);
    }

    move(toPosition: [number, number], board: ChessFigure[][]): void {
        if (this.isValidMove(toPosition, board)) {
            this.position = toPosition;
        }
    }

    isValidMove(to: [number, number], board: ChessFigure[][]): boolean {
        const [fromFile, fromRank] = this.position;
        const [toFile, toRank] = to;

        // Rook can move horizontally or vertically
        if (fromFile !== toFile && fromRank !== toRank) {
            return false;
        }

        // Check if the path is clear
        if (fromFile === toFile) {
            const step = fromRank < toRank ? 1 : -1;
            for (let rank = fromRank + step; rank !== toRank; rank += step) {
                if (board[fromFile][rank] !== null) {
                    return false;
                }
            }
        } else {
            const step = fromFile < toFile ? 1 : -1;
            for (let file = fromFile + step; file !== toFile; file += step) {
                if (board[file][fromRank] !== null) {
                    return false;
                }
            }
        }

        return true;
    }
}