import { ChessColor, ChessFigure } from "./ChessFigure";

export class King extends ChessFigure {
    constructor(id: number, type: number, position: [number, number], color: ChessColor, hasMoved: boolean) {
        super(id, type, position, color, hasMoved);
    }

    isValidMove(to: [number, number], board: (ChessFigure | null)[][]): boolean {
        const [targetFile, targetRank] = to;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

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