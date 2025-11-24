<!-- DataTable.vue -->
<template>
  <div>

    <!-- SEARCH + PERPAGE -->
    <div v-if="searchable" class="mb-4 flex justify-between items-center">
      <!-- PERPAGE -->
      <select
        v-model.number="localPerPage"
        class="block w-15 rounded-full border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700
              focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20
              dark:bg-slate-900 dark:text-gray-200 dark:border-gray-700"
      >
        <option v-for="n in [5,10,25,50,100]" :key="n" :value="n">{{ n }}</option>
      </select>

      <!-- SEARCH -->
      <input
        v-model="localSearch"
        placeholder="Cari data..."
        class="block w-60 rounded-full bg-white px-3 py-1 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 dark:bg-slate-800 dark:text-gray-200 dark:outline-gray-600"
      />
    </div>

    <!-- TABLE -->
    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-slate-800">
          <tr>
            <th 
              scope="col" 
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-6">
              No
            </th>

            <th
              v-for="col in dataColumns"
              :key="col.key"
              scope="col"
              @click="col.key !== 'actions' && toggleSort(col.key)"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer select-none"
            >
              <span>{{ col.label }}</span>

              <!-- Sort Icon -->
              <span v-if="col.key === sortBy">
                {{ sortDir === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-slate-900">
          <tr 
            v-for="(row, index) in paginated" 
            :key="row.id"
            class="transition"
          >
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 dark:text-gray-100 sm:pl-6">
              {{ startIndex + index + 1 }}
            </td>

            <!-- Dynamic Columns -->
            <td
              v-for="col in dataColumns"
              :key="col.key"
              class="whitespace-nowrap px-3 py-4 text-sm text-gray-700 dark:text-gray-300"
            >
              <!-- Slot untuk actions -->
              <slot
                v-if="col.slot"
                :name="col.slot"
                :row="row"
              />

              <!-- Normal field -->
              <span v-else>
                {{ row[col.key] }}
              </span>
            </td>
          </tr>

          <tr v-if="filtered.length === 0">
            <td :colspan="dataColumns.length + 1" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              Tidak ada data ditemukan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div v-if="paginated.length" class="flex justify-between items-center mt-6">
      
      <!-- Info -->
      <div class="text-xs text-gray-600 dark:text-gray-300">Showing
        {{ paginated.length }} to {{ filtered.length }} data
      </div>

      <div class="flex items-center space-x-2">

        <!-- FIRST -->
        <button
          @click="goFirst"
          :disabled="page === 1"
          class="px-3 py-1.5 rounded-full text-xs disabled:opacity-30
                bg-white dark:bg-slate-800
                text-gray-700 dark:text-gray-200
                shadow-sm border border-gray-200 dark:border-slate-700
                hover:bg-blue-50 dark:hover:bg-slate-700
                hover:shadow-md active:scale-95
                transition-all"
        >
          «
        </button>

        <!-- PREV -->
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1.5 rounded-full text-xs disabled:opacity-30
                bg-white dark:bg-slate-800
                text-gray-700 dark:text-gray-200
                shadow-sm border border-gray-200 dark:border-slate-700
                hover:bg-blue-50 dark:hover:bg-slate-700
                hover:shadow-md active:scale-95
                transition-all"
        >
          ‹
        </button>

        <!-- NUMBER -->
        <template v-for="p in pagesToShow" :key="p">
          <button
            v-if="p !== '...'"
            @click="updatePage(p)"
            :class="[ 
              'px-4 py-1.5 rounded-full text-xs transition-all border shadow-sm active:scale-95',
              p === page
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:shadow-md'
            ]"
          >
            {{ p }}
          </button>

          <span
            v-else
            class="px-2 text-gray-500 dark:text-gray-400 select-none"
          >…</span>
        </template>

        <!-- NEXT -->
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-3 py-1.5 rounded-full text-xs disabled:opacity-30
                bg-white dark:bg-slate-800
                text-gray-700 dark:text-gray-200
                shadow-sm border border-gray-200 dark:border-slate-700
                hover:bg-blue-50 dark:hover:bg-slate-700
                hover:shadow-md active:scale-95
                transition-all"
        >
          ›
        </button>

        <!-- LAST -->
        <button
          @click="goLast"
          :disabled="page === totalPages"
          class="px-3 py-1.5 rounded-full text-xs disabled:opacity-30
                bg-white dark:bg-slate-800
                text-gray-700 dark:text-gray-200
                shadow-sm border border-gray-200 dark:border-slate-700
                hover:bg-blue-50 dark:hover:bg-slate-700
                hover:shadow-md active:scale-95
                transition-all"
        >
          »
        </button>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

/* PROPS */
const props = defineProps({
  rows: { type: Array, required: true },
  columns: { type: Array, required: true },
  searchable: Boolean,
  sortable: Boolean,
  paginated: Boolean,

  perPage: { type: Number, default: 5 },  // DEFAULT 5

  /* v-model */
  search: String,
  page: Number,
  sortBy: String,
  sortDir: String,
});

/* EMIT */
const emit = defineEmits([
  "update:search",
  "update:page",
  "update:sortBy",
  "update:sortDir",
  "update:perPage",
]);

/* LOCAL STATES */
const localSearch = ref(props.search ?? "");
const localPage = ref(props.page ?? 1);

/* PER PAGE (PAKAI LOCAL, BUKAN props LANGSUNG) */
const localPerPage = ref(props.perPage);

/* SYNC TO PARENT */
watch(localSearch, (v) => emit("update:search", v));
watch(localPage, (v) => emit("update:page", v));

watch(localPerPage, (v) => {
  emit("update:perPage", v);
  emit("update:page", 1); // reset page
});

/* COLUMNS */
const dataColumns = computed(() => props.columns);

/* SEARCH */
const filtered = computed(() => {
  if (!localSearch.value) return props.rows;

  return props.rows.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(localSearch.value.toLowerCase())
  );
});

