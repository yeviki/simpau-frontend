<!-- pages/LoginPage.vue -->
<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">

    <!-- Logo + Title -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
      <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">

      <!-- Card Login -->
      <div class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">

        <!-- Error Alert -->
        <transition name="fade">
          <div
            v-if="error"
            class="mb-4 rounded-lg bg-red-500/20 border border-red-400 text-red-600 p-3 text-center animate-shake"
          >
            {{ error }}
          </div>
        </transition>

        <!-- Form -->
        <div class="space-y-6">

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-900">Email address</label>
            <div class="mt-2">
              <input
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="Masukkan email"
                @keyup.enter="login"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                       outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400
                       focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-900">Password</label>
            <div class="mt-2 relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Masukkan password"
                @keyup.enter="login"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                       outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400
                       focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />

              <!-- TOGGLE EYE -->
              <button
                type="button"
                @click="togglePassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M2.458 12C3.732 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
                  <circle cx="12" cy="12" r="3" stroke-width="1.5" />
                </svg>

                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 3l18 18M10.477 10.44A3 3 0 0113.5 12m4.905 1.447C17.67 16.478 15 19 12 19c-4.478 0-8.268-2.943-9.542-7a11.95 11.95 0 012.676-4.35m3.11-2.229A11.95 11.95 0 0112 5c4.478 0 8.268 2.943 9.542 7a11.93 11.93 0 01-1.38 2.78" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit -->
          <div>
            <button
              @click="login"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- LOADING OVERLAY -->
  <div
    v-if="loading"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div class="text-white text-xl font-semibold animate-pulse">
      Loading...
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

// 👇 tambahan baru
const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
// 👆 tidak mengubah logika login

const auth = useAuthStore();
const router = useRouter();

const login = async () => {
  loading.value = true;
  error.value = "";

  try {
    await auth.login({
      email: email.value,
      password: password.value,
    });

    router.push("/dashboard");
  } catch (err) {
    error.value = "Email atau password salah!";
  } finally {
    loading.value = false;
  }
};
</script>
