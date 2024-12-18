import { ChessColor } from '../constants';

export abstract class ChessFigure {
  id: number;
  type: number;
  position: [number, number];
  color: ChessColor;

  protected constructor(id: number, type: number, position: [number, number], color: ChessColor) {
    this.id = id;
    this.type = type;
    this.position = position;
    this.color = color;
  }

  abstract isValidMove(toPosition: [number, number], board: (ChessFigure | null)[][]): boolean;
}
