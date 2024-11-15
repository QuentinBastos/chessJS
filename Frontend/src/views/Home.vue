<template>
  <div>
    <button @click="logBoard">Log Board</button>
    <div class="chessboard">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="cell">
          <img class="piece" v-if="cell" :src="getImageSrc(cell.id, cell.color)" :alt="`Piece ${cell.id}`" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { ChessFigure } from '@/../../Backend/src/interface/ChessFigure';

export default defineComponent({
  name: 'ChessBoardLogger',
  setup() {
    const board = ref<(ChessFigure | null)[][] | null>(null);

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

    return {
      board,
      logBoard,
      getImageSrc,
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
