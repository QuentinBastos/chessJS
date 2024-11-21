<template>
  <router-link :to="link"
       :style="{ 'background' : color ,
       'border-color' : borderColor,}"
       class="flex border-b-4 rounded-lg bg-blue text-white text-xl
       items-center hover:opacity-90 w-fit gap-6 px-6 py-4 shadow-2xl">
    <img src="/images/icons/strategy.png" :alt="name" class="w-2/12 ">
    <div class="flex flex-col gap-2 text-start">
      <p class="flex font-bold text-2xl w-3/4">{{ name }}</p>
      <p class="flex font-light text-sm">{{ desc }}</p>
    </div>
  </router-link>
</template>

<script setup lang="ts">

import {computed} from "vue";

const props = defineProps<{
  name: string;
  desc: string
  link: string;
  type?: string;
}>();

const color = computed(() => {
  return props.type === 'primary' ? '#3b82f6' : '#494949'
})

const borderColor = computed(() => {
  return props.type === 'primary' ? '#2d579b' : '#717171'
})

</script>

<style scoped>

</style>
