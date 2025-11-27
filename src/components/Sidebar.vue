<!-- components/Sidebar.vue -->
<template>
  <aside
    :class="[
      'h-screen overflow-y-auto transition-all duration-300 ease-in-out select-none shadow-sm border-r',

      collapsed ? 'w-20' : 'w-64',

      theme === 'dark'
        ? 'bg-slate-900 border-gray-700/50'
        : 'bg-white border-gray-200/60'
    ]"
  >
    <!-- HEADER -->
    <div
      :class="[
        'flex items-center justify-between h-16 px-4 border-b backdrop-blur-sm',
        theme === 'dark'
          ? 'bg-slate-900/80 border-gray-700/50'
          : 'bg-white/80 border-gray-200/60'
      ]"
    >
      <div class="flex items-center space-x-2">
        <img
          v-if="!collapsed"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          class="h-8"
        />

        <span
          v-if="!collapsed"
          :class="[
            'font-semibold text-lg',
            theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
          ]"
        >
          Admin Panel
        </span>
      </div>

      <button
        @click="$emit('toggleCollapse')"
        :class="[
          'p-2 rounded-lg transition',
          theme === 'dark'
            ? 'hover:bg-slate-700/60 text-gray-200'
            : 'hover:bg-gray-200/80 text-gray-700'
        ]"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>
    </div>

    <!-- MENU -->
    <nav class="mt-4 space-y-1 px-2">
      <div
        v-for="m in menu"
        :key="m.path"
        @click="go(m.path); $emit('closeMobile')"
        :class="[
          'flex items-center px-3 py-2 cursor-pointer rounded-lg transition-all',
          
          isActive(m.path)
            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
            : theme === 'dark'
              ? 'text-gray-300 hover:bg-slate-700/70'
              : 'text-gray-700 hover:bg-gray-200/70'
        ]"
      >
        <component
          :is="m.icon"
          :class="[
            'w-5 h-5 transition-colors',
            isActive(m.path)
              ? 'text-white'
              : theme === 'dark'
                  ? 'text-gray-300'
                  : 'text-gray-700'
          ]"
        />

        <transition name="fade">
          <span v-if="!collapsed" class="ml-3 text-sm font-medium">
            {{ m.label }}
          </span>
        </transition>
      </div>
    </nav>

    <!-- TOGGLE THEME -->
    <div class="absolute bottom-5 left-0 right-0 flex justify-center">
      <button
        @click="$emit('toggleTheme')"
        :class="[
          'flex items-center justify-center rounded-lg transition-all duration-300 shadow-sm',

          theme === 'dark'
            ? 'text-gray-100 bg-slate-700'
            : 'text-gray-900 bg-gray-200',

          collapsed ? 'w-11 h-11' : 'px-4 py-2'
        ]"
      >
        <transition name="rotate-fade" mode="out-in">
          <span :key="theme" class="text-xl">
            <span v-if="theme === 'light'">🌞</span>
            <span v-else>🌙</span>
          </span>
        </transition>

        <transition name="fade">
          <span
            v-if="!collapsed"
            class="ml-2 text-sm"
            :class="theme === 'dark' ? 'text-gray-100' : 'text-gray-900'"
          >
            {{ theme === 'light' ? 'Light Mode' : 'Dark Mode' }}
          </span>
        </transition>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { Bars3Icon } from '@heroicons/vue/24/outline';

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
