<!-- pages/DasboardHome.vue -->
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
import api from "../api/axios";
import Swal from "sweetalert2";

const { theme } = defineProps({
  theme: String
});

const stats = ref({
  users: 0,
  roles: 0,
  lastLogin: "-",
});

onMounted(async () => {
  try {

    // ===============================================
    // 1️⃣ CEK STATUS MAINTENANCE
    // ===============================================
    const maintenance = await api.get("/system/maintenance-status");

    if (maintenance.data.status === 1) {

      // Jika maintenance aktif → tampilkan alert
      // (Tidak logout otomatis, hanya memberi tahu)
      Swal.fire({
        icon: "warning",
        title: "Aplikasi Dalam Mode Maintenance",
        text: "Beberapa fitur mungkin tidak dapat digunakan.",
        confirmButtonColor: "#d33",
      });
    }

    // ===============================================
    // 2️⃣ AMBIL DATA STATS (LOGIKA ASLI)
    // ===============================================
    const res = await api.get("/master/stats");
    stats.value = res.data;

  } catch (e) {
    console.error(e);
  }
});
</script>
