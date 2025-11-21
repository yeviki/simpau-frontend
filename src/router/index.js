// router/index.js
import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "../pages/LoginPage.vue";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import UsersPage from "../pages/UsersPage.vue";

const routes = [
  { path: "/", redirect: "/login" },

  {
    path: "/login",
    component: LoginPage,
    meta: { guest: true },
  },

  // Semua route yang memakai DashboardLayout masuk sini:
  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        component: () => import("../pages/DashboardHome.vue") // optional
      },
      {
        path: "users",
        component: UsersPage,
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) return next("/login");
  if (to.meta.guest && token) return next("/dashboard");

  next();
});

export default router;
