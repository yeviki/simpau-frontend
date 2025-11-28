// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginPage from "../pages/LoginPage.vue";
import DashboardLayout from "../layouts/DashboardLayout.vue";

const routes = [
  // redirect awal
  { path: "/", redirect: "/dashboard" },

  // login
  {
    path: "/login",
    component: LoginPage,
    meta: { guest: true },
  },

  // ROOT LAYOUT (WAJIB PUNYA NAME)
  {
    path: "/",
    name: "DashboardRoot",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [], // akan ditambah dynamic routes
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Flag agar dynamic routes hanya didaftarkan sekali
let isDynamicRouteLoaded = false;

// ====================================================
// ROUTER MIDDLEWARE
// ====================================================
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // saat refresh halaman → load token + profile + menu
  await auth.loadToken();

  // ================================
  // LOAD DYNAMIC ROUTES SEKALI SAJA
  // ================================
  if (auth.isLoggedIn && !isDynamicRouteLoaded) {

    // dynamic routes sudah dibentuk di auth.js
    const dynamicRoutes = auth.generateRoutesFromMenu(auth.menuTree);

    dynamicRoutes.forEach((r) => {
      // WAJIB PAKAI "DashboardRoot"
      router.addRoute("DashboardRoot", {
        ...r,
        path: r.path.startsWith("/") ? r.path : "/" + r.path, // cegah error
      });
    });

    isDynamicRouteLoaded = true;

    // ulangi navigasi agar router mengenali route baru
    return next({ ...to, replace: true });
  }

  // =================================
  // PROTEKSI ROUTE AGAR BUTUH LOGIN
  // =================================
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next("/login");
  }

  // =================================
  // CEGAH USER LOGIN MASUK KE /login
  // =================================
  if (to.meta.guest && auth.isLoggedIn) {
    return next("/dashboard");
  }

  next();
});

export default router;
