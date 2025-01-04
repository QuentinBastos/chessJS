<template>
  <div class="flex w-full h-screen overflow-hidden">
    <AsideHome/>
    <div class="w-full bg-neutral-800 flex items-center justify-around h-full sm:gap-2 gap-8 px-8 selectedNone">
      <div class="flex flex-col w-full h-full justify-between">
        <div class="flex text-white font-bold gap-4 my-2 h-[10vh]">
          <img src="/images/player/car.png" width="48" height="48" alt="iconProfile"/>
          <div class="flex flex-col gap-1">
            <div v-if="currentTurn === ChessColor.White">
              <span>Invité</span>
            </div>
            <div v-if="currentTurn === ChessColor.Black">
              <span>{{ username }}</span>
              <span>(450)</span>
            </div>
            <div class="flex" v-if="currentTurn === ChessColor.Black">
              <img v-for="(piece, index) in capturedWhitePieces" :key="index"
                   :src="getImageSrc(piece.type, piece.color)" :alt="`Captured Black Piece ${index}`" width="24px"
                   height="24px"/>
            </div>
            <div class="flex" v-if="currentTurn === ChessColor.White">
              <img v-for="(piece, index) in capturedBlackPieces" :key="index"
                   :src="getImageSrc(piece.type, piece.color)" :alt="`Captured White Piece ${index}`" width="24px"
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
            <div v-if="currentTurn === ChessColor.White">
              <span>{{ username }}</span>
              <span>(450)</span>
            </div>
            <div v-if="currentTurn === ChessColor.Black">
              <span>Invité</span>
            </div>
            <div class="flex" v-if="currentTurn === ChessColor.Black">
              <img v-for="(piece, index) in capturedBlackPieces" :key="index"
                   :src="getImageSrc(piece.type, piece.color)" :alt="`Captured Black Piece ${index}`" width="24px"
                   height="24px"/>
            </div>
            <div class="flex" v-if="currentTurn === ChessColor.White">
              <img v-for="(piece, index) in capturedWhitePieces" :key="index"
                   :src="getImageSrc(piece.type, piece.color)" :alt="`Captured White Piece ${index}`" width="24px"
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
      <div class="flex flex-col w-1/3 bg-neutral-600 gap-4 rounded items-center px-4 py-6">
        <h2 class="text-white font-bold text-3xl">Jouer</h2>
        <div class="flex gap-2">
          <div class="flex items-center rounded px-4 cursor-pointer" v-bind:style="!isPrivate ? {'background' : 'black'} :  {'background' : 'gray'}">
            <input id="bordered-radio-1" type="radio" v-model="isPrivate" :value=false name="bordered-radio" class="w-4 h-4 hidden cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="bordered-radio-1" class="w-full py-4 text-sm cursor-pointer font-medium text-gray-900 dark:text-gray-300">Privé</label>
          </div>
          <div class="flex items-center rounded cursor-pointer bg-neutral-800 px-4" v-bind:style="isPrivate ? {'background' : 'black'} :  {'background' : 'gray'}">
            <input checked id="bordered-radio-2" type="radio" v-model="isPrivate" :value=true name="bordered-radio" class="w-4 h-4 hidden text-blue-600 cursor-pointer bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="bordered-radio-2" class="w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">Public</label>
          </div>
        </div>
        <label for="nameRoom" class="font-medium text-white">Nom partie </label>
        <input id="nameRoom" type="text" v-model="nameRoom" class="w-2/3 shadow py-1 pl-1 rounded">
        <div v-if="!isGameStarted" @click="createBoard" class=" flex border w-full mt-4 rounded justify-center
            py-2 bg-white text-black font-bold hover:opacity-75">
            <p>Commencer</p>
          </div>
          <p>Current Turn: {{ currentTurn }}</p>
          <div v-if="isGameStarted" @click="giveUp" class=" flex border w-full mt-4 rounded justify-center
            py-2 bg-neutral-800 text-white font-bold hover:opacity-75">
            <p>Abandon</p>
          </div>
        <div v-if="isKingInCheckmate">King is in check!</div>
      </div>
    </div>
    <div v-if="isCheck || isKingInCheckmate || isStaleMate || hasGivenUp" id="popup-modal" tabindex="-1"
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
          <div v-if="isKingInCheckmate || hasGivenUp || isStaleMate"
               class="flex justify-center p-4 space-x-4 bg-gray-100 dark:bg-gray-800">
            <button @click="backToMenu"
                    class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Revenir au
              menu principale
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showPromotionModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-lg">
        <h3 class="text-lg font-bold mb-4">Promote Pawn</h3>
        <div class="flex gap-4">
          <img v-for="piece in promotionPieces" :key="piece.type" :src="getImageSrc(piece.type, piece.color)"
               :alt="String(piece.type)"
               @click="promotePawn(piece.type)" class="cursor-pointer" width="40px" height="40px"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import {useRouter} from "vue-router";
