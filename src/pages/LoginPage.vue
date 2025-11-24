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
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                       outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400
                       focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-900">Password</label>
            <div class="mt-2">
              <input
                v-model="password"
                type="password"
                autocomplete="current-password"
                placeholder="Masukkan password"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                       outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400
                       focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}
.animate-shake {
  animation: shake 0.25s ease;
}
</style>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

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

