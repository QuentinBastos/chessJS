<template>
  <div class="flex h-screen ">
    <AsideHome/>
    <div class="h-screen bg-neutral-800 w-full flex items-center justify-center  px-4">
      <div class="flex flex-col items-center justify-center gap-6 w-3/4">
        <div class="chessboard h-[80vh] items-center">
          <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
            <div
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              :class="[ 'cell', (rowIndex + cellIndex) % 2 === 0 ? 'bg-[#54769a] ' : 'bg-blue-50']"
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
        <div class="flex w-full justify-center">
          <div class="w-2/3 flex justify-around">
            <button @click="previousMove" :disabled="currentMoveIndex <= 0" class="flex bg-black text-white py-2 px-4 rounded font-bold">⟵ Reculer</button>
            <button @click="nextMove" :disabled="currentMoveIndex >= review.length" class="flex bg-white py-2 px-4 rounded font-bold">Avancer ⟶</button>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-1/4 bg-white gap-4 rounded items-center px-4 pt-2">
        <h2 class="text-neutral-800 font-bold text-3xl">Remacth</h2>
        <div class="bg-neutral-700 rounded mb-4 w-full h-[20vh]">
          <ul class="grid grid-cols-2 lg:grid-cols-3 text-white h-auto">
            <li class="flex gap-2 w-fit" v-for="reviewrange in currentMoveIndex" >
              <p> {{ currentMoveIndex.value }}</p>
              <p v-if="currentMoveIndex <= 1 "> </p>
              <p v-else> ⟶ </p>
              <p>{{ review[reviewrange - 1] }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ChessColor, ChessFigure} from "@/../../Backend/src/interface/ChessFigure";
import { API_GAMES_URL, API_INIT_BOARD_URL, API_ROOT_URL, API_URL} from "@/constants";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router"
import AsideHome from "@/components/home/aside.vue";

const currentTurn = ref<ChessColor>(ChessColor.White);
const review = ref<string[]>([])
const board = ref<(ChessFigure | null)[][] | null>(null);
const currentMoveIndex = ref(0);

const route = useRoute();
onMounted(async () => {
  const token = localStorage.getItem("jwt_token");
  const gameId = route.params.id;
  const response = await axios.get(`${API_URL}${API_GAMES_URL}/${gameId}`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  review.value = JSON.parse(response.data.review);
  await loadBoard();
});

const loadBoard = async () => {
  try {
    const response = await axios.get(API_URL + API_ROOT_URL + API_INIT_BOARD_URL);
    board.value = response.data.board;
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
  grid-template-rows: repeat(8, 1fr);
  grid-template-columns: repeat(8, 1fr);
  transform: rotate(-90deg);
  outline: 0.25em solid white;;
  border: 0.15em solid black;
  aspect-ratio: 1;
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
}


.piece {
  padding: 12.5%;
  height: 100%;
  width: 100%;
}
</style>
