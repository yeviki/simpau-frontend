// api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// ===========================================
// REQUEST INTERCEPTOR (LEMPAR TOKEN OTOMATIS)
// ===========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===================================================
// RESPONSE INTERCEPTOR (HANDLE TOKEN EXPIRED OTOMATIS)
// ===================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token invalid atau expired
    if (error.response && error.response.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");

      // Jangan redirect kalau sudah di halaman login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
