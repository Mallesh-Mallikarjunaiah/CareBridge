// src/utils/api.js
// ──────────────────────────────────────────────
// CareBridge — Axios API Client
// ──────────────────────────────────────────────
// Centralized HTTP client that:
// 1. Points all requests to our FastAPI backend
// 2. Automatically attaches JWT token to every request
// 3. Handles 401 errors (expired token → redirect to login)
// ──────────────────────────────────────────────

import axios from "axios";

const api = axios.create({
  baseURL: "/api",           // Vite proxy forwards this to http://localhost:8000/api
  timeout: 30000,            // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ─────────────────────────
// Runs BEFORE every request is sent
// Attaches the JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("carebridge_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────
// Runs AFTER every response is received
// If 401 (unauthorized), clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("carebridge_token");
      localStorage.removeItem("carebridge_user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default api;