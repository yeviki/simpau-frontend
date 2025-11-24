<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold">Menu</h1>

      <button
        @click="openAddMenu()"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
      >
        Tambah Menu
      </button>
    </div>

    <!-- SEARCH + CONTROLS -->
    <div class="flex items-center mb-4 space-x-2">
      <input
        v-model="query.search"
        placeholder="Cari..."
        class="block rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
      />
      <select v-model="sortBy" class="rounded-md px-2 py-1 border">
        <option value="id_menu">ID</option>
        <option value="title_menu">Title</option>
        <option value="order_menu">Order</option>
      </select>
      <select v-model="sortDir" class="rounded-md px-2 py-1 border">
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>

      <select v-model.number="perPage" class="rounded-md px-2 py-1 border ml-auto">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
      </select>
    </div>

    <!-- CUSTOM NESTED TABLE -->
    <div class="overflow-x-auto bg-white rounded-md shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left">#</th>
            <th class="px-4 py-2 text-left">Title Menu</th>
            <th class="px-4 py-2 text-left">Url Menu</th>
            <th class="px-4 py-2 text-left">Icon</th>
            <th class="px-4 py-2 text-left">Order</th>
            <th class="px-4 py-2 text-left">Parent</th>
            <th class="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <template v-for="(parent, idx) in paginatedParents" :key="parent.id_menu">
            <!-- parent row -->
            <tr class="bg-gray-100">
              <td class="px-4 py-2">{{ parentIndex(idx) }}</td>
              <td class="px-4 py-2 font-semibold">{{ parent.title_menu }}</td>
              <td class="px-4 py-2">{{ parent.url_menu }}</td>
              <td class="px-4 py-2">{{ parent.icon_menu }}</td>
              <td class="px-4 py-2">{{ parent.order_menu }}</td>
              <td class="px-4 py-2">—</td>
              <td class="px-4 py-2">
                <button @click="openEdit(parent)" class="rounded-sm bg-indigo-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500">Edit</button>
                <button @click="openAddSub(parent)" class="rounded-sm bg-green-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-green-500">Tambah Sub</button>
                <button @click="confirmDelete(parent.id_menu)" class="rounded-sm bg-red-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-red-500">Hapus</button>
              </td>
            </tr>

            <!-- children rows -->
            <tr v-for="child in childrenOf(parent.id_menu)" :key="child.id_menu" class="bg-white">
              <td class="px-4 py-2"></td>
              <td class="px-4 py-2 pl-8">↳ {{ child.title_menu }}</td>
              <td class="px-4 py-2">{{ child.url_menu }}</td>
              <td class="px-4 py-2">{{ child.icon_menu }}</td>
              <td class="px-4 py-2">{{ child.order_menu }}</td>
              <td class="px-4 py-2">{{ parent.title_menu }}</td>
              <td class="px-4 py-2">
                <button @click="openEdit(child)" class="rounded-sm bg-indigo-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500">Edit</button>
                <button @click="openAddSub(child)" class="rounded-sm bg-green-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-green-500">Tambah Sub</button>
                <button @click="confirmDelete(child.id_menu)" class="rounded-sm bg-red-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-red-500">Hapus</button>
              </td>
            </tr>
          </template>

          <!-- kosong -->
          <tr v-if="filteredParents.length === 0">
            <td colspan="7" class="px-4 py-4 text-center text-gray-500">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- PAGINATION -->
    <div class="flex justify-between items-center mt-3">
      <div class="text-sm text-gray-600">Menampilkan {{ startItem }} - {{ endItem }} dari {{ totalParentCount }} parent</div>

      <div class="space-x-2">
        <button :disabled="pagination.page === 1" @click="pagination.page--" class="px-2 py-1 border rounded">Prev</button>
        <button :disabled="pagination.page >= totalPages" @click="pagination.page++" class="px-2 py-1 border rounded">Next</button>
      </div>
    </div>

    <!-- MODAL -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>{{ isEdit ? "Edit Menu" : "Tambah Menu" }}</template>

      <div class="space-y-4">
        <!-- parent_id -->
        <div>
          <label class="text-sm text-gray-200">Parent Menu (kosong = parent utama)</label>
          <select v-model="form.parent_id" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300">
            <option value="">— Tidak ada —</option>
            <option v-for="p in parentOptions" :key="p.id_menu" :value="p.id_menu">{{ p.title_menu }}</option>
          </select>
          <p v-if="errors.parent_id" class="text-red-500 text-xs mt-1">{{ errors.parent_id }}</p>
        </div>

        <!-- title_menu -->
        <div>
          <label class="text-sm text-gray-200">Title Menu</label>
          <input v-model="form.title_menu" placeholder="Masukkan title menu" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300" />
          <p v-if="errors.title_menu" class="text-red-500 text-xs mt-1">{{ errors.title_menu }}</p>
        </div>

        <!-- url_menu -->
        <div>
          <label class="text-sm text-gray-200">Url Menu</label>
          <input v-model="form.url_menu" placeholder="Masukkan url menu" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300" />
          <p v-if="errors.url_menu" class="text-red-500 text-xs mt-1">{{ errors.url_menu }}</p>
        </div>

        <!-- icon_menu -->
        <div>
          <label class="text-sm text-gray-200">Icon Menu</label>
          <input v-model="form.icon_menu" placeholder="Masukkan icon menu" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300" />
          <p v-if="errors.icon_menu" class="text-red-500 text-xs mt-1">{{ errors.icon_menu }}</p>
        </div>

        <!-- order_menu -->
        <div>
          <label class="text-sm text-gray-200">Order Menu</label>
          <input v-model="form.order_menu" placeholder="Masukkan order menu" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300" />
          <p v-if="errors.order_menu" class="text-red-500 text-xs mt-1">{{ errors.order_menu }}</p>
        </div>
      </div>

      <template #footer>
        <button @click="saveMenu" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow">Simpan</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";
