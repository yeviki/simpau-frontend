<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Logo + Title -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
      <h2 class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
        <!-- Error Alert + Countdown -->
        <transition name="fade">
          <div v-if="error" class="mb-4 rounded-lg bg-red-50 border border-red-400 text-red-700 p-3 text-center animate-shake">
            <div class="font-medium">{{ error }}</div>

            <div v-if="countdown > 0" class="mt-2">
              <div class="flex justify-between mb-1 text-sm font-mono text-gray-700">
                <span>⏳ Waktu tersisa:</span>
                <span>{{ formatTime(countdown) }}</span>
              </div>
              <div class="w-full h-3 rounded-full overflow-hidden bg-gray-200 relative">
                <div
                  class="h-3 rounded-full absolute top-0 left-0 shimmer"
                  :style="{ width: progressBarWidth + '%', backgroundColor: progressBarColor }"
                ></div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Form -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-900">Username or Email address</label>
            <div class="mt-2">
              <input v-model="email" type="email" autocomplete="email" placeholder="Masukkan email" @keyup.enter="login"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                       outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400
                       focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-900">Password</label>
            <div class="mt-2 relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password"
                placeholder="Masukkan password" @keyup.enter="login"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900
                       outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400
                       focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" />
              <button type="button" @click="togglePassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
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

          <div>
            <button @click="login"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading Overlay -->
  <div v-if="loading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="text-white text-xl font-semibold animate-pulse">
      Loading...
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const showPassword = ref(false);

const blockedUntil = ref(null);
const countdown = ref(0);
const failCount = ref(0);
let countdownInterval = null;
let totalCountdown = ref(0);

const router = useRouter();
const auth = useAuthStore();

const togglePassword = () => showPassword.value = !showPassword.value;

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const progressBarWidth = computed(() => {
  if (!blockedUntil.value || countdown.value <= 0) return 0;
  return (countdown.value / totalCountdown.value) * 100;
});

const progressBarColor = computed(() => {
  if (!totalCountdown.value) return "#16a34a";
  const ratio = countdown.value / totalCountdown.value;
  if (ratio > 0.6) return "#16a34a";
  if (ratio > 0.3) return "#facc15";
  return "#dc2626";
});

const saveBlocked = (emailKey, blockedTime, fail) => {
  localStorage.setItem(`blockedUntil_${emailKey}`, blockedTime);
  localStorage.setItem(`failCount_${emailKey}`, fail);
};

const loadBlocked = (emailKey) => {
  const blocked = localStorage.getItem(`blockedUntil_${emailKey}`);
  const fail = localStorage.getItem(`failCount_${emailKey}`);
  return blocked ? { blocked, fail: parseInt(fail) } : null;
};

const removeBlocked = (emailKey) => {
  localStorage.removeItem(`blockedUntil_${emailKey}`);
  localStorage.removeItem(`failCount_${emailKey}`);
};

const startCountdown = (blockedTime, fail) => {
  blockedUntil.value = blockedTime;
  failCount.value = fail || failCount.value;
  totalCountdown.value = Math.floor((new Date(blockedUntil.value) - new Date()) / 1000);
  countdown.value = totalCountdown.value;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const remaining = Math.floor((new Date(blockedUntil.value) - new Date()) / 1000);
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      countdown.value = 0;
      blockedUntil.value = null;
      removeBlocked(email.value);

      // --- tampilkan pesan dan fade-out otomatis ---
      error.value = "Akun sudah terbuka, silakan login kembali";
      setTimeout(() => {
        error.value = "";
      }, 5000); // hilang setelah 5 detik
    } else {
      countdown.value = remaining;
    }
  }, 1000);
};


watch(email, (newEmail) => {
  clearInterval(countdownInterval);
  countdown.value = 0;
  blockedUntil.value = null;
  failCount.value = 0;
  error.value = ""; // reset pesan error saat ganti email

  if (!newEmail) return;

  const data = loadBlocked(newEmail);
  if (data) startCountdown(data.blocked, data.fail);
});

onMounted(() => {
  if (email.value) {
    const data = loadBlocked(email.value);
    if (data) startCountdown(data.blocked, data.fail);
  }
});

const login = async () => {
  const data = loadBlocked(email.value);
  if (data && countdown.value > 0) {
    error.value = `Akun sementara terkunci. Silakan tunggu ${formatTime(countdown.value)}`;
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const res = await auth.login({ email: email.value, password: password.value });
    removeBlocked(email.value);
    router.push("/dashboard");
  } catch (err) {
    if (err.response && err.response.data) {
      error.value = err.response.data.message || "Login gagal";

      if (err.response.data.blockedUntil) {
        startCountdown(err.response.data.blockedUntil, err.response.data.failCount);
        saveBlocked(email.value, err.response.data.blockedUntil, err.response.data.failCount);
      }
    } else {
      error.value = "Login gagal, silakan coba lagi!";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>


