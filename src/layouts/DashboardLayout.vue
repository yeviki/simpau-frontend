<!-- layouts/DashboardLayout.vue -->
<template>
  <div
    class="flex min-h-screen relative transition-colors duration-300"
    :class="theme === 'dark'
      ? 'bg-slate-900 text-gray-100'
      : 'bg-gray-50 text-gray-800'"
  >
    <!-- MOBILE OVERLAY -->
    <div
      v-if="isMobile && sidebarOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- SIDEBAR -->
    <Sidebar
      class="z-40"
      :class="[
        isMobile
          ? 'fixed inset-y-0 left-0 transform transition-transform duration-300 lg:hidden'
          : 'relative',

        sidebarOpen
          ? 'translate-x-0'
          : isMobile
            ? '-translate-x-full'
            : ''
      ]"
      :collapsed="collapsed"
      :theme="theme"
      :menu="menu"
      @toggleTheme="toggleTheme"
      @toggleCollapse="toggleCollapse"
      @closeMobile="closeSidebar"
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
        @openSidebarMobile="openSidebar"
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
import { ref, watch, onMounted, onUnmounted } from "vue";
import Sidebar from "../components/Sidebar.vue";
import Topbar from "../components/Topbar.vue";
import { Key, Menu, Users, LayoutDashboard } from "lucide-vue-next";
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

/* RESPONSIVE MOBILE */
const isMobile = ref(window.innerWidth < 1024);
const sidebarOpen = ref(false);

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024;
  if (!isMobile.value) sidebarOpen.value = false; // reset on desktop
};

const openSidebar = () => (sidebarOpen.value = true);
const closeSidebar = () => (sidebarOpen.value = false);

onMounted(() => window.addEventListener("resize", handleResize));
onUnmounted(() => window.removeEventListener("resize", handleResize));

/* STATIC MENU */
const menu = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/users", icon: Users },
  { label: "Menu", path: "/menu", icon: Menu },
  { label: "Roles", path: "/roles", icon: Key },
];

const notificationsCount = ref(3);

const userNavigation = [
  { name: "Profile", action: () => router.push("/profile") },
  { name: "Settings", action: () => router.push("/settings") },
];

const logout = () => auth.logout();
</script>
