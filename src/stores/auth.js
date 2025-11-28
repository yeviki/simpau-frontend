// stores/auth.js
import { defineStore } from "pinia";
import api from "../api/axios";
import router from "../router"; // ⬅️ WAJIB import router untuk addRoute()

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,

    // menu flat dari backend (sudah ada)
    menu: [],

    // ⬇️ menu tree baru (untuk sidebar)
    menuTree: [],
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    // ===========================
    // LOGIN
    // ===========================
    async login(payload) {
      try {
        const res = await api.post("/auth/login", payload);

        // simpan token
        this.token = res.data.token;
        localStorage.setItem("token", this.token);

        // load profile & menu
        await this.fetchProfile();
        await this.loadMenu();

      } catch (err) {
        throw err;
      }
    },

    // ===========================
    // FETCH PROFILE
    // ===========================
    async fetchProfile() {
      const res = await api.get("/auth/me");
      this.user = res.data; 
    },

    // ===========================
    // BUILD MENU TREE (BARU)
    // ===========================
    buildMenuTree(menuList) {
      const map = {};
      const roots = [];

      menuList.forEach(item => {
        map[item.id_menu] = { ...item, children: [] };
      });

      menuList.forEach(item => {
        if (item.parent_id) {
          map[item.parent_id].children.push(map[item.id_menu]);
        } else {
          roots.push(map[item.id_menu]);
        }
      });

      return roots;
    },

    // ===========================
    // BENTUK ROUTE DARI MENU (BARU)
    // ===========================
    generateRoutesFromMenu(tree) {
      const routes = [];

      tree.forEach(item => {
        // hanya generasi route jika url valid dan component ada
        if (item.url_menu && item.url_menu !== "#" && item.component) {
          routes.push({
            path: item.url_menu.startsWith("/") ? item.url_menu : "/" + item.url_menu,
            name: item.component,
            component: () => import(`../pages/${item.component}.vue`)
          });
        }

        // cek anak
        if (item.children && item.children.length > 0) {
          routes.push(...this.generateRoutesFromMenu(item.children));
        }
      });

      return routes;
    },

    // ===========================
    // LOAD MENU
    // ===========================
    async loadMenu() {
      if (!this.token) return;

      const res = await api.get("/auth/menu");
      this.menu = res.data.menu;

      // 1️⃣ bentuk tree
      this.menuTree = this.buildMenuTree(this.menu);

      // 2️⃣ bentuk dynamic route dari tree
      const dynamicRoutes = this.generateRoutesFromMenu(this.menuTree);

      // 3️⃣ masukkan route sebagai child dari "/"
      dynamicRoutes.forEach(r => {
        router.addRoute("/", r);
      });
    },

    // ===========================
    // LOAD TOKEN (REFRESH PAGE)
    // ===========================
    async loadToken() {
      if (this.token && !this.user) {
        try {
          await this.fetchProfile();

          // ➕ load menu juga
          await this.loadMenu();
        } catch (e) {
          this.logout();
        }
      }
    },

    // ===========================
    // LOGOUT
    // ===========================
    logout: async function() {
      if (!this.token) {
        this._clearAuthState();
        return;
      }

      try {
        // panggil API logout → sertakan token di header
        await api.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
      } catch (err) {
        console.error("Logout API error:", err);
      } finally {
        this._clearAuthState();
      }
    },

    _clearAuthState() {
      // reset state Pinia
      this.user = null;
      this.token = null;
      this.menu = [];
      this.menuTree = [];

      localStorage.removeItem("token");

      // redirect ke login, tunggu beberapa ms agar request benar-benar selesai
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }


  },
});