import {ChessFigure} from "@/models/ChessFigure";
import {
  QUEEN,
  ROOK,
  BISHOP,
  KNIGHT,
  ChessColor,
} from "@/constants";

import AsideHome from "@/components/home/aside.vue";
import { useGameService } from "@/composable/game/useGameService";
import { useHistoryService } from "@/composable/history/useHistoryService";
import {
  getBoard,
  initBoard,
  getPossibleMovesPiece,
  moveOnePiece,
  isKingInCheck,
  promotePiece,
  endGame,
} from '@/composable/gamePlay';

const router = useRouter();
const board = ref<(ChessFigure | null)[][] | null>(null);
const draggedPiece = ref<{ row: number; col: number } | null>(null);
const currentTurn = ref<ChessColor>(ChessColor.White);
const isGameStarted = ref(false);
const highlightedMoves = ref<[number, number][]>([]);
const isKingInCheckmate = ref(false);
const isStaleMate = ref(false);
const hasGivenUp = ref(false);
const isCheck = ref(false);
const review = ref(['']);
const textModal = ref('');
const errorMessage = ref<{ title: string, message: string }[]>([]);
const modalTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const capturedPieces = ref<ChessFigure[]>([]);
const isPrivate = ref(true);
const nameRoom = ref('');
const showPromotionModal = ref(false);
const promotionRow = ref<number | null>(null);
const promotionCol = ref<number | null>(null);
const { createGame } = useGameService();
const { createHistory } = useHistoryService();
const username = JSON.parse(<string>localStorage.getItem("user")).username;
const promotionPieces = ref([
  {type: QUEEN, color: currentTurn.value},
  {type: ROOK, color: currentTurn.value},
  {type: BISHOP, color: currentTurn.value},
  {type: KNIGHT, color: currentTurn.value},
]);


const loadBoard = async () => {
  try {
    const response = await getBoard();
    console.log(response);
    capturedPieces.value = response.capturedPieces;
    review.value = response.review;
    board.value = response.board;
    currentTurn.value = response.currentTurn;
    isGameStarted.value = response.isGameStarted;
  } catch (error) {
    errorMessage.value.push({title: "Error fetching board", message: String(error)});
  }
};

const createBoard = async () => {
  try {
    review.value = [''];
    highlightedMoves.value = [];
    currentTurn.value = ChessColor.White;
    isKingInCheckmate.value = false;
    isStaleMate.value = false;
    isCheck.value = false;
    capturedPieces.value = [];
    const response = await initBoard();
    board.value = response.board;
    isGameStarted.value = response.isGameStarted;
  } catch (error) {
    errorMessage.value.push({title: "Error fetching board", message: String(error)});
  }
};

const getPossibleMoves = async (pieceId: string) => {
  try {
    const response = await getPossibleMovesPiece(pieceId)
    return response;
  } catch (error: unknown) {
    errorMessage.value.push({title: "Error move", message: String(error)});
    return [];
  }
};

const movePiece = async (pieceId: number, toPosition: [number, number]) => {
  try {
    const response = await moveOnePiece(pieceId, toPosition);
    return response;
  } catch (error) {
    errorMessage.value.push({title: "Error fetching possible moves", message: String(error)});
    throw error;
  }
};

const stateGame = async () => {
  try {
    const response = await isKingInCheck(currentTurn.value)
    return response;
  } catch (error) {
    errorMessage.value.push({title: "Error state game", message: String(error)});
  }
};

const getImageSrc = (type: number, color: string): string => {
  const pieceColor = color.toLowerCase();
  return `/images/pieces/${pieceColor}_${type}.png`;
};

