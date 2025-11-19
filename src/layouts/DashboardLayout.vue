<template>
  <div :class="['flex min-h-screen transition-colors', themeClass]">

    <Sidebar
      :collapsed="collapsed"
      :theme="theme"
      :menu="menu"
      @toggleTheme="toggleTheme"
      @toggleCollapse="toggleCollapse"
    />

    <div class="flex-1 flex flex-col">

      <Topbar :theme="theme" @logout="logout" />

      <main class="p-6">
        <router-view />
      </main>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";

// Icon menu
import { Users, LayoutDashboard } from "lucide-vue-next";

const router = useRouter();

// Theme & collapse
const theme = ref(localStorage.getItem("theme") || "dark");
const collapsed = ref(false);

// Buat dinamis
const menu = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/users", icon: Users },
];

const themeClass = computed(() =>
  theme.value === "dark"
    ? "bg-slate-900 text-gray-100"
    : "bg-gray-50 text-gray-800"
);

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme.value);
};

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>
