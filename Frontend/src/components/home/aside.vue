<template>
  <aside class="bg-neutral-900 w-[13%] min-w-[200px] h-full relative overflow-y-auto ">
    <router-link class="flex items-center py-2 px-3 hover:bg-neutral-600" to="/">
      <img src="/images/icons/chess.png" alt="LocalChess" class="w-[48px]">
      <p class="text-white font-bold text-2xl">LocalChess</p>
    </router-link>
    <ul class="flex flex-col text-white font-bold text-lg">
      <li class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer">
        <img src="/images/icons/strategy.png" alt="LocalChess" class="w-[36px]">
        <p>Jouer</p>
      </li>
      <li class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer">
        <img src="/images/icons/jigsaw.png" alt="LocalChess" class="w-[36px]">
        <p>Problèmes</p>
      </li>
      <li class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer">
        <img src="/images/icons/education.png" alt="LocalChess" class="w-[36px]">
        <p>Apprendre</p>
      </li>
      <li class="flex  hover:bg-neutral-600 cursor-pointer">
        <router-link class="flex items-center gap-4 px-3 py-2" to="/history">
          <img src="/images/icons/binoculars.png" alt="LocalChess" class="w-[36px]">
          <p>Historique</p>
        </router-link>
      </li>
      <li class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer">
        <img src="/images/icons/newspaper.png" alt="LocalChess" class="w-[36px]">
        <p>Info</p>
      </li>
      <li class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer">
        <img src="/images/icons/social-care.png" alt="LocalChess" class="w-[36px]">
        <p>Social</p>
      </li>
      <li class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer">
        <img src="/images/icons/more.png" alt="LocalChess" class="w-[36px]">
        <p>Plus</p>
      </li>
    </ul>
    <div v-if="!storedUser" class="flex flex-col gap-3 px-3 pb-4">
      <input type="search" placeholder="Rechercher"
             class="bg-neutral-700 border-gray-500 border rounded py-2 pl-2 my-4 "/>
      <navButton name="Créer un compte" link="/register" type="primary"/>
      <navButton name="Se connecter" link="/login"/>
    </div>
    <div v-else class="flex flex-col gap-3 px-3 pb-4 text-white">
      <p>{{ storedUser.username }}</p>
      <p>{{ storedUser.email }}</p>
      <nav-button name="Logout" link="" @click="logout"/>
    </div>
    <ul class="flex flex-col text-gray-400 font-bold">
      <li class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer">
        <img src="/images/icons/dark-mode.png" alt="LocalChess" class="w-[24px]">
        <p>Interface</p>
      </li>
      <li class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer">
        <img src="/images/icons/globe.png" alt="LocalChess" class="w-[24px]">
        <p>Langues</p>
      </li>
      <li class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer">
        <img src="/images/icons/headset.png" alt="LocalChess" class="w-[24px]">
        <p>Assitance</p>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import navButton from "@/components/tools/button.vue";
import {onMounted, ref} from "vue";

const storedUser = ref();

onMounted(() => {
  storedUser.value = JSON.parse(localStorage?.getItem("user"));
})

const logout = (() => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user");
  window.location.reload();
})
</script>

<style lang="scss" scoped>
aside {
  scrollbar-width: none;
}
</style>