const onDragStart = async (event: DragEvent, row: number, col: number) => {
  if (!isGameStarted.value) {
    event.preventDefault();
    return;
  }

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
      errorMessage.value.push({ title: "Piece", message: "Mauvaise position" });
      return;
    }

    try {
      const response = await movePiece(pieceId, toPosition);
      if (response && response.success) {
        review.value = response.review;
        board.value = response.board;
        currentTurn.value = currentTurn.value === ChessColor.White ? ChessColor.Black : ChessColor.White;
        capturedPieces.value = response.capturedPieces;

        const audio = new Audio('/sounds/move-piece.mp3');
        await audio.play();

        const chessboard = document.querySelector('.chessboard');
        const cells = document.querySelectorAll('.cell');
        if (chessboard) {
          chessboard.classList.toggle('rotate');
        }
        if (cells) {
          cells.forEach((cell) => {
            cell.classList.toggle('rotatePiece');
            cell.classList.remove('fade-in');
            cell.classList.add('fade-out');
            setTimeout(() => {
              cell.classList.remove('fade-out');
              cell.classList.add('fade-in');
            }, 500);
          });
        }

        if (response.promotion) {
          showPromotionModal.value = true;
          promotionRow.value = row;
          promotionCol.value = col;
        } else {
          const stateResponse = await stateGame();
          if (stateResponse.isInCheck && !stateResponse.movePossible) {
            isKingInCheckmate.value = true;
            showModal("Echec et mat ! <br> Partie perdu <br> Gagnant: " + currentTurn.value);
            await finish();
          } else if (stateResponse.isInCheck && stateResponse.movePossible) {
            isCheck.value = true;
            showModal("Le roi est en échec!");
          } else if (!stateResponse.isInCheck && !stateResponse.movePossible) {
            isStaleMate.value = true;
            showModal("Egalité! <br> Partie nulle");
            await finish();
          } else {
            isKingInCheckmate.value = false;
          }
        }
      }
    } catch (error) {
      errorMessage.value.push({ title: "Error moving piece", message: String(error) });
    }

    draggedPiece.value = null;
    highlightedMoves.value = [];
  }
};

const promotePawn = async (type: number) => {
  if (promotionRow.value !== null && promotionCol.value !== null) {
    const pieceId = board.value![promotionRow.value][promotionCol.value]?.id;
    if (pieceId === undefined) {
      errorMessage.value.push({title: "Error", message: "Invalid piece position"});
      return;
    }

    try {
      const response = await promotePiece(pieceId, type)

      if (response && response.success) {
        board.value = response.board;
        showPromotionModal.value = false;
        promotionRow.value = null;
        promotionCol.value = null;

        const stateResponse = await stateGame();
        if (stateResponse.isInCheck && !stateResponse.movePossible) {
          isKingInCheckmate.value = true;
          showModal("Echec et mat ! <br> Partie perdu <br> Gagnant: " + currentTurn.value);
          await finish();
        } else if (stateResponse.isInCheck && stateResponse.movePossible) {
          isCheck.value = true;
          showModal("Le roi est en échec!");
        } else if (!stateResponse.isInCheck && !stateResponse.movePossible) {
          isStaleMate.value = true;
          showModal("Egalité! <br> Partie nulle");
          await finish();
        } else {
          isKingInCheckmate.value = false;
        }
      }
    } catch (error) {
      errorMessage.value.push({title: "Error promoting pawn", message: String(error)});
    }
  }
};

const onPieceClick = async (piece: ChessFigure) => {
  if (piece.color === currentTurn.value && isGameStarted.value) {
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
  if (isCheck.value) {
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
  hasGivenUp.value = false;
};

async function giveUp() {
  try {
    hasGivenUp.value = true;
    showModal("Vous avez abandonné! <br> Game Over! <br> Winner: " + (currentTurn.value === ChessColor.White ? ChessColor.Black : ChessColor.White));
    await finish();
  } catch (error) {
    errorMessage.value.push({title: "Error giving up", message: String(error)});
  }
}

async function finish() {
  try {
    const token = localStorage.getItem("jwt_token");
    const response = await axios.post(`${API_URL}${API_ROOT_URL}${API_END_GAME_URL}`);
    isGameStarted.value = response.data.isGameStarted;

    isGameStarted.value = response.isGameStarted;
    const handleCreateGame = async () => {
      try {
        const response = await createGame( token , {
          name: nameRoom.value || "check",
          review: JSON.stringify(review.value),
          share: Number(isPrivate.value),
        });
        return response.data;
      } catch (err) {
        console.error("Erreur lors de la création du jeu :", err);
        throw err;
      }
    };

    const gameData = await handleCreateGame();
    console.log(gameData.id);
    const userId = JSON.parse(<string>localStorage.getItem("user")).id;
    await createHistory(token, { idUser: userId, idGame :gameData.id });
  } catch (error) {
    errorMessage.value.push({title: "Error finishing game", message: String(error)});
  }
}


async function backToMenu() {
  await createBoard();
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
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;

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

.selectedNone {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.rotate {
  transform: rotate(90deg);
}

.rotatePiece {
  transform: rotate(270deg);
}

.fade-in {
  opacity: 1 !important;
}

.fade-out {
  opacity: 0 !important;
}

</style>
