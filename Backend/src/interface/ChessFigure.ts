export enum ChessColor {
    White = "white",
    Black = "black",
}

export abstract class ChessFigure {
    id: number;
    type: number;
    position: [number, number];
    color: ChessColor;

    protected constructor(id: number, type: number,  position: [number, number], color: ChessColor) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.color = color;
    }

    move(toPosition: [number, number], board: (ChessFigure | null)[][]): void {
        this.position = toPosition;
    }

    abstract isValidMove(toPosition: [number, number], board: (ChessFigure|null)[][]): boolean;
}