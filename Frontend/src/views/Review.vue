<template>
  <div>
    <button @click="loadBoard">Load Board</button>
    <p>Current Turn: {{ currentTurn }}</p>
    <div class="chessboard">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="['cell']"
        >
          <img
            class="piece"
            v-if="cell"
            :src="getImageSrc(cell.type, cell.color)"
            :alt="`Piece ${cell.id}`"
          />
        </div>
      </div>
    </div>
    <div class="controls">
      <button @click="previousMove" :disabled="currentMoveIndex <= 0">⟵ Reculer</button>
      <button @click="nextMove" :disabled="currentMoveIndex >= review.length - 1">Avancer ⟶</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ChessColor, ChessFigure} from "@/../../Backend/src/interface/ChessFigure";
import {API_BOARD_URL, API_ROOT_URL, API_URL} from "../constants";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router"

const currentTurn = ref<ChessColor>(ChessColor.White);
const review = ref<string[]>([])
const board = ref<(ChessFigure | null)[][] | null>(null);
const currentMoveIndex = ref(0);

const route = useRoute();
onMounted(async () => {
  const token = localStorage.getItem("jwt_token");
  const gameId = route.params.id;
  const response = await axios.get(`${API_URL}/games/${gameId}`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  review.value = JSON.parse(response.data.review);
  await loadBoard();
});

const loadBoard = async () => {
  try {
    const response = await axios.get(API_URL + API_ROOT_URL + API_BOARD_URL);
    board.value = response.data;
  } catch (error) {
    console.error("Error fetching board:", error);
  }
};

const getImageSrc = (type: number, color: string): string => {
  const pieceColor = color.toLowerCase();
  return `/images/pieces/${pieceColor}_${type}.png`;
};

const movePieceLocal = (pieceId: number, toPosition: [number, number]) => {
  if (!board.value) return;

  let fromRow = -1;
  let fromCol = -1;
  for (let row = 0; row < board.value.length; row++) {
    for (let col = 0; col < board.value[row].length; col++) {
      const piece = board.value[row][col];
      if (piece && piece.id === pieceId) {
        fromRow = row;
        fromCol = col;
        break;
      }
    }
    if (fromRow !== -1) break;
  }

  if (fromRow === -1 || fromCol === -1) {
    console.error(`Piece with ID ${pieceId} not found`);
    return;
  }

  const [toRow, toCol] = toPosition;
  board.value[toRow][toCol] = board.value[fromRow][fromCol];
  board.value[fromRow][fromCol] = null;
};

const nextMove = async () => {
  if (currentMoveIndex.value < review.value.length) {
    const move = review.value[currentMoveIndex.value];
    const [pieceId, toPosition] = parseMove(move);
    await movePieceLocal(pieceId, toPosition);
    currentMoveIndex.value++;
  }
};

const previousMove = async () => {
  if (currentMoveIndex.value > 0) {
    currentMoveIndex.value--;
    await loadBoard();
    for (let i = 0; i < currentMoveIndex.value; i++) {
      const move = review.value[i];
      const [pieceId, toPosition] = parseMove(move);
      await movePieceLocal(pieceId, toPosition);
    }
  }
};

const parseMove = (move: string): [number, [number, number]] => {
  const [pieceIdStr, positionStr] = move.split(":");
  const pieceId = parseInt(pieceIdStr, 10);
  const [row, col] = positionStr.split(",").map(Number);
  return [pieceId, [row, col]];
};
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
</style>
