import {ChessColor, ChessFigure} from "./ChessFigure";

export class King extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    move(toPosition: [number, number]): void {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        if (fileDiff <= 1 && rankDiff <= 1) {
            this.position = toPosition;
            console.log('King moved to', toPosition);
        } else {
            console.log('Invalid move for the king');
        }
    }
}