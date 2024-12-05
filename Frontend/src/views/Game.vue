<template>
  <div>
    <button @click="initBoard">Init Board</button>
    <p>Current Turn: {{ currentTurn }}</p>
    <div>
      <div v-if="isKingInCheckmate">King is in check!</div>
    </div>
    <div class="chessboard">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="['cell', { 'highlight': isHighlighted(rowIndex, cellIndex) }]"
          @drop="onDrop($event, rowIndex, cellIndex)"
          @dragover="onDragOver($event)"
        >
          <img
            class="piece"
            v-if="cell"
            :src="getImageSrc(cell.type, cell.color)"
            :alt="`Piece ${cell.id}`"
            :draggable="cell.color === currentTurn"
            @dragstart="onDragStart($event, rowIndex, cellIndex)"
            @click="onPieceClick(cell)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, onMounted} from "vue";
import axios from "axios";
import {ChessColor, ChessFigure} from "@/../../Backend/src/interface/ChessFigure";
import {
  API_URL,
  API_BOARD_URL,
  API_POSSIBLES_MOVES_URL,
  API_MOVE_PIECE_URL,
  API_KING_CHECK_URL,
  API_ROOT_URL,
  API_INIT_BOARD_URL,
} from "../../../Shared/constants";

const board = ref<(ChessFigure | null)[][] | null>(null);
const draggedPiece = ref<{ row: number; col: number } | null>(null);
const currentTurn = ref<ChessColor>(ChessColor.White);
const highlightedMoves = ref<[number, number][]>([]);
const isKingInCheckmate = ref(false);

const loadBoard = async () => {
  try {
    const response = await axios.get(API_URL + API_ROOT_URL + API_BOARD_URL);
    board.value = response.data;
    console.log("Board:", board.value);
  } catch (error) {
    console.error("Error fetching board:", error);
  }
};

const initBoard = async () => {
  try {
    highlightedMoves.value = [];
    currentTurn.value = ChessColor.White;
    isKingInCheckmate.value = false;
    const response = await axios.get(API_URL + API_ROOT_URL + API_INIT_BOARD_URL);
    board.value = response.data;
    console.log("Board:", board.value);
  } catch (error) {
    console.error("Error fetching board:", error);
  }
};

const getPossibleMoves = async (pieceId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}${API_ROOT_URL}${API_POSSIBLES_MOVES_URL.replace(":id", pieceId)}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching possible moves:", error);
    return [];
  }
};

const movePiece = async (pieceId: number, toPosition: [number, number]) => {
  try {
    const response = await axios.post(API_URL + API_ROOT_URL + API_MOVE_PIECE_URL, {
      pieceId,
      toPosition,
    });
    return response.data;
  } catch (error) {
    console.error("Error moving piece:", error.response?.data || error.message);
    throw error;
  }
};

const stateGame = async () => {
  try {
    const response = await axios.get(
      `${API_URL}${API_ROOT_URL}${API_KING_CHECK_URL.replace(":color", currentTurn.value)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error checking king:", error);
  }
};

const getImageSrc = (type: number, color: string): string => {
  const pieceColor = color.toLowerCase();
  return `/images/pieces/${pieceColor}_${type}.png`;
};

const onDragStart = async (event: DragEvent, row: number, col: number) => {
  const piece = board.value![row][col];
  if (piece && piece.color === currentTurn.value) {
    draggedPiece.value = {row, col};
    highlightedMoves.value = await getPossibleMoves(piece.id.toString());
  } else {
    event.preventDefault();
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = async (event: DragEvent, row: number, col: number) => {
  event.preventDefault();
  if (draggedPiece.value) {
    const fromRow = draggedPiece.value.row;
    const fromCol = draggedPiece.value.col;
    const pieceId = board.value![fromRow][fromCol]?.id;
    const toPosition: [number, number] = [row, col];

    if (pieceId === undefined) {
      alert("Invalid piece");
      return;
    }

    try {
      const response = await movePiece(pieceId, toPosition);
      if (response && response.success) {
        board.value = response.board;
        currentTurn.value = currentTurn.value === ChessColor.White ? ChessColor.Black : ChessColor.White;
        const stateResponse = await stateGame();
        if (stateResponse.isInCheck && !stateResponse.movePossible) {
          console.log("King is in checkmate!");
          isKingInCheckmate.value = true;
          alert("King is in checkmate!");
        } else {
          isKingInCheckmate.value = false;
        }
      }
    } catch (error) {
      console.error("Error moving piece:", error);
    }
    draggedPiece.value = null;
    highlightedMoves.value = [];
  }
};

const onPieceClick = async (piece: ChessFigure) => {
  if (piece.color === currentTurn.value) {
    highlightedMoves.value = await getPossibleMoves(piece.id.toString());
  }
};

const isHighlighted = (row: number, col: number): boolean => {
  return highlightedMoves.value.some((move) => move[0] === row && move[1] === col);
};

onMounted(loadBoard);
</script>

<style scoped>
.chessboard {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
  transform: rotate(-90deg);
}

.row {
  display: contents;
}

.cell {
  transform: rotate(90deg);
  background: white;
  width: 50px;
  height: 50px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell span {
  color: black;
}

.piece {
  height: 40px;
  width: 40px;
}

.highlight {
  background-color: yellow;
}
</style>
