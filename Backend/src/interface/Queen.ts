import { ChessColor, ChessFigure } from "./ChessFigure";

export class Queen extends ChessFigure {
    constructor(id: number, type: number, position: [number, number], color: ChessColor) {
        super(id, type, position, color);
    }

    move(toPosition: [number, number], board: ChessFigure[][]): void {
        if (this.isValidMove(toPosition, board)) {
            this.position = toPosition;
        }
    }

    isValidMove(to: [number, number], board: ChessFigure[][]): boolean {
        const [targetFile, targetRank] = to;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        // Queen moves vertically, horizontally, or diagonally
        if (
            targetFile === currentFile || // Move vertically
            targetRank === currentRank || // Move horizontally
            fileDiff === rankDiff // Move diagonally
        ) {
            // Check for obstacles in the path
            const stepFile = targetFile === currentFile ? 0 : (targetFile - currentFile) / fileDiff;
            const stepRank = targetRank === currentRank ? 0 : (targetRank - currentRank) / rankDiff;

            let file = currentFile + stepFile;
            let rank = currentRank + stepRank;

            while (file !== targetFile || rank !== targetRank) {
                if (board[file][rank] !== null) {
                    return false; // There is an obstacle in the path
                }
                file += stepFile;
                rank += stepRank;
            }

            const targetPiece = board[targetFile][targetRank];
            // Check if the target position is occupied by a piece of the same color
            if (targetPiece === null || targetPiece.color !== this.color) {
                return true;
            }
        }
        return false;
    }
}