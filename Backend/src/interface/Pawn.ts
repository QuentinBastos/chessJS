// Pawn.ts
import { ChessColor, ChessFigure } from "./ChessFigure";

export class Pawn extends ChessFigure {
    constructor(id: number, position: [number, number], color: ChessColor) {
        super(id, position, color);
    }

    isValidMove(to: [number, number], board: (ChessFigure | null)[][]): boolean {
        const [targetFile, targetRank] = to;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = targetRank - currentRank;

        // Pawn moves one square forward
        if (rankDiff === 1 && fileDiff === 0) {
            const targetPiece = board[targetFile][targetRank];
            // Check if the target position is empty
            if (targetPiece === null) {
                return true;
            }
        }

        // Pawn captures diagonally
        if (rankDiff === 1 && fileDiff === 1) {
            const targetPiece = board[targetFile][targetRank];
            // Check if the target position is occupied by an opponent's piece
            if (targetPiece !== null && targetPiece.color !== this.color) {
                return true;
            }
        }

        return false;
    }
}