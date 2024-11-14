import {ChessColor, ChessFigure} from "./ChessFigure";

export class Rook extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    move(toPosition: [number, number]): void {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;

        if (
            targetFile === currentFile ||
            targetRank === currentRank
        ) {
            this.position = toPosition;
        }
    }
}