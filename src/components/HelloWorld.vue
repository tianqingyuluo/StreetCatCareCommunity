<template>
  <h1>{{ msg }}</h1>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{ msg: string }>()
</script>

<style scoped>
a {
  color: #42b983;
}
</style>