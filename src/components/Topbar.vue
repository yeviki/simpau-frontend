<template>
  <header class="h-16 flex items-center justify-between px-6 border-b dark:border-slate-700">
    <h1 class="text-xl font-semibold">{{ title }}</h1>

    <button
      @click="$emit('logout')"
      class="px-4 py-2 bg-red-600 text-white rounded"
    >
      Logout
    </button>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Ambil title otomatis dari route meta
const title = computed(() => route.meta.title || "Dashboard");
</script>
