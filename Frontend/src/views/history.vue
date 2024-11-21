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
          <th>Song</th>
          <th>Artist</th>
          <th>Year</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
          <td>Malcolm Lockyer</td>
          <td>1961</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">

import AsideHome from "@/components/home/aside.vue";
import {onMounted} from "vue";

onMounted(() => {

})


</script>

<style scoped>

</style>
