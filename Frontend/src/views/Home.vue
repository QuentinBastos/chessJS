<template>
  <div>
    <button @click="logBoard">Log Board</button>
    <p>Current Turn: {{ currentTurn }}</p>
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

<script lang="ts">
import {defineComponent, ref} from 'vue';
import axios from 'axios';
import {ChessFigure, ChessColor} from '@/../../Backend/src/interface/ChessFigure';

export default defineComponent({
  name: 'ChessBoardLogger',
  setup() {
    const board = ref<(ChessFigure | null)[][] | null>(null);
    const draggedPiece = ref<{ row: number; col: number } | null>(null);
    const currentTurn = ref<ChessColor>(ChessColor.White);
    const highlightedMoves = ref<[number, number][]>([]);

    const logBoard = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/board');
        board.value = response.data;
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };

    const getPossibleMoves = async (pieceId: string) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/possible-moves/${pieceId}`);
        return response.data;
      } catch (error: unknown) {
        console.error('Error fetching possible moves:', error);
        return [];
      }
    };

    const movePiece = async (pieceId: number, toPosition: [number, number]) => {
      try {
        console.log('Sending move request:', { pieceId, toPosition });
        const response = await axios.post('http://localhost:8000/api/move-piece', {
          pieceId,
          toPosition
        });
        console.log('Move successful:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error moving piece:', error.response?.data || error.message);
        throw error;
      }
    };

    const getImageSrc = (type: number, color: string): string => {
      const pieceColor = color.toLowerCase();
      return `/images/pieces/${pieceColor}_${type}.png`;
    };

    const onDragStart = async (event: DragEvent, row: number, col: number) => {
      const piece = board.value![row][col];
      if (piece && piece.color === currentTurn.value) {
        draggedPiece.value = { row, col };
        const possibleMoves = await getPossibleMoves(piece.id.toString());
        highlightedMoves.value = possibleMoves;
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
          alert('Invalid piece');
          return;
        }

        try {
          const response = await movePiece(pieceId, toPosition);
          if (response && response.success) {
            board.value = response.board;
            currentTurn.value = currentTurn.value === ChessColor.White ? ChessColor.Black : ChessColor.White;
          }
        } catch (error) {
          console.error('Error moving piece:', error);
          alert('Error moving piece: ' + JSON.stringify(error.response?.data || error.message));
        }

        draggedPiece.value = null;
        highlightedMoves.value = [];
      }
    };

    const onPieceClick = async (piece: ChessFigure) => {
      if (piece.color === currentTurn.value) {
        const possibleMoves = await getPossibleMoves(piece.id.toString());
        highlightedMoves.value = possibleMoves;
      }
    };

    const isHighlighted = (row: number, col: number): boolean => {
      return highlightedMoves.value.some(move => move[0] === row && move[1] === col);
    };

    return {
      board,
      logBoard,
      getImageSrc,
      onDragStart,
      onDragOver,
      onDrop,
      currentTurn,
      onPieceClick,
      getPossibleMoves,
      isHighlighted,
      movePiece,
    };
  },
});
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
