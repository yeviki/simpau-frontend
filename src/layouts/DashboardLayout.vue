<!-- layouts/DasboardLayout.vue -->

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
      <Topbar
        :theme="theme"
        :user="user"
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

// Icons (lucide)
import { Users, LayoutDashboard } from "lucide-vue-next";

const router = useRouter();
const theme = ref(localStorage.getItem("theme") || "dark");
const collapsed = ref(false);

const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme.value);
};
const toggleCollapse = () => { collapsed.value = !collapsed.value; };

const user = ref({
  name: "Tom Cook",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
});
const notificationsCount = ref(3);
const userNavigation = [
  { name: "Profile", action: () => router.push("/profile") },
  { name: "Settings", action: () => router.push("/settings") },
];

const menu = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/users", icon: Users },
];

const themeClass = computed(() =>
  theme.value === "dark"
    ? "bg-slate-900 text-gray-100"
    : "bg-gray-50 text-gray-800"
);

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>
