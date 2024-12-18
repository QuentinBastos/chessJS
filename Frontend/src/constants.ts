export enum ChessColor {
    White = "white",
    Black = "black",
}
export const ROOK = 1;
export const KNIGHT = 2;
export const BISHOP = 3;
export const QUEEN = 4;
export const PAWN = 6;
export const API_URL = "http://localhost:8000";
export const API_ROOT_URL = "/api";
export const API_BOARD_URL = "/board";
export const API_INIT_BOARD_URL = "/init-board";
export const API_POSSIBLES_MOVES_URL = "/possible-moves/:id";
export const API_MOVE_PIECE_URL = "/move-pieces";
export const API_KING_CHECK_URL = "/is-king-in-check/:color";
export const API_GAMES_URL = "/games";
export const API_END_GAME_URL = "/end-game";
export const API_PROMOTION_URL = "/promotion";
export const API_CASTLE_URL = "/can-castle";
