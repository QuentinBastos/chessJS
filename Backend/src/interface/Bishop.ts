import {ChessColor, ChessFigure} from "./ChessFigure";

export class Bishop extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    move(toPosition: [number, number]): void {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        if (fileDiff === rankDiff) {
            this.position = toPosition;
            console.log('Bishop moved to', toPosition);
        } else {
            console.log('Invalid move for the bishop');
        }
    }
}