import {ChessColor, ChessFigure} from "./ChessFigure";

export class Pawn extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    move(toPosition: [number, number]): void {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = targetRank - currentRank;

        if (rankDiff === 1 && fileDiff === 0) {
            this.position = toPosition;
        }
    }
}