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
        <input v-model="password" type="password" placeholder="Password"
               class="w-full rounded border-2 border-neutral-400 bg-neutral-500 text-white py-1 pl-2"/>
        <nav-button name="Log In" link="" @click="login" class="w-full"/>
      </div>
      <div>
        <span>You don't have account ? </span>
        <router-link to="/register" class="text-blue-600 font-medium">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref} from "vue";
import navButton from "@/components/tools/button.vue";
import { useRouter } from 'vue-router'
import { API_URL } from "@/constants";

const router = useRouter()
const username = ref("");
const password = ref("");

const login = async () => {
  try {

    const response = await axios.post(`${API_URL}/auth`, {
      grant_type: "password",
      username: username.value,
      password: password.value,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });


    const {token} = response.data;
    console.log(token)
    localStorage.setItem("jwt_token", token[0]);
    const user = {id: token[1], username: token[2], email: token[3]};
    localStorage.setItem("user", JSON.stringify(user));
    await router.push({path: '/'})

  } catch (err) {
    console.error(err);
  }
};
</script>
