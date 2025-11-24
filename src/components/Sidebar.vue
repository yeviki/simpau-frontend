<!-- components/sidebar.vue -->
<template>
  <aside
    :class="[
      'h-screen relative bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out shadow-sm shadow-gray-300/20 dark:shadow-black/20 border-r border-gray-200/50 dark:border-gray-700/50',
      collapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- HEADER -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200/50 dark:border-gray-700/50">
      <div class="flex items-center space-x-2">
        <img
          v-if="!collapsed"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          class="h-8"
        />
        <span v-if="!collapsed" class="font-bold text-lg text-slate-900 dark:text-slate-100">
          Admin Panel
        </span>
      </div>

      <button
        class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        @click="$emit('toggleCollapse')"
      >
        <Bars3Icon class="w-6 h-6 text-slate-700 dark:text-slate-200" />
      </button>
    </div>

    <!-- MENU -->
    <nav class="mt-4 space-y-1 px-2">
      <div
        v-for="m in menu"
        :key="m.path"
        @click="go(m.path)"
        :class="[
          'flex items-center px-3 py-2 cursor-pointer rounded-lg transition-all',
          isActive(m.path)
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        ]"
      >
        <component :is="m.icon" class="w-5 h-5" />
        <transition name="fade">
          <span v-if="!collapsed" class="ml-3">{{ m.label }}</span>
        </transition>
      </div>
    </nav>

    <!-- TOGGLE THEME -->
    <!-- <div class="absolute bottom-5 left-0 right-0 flex justify-center">
      <button
        @click="$emit('toggleTheme')"
        :class="[
          'flex items-center justify-center rounded transition-all duration-300',
          collapsed
            ? 'w-10 h-10 bg-slate-300 dark:bg-slate-700'
            : 'px-4 py-2 bg-slate-300 dark:bg-slate-700'
        ]"
      >
        <transition name="rotate-fade" mode="out-in">
          <span :key="theme" class="text-xl">
            <span v-if="theme === 'light'">🌞</span>
            <span v-else>🌙</span>
          </span>
        </transition>

        <transition name="fade">
          <span v-if="!collapsed" class="ml-2 text-slate-900 dark:text-slate-100">
            {{ theme === 'light' ? 'Light Mode' : 'Dark Mode' }}
          </span>
        </transition>
      </button>
    </div> -->
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();

const props = defineProps({
  collapsed: Boolean,
  theme: String,
  menu: Array,
});

const router = useRouter();
const route = useRoute();

const go = (path) => router.push(path);
const isActive = (p) => route.path.startsWith(p);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.rotate-fade-enter-active,
.rotate-fade-leave-active {
  transition: all 0.25s ease;
}
.rotate-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg);
}
.rotate-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}
</style>
