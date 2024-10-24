import {ChessColor, ChessFigure} from "./ChessFigure";

export class Knight extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    move(toPosition: [number, number]): void {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        if ((fileDiff === 1 && rankDiff === 2) || (fileDiff === 2 && rankDiff === 1)) {
            this.position = toPosition;
            console.log('Knight moved to', toPosition);
        } else {
            console.log('Invalid move for the knight');
        }
    }
}