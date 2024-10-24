import {ChessColor, ChessFigure} from "./ChessFigure";

export class Queen extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    move(toPosition: [number, number]): void {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        if (
            targetFile === currentFile || // Move vertically
            targetRank === currentRank || // Move horizontally
            fileDiff === rankDiff // Move diagonally
        ) {
            // Valid move for the queen
            this.position = toPosition;
            console.log('Queen moved to', toPosition);
        } else {
            console.log('Invalid move for the queen');
        }
    }
}