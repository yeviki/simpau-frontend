<template>
  <aside
    :class="[
      'h-screen relative border-r dark:border-slate-700 transition-all duration-300 ease-in-out',
      collapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Header -->
    <div class="p-4 flex items-center justify-between">
      <span class="font-bold text-xl" v-if="!collapsed">Admin Panel</span>

      <button
        class="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        @click="$emit('toggleCollapse')"
      >
        ☰
      </button>
    </div>

    <!-- Menu -->
    <nav class="mt-4 space-y-1">
      <div
        v-for="m in menu"
        :key="m.path"
        @click="go(m.path)"
        :class="[
          'flex items-center px-4 py-2 cursor-pointer rounded-lg transition-all',
          isActive(m.path)
            ? 'bg-blue-600 text-white'
            : 'hover:bg-slate-200 dark:hover:bg-slate-700'
        ]"
      >
        <component :is="m.icon" class="w-5 h-5" />

        <transition name="fade">
          <span class="ml-3" v-if="!collapsed">{{ m.label }}</span>
        </transition>
      </div>
    </nav>

    <!-- Toggle Theme -->
    <div class="absolute bottom-5 left-0 right-0 flex justify-center">
      <button
        @click="$emit('toggleTheme')"
        :class="[
          'flex items-center justify-center rounded transition-all duration-300',
          collapsed
            ? 'w-10 h-10 bg-slate-300 dark:bg-slate-700'
            : 'px-4 py-2 bg-slate-300 dark:bg-slate-700'
        ]"
      >
        <!-- ICON with rotation -->
        <transition name="rotate-fade" mode="out-in">
          <span :key="theme" class="text-xl">
            <span v-if="theme === 'light'">🌞</span>
            <span v-else>🌙</span>
          </span>
        </transition>

        <!-- TEXT -->
        <transition name="fade">
          <span v-if="!collapsed" class="ml-2">
            {{ theme === 'light' ? "Light Mode" : "Dark Mode" }}
          </span>
        </transition>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

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
  transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.rotate-fade-enter-active {
  transition: all .25s ease;
}

.rotate-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg);
}

.rotate-fade-leave-active {
  transition: all .25s ease;
}

.rotate-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg);
}
</style>
