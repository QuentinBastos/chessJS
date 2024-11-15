<template>
  <div>
    <button @click="logBoard">Log Board</button>
    <p>Current Turn: {{ currentTurn }}</p>
    <div class="chessboard">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          class="cell"
          @drop="onDrop($event, rowIndex, cellIndex)"
          @dragover="onDragOver($event)"
        >
          <img
            class="piece"
            v-if="cell"
            :src="getImageSrc(cell.id, cell.color)"
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
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { ChessFigure, ChessColor } from '@/../../Backend/src/interface/ChessFigure';

export default defineComponent({
  name: 'ChessBoardLogger',
  setup() {
    const board = ref<(ChessFigure | null)[][] | null>(null);
    const draggedPiece = ref<{ row: number; col: number } | null>(null);
    const currentTurn = ref<ChessColor>(ChessColor.White);

    const logBoard = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/board');
        board.value = response.data;
        console.log(board.value);
      } catch (error) {
        console.error('Error fetching board:', error);
      }
    };

    const getImageSrc = (id: number, color: string): string => {
      const pieceColor = color.toLowerCase();
      return `/images/pieces/${pieceColor}_${id}.png`;
    };

    const onDragStart = (event: DragEvent, row: number, col: number) => {
      const piece = board.value![row][col];
      if (piece && piece.color === currentTurn.value) {
        draggedPiece.value = { row, col };
      } else {
        event.preventDefault();
      }
    };

    const onDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const onDrop = (event: DragEvent, row: number, col: number) => {
      event.preventDefault();
      if (draggedPiece.value) {
        const fromRow = draggedPiece.value.row;
        const fromCol = draggedPiece.value.col;
        if (fromCol !== col) {
          const piece = board.value![fromRow][fromCol];
          board.value![fromRow][fromCol] = null;
          board.value![row][col] = piece;
          currentTurn.value = currentTurn.value === ChessColor.White ? ChessColor.Black : ChessColor.White;
        }
        draggedPiece.value = null;
      }
    };

    const getPossibleMoves = (piece: ChessFigure, board: (ChessFigure | null)[][]): [number, number][] => {
      const possibleMoves: [number, number][] = [];
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          if (piece.isValidMove([row, col], board)) {
            possibleMoves.push([row, col]);
          }
        }
      }
      return possibleMoves;
    };

    const onPieceClick = (piece: ChessFigure) => {
      console.log("test");
      if (piece.color === currentTurn.value) {
        const possibleMoves = getPossibleMoves(piece, board.value!);
        console.log('Possible moves:', possibleMoves);
      }
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
</style>
