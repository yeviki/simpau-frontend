<template>
  <header
    class="h-16 flex items-center justify-between px-6 transition-colors duration-300 border-b shadow-sm"
    :class="themeClass"
  >
    <!-- Left: Page Title -->
    <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
      {{ title }} <p class="text-xs text-indigo-500">{{ user.role }}</p>
    </h1>

    <!-- Right Section -->
    <div class="flex items-center space-x-4">

      <!-- Profile Dropdown -->
      <Menu as="div" class="relative">
        <MenuButton
          class="flex items-center space-x-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 p-1"
        >

          <!-- Avatar -->
          <img
            :src="computedAvatar"
            alt="avatar"
            class="w-9 h-9 rounded-full border dark:border-gray-600"
          />

          <!-- Name + Email -->
          <div class="hidden md:flex flex-col text-left leading-tight">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ user?.name }}
            </span>
            <span class="text-xs text-gray-600 dark:text-gray-300">
              {{ user?.email }}
            </span>
          </div>

          <ChevronDownIcon class="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </MenuButton>

        <!-- Dropdown -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="absolute right-0 mt-2 w-44 origin-top-right rounded-md 
                   bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-black/10 
                   focus:outline-none z-50"
          >
            <MenuItem
              v-for="item in userNavigation"
              :key="item.name"
              v-slot="{ active }"
            >
              <button
                @click="item.action && item.action()"
                :class="[
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                ]"
              >
                {{ item.name }}
              </button>
            </MenuItem>

            <MenuItem v-slot="{ active }">
              <button
                @click="$emit('logout')"
                :class="[
                  active ? 'bg-gray-100 dark:bg-gray-700' : '',
                  'w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400'
                ]"
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
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

/* PROPS DARI LAYOUT */
const props = defineProps({
  user: { type: Object, default: () => ({}) },
  notificationsCount: Number,
  userNavigation: Array,
  theme: { type: String, default: "dark" },
});

/* DEFAULT AVATAR */
const computedAvatar = computed(() => {
  if (!props.user?.name) return "https://ui-avatars.com/api/?name=User";

  return (
    "https://ui-avatars.com/api/?background=4f46e5&color=fff&name=" +
    encodeURIComponent(props.user.name)
  );
});

const route = useRoute();

const title = computed(() => route.meta.title || "Dashboard");

const themeClass = computed(() =>
  props.theme === "dark"
    ? "bg-slate-900 text-gray-100 border-gray-700/30"
    : "bg-white text-gray-800 border-gray-300/30"
);
</script>
