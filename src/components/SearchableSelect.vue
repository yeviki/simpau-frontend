<!-- components/SearchableSelect.vue -->
<template>
  <div class="relative">
    <!-- Label -->
    <label v-if="label" class="text-sm text-gray-200 mb-1 block">
      {{ label }}
    </label>

    <!-- Input untuk search / display value -->
    <input
      type="text"
      v-model="search"
      @focus="open = true"
      @click="open = true"
      :placeholder="placeholder"
      class="w-full px-3 py-2 rounded-md bg-white text-black border border-gray-300"
      readonly
    />

    <!-- Dropdown -->
    <ul
      v-if="open"
      class="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md max-h-52 overflow-auto shadow-lg"
    >
      <li
        v-for="item in filteredOptions"
        :key="item[valueField]"
        @click="select(item)"
        class="px-3 py-2 cursor-pointer hover:bg-indigo-600 hover:text-white"
      >
        {{ item[labelField] }}
      </li>

      <li
        v-if="filteredOptions.length === 0"
        class="px-3 py-2 text-gray-400 text-sm"
      >
        Tidak ada data
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import api from "../api/axios";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: { type: String, default: "-- Pilih --" },
  items: { type: Array, default: () => [] },
  url: String,
  labelField: { type: String, default: "status_name" },
  valueField: { type: String, default: "id_status" },
});

const emit = defineEmits(["update:modelValue"]);

const options = ref([]);
const search = ref("");
const open = ref(false);

// Load data
const load = async () => {
  if (props.url) {
    try {
      const res = await api.get(props.url);
      options.value = res.data;
    } catch (error) {
      console.error("Dropdown load error:", error);
    }
  } else {
    options.value = props.items;
  }
};

onMounted(load);

// Filter options berdasarkan search
const filteredOptions = computed(() => {
  if (!search.value) return options.value;
  return options.value.filter((item) =>
    item[props.labelField]
      .toString()
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});

// Pilih item
const select = (item) => {
  search.value = item[props.labelField];
  emit("update:modelValue", item[props.valueField]);
  open.value = false;
};

// Autofill jika modelValue berubah
watch(
  () => props.modelValue,
  (val) => {
    const found = options.value.find((i) => i[props.valueField] == val);
    if (found) search.value = found[props.labelField];
  },
  { immediate: true }
);

// Tutup dropdown jika klik di luar
document.addEventListener("click", (e) => {
  if (!e.target.closest(".relative")) open.value = false;
});
</script>
