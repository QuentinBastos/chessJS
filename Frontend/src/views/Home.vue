<template>
  <div class="flex w-full h-screen overflow-hidden">
    <AsideHome/>
    <div class="w-[87%] bg-neutral-800 text-white  font-bold py-10 px-32">
      <div class="flex">
        <img src="/images/illustration/board-chess.webp" alt="board chess" class="rounded-lg w-[46%] h-fit">
        <div class=" flex flex-col items-center w-full text-center">
          <div class="mt-8 w-full flex flex-col items-center">
            <div class="text-5xl mb-8">
              <h1>Jouez aux échecs</h1>
              <h1>en ligne sur le</h1>
              <h1>site n°2 !</h1>
            </div>
            <div class="flex flex-inline gap-6 justify-center mb-12">
              <div class="flex gap-2">
                <span>9 999 999</span>
                <span class="font-medium text-gray-400">Parties du jour</span>
              </div>
              <div class="flex gap-2">
                <span>999 999</span>
                <span class="font-medium text-gray-400"> En train de jouer</span>
              </div>
            </div>
            <div class="w-[65%] flex flex-col gap-8">
              <button-icon name="Jouez en ligne" desc="Jouez avec quelqu'un de votre niveau" type="primary" link="/game"/>
              <button-icon name="Jouez contre l'ordinateur"
                           desc="Jouez contre des robots d'entrainement personnalisables" link="/game"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import AsideHome from "@/components/home/aside.vue";
import ButtonIcon from "@/components/tools/buttonIcon.vue";
</script>
