<template>
  <div class="flex">
    <input
      type="checkbox"
      id="menu-toggle"
      class="peer hidden"
    />
    <label
      for="menu-toggle"
      class="cursor-pointer p-3 text-white bg-neutral-800 sm:hidden peer-checked:hidden md:min-w-[200px]"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M4 6h16M4 12h16m-7 6h7"
        ></path>
      </svg>
    </label>

    <aside class="bg-neutral-900 h-full relative overflow-y-auto z-10 hidden peer-checked:block sm:block lg:min-w-[200px]">
      <label
        for="menu-toggle"
        class="flex items-center justify-center top-3 right-3 cursor-pointer p-2 text-white sm:hidden"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </label>
      <router-link class="flex items-center py-2 px-3 hover:bg-neutral-600 lg:justify-start justify-center" to="/">
        <img src="/images/icons/chess.png" alt="LocalChess" class="w-[48px]">
        <p class="text-white font-bold text-2xl hidden lg:flex">LocalChess</p>
      </router-link>
      <ul class="flex flex-col text-white font-bold text-lg">
        <li
          class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <img src="/images/icons/strategy.png" alt="LocalChess" class="w-[36px]">
          <p class="hidden lg:flex">Jouer</p>
        </li>
        <li
          class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <img src="/images/icons/jigsaw.png" alt="LocalChess" class="w-[36px]">
          <p class="hidden lg:flex">Problèmes</p>
        </li>
        <li
          class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <img src="/images/icons/education.png" alt="LocalChess" class="w-[36px]">
          <p class="hidden lg:flex">Apprendre</p>
        </li>
        <li class="flex hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <router-link class="flex items-center gap-4 px-3 py-2" :to="'/history/'+ storedUser?.id">
            <img src="/images/icons/binoculars.png" alt="LocalChess" class="w-[36px]">
            <p class="hidden lg:flex">Historique</p>
          </router-link>
        </li>
        <li
          class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <img src="/images/icons/newspaper.png" alt="LocalChess" class="w-[36px]">
          <p class="hidden lg:flex">Info</p>
        </li>
        <li
          class="flex hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <router-link class="flex items-center gap-4 px-3 py-2" to="/leaderboard">
            <img src="/images/icons/trophy.png" alt="trophy" class="w-[36px]">
            <p class="hidden lg:flex">LeaderBoard</p>
          </router-link>
        </li>
        <li
          class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <img src="/images/icons/more.png" alt="LocalChess" class="w-[36px]">
          <p class="hidden lg:flex">Plus</p>
        </li>
      </ul>
      <div v-if="!storedUser" class="lg:flex flex-col gap-3 px-3 pb-4 hidden">
        <input type="search" placeholder="Rechercher"
               class="bg-neutral-700 border-gray-500 border rounded py-2 pl-2 my-4 "/>
        <navButton name="Créer un compte" link="/register" type="primary"/>
        <navButton name="Se connecter" link="/login"/>
      </div>
      <div v-else class="lg:flex flex-col gap-3 px-3 pb-4 text-white hidden">
        <p>{{ storedUser.username }}</p>
        <p>{{ storedUser.email }}</p>
        <nav-button name="Logout" link="" @click="logout"/>
      </div>
      <ul class="flex flex-col text-gray-400 font-bold">
        <li
          class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <img src="/images/icons/dark-mode.png" alt="LocalChess" class="w-[24px]">
          <p class="hidden lg:flex">Interface</p>
        </li>
        <li
          class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <img src="/images/icons/globe.png" alt="LocalChess" class="w-[24px]">
          <p class="hidden lg:flex">Langues</p>
        </li>
        <li
          class="flex items-center gap-4 px-3 py-2 hover:bg-neutral-600 cursor-pointer lg:justify-start justify-center">
          <img src="/images/icons/headset.png" alt="LocalChess" class="w-[24px]">
          <p class="hidden lg:flex">Assitance</p>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script setup>
import navButton from "@/components/tools/button.vue";
import {onMounted, ref} from "vue";
import LeaderBoard from "@/views/LeaderBoard.vue";

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
