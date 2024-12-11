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
      <div v-if="errorMessage.length" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
           role="alert">
        <strong class="font-bold">{{ errorMessage[0].title }}</strong>
        <br>
        <span class="block sm:inline">{{ errorMessage[0].message }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="removeAlert(0)">
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 20 20"><title>Close</title><path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>
      <div class="flex flex-col w-1/3">
        <button @click="initBoard">Init Board</button>
        <p>Current Turn: {{ currentTurn }}</p>
        <button @click="finish">Finish</button>
        <p>Current Turn: {{ review }}</p>
        <div v-if="isKingInCheckmate">King is in check!</div>
      </div>
    </div>
    <div v-if="isCheck || isKingInCheckmate || isStaleMate" id="popup-modal" tabindex="-1" class="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button v-if="isKingInCheckmate" type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" @click="closeModal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" v-html="textModal"></h3>
          </div>
          <div v-if="isKingInCheckmate" class="flex justify-center p-4 space-x-4 bg-gray-100 dark:bg-gray-800">
            <button @click="backToMenu" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Revenir au menu principale</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, onMounted} from "vue";
import { useRouter } from "vue-router";
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
  API_GAMES_URL,
  PAWN,
} from "@/constants";

import AsideHome from "@/components/home/aside.vue";

const router = useRouter();
const board = ref<(ChessFigure | null)[][] | null>(null);
const draggedPiece = ref<{ row: number; col: number } | null>(null);
const currentTurn = ref<ChessColor>(ChessColor.White);
const highlightedMoves = ref<[number, number][]>([]);
const isKingInCheckmate = ref(false);
const isStaleMate = ref(false);
const isCheck = ref(false);
const review = ref(['']);
const textModal = ref('');
const showPromotionModal = ref(false);
const selectedPromotion = ref('QUEEN');
const promotionPieceId = ref<number | null>(null);
const promotionPosition = ref<[number, number] | null>(null);
const errorMessage = ref<{ title: string, message: string }[]>([]);
const modalTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

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
    review.value = [''];
    highlightedMoves.value = [];
    currentTurn.value = ChessColor.White;
    isKingInCheckmate.value = false;
    const response = await axios.get(API_URL + API_ROOT_URL + API_INIT_BOARD_URL);
    board.value = response.data;
    console.log("Board:", board.value);
  } catch (error) {
    errorMessage.value.push({title: "Error fetching board", message: error});
  }
};

const getPossibleMoves = async (pieceId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}${API_ROOT_URL}${API_POSSIBLES_MOVES_URL.replace(":id", pieceId)}`
    );
    return response.data;
  } catch (error: unknown) {
    errorMessage.value.push({title: "Error move", message: error});
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
    errorMessage.value.push({title: "Error fetching possible moves", message: error});
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
    errorMessage.value.push({title: "Error state game", message: error});
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
      errorMessage.value.push({title: "Piece", message: "Invalid piece position"});
      return;
    }

    try {
      const response = await movePiece(pieceId, toPosition);
      if (response && response.success) {
        review.value.push(pieceId + ':' + toPosition)
        board.value = response.board;
        currentTurn.value = currentTurn.value === ChessColor.White ? ChessColor.Black : ChessColor.White;

        const piece = board.value![row][col];
        if (piece && piece.type === PAWN && (row === 0 || row === 7)) {
          showPromotionModal.value = true;
          promotionPieceId.value = pieceId;
          promotionPosition.value = toPosition;
        }

        const stateResponse = await stateGame();
        if (stateResponse.isInCheck && !stateResponse.movePossible) {
          isKingInCheckmate.value = true;
          showModal("King is in checkmate! <br> Game Over! <br> Winner: " + currentTurn.value);
        } else if (stateResponse.isInCheck && stateResponse.movePossible) {
          isCheck.value = true;
          showModal("King is in check! <br> Move!");
        } else if (!stateResponse.isInCheck && !stateResponse.movePossible) {
          isStaleMate.value = true;
          showModal("Stalemate! <br> Game Over! <br> Draw!");
        } else {
          isKingInCheckmate.value = false;
        }
      }
    } catch (error) {
      errorMessage.value.push({title: "Error moving piece", message: error});
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

const promotePawn = () => {
  // TODO implement promotion
  if (promotionPieceId.value !== null && promotionPosition.value !== null) {
    const [toFile, toRank] = promotionPosition.value;
    const newType = selectedPromotion.value;
    board.value![toFile][toRank] = new ChessFigure(promotionPieceId.value, newType, promotionPosition.value, currentTurn.value);
    showPromotionModal.value = false;
  }
};


const isHighlighted = (row: number, col: number): boolean => {
  return highlightedMoves.value.some((move) => move[0] === row && move[1] === col);
};

const removeAlert = (index: number) => {
  errorMessage.value.splice(index, 1);
};

const showModal = (message: string) => {
  textModal.value = message;
  if (!isKingInCheckmate.value) {
    modalTimeout.value = setTimeout(() => {
      closeModal();
    }, 1500);
  }
};

const closeModal = () => {
  if (modalTimeout.value) {
    clearTimeout(modalTimeout.value);
    modalTimeout.value = null;
  }
  textModal.value = "";
  isStaleMate.value = false;
  isCheck.value = false;
  isKingInCheckmate.value = false;
};

async function finish() {
  try {
    const token = localStorage.getItem("jwt_token");
    await axios.post(`${API_URL}${API_GAMES_URL}`, {
      name: 'test',
      review: JSON.stringify(review.value),
    }, {
      headers: {Authorization: `Bearer ${token}`},
    });
  } catch (error) {
    errorMessage.value.push({title: "Error finishing game", message: error.message || error});
  }
}

async function backToMenu() {
  await router.push({path: '/'});
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

.promotion-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

</style>
