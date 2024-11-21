// Pawn.ts
import {ChessColor, ChessFigure} from "./ChessFigure";

export class Pawn extends ChessFigure {
    constructor(id: number, type: number, position: [number, number], color: ChessColor) {
        super(id, type, position, color);
    }

    isValidMove(to: [number, number], board: (ChessFigure | null)[][]): boolean {
        const [targetFile, targetRank] = to;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = targetRank - currentRank;

        const direction = this.color === ChessColor.White ? 1 : -1;

        if (rankDiff === direction && fileDiff === 0) {
            const targetPiece = board[targetFile][targetRank];
            if (targetPiece === null) {
                return true;
            }
        }
        else if (rankDiff === 2 * direction && fileDiff === 0 && currentRank === (this.color === ChessColor.White ? 1 : 6)) {
            const targetPiece = board[targetFile][targetRank];
            if (targetPiece === null && board[currentFile][currentRank + direction] === null) {
                return true;
            }
        }
        else if (rankDiff === direction && fileDiff === 1) {
            const targetPiece = board[targetFile][targetRank];
            if (targetPiece !== null && targetPiece.color !== this.color) {
                return true;
            }
        }
        return false;
    }
}