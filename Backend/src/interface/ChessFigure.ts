export enum ChessColor {
    White = "white",
    Black = "black",
}
export abstract class ChessFigure {
    position: [number, number];
    color: ChessColor;

    protected constructor(position: [number, number], color: ChessColor) {
        this.position = position;
        this.color = color;
    }

    move(toPosition: [number, number], board: (ChessFigure | null)[][]): void {
        this.position = toPosition;
    }

    abstract isValidMove(to: [number, number], board: (ChessFigure | null)[][]): boolean;
}