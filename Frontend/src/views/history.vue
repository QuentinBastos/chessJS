<template>
  <div class="flex w-full h-screen overflow-hidden">
    <AsideHome/>
    <div class="w-[87%] bg-neutral-800 text-white  font-bold py-10 px-32">
      <div class="flex gap-2 items-center">
        <img src="/images/icons/binoculars.png" class="w-[54px]">
        <h1 class="text-3xl">My Game (nbgame)</h1>
      </div>
      <table class="table-auto">
        <thead>
        <tr>
          <th>Time</th>
          <th>name room</th>
          <th>Players</th>
          <th>Victory</th>
          <th>number coup</th>
        </tr>
        </thead>
        <tbody v-for="game in gameList">
          <tr>
            <td>10 Min</td>
            <td>{{ game.name }}</td>
            <td>ddd</td>
            <td>dzdz</td>
            <td>{{ game.review }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">

import AsideHome from "@/components/home/aside.vue";
import {ref, onMounted} from "vue";
import axios from "axios";

const histories = ref([]);
const gameList = ref([]);

onMounted(async () => {
  try {
    const token = localStorage.getItem("jwt_token");
    const userId = JSON.parse(localStorage.getItem("user")).id;

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/histories/user/${userId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      }
    );

    histories.value = response.data;
    console.log(histories.value);
    for (let i = 0; i < histories.value.length; i++) {
      const id = histories.value[i].idGame
      const gameResponse = await axios.get(`${import.meta.env.VITE_API_URL}/games/${id}`,
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
