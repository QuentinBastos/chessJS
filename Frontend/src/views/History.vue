<template>
  <div class="flex w-full h-screen overflow-hidden">
    <AsideHome/>
    <div class="w-[87%] bg-neutral-800 text-white  font-bold py-10 px-16">
      <div class="flex gap-2 items-center mb-6">
        <img src="/images/icons/binoculars.png" class="w-[54px]">
        <h1 class="text-3xl">Historiques ({{ gameList.length }})</h1>
      </div>
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
import {ref, onMounted} from "vue";
import axios from "axios";
import {API_URL} from "@/constants";

const histories = ref([]);
const gameList = ref([]);

onMounted(async () => {
  try {
    const token = localStorage.getItem("jwt_token");
    const userId = JSON.parse(<string>localStorage.getItem("user")).id;

    const response = await axios.get(
      `${API_URL}/histories/user/${userId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      }
    );

    histories.value = response.data;
    console.log("history", histories.value);
    for (let i = 0; i < histories.value.length; i++) {
      const id = histories.value[i].idGame
      const gameResponse = await axios.get(`${API_URL}/games/${id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );
      gameList.value[i] = gameResponse.data;
    }
  } catch (err) {
    console.error("Error fetching histories:", err);
  }
  console.log(gameList)
});


</script>

<style scoped>

</style>
