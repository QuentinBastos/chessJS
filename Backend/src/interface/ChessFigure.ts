export enum ChessColor {
    White = "white",
    Black = "black",
}

export class ChessFigure {
    position: [number, number];
    color: ChessColor;

    constructor(position: [number, number], color: ChessColor) {
        this.position = position;
        this.color = color;
    }

    move(toPosition: [number, number]): void {
        this.position = toPosition;
    }
}