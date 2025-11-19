<template>
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50
           transition-opacity animate-fadeIn"
  >
    <div
      class="relative w-96 rounded-2xl shadow-xl border border-white/10
             bg-white/15 backdrop-blur-xl p-6 animate-scaleIn"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-white/80 hover:text-white transition p-1"
      >
        ✕
      </button>

      <!-- Title Slot -->
      <h2 class="text-2xl font-semibold text-white mb-5">
        <slot name="title" />
      </h2>

      <!-- Body Slot -->
      <div class="space-y-4 text-gray-100">
        <slot />
      </div>

      <!-- Footer Slot -->
      <div class="mt-6 pt-4 border-t border-white/10 text-right">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0 }
  to   { opacity: 1 }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}

@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-scaleIn {
  animation: scaleIn 0.25s ease-out;
}
</style>
