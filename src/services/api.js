import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// REQUEST INTERCEPTOR
// =========================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================
// RESPONSE INTERCEPTOR
// =========================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error.response?.status;

    // =========================
    // 401 - UNAUTHORIZED
    // =========================

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    // =========================
    // 403 - FORBIDDEN
    // =========================

    if (status === 403) {
      error.userMessage =
        "You do not have permission to perform this action.";

      return Promise.reject(error);
    }

    // =========================
    // OTHER ERRORS
    // =========================

    return Promise.reject(error);
  }
);

export default api;