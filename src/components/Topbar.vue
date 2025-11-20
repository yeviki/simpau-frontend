<template>
  <header
    class="h-16 flex items-center justify-between px-6 transition-colors duration-300 border-b shadow-sm"
    :class="themeClass"
  >
    <!-- Left: Breadcrumb + Title -->
    <div class="flex items-center space-x-4">
      <!-- <nav class="text-sm text-gray-500 dark:text-gray-300" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1">
          <li v-for="(crumb, index) in breadcrumbs" :key="index" class="inline-flex items-center">
            <span v-if="index > 0" class="mx-1">/</span>
            <router-link :to="crumb.href" class="hover:text-gray-700 dark:hover:text-white">
              {{ crumb.label }}
            </router-link>
          </li>
        </ol>
      </nav> -->
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h1>
    </div>

    <!-- Right: Search + Notifications + Profile -->
    <div class="flex items-center space-x-4">
      <!-- Search -->
      <!-- <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="onSearch"
          placeholder="Search..."
          class="pl-8 pr-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <MagnifyingGlassIcon class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div> -->

      <!-- Notifications -->
      <!-- <button class="relative p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
        <span class="sr-only">View notifications</span>
        <BellIcon class="w-6 h-6 text-gray-600 dark:text-gray-300" />
        <span v-if="notificationsCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {{ notificationsCount }}
        </span>
      </button> -->

      <!-- Profile Dropdown -->
      <Menu as="div" class="relative">
        <MenuButton class="flex items-center space-x-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 p-1">
          <img :src="user.avatar" alt="User avatar" class="w-8 h-8 rounded-full" />
          <span class="hidden md:block text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</span>
          <ChevronDownIcon class="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </MenuButton>
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems class="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
              <button
                @click="item.action && item.action()"
                :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200']"
              >
                {{ item.name }}
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                @click="$emit('logout')"
                :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400']"
              >
                Logout
              </button>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { BellIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  user: { type: Object, default: () => ({ name: "Tom Cook", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }) },
  notificationsCount: { type: Number, default: 0 },
  userNavigation: { type: Array, default: () => [{ name: "Your profile", action: null }] },
  theme: { type: String, default: "dark" },
});

const searchQuery = ref("");
const route = useRoute();
const router = useRouter();

const title = computed(() => route.meta.title || "Dashboard");
const breadcrumbs = computed(() => route.meta.breadcrumb || [{ label: "Home", href: "/" }]);

const onSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: route.path, query: { ...route.query, search: searchQuery.value } });
  }
};

const themeClass = computed(() =>
  props.theme === 'dark'
    ? "bg-slate-900 text-gray-100 border-gray-700/30"
    : "bg-white text-gray-800 border-gray-300/30"
);
</script>
