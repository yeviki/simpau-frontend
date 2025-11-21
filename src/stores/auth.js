import { defineStore } from "pinia";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token"),
  }),

  actions: {
    async login(payload) {
      const res = await api.post("/auth/login", payload);

      this.token = res.data.token;
      localStorage.setItem("token", this.token);

      await this.fetchProfile();
    },

    async fetchProfile() {
      const res = await api.get("/auth/me");
      this.user = res.data.user;
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      window.location.href = "/login";
    },
  },
});
