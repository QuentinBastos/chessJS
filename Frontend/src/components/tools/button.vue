<template>
  <router-link :to="link"
               :style="{ 'background' : color ,
               'border-color' : borderColor}"
               class="flex border-b-2 rounded bg-blue text-white text-xl items-center justify-center hover:opacity-90 ">
    <p class="flex py-2 font-medium">{{ name }}</p>
  </router-link>
</template>

<script setup lang="ts">

import {computed} from "vue";

const props = defineProps<{
  name: string;
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
