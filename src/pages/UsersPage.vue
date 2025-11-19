<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold">Users</h1>

      <button
        @click="openAdd"
        class="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Tambah User
      </button>
    </div>

    <!-- Search -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="search"
        placeholder="Cari username/email..."
        class="p-2 border rounded w-60"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden shadow rounded bg-white">
      <table class="w-full">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th @click="sort('id')" class="p-3 cursor-pointer">
              ID
              <span v-if="sortBy === 'id'">
                {{ sortDir === 'asc' ? '▲' : '▼' }}
              </span>
            </th>

            <th @click="sort('username')" class="p-3 cursor-pointer">
              Username
              <span v-if="sortBy === 'username'">
                {{ sortDir === 'asc' ? '▲' : '▼' }}
              </span>
            </th>

            <th @click="sort('email')" class="p-3 cursor-pointer">
              Email
              <span v-if="sortBy === 'email'">
                {{ sortDir === 'asc' ? '▲' : '▼' }}
              </span>
            </th>

            <th @click="sort('role')" class="p-3 cursor-pointer">
              Role
              <span v-if="sortBy === 'role'">
                {{ sortDir === 'asc' ? '▲' : '▼' }}
              </span>
            </th>

            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="u in paginated"
            :key="u.id"
            :class="[
              'border-b transition',
              u.id === highlightId ? 'bg-green-100' : ''
            ]"
          >
            <td class="p-3">{{ u.id }}</td>
            <td class="p-3">{{ u.username }}</td>
            <td class="p-3">{{ u.email }}</td>
            <td class="p-3">{{ u.role }}</td>

            <td class="p-3 text-center space-x-3">
              <button @click="openEdit(u)" class="px-2 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600 
                      shadow-sm transition active:scale-95">
                Edit
              </button>

              <button
                @click="remove(u.id)"
                class="px-2 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600 
                      shadow-sm transition active:scale-95">
                Hapus
              </button>
            </td>
          </tr>

          <tr v-if="filtered.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500">
              Tidak ada data ditemukan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <div>
        Menampilkan {{ paginated.length }} dari {{ filtered.length }} data.
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span>Halaman {{ page }} / {{ totalPages }}</span>

        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="showModal" @close="showModal = false">
      <template #title>
        {{ isEdit ? "Edit User" : "Tambah User" }}
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-200">Username</label>
          <input
            v-model="form.username"
            placeholder="Masukkan username"
            class="w-full px-3 py-2 rounded-lg bg-white/20 text-white
                  placeholder-white/60 border border-white/20 focus:border-blue-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
          />
        </div>

        <div>
          <label class="text-sm text-gray-200">Email</label>
          <input
            v-model="form.email"
            placeholder="Masukkan email"
            class="w-full px-3 py-2 rounded-lg bg-white/20 text-white
                  placeholder-white/60 border border-white/20 focus:border-blue-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
          />
        </div>

        <div v-if="!isEdit">
          <label class="text-sm text-gray-200">Password</label>
          <input
            v-model="form.password"
            placeholder="Password"
            type="password"
            class="w-full px-3 py-2 rounded-lg bg-white/20 text-white
                  placeholder-white/60 border border-white/20 focus:border-blue-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
          />
        </div>

        <div>
          <label class="text-sm text-gray-200">Role</label>
          <select
            v-model="form.role"
            class="w-full px-3 py-2 rounded-lg bg-white/20 text-white
                  border border-white/20 focus:border-blue-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
          >
            <option class="text-black" value="adminsuper">Admin Super</option>
            <option class="text-black" value="adminlocal">Admin Local</option>
            <option class="text-black" value="pimpinan">Pimpinan</option>
          </select>
        </div>
      </div>

      <template #footer>
        <button
          @click="save"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow
                transition focus:ring-2 focus:ring-blue-500/40"
        >
          Simpan
        </button>
      </template>
    </Modal>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios.js";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";


/* --------------------------------------------
 * STATE
 * -------------------------------------------- */
const users = ref([]);

/* search */
const search = ref("");

/* sorting */
const sortBy = ref("id");
const sortDir = ref("asc");

/* pagination */
const page = ref(1);
const perPage = 5;

/* modal */
const showModal = ref(false);
const isEdit = ref(false);

/* highlight row */
const highlightId = ref(null);

/* form */
const form = ref({
  id: null,
  username: "",
  email: "",
  password: "",
  role: "adminlocal",
});

/* --------------------------------------------
 * LOAD USERS
 * -------------------------------------------- */
const loadUsers = async () => {
  const res = await api.get("/users");
  users.value = res.data;
};

/* --------------------------------------------
 * SEARCH
 * -------------------------------------------- */
const filtered = computed(() => {
  if (!search.value) return users.value;

  return users.value.filter((u) =>
    `${u.username} ${u.email}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});

/* --------------------------------------------
 * SORTING
 * -------------------------------------------- */
const sort = (field) => {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = field;
    sortDir.value = "asc";
  }
};

const sorted = computed(() => {
  return [...filtered.value].sort((a, b) => {
    let x = a[sortBy.value];
    let y = b[sortBy.value];

    if (typeof x === "string") x = x.toLowerCase();
    if (typeof y === "string") y = y.toLowerCase();

    if (x < y) return sortDir.value === "asc" ? -1 : 1;
    if (x > y) return sortDir.value === "asc" ? 1 : -1;
    return 0;
  });
});

/* --------------------------------------------
 * PAGINATION
 * -------------------------------------------- */
const totalPages = computed(() =>
  Math.ceil(sorted.value.length / perPage)
);

const paginated = computed(() => {
  const start = (page.value - 1) * perPage;
  return sorted.value.slice(start, start + perPage);
});

const nextPage = () => {
  if (page.value < totalPages.value) page.value++;
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};

/* --------------------------------------------
 * MODAL OPEN
 * -------------------------------------------- */
const openAdd = () => {
  isEdit.value = false;
  form.value = {
    id: null,
    username: "",
    email: "",
    password: "",
    role: "adminlocal",
  };
  showModal.value = true;
};

const openEdit = (u) => {
  isEdit.value = true;
  form.value = { ...u, password: "" };
  showModal.value = true;
};

/* --------------------------------------------
 * SAVE DATA
 * -------------------------------------------- */
const save = async () => {
  if (isEdit.value) {
    await api.put(`/users/${form.value.id}`, form.value);
  } else {
    const res = await api.post("/users", form.value);
    highlightId.value = res.data.id; // highlight created row
  }

  showModal.value = false;

  await loadUsers();

  // highlight edit
  if (isEdit.value) highlightId.value = form.value.id;

  setTimeout(() => (highlightId.value = null), 1200);
};

/* --------------------------------------------
 * DELETE
 * -------------------------------------------- */
const remove = async (id) => {
  const result = await Swal.fire({
    title: "Hapus User?",
    text: "Data yang sudah dihapus tidak dapat dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    reverseButtons: true,
    buttonsStyling: false,
    customClass: {
      popup: "rounded-xl dark:bg-slate-800",
      title: "text-xl font-semibold dark:text-white",
      htmlContainer: "text-gray-600 dark:text-gray-300",
      confirmButton:
        "px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow",
      cancelButton:
        "px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600",
    },
  });

  if (!result.isConfirmed) return;

  await api.delete(`/users/${id}`);
  loadUsers();

  Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: "User berhasil dihapus.",
    timer: 1500,
    showConfirmButton: false,
    customClass: {
      popup: "rounded-xl dark:bg-slate-800",
      title: "dark:text-white",
      htmlContainer: "dark:text-gray-300",
    },
  });
};


onMounted(loadUsers);
</script>
