<template>
  <div class="flex w-full h-screen overflow-hidden">
    <AsideHome/>
    <div class="w-full bg-neutral-800 text-white  font-bold py-10 px-16 overflow-y-auto">
      <div class="flex gap-2 items-center mb-6">
        <img src="/images/icons/binoculars.png" class="w-[54px]">
        <h1 class="text-3xl ">Historiques ({{ gameList.length }})</h1>
      </div>
      <h1 class="text-xl my-2">Nombres de coup total: {{ totalMoves }}</h1>
      <div class="flex-col bg-neutral-900 py-4 px-2 rounded">
        <table class="w-full table-auto">
          <thead>
          <tr class="border-white border-b">
            <th class="pb-2">Temps</th>
            <th class="pb-2">Nom room</th>
            <th class="pb-2">Joueur(s)</th>
            <th class="pb-2">Victoire</th>
            <th class="pb-2">Nombres de coup</th>
            <th class="pb-2">Action</th>
          </tr>
          </thead>
          <tbody v-for="game in gameList">
          <tr class="flex-col border-white border-b ">
            <td class="text-center py-4">10 Minutes</td>
            <td class="text-center">{{ game.name }}</td>
            <td class="text-center">Local</td>
            <td class="text-center">Gagné</td>
            <td class="text-center"> {{ JSON.parse(game.review).length }}</td>
            <td class="text-center">
              <router-link :to="'/review/'+ game.id" class="bg-sky-600 py-1 px-1 font-medium rounded">Revoir
              </router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import AsideHome from "@/components/home/aside.vue";
import {computed, onMounted, ref} from "vue";
import {useGameService} from "@/composable/game/useGameService";
import {useHistoryService} from "@/composable/history/useHistoryService";
import {useRoute} from "vue-router"

const { fetchGameById } = useGameService();
const { fetchHistoriesByUserId } = useHistoryService();

const histories = ref([]);
const gameList = ref([]);
const totalMoves = computed(() => {
  return gameList.value.reduce((sum, game) => {
    const moves = JSON.parse(game.review);
    return sum + moves.length;
  }, 0);
});
const route = useRoute();

onMounted(async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      throw new Error('Token JWT non trouvé');
    }

    histories.value = await fetchHistoriesByUserId(route.params.id , token);
    for (let i = 0; i < histories.value.length; i++) {
      const gameResponse = await fetchGameById(histories.value[i].idGame, token);
      if (route.params.id == JSON.parse(localStorage.getItem("user")).id ) {
        gameList.value.push(gameResponse);
      } else {
        if (gameResponse && gameResponse.share === 1) {
          gameList.value.push(gameResponse);
        }
      }
    }

  } catch (err) {
    console.error('Erreur lors de la récupération des données :', err);
  }
});


</script>

<style scoped>

</style>
