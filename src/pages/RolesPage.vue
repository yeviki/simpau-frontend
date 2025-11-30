<!-- pages/RolesPage.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <h1 class="text-3xl font-bold">Roles Management</h1>

      <button
        @click="openAdd"
        class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
      >
        Tambah Roles
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
          @click="openDetail(row)" 
          class="rounded-sm bg-yellow-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-yellow-500"
        >
          Set Roles
        </button>
        
        <button 
          @click="confirmDelete(row.id)" 
          class="rounded-sm bg-red-600 ml-2 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-red-500"
        >
          Hapus
        </button>
      </template>
    </DataTable>

    <!-- MODAL CRUD -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>
        {{ isEdit ? "Edit Roles" : "Tambah Roles" }}
      </template>

      <div class="space-y-4">
        <div>
          <label class="text-sm text-gray-200">Nama Roles</label>
          <input
            v-model="form.roles_name"
            placeholder="Masukkan Nama Roles"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300"
          />
          <p v-if="errors.roles_name" class="text-red-500 text-xs mt-1">
            {{ errors.roles_name }}
          </p>
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


    <!-- MODAL SET ROLES -->
    <Modal v-if="showAccessModal" @close="showAccessModal = false">
      <template #title> Set Hak Akses Menu </template>

      <div class="space-y-2 max-h-80 overflow-y-auto p-2">

        <template v-for="parent in menuTree" :key="parent.id_menu">

          <!-- PARENT -->
          <div class="font-semibold mt-2">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                :value="parent.id_menu"
                v-model="roleMenus"
                @change="toggleParent(parent.id_menu, parent.children)"
              />
              <span>{{ parent.title_menu }}</span>
            </label>
          </div>

          <!-- CHILDREN -->
          <div
            v-for="child in parent.children"
            :key="child.id_menu"
            class="ml-6 flex flex-col"
          >
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                :value="child.id_menu"
                v-model="roleMenus"
                @change="updateParent(child)"
              />
              <span>{{ child.title_menu }}</span>
            </label>
          </div>

        </template>

      </div>

      <template #footer>
        <button
          @click="saveAccess"
          class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          Simpan Hak Akses
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
import api from "../api/axios";

const { theme } = defineProps({ theme: String });

// CRUD roles
const {
  items, form, errors, showModal, isEdit,
  pagination, query, openAdd, openEdit,
  save, remove, load, resetForm
} = useCrud("/roles", {
  defaultForm: { id: null, roles_name: "" },
  rulesCreate: { roles_name: ["required"] },
  rulesUpdate: { roles_name: ["required"] },

  // ⬇ Tambahkan ini
  afterSave: () => {
    Swal.fire({
      icon: "success",
      title: isEdit.value ? "Roles berhasil diupdate" : "Roles berhasil ditambahkan",
      timer: 1500,
      showConfirmButton: false,
    });
  }
});

// SORT
const sortBy = ref("id");
const sortDir = ref("asc");
const perPage = ref(5);

// Table columns
const columns = [
  { key: "roles_name", label: "Nama Roles" },
  { key: "actions", label: "Action", slot: "actions" },
];

onMounted(load);

// Close modal
const closeModal = () => {
  resetForm();
  showModal.value = false;
};

// Delete
const confirmDelete = (id) => remove(id);


// ================================
//   MODAL SET ROLES
// ================================
const showAccessModal = ref(false);
const selectedRoleId = ref(null);
const menus = ref([]);
const roleMenus = ref([]);

// Build tree
// Build tree
const buildMenuTree = (data) => {
  const map = {};
  const roots = [];

  // mapping awal
  data.forEach(i => (map[i.id_menu] = { ...i, children: [] }));

  // loop untuk parent & child
  data.forEach(i => {
    // FIX di sini → parent null / "" juga dianggap root
    if (i.parent_id === 0 || i.parent_id === null || i.parent_id === "" || i.parent_id === undefined) {
      roots.push(map[i.id_menu]);
    } else {
      map[i.parent_id]?.children.push(map[i.id_menu]);
    }
  });

  return roots;
};


const menuTree = computed(() => buildMenuTree(menus.value));

// Toggle parent
const toggleParent = (id_menu, children) => {
  const checked = roleMenus.value.includes(id_menu);

  const setChildren = (list, value) => {
    list.forEach(c => {
      const idx = roleMenus.value.indexOf(c.id_menu);

      if (value) {
        if (idx === -1) roleMenus.value.push(c.id_menu);
      } else {
        if (idx !== -1) roleMenus.value.splice(idx, 1);
      }

      if (c.children && c.children.length) {
        setChildren(c.children, value);
      }
    });
  };

  setChildren(children, checked);
};

// Toggle child update parent
const updateParent = (child) => {
  const parent = menuTree.value.find(p => p.id_menu === child.parent_id);
  if (!parent) return;

  const parentId = parent.id_menu;

  // Jika minimal 1 child dicentang → parent harus dicentang
  const hasChecked = parent.children.some(c => roleMenus.value.includes(c.id_menu));
  const parentIndex = roleMenus.value.indexOf(parentId);

  if (hasChecked && parentIndex === -1) {
    roleMenus.value.push(parentId);
  }

  // Jika semua child uncheck → parent harus uncheck
  const allUnchecked = parent.children.every(c => !roleMenus.value.includes(c.id_menu));
  if (allUnchecked && parentIndex !== -1) {
    roleMenus.value.splice(parentIndex, 1);
  }
};

// ================================
//   OPEN DETAIL → FETCH MENU
// ================================
const openDetail = async (row) => {
  selectedRoleId.value = row.id;

  // fetch all menus
  const resMenu = await api.get("/roles/menu/all");

  menus.value = resMenu.data.map(m => ({
    id_menu: m.id_menu ?? m.id ?? m.menu_id,
    parent_id: m.parent_id ?? m.parent ?? 0,
    title_menu: m.title_menu ?? m.nama_menu ?? m.menu_name,
  }));

  // fetch menus owned by this role
  const resRoleMenu = await api.get(`/roles/${row.id}/menus`);
  roleMenus.value = resRoleMenu.data;

  showAccessModal.value = true;
};


// SAVE ACCESS
const saveAccess = async () => {
  await api.post(`/roles/${selectedRoleId.value}/menus`, {
    menu_ids: roleMenus.value,
  });

  Swal.fire({
    icon: "success",
    title: "Hak akses disimpan!",
    timer: 1500,
    showConfirmButton: false,
  });

  showAccessModal.value = false;
};
</script>
