<template>
  <div class="flex w-full h-screen overflow-hidden">
    <AsideHome/>
    <div class="w-full bg-neutral-800 flex items-center justify-around h-full sm:gap-2 gap-8 px-8">
      <div class="flex flex-col w-full h-full justify-between">
        <div class="flex text-white font-bold flex gap-4 my-2 h-[10vh]">
          <img src="/images/player/car.png" width="48" height="48" alt="iconProfile"/>
          <div class="flex flex-col gap-1">
            <div>
              <span>Modzi</span>
              <span>(450)</span>
            </div>
            <div class="flex">
              <img v-for="(piece, index) in capturedWhitePieces" :key="index" :src="getImageSrc(piece.type, piece.color)" :alt="`Captured White Piece ${index}`" width="24px"
                   height="24px"/>
            </div>
          </div>
        </div>
        <div class="flex justify-center h-[80vh]">
          <div class="chessboard h-full">
            <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
              <div
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                :class="[ 'cell', (rowIndex + cellIndex) % 2 === 0 ? 'bg-[#54769a] ' : 'bg-blue-50']"
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
        <div class="text-white font-bold flex gap-4 my-2 h-[10vh]">
          <img src="/images/player/car.png" width="48" height="48" alt="iconProfile"/>
          <div class="flex flex-col gap-1">
            <div>
              <span>Modzi</span>
              <span>(450)</span>
            </div>
            <div class="flex">
              <img v-for="(piece, index) in capturedBlackPieces" :key="index" :src="getImageSrc(piece.type, piece.color)" :alt="`Captured Black Piece ${index}`" width="24px"
                   height="24px"/>
            </div>
          </div>
        </div>
      </div>
      <div v-if="errorMessage.length"
           class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 right-4 top-4 rounded absolute"
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
      <div class="flex flex-col items-center w-2/3 gap-4">
        <div @click="initBoard" class=" flex border w-full mt-4 rounded justify-center
          py-2 bg-white text-black font-bold hover:opacity-75">
          <p>Commencer</p>
        </div>
        <p>Current Turn: {{ currentTurn }}</p>
        <div @click="finish" class=" flex border w-full mt-4 rounded justify-center
          py-2 bg-neutral-800 text-white font-bold hover:opacity-75">
          <p>Abandonner</p>
        </div>
        <ul class="flex flex-col gap-2">
          <li v-for="(pair, index) in groupedReviews" :key="index">
            {{ index + 1 }}. {{ pair[0] }} - {{ pair[1] }}
          </li>
        </ul>
        <div v-if="isKingInCheckmate">King is in check!</div>
      </div>
    </div>
    <div v-if="isCheck || isKingInCheckmate || isStaleMate" id="popup-modal" tabindex="-1"
         class="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button v-if="isKingInCheckmate" type="button"
                  class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  @click="closeModal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
          <div class="p-4 md:p-5 text-center">
            <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400" v-html="textModal"></h3>
          </div>
          <div v-if="isKingInCheckmate" class="flex justify-center p-4 space-x-4 bg-gray-100 dark:bg-gray-800">
            <button @click="backToMenu"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Revenir au
              menu principale
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import {useRouter} from "vue-router";
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
} from "@/constants";

import AsideHome from "@/components/home/aside.vue";

const router = useRouter();
const board = ref<(ChessFigure | null)[][] | null>(null);
const draggedPiece = ref<{ row: number; col: number } | null>(null);
const currentTurn = ref<ChessColor>(ChessColor.White);
const highlightedMoves = ref<[number, number][]>([]);
const isKingInCheckmate = ref(false);
const reviewList = ref(['']);
const isStaleMate = ref(false);
const isCheck = ref(false);
const review = ref(['']);
const textModal = ref('');
const errorMessage = ref<{ title: string, message: string }[]>([]);
const modalTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const capturedPieces = ref<ChessFigure[]>([]);

const loadBoard = async () => {
  try {
    const response = await axios.get(API_URL + API_ROOT_URL + API_BOARD_URL);
    capturedPieces.value = response.data.capturedPieces;
    review.value = response.data.review;
    board.value = response.data.board;
    currentTurn.value = response.data.currentTurn;
  } catch (error) {
    errorMessage.value.push({title: "Error fetching board", message: error});
  }
};

const groupedReviews = computed(() => {
  const pairs = [];
  for (let i = 0; i < reviewList.length; i += 2) {
    pairs.push([reviewList[i], reviewList[i + 1] || ""]);
  }
  return pairs;
});

const initBoard = async () => {
  try {
    review.value = [''];
    highlightedMoves.value = [];
    currentTurn.value = ChessColor.White;
    isKingInCheckmate.value = false;
    isStaleMate.value = false;
    isCheck.value = false;
    capturedPieces.value = [];
    const response = await axios.get(API_URL + API_ROOT_URL + API_INIT_BOARD_URL);
    board.value = response.data;
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
        review.value = response.review;
        board.value = response.board;
        currentTurn.value = currentTurn.value === ChessColor.White ? ChessColor.Black : ChessColor.White;
        capturedPieces.value = response.capturedPieces;

        const stateResponse = await stateGame();
        if (stateResponse.isInCheck && !stateResponse.movePossible) {
          isKingInCheckmate.value = true;
          showModal("King is in checkmate! <br> Game Over! <br> Winner: " + currentTurn.value);
          await finish();
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

const capturedWhitePieces = computed(() => {
  return capturedPieces.value.filter(piece => piece.color === ChessColor.White);
});

const capturedBlackPieces = computed(() => {
  return capturedPieces.value.filter(piece => piece.color === ChessColor.Black);
});

onMounted(loadBoard);
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