/* SORT */
const toggleSort = (key) => {
  if (!props.sortable) return;

  const newDir =
    props.sortBy === key
      ? props.sortDir === "asc"
        ? "desc"
        : "asc"
      : "asc";

  emit("update:sortBy", key);
  emit("update:sortDir", newDir);
};

const sorted = computed(() => {
  if (!props.sortable || !props.sortBy) return filtered.value;

  return [...filtered.value].sort((a, b) => {
    let x = a[props.sortBy];
    let y = b[props.sortBy];

    if (typeof x === "string") x = x.toLowerCase();
    if (typeof y === "string") y = y.toLowerCase();

    if (x < y) return props.sortDir === "asc" ? -1 : 1;
    if (x > y) return props.sortDir === "asc" ? 1 : -1;
    return 0;
  });
});

/* PAGINATION — FIXED TO USE localPerPage */
const totalPages = computed(() =>
  Math.ceil(sorted.value.length / localPerPage.value)
);

const paginated = computed(() => {
  if (!props.paginated) return sorted.value;

  const start = (props.page - 1) * localPerPage.value;
  return sorted.value.slice(start, start + localPerPage.value);
});

const startIndex = computed(() =>
  (props.page - 1) * localPerPage.value
);

const nextPage = () => {
  if (props.page < totalPages.value) emit("update:page", props.page + 1);
};

const prevPage = () => {
  if (props.page > 1) emit("update:page", props.page - 1);
};

const goFirst = () => emit("update:page", 1);
const goLast = () => emit("update:page", totalPages.value);

const updatePage = (p) => emit("update:page", p);

/* PAGES TO SHOW */
const pagesToShow = computed(() => {
  const total = totalPages.value;
  const current = props.page;

  if (total <= 5) return [...Array(total)].map((_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];

  return [1, "...", current - 1, current, current + 1, "...", total];
});
</script>
