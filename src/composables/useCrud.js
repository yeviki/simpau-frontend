// composables/useCrud.js
import { ref, reactive } from "vue";
import api from "../api/axios";
import { validate } from "../utils/validator";

export function useCrud(endpoint, options = {}) {
  // Default options
  const defaultForm = options.defaultForm || {};
  const mapResponse = options.mapResponse || ((res) => res);
  const transformForm = options.transformForm || ((form) => form);

  const rules = options.rules || {}; // <-- tambahkan rules custom

  // Hooks
  const beforeSave = options.beforeSave || null;
  const afterSave = options.afterSave || null;

  const beforeDelete = options.beforeDelete || null;
  const afterDelete = options.afterDelete || null;

  // State
  const items = ref([]);
  const loading = ref(false);
  const form = reactive(structuredClone(defaultForm));
  const errors = reactive({});
  const isEdit = ref(false);
  const showModal = ref(false);

  // Query (search/filter)
  const query = reactive({});

  // Pagination
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  // ========== RESET FORM ==========
  const resetForm = () => {
    Object.keys(defaultForm).forEach((key) => {
      form[key] = defaultForm[key];
    });
    Object.keys(errors).forEach((k) => delete errors[k]);
  };

  // =====================================
  // HELPERS: AUTO DETECT RESPONSE FORMAT
  // =====================================
  const extractList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.result)) return data.result;
    return [];
  };

  const extractPagination = (data) => ({
    total: data.total || 0,
    lastPage: data.last_page || 1,
  });

  // ========== LOAD LIST ==========
  const load = async () => {
    loading.value = true;
    try {
      const { data } = await api.get(endpoint, {
        params: {
          page: pagination.page,
          per_page: pagination.perPage,
          ...query,
        },
      });

      const list = extractList(data);
      items.value = mapResponse(list);

      const pg = extractPagination(data);
      pagination.total = pg.total;
      pagination.lastPage = pg.lastPage;
    } finally {
      loading.value = false;
    }
  };

  // ========== FETCH ONE ==========
  const fetchOne = async (id, assignToForm = false) => {
    loading.value = true;
    try {
      const { data } = await api.get(`${endpoint}/${id}`);
      if (assignToForm) Object.assign(form, data);
      return data;
    } finally {
      loading.value = false;
    }
  };

  // ========== OPEN ADD ==========
  const openAdd = () => {
    resetForm();
    isEdit.value = false;
    showModal.value = true;
  };

  // ========== OPEN EDIT ==========
  const openEdit = async (rowOrId) => {
    resetForm();
    isEdit.value = true;

    if (typeof rowOrId === "object") {
      Object.assign(form, rowOrId);
    } else {
      await fetchOne(rowOrId, true);
    }

    showModal.value = true;
  };

  // ==================================
  // SAVE (CREATE / UPDATE) + VALIDATOR
  // ==================================
  const save = async () => {
    loading.value = true;

    // reset error lama
    Object.keys(errors).forEach((k) => delete errors[k]);

    try {
      // 1. Client-side validation
      const validation = validate(form, rules);
      if (Object.keys(validation).length > 0) {
        Object.assign(errors, validation);
        loading.value = false;
        return false; // hentikan request
      }

      // 2. beforeSave hook
      if (beforeSave) await beforeSave(form);

      const payload = transformForm(form);

      const method = isEdit.value ? "put" : "post";
      const url = isEdit.value ? `${endpoint}/${form.id}` : endpoint;

      // 3. Request ke server
      await api[method](url, payload);

      // 4. Refresh Data
      await load();
      showModal.value = false;
      resetForm();

      // 5. afterSave hook
      if (afterSave) afterSave();

      return true;
    } catch (e) {
      // 6. Error dari backend → tampilkan ke errors
      if (e.response?.data?.errors) {
        Object.assign(errors, e.response.data.errors);
      } else if (e.response?.data?.message) {
        errors.general = e.response.data.message;
      }

      return false;
    } finally {
      loading.value = false;
    }
  };

  // ========== DELETE ==========
  const remove = async (id) => {
    if (beforeDelete) {
      const ok = await beforeDelete(id);
      if (!ok) return;
    }

    loading.value = true;
    try {
      await api.delete(`${endpoint}/${id}`);
      await load();
      if (afterDelete) afterDelete();
    } finally {
      loading.value = false;
    }
  };

  // Pagination
  const changePage = (page) => {
    pagination.page = page;
    load();
  };

  return {
    items,
    loading,
    form,
    errors,
    isEdit,
    showModal,
    pagination,
    query,

    load,
    fetchOne,
    openAdd,
    openEdit,
    save,
    remove,
    changePage,
    resetForm,
  };
}
