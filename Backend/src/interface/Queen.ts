import { ChessColor, ChessFigure } from "./ChessFigure";

export class Queen extends ChessFigure {
    constructor(id: number, type: number, position: [number, number], color: ChessColor) {
        super(id, type, position, color);
    }

    isValidMove(to: [number, number], board: (ChessFigure | null)[][]): boolean {
        const [targetFile, targetRank] = to;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        if (
            targetFile === currentFile || // Move vertically
            targetRank === currentRank || // Move horizontally
            fileDiff === rankDiff // Move diagonally
        ) {
            const stepFile = targetFile === currentFile ? 0 : (targetFile - currentFile) / fileDiff;
            const stepRank = targetRank === currentRank ? 0 : (targetRank - currentRank) / rankDiff;

            let file = currentFile + stepFile;
            let rank = currentRank + stepRank;

            while (file !== targetFile || rank !== targetRank) {
                if (board[file][rank] !== null) {
                    return false;
                }
                file += stepFile;
                rank += stepRank;
            }

            const targetPiece = board[targetFile][targetRank];
            if (targetPiece === null || targetPiece.color !== this.color) {
                return true;
            }
        }
        return false;
    }
}