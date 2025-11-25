<!-- layouts/DashboardLayout.vue -->
<template>
  <div
    class="flex min-h-screen transition-colors duration-300"
    :class="theme === 'dark'
      ? 'bg-slate-900 text-gray-100'
      : 'bg-gray-50 text-gray-800'"
  >
    <!-- SIDEBAR -->
    <Sidebar
      :collapsed="collapsed"
      :theme="theme"
      :menu="menu"
      @toggleTheme="toggleTheme"
      @toggleCollapse="toggleCollapse"
    />

    <!-- MAIN AREA -->
    <div
      class="flex-1 flex flex-col transition-colors duration-300"
      :class="theme === 'dark'
        ? 'bg-slate-900 text-gray-100'
        : 'bg-white text-gray-800'"
    >
      <!-- TOPBAR -->
      <Topbar
        :theme="theme"
        :user="auth.user"
        :notificationsCount="notificationsCount"
        :userNavigation="userNavigation"
        @logout="logout"
      />

      <!-- CONTENT -->
      <main
        class="flex-1 p-4 sm:p-6 lg:p-8 transition-colors duration-300"
        :class="theme === 'dark'
          ? 'bg-slate-900 text-gray-100'
          : 'bg-gray-50 text-gray-800'"
      >
        <router-view :theme="theme" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";
import { Menu, Users, LayoutDashboard } from "lucide-vue-next";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

/* THEME CONTROL */
const theme = ref(localStorage.getItem("theme") || "dark");
const collapsed = ref(false);

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme.value);
};

/* ADD OR REMOVE CLASS dark ON HTML */
watch(
  () => theme.value,
  (val) => {
    document.documentElement.classList.toggle("dark", val === "dark");
  },
  { immediate: true }
);

const toggleCollapse = () => (collapsed.value = !collapsed.value);

/* STATIC MENU */
const menu = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/users", icon: Users },
  { label: "Menu", path: "/menu", icon: Menu },
];

const notificationsCount = ref(3);

const userNavigation = [
  { name: "Profile", action: () => router.push("/profile") },
  { name: "Settings", action: () => router.push("/settings") },
];

const logout = () => auth.logout();
</script>
