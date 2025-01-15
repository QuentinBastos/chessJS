<template>
  <div class="flex w-full h-screen overflow-hidden">
    <AsideHome/>
    <div class="w-full bg-neutral-800 text-white  font-bold py-10 px-16">
      <div class="flex gap-2 items-center mb-6">
        <img src="/images/icons/trophy.png" class="w-[54px]" alt="trophy">
        <h1 class="text-3xl">LeaderBoard</h1>
      </div>
      <div class="flex-col bg-neutral-900 py-4 px-2 rounded">
        <table class="w-full table-auto">
          <thead>
          <tr class="border-white border-b">
            <th class="pb-2">Rank</th>
            <th class="pb-2">Name</th>
            <th class="pb-2">Email</th>
            <th class="pb-2">LP</th>
            <th class="pb-2">Action</th>
          </tr>
          </thead>
          <tbody v-for="(ranking,index) in userList" :key="index">
          <tr class="flex-col border-white border-b ">
            <td class="text-center py-4">{{ index+1 }}</td>
            <td class="text-center">{{ ranking.username }}</td>
            <td class="text-center">{{ ranking.email }}</td>
            <td class="text-center">{{ ranking.rank }}</td>
            <td class="text-center">
              <router-link :to="'/history/'+ ranking.id" class="bg-sky-600 py-1 px-1 font-medium rounded">Voir
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

import AsideHome from "@/components/home/ChessAside.vue";
import {ref, onMounted} from "vue";
import { useUserService } from "@/composable/user/useUserService";

const { fetchAllUsers } = useUserService();
const userList = ref({});

onMounted(async () => {
  try {
    const token = localStorage.getItem("jwt_token");

    const response = await fetchAllUsers(token);

    userList.value = response.sort((a, b) => a.rank - b.rank).reverse();
  } catch (err) {
      console.error("Error fetching histories:", err);
  }
})
</script>

<style lang="scss" scoped>
</style>
