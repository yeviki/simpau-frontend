<!-- UsersPage.vue -->
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
      :rows="items"
      :columns="columns"
      searchable
      sortable
      paginated
      :per-page="5"
      v-model:search="query.search"
      v-model:page="pagination.page"
      :sort-by="sortBy"
      :sort-dir="sortDir"
      @update:sortBy="sortBy = $event"
      @update:sortDir="sortDir = $event"
    >
      <template #actions="{ row }">
        <button @click="openEdit(row)" class="rounded-sm bg-indigo-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Edit</button>
        
        <button @click="confirmDelete(row.id)" class="rounded-sm bg-red-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Hapus</button>
      </template>
    </DataTable>

    <!-- MODAL -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>
        {{ isEdit ? "Edit User" : "Tambah User" }}
      </template>

      <div class="space-y-4">
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
            v-model="form.role"
            class="w-full px-3 py-1 rounded-lg bg-white text-black border border-gray-300"
          >
            <option value="adminsuper">Admin Super</option>
            <option value="adminlocal">Admin Local</option>
            <option value="pimpinan">Pimpinan</option>
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
import { validate } from "../utils/validator";
import { useCrud } from "../composables/useCrud";

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
      role: "adminlocal",
    },
    rules: {
      username: ["required"],
      email: ["required", "email"],
      password: ["min:6"], // kalau kosong → tidak error, sesuai validator kamu
      role: ["required"],
    },

    // 👇 Transform payload sebelum dikirim
    transformForm: (f) => {
      const payload = { ...f };
      if (payload.password === "") delete payload.password;
      return payload;
    },

    // 👇 Setelah sukses create/update
    afterSave: () => {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        timer: 1500,
        showConfirmButton: false,
      });
    },

    // 👇 Hapus data
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

// DATATABLE SORT
const sortBy = ref("id");
const sortDir = ref("asc");

// Kolom tabel
const columns = [
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
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
