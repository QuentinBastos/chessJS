<template>
  <div class="flex w-full h-screen overflow-hidden">
    <AsideHome/>
    <div class="w-full bg-neutral-800 flex items-center justify-center h-screen">
      <div class="flex w-1/2 h-fit">
        <div class="chessboard w-full">
          <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
            <div
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              :class="[ 'cell',
            (rowIndex + cellIndex) % 2 === 0 ? 'bg-sky-900' : 'bg-blue-50'
          ]"
              @drop="onDrop($event, rowIndex, cellIndex)"
              @dragover="onDragOver($event)"
            >
              <div class="highlight-overlay" v-if="isHighlighted(rowIndex, cellIndex)"></div>
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
      <div class="flex flex-col w-1/3">
        <button @click="initBoard">Init Board</button>
        <p>Current Turn: {{ currentTurn }}</p>
        <button @click="finish">Finish</button>
        <p>Current Turn: {{ review }}</p>
        <div v-if="isKingInCheckmate">King is in check!</div>
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
import AsideHome from "@/components/home/aside.vue";

const board = ref<(ChessFigure | null)[][] | null>(null);
const draggedPiece = ref<{ row: number; col: number } | null>(null);
const currentTurn = ref<ChessColor>(ChessColor.White);
const highlightedMoves = ref<[number, number][]>([]);
const isKingInCheckmate = ref(false);
const review = ref(['']);

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
        review.value.push(pieceId + ':' + toPosition)
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

async function finish() {
  const token = localStorage.getItem("jwt_token");
  await axios.post(`${API_URL}/games`, {
    name: 'test',
    review: JSON.stringify(review.value),
  }, {
    headers: {Authorization: `Bearer ${token}`},
  });
}

onMounted(loadBoard);
</script>


<style scoped>
.chessboard {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(8, 12.5%);
  grid-template-rows: repeat(8, 12.5%);
  transform: rotate(-90deg);
  border: 0.5em solid black;
  border-radius: 1%;
}

.row {
  display: contents;
}

.cell {
  position: relative;
  transform: rotate(90deg);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.75;
  }
}


.piece {
  padding: 12.5%;
  height: 100%;
  width: 100%;
}

.highlight-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff374;
  border-radius: 50%;
  pointer-events: none;
  scale: 0.5;
  filter: blur(6px);
}
</style>
