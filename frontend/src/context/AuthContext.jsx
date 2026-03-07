// src/context/AuthContext.jsx
// ──────────────────────────────────────────────
// CareBridge — Auth Context (JWT Based)
// ──────────────────────────────────────────────
// Holds the logged-in user globally.
// Any component can call useAuth() to get:
//   - user (current user profile or null)
//   - loading (true while checking auth)
//   - login(data) — login function
//   - signup(data) — signup function
//   - logout() — logout function
// ──────────────────────────────────────────────

import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Check if user is already logged in (on app load) ──
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("carebridge_token");
      const savedUser = localStorage.getItem("carebridge_user");

      if (token && savedUser) {
        try {
          // Verify token is still valid by calling /api/auth/me
          const res = await api.get("/auth/me");
          setUser(res.data);
          // Update saved user with latest data
          localStorage.setItem("carebridge_user", JSON.stringify(res.data));
        } catch (err) {
          // Token expired or invalid — clear everything
          localStorage.removeItem("carebridge_token");
          localStorage.removeItem("carebridge_user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ── Signup ────────────────────────────────────
  const signup = async ({ full_name, email, mobile_number, username, password, confirm_password }) => {
    const res = await api.post("/auth/register", {
      full_name,
      email,
      mobile_number,
      username,
      password,
      confirm_password,
    });

    const { access_token, user: userData } = res.data;

    // Save token and user to localStorage
    localStorage.setItem("carebridge_token", access_token);
    localStorage.setItem("carebridge_user", JSON.stringify(userData));

    setUser(userData);
    return userData;
  };

  // ── Login ─────────────────────────────────────
  const login = async ({ username_or_email, password }) => {
    const res = await api.post("/auth/login", {
      username_or_email,
      password,
    });

    const { access_token, user: userData } = res.data;

    // Save token and user to localStorage
    localStorage.setItem("carebridge_token", access_token);
    localStorage.setItem("carebridge_user", JSON.stringify(userData));

    setUser(userData);
    return userData;
  };

  // ── Logout ────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("carebridge_token");
    localStorage.removeItem("carebridge_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}