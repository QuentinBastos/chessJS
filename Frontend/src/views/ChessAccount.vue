<template>
  <div class="w-screen h-screen flex justify-center bg-neutral-800">
    <div class="flex flex-col gap-2 w-1/3 mb-16 items-center justify-center text-white">
      <div class="flex items-center py-2 px-3">
        <img src="/images/icons/chess.png" alt="LocalChess" class="w-[48px]">
        <p class="text-white font-bold text-2xl">LocalChess</p>
      </div>
      <h1 class="text-3xl font-bold">Start</h1>
      <h1 class="text-3xl font-bold">Chess.com</h1>
      <img src="/images/illustration/piece-dechecs.png" alt="piece" class="w-3/12 my-4">
      <div class="flex flex-col items-center w-3/4 gap-4">
        <input v-model="username" placeholder="Username"
               class="w-full rounded border-2 border-neutral-400 bg-neutral-500 text-white py-1 pl-2"/>
        <input v-model="email" type="email" placeholder="email"
               class="w-full rounded border-2 border-neutral-400 bg-neutral-500 text-white py-1 pl-2"/>
        <nav-button name="Mettre à jour" link="" @click="updateLogin" class="w-full"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import navButton from "@/components/tools/button.vue";
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useUserService} from "@/composable/user/useUserService";

const router = useRouter();
const id = ref(0);
const username = ref("");
const email = ref("");
const { updateUser } = useUserService()

onMounted(async () => {
  id.value = JSON.parse(localStorage.getItem("user")).id
  username.value = JSON.parse(localStorage.getItem("user")).username
  email.value = JSON.parse(localStorage.getItem("user")).email
})


const updateLogin = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    await updateUser( token, id.value ,{username: username.value , email: email.value});
    const user = { id: id.value, username: username.value, email: email.value };
    localStorage.setItem('user', JSON.stringify(user));
    await router.push({ path: '/' });
  } catch (err) {
    console.error('update failed:', err);
  }
};
</script>
