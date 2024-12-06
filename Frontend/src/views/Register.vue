<template>
  <div class="w-screen h-screen flex justify-center bg-neutral-800">
    <div class="flex flex-col gap-2 mt-14 w-1/3 mb-16 items-center text-white">
      <div class="flex items-center py-2 px-3">
        <img src="/images/icons/chess.png" alt="LocalChess" class="w-[48px]">
        <p class="text-white font-bold text-2xl">LocalChess</p>
      </div>
      <h1 class="text-3xl font-bold">Create your Chess.com</h1>
      <h1 class="text-3xl font-bold">account</h1>
      <img src="/images/illustration/piece-dechecs.png" alt="piece" class="w-3/12 my-4">
      <div class="flex flex-col items-center w-3/4 gap-4">
        <input v-model="username" type="text" placeholder="Username"
               class="w-full rounded border-2 border-neutral-400 bg-neutral-500 text-white py-1 pl-2"/>
        <input v-model="email" type="email" placeholder="Email"
               class="w-full rounded border-2 border-neutral-400 bg-neutral-500 text-white py-1 pl-2"/>
        <input v-model="password" type="password" placeholder="Password"
               class="w-full rounded border-2 border-neutral-400 bg-neutral-500 text-white py-1 pl-2"/>
        <!--        <div>-->
        <!--           <div class="flex flex-col">-->
        <!--             <img src="">-->
        <!--             <p></p>-->
        <!--           </div>-->
        <!--        </div>-->
        <nav-button name="Log Up" link="" @click="register" class="w-full"/>
      </div>
      <div>
        <span>You have account ? </span>
        <router-link to="/login" class="text-blue-600 font-medium">Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref} from "vue";
import navButton from "@/components/tools/button.vue";

import router from "@/router";
import {API_URL} from "../../constants";

const username = ref("");
const password = ref("");
const email = ref("");
const rank = ref(0);

const register = async () => {
  try {

    await axios.post(`${API_URL}/users`, {
      username: username.value,
      email: email.value,
      password: password.value,
      rank: rank.value
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await router.push({path: '/login'})
  } catch (err) {
    console.error(err);
  }
};

</script>
