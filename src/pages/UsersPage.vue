<!-- pages/UsersPage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold">Users</h1>

      <button
        @click="openAdd"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
      >
        Tambah User
      </button>
    </div>

    <!-- DATATABLE -->
    <DataTable
      :theme="theme"
      :rows="items"
      :columns="columns"
      searchable
      sortable
      paginated
      v-model:search="query.search"
      v-model:page="pagination.page"
      :sort-by="sortBy"
      :sort-dir="sortDir"
      @update:sortBy="sortBy = $event"
      @update:sortDir="sortDir = $event"
      v-model:perPage="perPage"
    >
      <template #actions="{ row }">
        <button 
          @click="openEdit(row)" 
          class="rounded-sm bg-indigo-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
        >
          Edit
        </button>
        
        <button 
          @click="confirmDelete(row.id)" 
          class="rounded-sm bg-red-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-red-500"
        >
          Hapus
        </button>
      </template>
    </DataTable>

    <!-- MODAL -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>
        {{ isEdit ? "Edit User" : "Tambah User" }}
      </template>

      <div class="space-y-4">
        <!-- FULLNAME -->
        <div>
          <label class="text-sm text-gray-200">Nama Lengkap</label>
          <input
            v-model="form.fullname"
            placeholder="Masukkan fullname"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.fullname" class="text-red-500 text-xs mt-1">
            {{ errors.fullname }}
          </p>
        </div>

        <!-- USERNAME -->
        <div>
          <label class="text-sm text-gray-200">Username</label>
          <input
            v-model="form.username"
            placeholder="Masukkan username"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.username" class="text-red-500 text-xs mt-1">
            {{ errors.username }}
          </p>
        </div>

        <!-- EMAIL -->
        <div>
          <label class="text-sm text-gray-200">Email</label>
          <input
            v-model="form.email"
            placeholder="Masukkan email"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">
            {{ errors.email }}
          </p>
        </div>

        <!-- PASSWORD -->
        <div>
          <label class="text-sm text-gray-200">Password</label>
          <input
            v-model="form.password"
            :placeholder="isEdit ? 'Kosongkan jika tidak ingin mengubah' : 'Password'"
            type="password"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">
            {{ errors.password }}
          </p>
        </div>

        <!-- ROLE -->
        <div>
          <label class="text-sm text-gray-200">Role</label>
          <select
            v-model="form.roles_id"
            class="w-full px-3 py-1 rounded-lg bg-white text-black border border-gray-300"
          >
            <option value="1">Admin Super</option>
            <option value="2">Admin Local</option>
            <option value="3">Pimpinan</option>
            <option value="4">Pimpinan</option>
          </select>
        </div>
      </div>

      <template #footer>
        <button
          @click="save"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          Simpan
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DataTable from "../components/DataTable.vue";
import Modal from "../components/Modal.vue";
import Swal from "sweetalert2";
import { useCrud } from "../composables/useCrud";

const { theme } = defineProps({
  theme: String
});

const {
  items,
  form,
  errors,
  showModal,
  isEdit,
  pagination,
  query,
  openAdd,
  openEdit,
  save,
  remove,
  load,
  resetForm,
} = useCrud("/users", {
  defaultForm: {
    id: null,
    username: "",
    email: "",
    password: "",
    roles_id: "2",
  },
  rulesCreate: {
    username: ["required"],
    email: ["required"],
    password: ["required", "min:6"],   // wajib saat tambah
  },

  rulesUpdate: {
    username: ["required"],
    email: ["required"],
    password: [],                     // tidak wajib saat edit
  },

  transformForm: (f) => {
    const payload = { ...f };

    // HANYA kirim password jika benar-benar diisi
    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }

    return payload;
  },

  // ⬇ Tambahkan ini
  afterSave: () => {
    Swal.fire({
      icon: "success",
      title: isEdit.value ? "Data berhasil diupdate" : "Data berhasil ditambahkan",
      timer: 1500,
      showConfirmButton: false,
    });
  },

  beforeDelete: async (id) => {
    const result = await Swal.fire({
      title: "Hapus User?",
      text: "Data yang sudah dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    return result.isConfirmed;
  },

  afterDelete: () => {
    Swal.fire({
      icon: "success",
      title: "User berhasil dihapus",
      timer: 1500,
      showConfirmButton: false,
    });
  },
});

// SORT
const sortBy = ref("id");
const sortDir = ref("asc");

// ADD perPage default = 5
const perPage = ref(5);

// Kolom tabel
const columns = [
  { key: "fullname", label: "Nama Lengkap" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "roles_name", label: "Roles" },
  { key: "actions", label: "Action", slot: "actions" },
];

onMounted(load);

// Tutup modal
const closeModal = () => {
  resetForm();
  showModal.value = false;
};

// Hapus user
const confirmDelete = (id) => remove(id);
</script>
