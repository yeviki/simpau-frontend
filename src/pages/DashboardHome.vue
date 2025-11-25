<template>
  <div>
    <h1
      class="text-3xl font-bold mb-6 transition-colors"
      :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'"
    >
      Selamat Datang
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- CARD 1 -->
      <div
        class="p-6 rounded-xl shadow transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-slate-800 text-gray-100'
          : 'bg-white text-gray-900'"
      >
        <h2 class="text-xl font-semibold mb-2">Total Users</h2>
        <p class="text-3xl font-bold">{{ stats.users }}</p>
      </div>

      <!-- CARD 2 -->
      <div
        class="p-6 rounded-xl shadow transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-slate-800 text-gray-100'
          : 'bg-white text-gray-900'"
      >
        <h2 class="text-xl font-semibold mb-2">Active Roles</h2>
        <p class="text-3xl font-bold">{{ stats.roles }}</p>
      </div>

      <!-- CARD 3 -->
      <div
        class="p-6 rounded-xl shadow transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-slate-800 text-gray-100'
          : 'bg-white text-gray-900'"
      >
        <h2 class="text-xl font-semibold mb-2">Last Login</h2>
        <p class="text-lg">{{ stats.lastLogin }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const { theme } = defineProps({
  theme: String
});

const stats = ref({
  users: 0,
  roles: 0,
  lastLogin: "-",
});
</script>
