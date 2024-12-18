import {ChessColor, ChessFigure} from "./ChessFigure";

export class Knight extends ChessFigure {
    constructor(id: number, type: number, position: [number, number], color: ChessColor, hasMoved: boolean) {
        super(id, type, position, color, hasMoved);
    }

    isValidMove(to: [number, number], board: (ChessFigure | null)[][]): boolean {
        const [targetFile, targetRank] = to;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        if ((fileDiff === 1 && rankDiff === 2) || (fileDiff === 2 && rankDiff === 1)) {
            const targetPiece = board[targetFile][targetRank];
            if (targetPiece === null || targetPiece.color !== this.color) {
                return true;
            }
        }
        return false;
    }
}