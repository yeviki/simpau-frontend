<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">

    <!-- Card -->
    <div class="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">
      <h2 class="text-4xl font-bold text-center text-white mb-8 tracking-wide">
        Login
      </h2>

      <!-- Alert gagal login -->
      <transition name="fade">
        <div
          v-if="error"
          class="mb-4 rounded-lg bg-red-500/20 border border-red-400 text-red-200 p-3 text-center animate-shake"
        >
          {{ error }}
        </div>
      </transition>

      <!-- Input Fields -->
      <div class="space-y-6">

        <div>
          <label class="text-gray-200 text-sm">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Masukkan email"
            class="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
          />
        </div>

        <div>
          <label class="text-gray-200 text-sm">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Masukkan password"
            class="w-full mt-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-300
                   focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
          />
        </div>

        <!-- Button -->
        <button
          @click="login"
          class="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold
                 transition duration-300 shadow-lg hover:shadow-blue-900/50"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth fade alert */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Small shake animation for error alert */
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
import api from "../api/axios.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();

const login = async () => {
  try {
    const res = await api.post("/auth/login", {
      email: email.value,
      password: password.value
    });

    localStorage.setItem("token", res.data.token);

    // gunakan SPA navigation
    router.push("/dashboard");

  } catch (err) {
    error.value = "Email atau password salah!";
  }
};
</script>

