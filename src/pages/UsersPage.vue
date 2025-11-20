<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold">Users</h1>

      <button
        @click="openAdd"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Tambah User
      </button>
    </div>

    <!-- Search -->
    <div class="flex justify-between items-center mb-4">
      <input
        v-model="search"
        placeholder="Cari username/email..."
        class="block w-60 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
      />
    </div>

    <!-- Table -->
    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th
              @click="sort('id')"
              scope="col"
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 cursor-pointer sm:pl-6"
            >
              No
              <span v-if="sortBy === 'id'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
            </th>

            <th
              @click="sort('username')"
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
            >
              Username
              <span v-if="sortBy === 'username'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
            </th>

            <th
              @click="sort('email')"
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
            >
              Email
              <span v-if="sortBy === 'email'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
            </th>

            <th
              @click="sort('role')"
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
            >
              Role
              <span v-if="sortBy === 'role'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
            </th>

            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">Aksi</span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="(u, index) in paginated"
            :key="u.id"
            :class="[
              'transition',
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              u.id === highlightId ? 'bg-green-100' : ''
            ]"
          >
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
              {{ (page - 1) * perPage + (index + 1) }}
            </td>

            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
              {{ u.username }}
            </td>

            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
              {{ u.email }}
            </td>

            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
              {{ u.role }}
            </td>

            <td class="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
              <button
                @click="openEdit(u)"
                class="text-indigo-600 hover:text-indigo-900 font-semibold transition"
              >
                Edit
              </button>

              <button
                @click="remove(u.id)"
                class="text-red-600 hover:text-red-800 font-semibold transition"
              >
                Hapus
              </button>
            </td>
          </tr>

          <tr v-if="filtered.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
              Tidak ada data ditemukan.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Super Compact -->
    <div class="flex justify-between items-center mt-6">

      <!-- Info -->
      <div class="text-xs text-gray-600 dark:text-gray-300">
        {{ paginated.length }} / {{ filtered.length }} data
      </div>

      <!-- Compact Pagination -->
      <div class="flex items-center space-x-1">

        <!-- FIRST -->
        <button
          @click="goFirst"
          :disabled="page === 1"
          class="px-2 py-1 rounded-full border text-xs disabled:opacity-30
                bg-white dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 
                dark:hover:bg-slate-700 transition"
        >
          «
        </button>

        <!-- PREV -->
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-2 py-1 rounded-full border text-xs disabled:opacity-30
                bg-white dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 
                dark:hover:bg-slate-700 transition"
        >
          ‹
        </button>

        <!-- Page Numbers -->
        <template v-for="p in pagesToShow" :key="p">

          <!-- Number -->
          <button
            v-if="p !== '...'"
            @click="page = p"
            :class="[
              'px-3 py-1 rounded-full text-xs transition border',
              page === p
                ? 'bg-blue-600 text-white border-blue-600 shadow'
                : 'bg-white dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700'
            ]"
          >
            {{ p }}
          </button>

          <!-- Ellipsis -->
          <span v-else class="px-2 text-gray-500 dark:text-gray-400 text-sm">…</span>
        </template>

        <!-- NEXT -->
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-2 py-1 rounded-full border text-xs disabled:opacity-30
                bg-white dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 
                dark:hover:bg-slate-700 transition"
        >
          ›
        </button>

        <!-- LAST -->
        <button
          @click="goLast"
          :disabled="page === totalPages"
          class="px-2 py-1 rounded-full border text-xs disabled:opacity-30
                bg-white dark:bg-slate-800 dark:text-gray-200 hover:bg-gray-100 
                dark:hover:bg-slate-700 transition"
        >
          »
        </button>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>
        {{ isEdit ? "Edit User" : "Tambah User" }}
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-200">Username</label>
          <input
            v-model="form.username"
            placeholder="Masukkan username"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <p v-if="errors.username" class="text-red-500 text-xs mt-1">
            {{ errors.username }}
          </p>
        </div>

        <div>
          <label class="text-sm text-gray-200">Email</label>
          <input
            v-model="form.email"
            placeholder="Masukkan email"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- <div v-if="!isEdit"> -->
        <div>
          <label class="text-sm text-gray-200">Password</label>
          <input
            v-model="form.password"
            :placeholder="isEdit ? 'Kosongkan jika tidak ingin mengubah' : 'Password'"
            type="password"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">
            {{ errors.password }}
          </p>
        </div>

        <div>
          <label class="text-sm text-gray-200">Role</label>
          <select
            v-model="form.role"
            class="w-full px-3 py-1 rounded-lg bg-white/20 text-white
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
import { validate } from "../utils/validator";

/* --------------------------------------------
 * STATE
 * -------------------------------------------- */
const errors = ref({});
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

// Pagination First Page And Last Page
const goFirst = () => (page.value = 1);
const goLast = () => (page.value = totalPages.value);

const pagesToShow = computed(() => {
  const total = totalPages.value;
  const current = page.value;

  if (total <= 5) return [...Array(total)].map((_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];

  return [1, "...", current - 1, current, current + 1, "...", total];
});

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

// Reset Form 
const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.value.username = "";
  form.value.email = "";
  form.value.password = "";
  form.value.role = "adminlocal";

  errors.value = {};
};

/* --------------------------------------------
 * VALIDATE DATA
 * -------------------------------------------- */
const rulesValidate = computed(() => ({
  username: ["required"],
  email: ["required", "email"],
  password: isEdit.value
    ? ["min:6"]        // Edit → password opsional
    : ["required", "min:6"], // Tambah → wajib
  role: ["required"],
}));

/* --------------------------------------------
 * SAVE DATA
 * -------------------------------------------- */
const save = async () => {
  try {
    errors.value = validate(form.value, rulesValidate.value);

  if (Object.keys(errors.value).length > 0) return;

    const payload = { ...form.value };

    if (isEdit.value && (!payload.password || payload.password.trim() === "")) {
      delete payload.password;
    }

    if (isEdit.value) {
      await api.put(`/users/${form.value.id}`, payload);
    } else {
      await api.post("/users", payload);
    }

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: isEdit.value ? "Berhasil ubah data" : "Data Berhasil ditambahkan",
      timer: 1500,
      showConfirmButton: false,
    });

    showModal.value = false;
    loadUsers();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message  || "Terjadi kesalahan",
    });
  }
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
        "px-4 ml-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow",
      cancelButton:
        "px-4 ml-1 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600",
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