import { useCrud } from "../composables/useCrud";

// --- USE CRUD khusus menu, pakai idField 'id_menu' ---
const {
  items,
  form,
  errors,
  showModal,
  isEdit,
  pagination,
  query,
  openAdd: crudOpenAdd,
  openEdit: crudOpenEdit,
  save,
  remove,
  load,
  resetForm,
} = useCrud("/menu", {
  idField: "id_menu",
  defaultForm: {
    id_menu: null,
    parent_id: "",
    title_menu: "",
    url_menu: "",
    icon_menu: "",
    order_menu: "",
  },
  rules: {
    title_menu: ["required"],
    url_menu: ["required"],
    icon_menu: ["required"],
    order_menu: ["required"],
  },
  afterSave: () => {
    Swal.fire({ icon: "success", title: "Berhasil!", timer: 1500, showConfirmButton: false });
  },
  beforeDelete: async (id) => {
    const result = await Swal.fire({
      title: "Hapus Menu?",
      text: "Data yang sudah dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });
    return result.isConfirmed;
  },
  afterDelete: () => {
    Swal.fire({ icon: "success", title: "Menu berhasil dihapus", timer: 1500, showConfirmButton: false });
  },
});

// --- SORT & PAGINATION ---
const sortBy = ref("id_menu");
const sortDir = ref("asc");
const perPage = ref(5);

onMounted(load);

const closeModal = () => {
  resetForm();
  showModal.value = false;
};

const confirmDelete = (id) => remove(id);

const parentOptions = computed(() => items.value.filter(i => !i.parent_id || i.parent_id === 0 || i.parent_id === ""));
const parents = computed(() => parentOptions.value);
const childrenOf = (parentId) => items.value.filter(i => String(i.parent_id) === String(parentId)).sort((a,b) => a.order_menu - b.order_menu);

// SEARCH + SORT + PAGINATION CLIENT-SIDE
const filteredParents = computed(() => {
  const s = (query.search || "").toString().toLowerCase().trim();
  let arr = parents.value.slice();
  if (s) arr = arr.filter(p => {
    const inParent = (p.title_menu || "").toLowerCase().includes(s) || (p.url_menu || "").toLowerCase().includes(s);
    const hasChild = items.value.some(c => String(c.parent_id) === String(p.id_menu) && ((c.title_menu||"").toLowerCase().includes(s) || (c.url_menu||"").toLowerCase().includes(s)));
    return inParent || hasChild;
  });
  arr.sort((a,b) => {
    const key = sortBy.value || "id_menu";
    const A = (a[key] ?? "").toString().toLowerCase();
    const B = (b[key] ?? "").toString().toLowerCase();
    return sortDir.value === "asc" ? (A>B?1:A<B?-1:0) : (A<B?1:A>B?-1:0);
  });
  return arr;
});

const totalParentCount = computed(() => filteredParents.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(filteredParents.value.length / perPage.value)));
if (!pagination.page) pagination.page = 1;
const paginatedParents = computed(() => {
  if (pagination.page > totalPages.value) pagination.page = totalPages.value;
  const start = (pagination.page-1)*perPage.value;
  return filteredParents.value.slice(start, start+perPage.value);
});
const startItem = computed(() => totalParentCount.value === 0 ? 0 : (pagination.page-1)*perPage.value+1);
const endItem = computed(() => Math.min(pagination.page*perPage.value, totalParentCount.value));
const parentIndex = (idx) => (pagination.page-1)*perPage.value + idx + 1;

// --- OPEN ADD ---
const openAddMenu = () => {
  resetForm();
  form.parent_id = "";
  isEdit.value = false;
  showModal.value = true;
};

// --- OPEN ADD SUB MENU ---
const openAddSub = (row) => {
  resetForm();
  form.parent_id = row.id_menu;
  isEdit.value = false;
  showModal.value = true;
};

// --- OPEN EDIT ---
const openEdit = (row) => {
    // pastikan parent_id kosong menjadi string ""
  const rowCopy = { ...row, parent_id: row.parent_id || "" };
  crudOpenEdit(rowCopy);// pakai composable
};

// --- SAVE MENU ---
const saveMenu = async () => {
  await save(); // pakai useCrud save
};
</script>

<style scoped>
.pl-8 { padding-left: 2rem; }
</style>
