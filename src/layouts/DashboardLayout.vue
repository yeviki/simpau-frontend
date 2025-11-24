<!-- layouts/DashboardLayout.vue -->
<template>
  <div :class="['flex min-h-screen transition-colors duration-300', themeClass]">
    <Sidebar
      :collapsed="collapsed"
      :theme="theme"
      :menu="menu"
      @toggleTheme="toggleTheme"
      @toggleCollapse="toggleCollapse"
    />

    <div class="flex-1 flex flex-col">
      
      <!-- Topbar memakai data user dari store -->
      <Topbar
        :theme="theme"
        :user="auth.user"
        :avatar="auth.avatarUrl"
        :email="auth.user?.email"
        :notificationsCount="notificationsCount"
        :userNavigation="userNavigation"
        @logout="logout"
      />


      <main class="flex-1 p-6 transition-colors duration-300">
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

import { Menu, Users, LayoutDashboard } from "lucide-vue-next";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

/* ==========================
   THEME & SIDEBAR
========================== */
const theme = ref(localStorage.getItem("theme") || "dark");
const collapsed = ref(false);

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme.value);
};
const toggleCollapse = () => { 
  collapsed.value = !collapsed.value; 
};

/* ==========================
   USER NAVIGATION
========================== */
const notificationsCount = ref(3);

const userNavigation = [
  { name: "Profile", action: () => router.push("/profile") },
  { name: "Settings", action: () => router.push("/settings") },
];

/* ==========================
   MENU
========================== */
const menu = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/users", icon: Users },
  { label: "Menu", path: "/menu", icon: Menu },
];

/* ==========================
   THEME CLASS
========================== */
const themeClass = computed(() =>
  theme.value === "dark"
    ? "bg-slate-900 text-gray-100"
    : "bg-gray-50 text-gray-800"
);

/* ==========================
   LOGOUT
========================== */
const logout = () => auth.logout();
</script>
