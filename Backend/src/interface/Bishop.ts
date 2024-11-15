import { ChessColor, ChessFigure } from "./ChessFigure";

export class Bishop extends ChessFigure {
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
        const fileDiff = Math.abs(toFile - fromFile);
        const rankDiff = Math.abs(toRank - fromRank);

        // Bishop moves diagonally
        if (fileDiff !== rankDiff) {
            return false;
        }

        // Check if the path is clear
        const fileStep = toFile > fromFile ? 1 : -1;
        const rankStep = toRank > fromRank ? 1 : -1;
        for (let i = 1; i < fileDiff; i++) {
            if (board[fromFile + i * fileStep][fromRank + i * rankStep] !== null) {
                return false;
            }
        }

        return true;
    }
}