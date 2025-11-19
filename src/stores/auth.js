// src/stores/auth.js
import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "{}"),
    loading: false,
    error: null
  }),

  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;

      try {
        const res = await axios.post("http://localhost:3000/api/login", {
          username,
          password,
        });

        this.token = res.data.token;
        this.user = res.data.user;

        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));

        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Login gagal!";
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = {};
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
