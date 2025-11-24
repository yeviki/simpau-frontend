<!-- pages/DashboardHome.vue -->
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Selamat Datang</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div class="p-6 rounded-xl shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-semibold mb-2">Total Users</h2>
        <p class="text-3xl font-bold">{{ stats.users }}</p>
      </div>

      <div class="p-6 rounded-xl shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-semibold mb-2">Active Roles</h2>
        <p class="text-3xl font-bold">{{ stats.roles }}</p>
      </div>

      <div class="p-6 rounded-xl shadow bg-white dark:bg-slate-800">
        <h2 class="text-xl font-semibold mb-2">Last Login</h2>
        <p class="text-lg">{{ stats.lastLogin }}</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const stats = ref({
  users: 0,
  roles: 0,
  lastLogin: "-",
});

onMounted(async () => {
  try {
    // kode kamu
    const res = await api.get("/dashboard/stats");
    stats.value = res.data;
  } catch (err) {
    console.error("Mounted error:", err);
  }
});
</script>
