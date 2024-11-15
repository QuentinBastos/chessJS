import { ChessColor, ChessFigure } from "./ChessFigure";

export class King extends ChessFigure {
    constructor(id: number, position: [number, number], color: ChessColor) {
        super(id, position, color);
    }

    move(toPosition: [number, number], board: (ChessFigure | null)[][]): void {
        if (this.isValidMove(toPosition, board)) {
            this.position = toPosition;
        }
    }

    isValidMove(to: [number, number], board: (ChessFigure | null)[][]): boolean {
        const [targetFile, targetRank] = to;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        // King moves one square in any direction
        if (fileDiff <= 1 && rankDiff <= 1) {
            const targetPiece = board[targetFile][targetRank];
            // Check if the target position is occupied by a piece of the same color
            if (targetPiece === null || targetPiece.color !== this.color) {
                return true;
            }
        }

        return false;
    }
}