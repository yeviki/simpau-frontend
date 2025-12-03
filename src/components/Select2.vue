<!-- components/Select2.vue -->
<template>
  <div>
    <!-- Label -->
    <label v-if="label" class="text-sm text-gray-200 mb-1 block">
      {{ label }}
    </label>

    <!-- Native Select -->
    <select
      class="w-full px-3 py-2 rounded-lg bg-white text-black border border-gray-300"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ placeholder }}</option>

      <option
        v-for="item in options"
        :key="item[valueField]"
        :value="item[valueField]"
      >
        {{ item[labelField] }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

// Props
const props = defineProps({
  modelValue: [String, Number],

  label: {
    type: String,
    default: "",
  },

  placeholder: {
    type: String,
    default: "-- Pilih --",
  },

  url: {
    type: String,
    default: null,
  },

  items: {
    type: Array,
    default: () => [],
  },

  labelField: {
    type: String,
    default: "name",
  },

  valueField: {
    type: String,
    default: "id",
  },
});

const options = ref([]);

// Load data dari API atau static items
const load = async () => {
  try {
    if (props.url) {
      const res = await api.get(props.url);
      options.value = res.data;
    } else {
      options.value = props.items;
    }
  } catch (error) {
    console.error("Dropdown Load Error:", error);
  }
};

onMounted(load);
</script>
