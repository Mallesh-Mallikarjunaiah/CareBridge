// src/pages/Auth.jsx
// ──────────────────────────────────────────────
// CareBridge — Login & Signup Page
// ──────────────────────────────────────────────
// Toggles between Login and Signup forms
// Connects to our FastAPI backend JWT auth
// ──────────────────────────────────────────────

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  // Toggle between login and signup
  const [mode, setMode] = useState("login"); // "login" | "signup"

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, signup } = useAuth();

  // Clear error when user starts typing
  const clearError = () => setError("");

  // ── Handle Login ─────────────────────────────
  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter your username/email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login({
        username_or_email: username,
        password: password,
      });
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Signup ────────────────────────────
  const handleSignup = async () => {
    // Validate all fields
    if (!fullName || !email || !mobile || !username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signup({
        full_name: fullName,
        email: email,
        mobile_number: mobile,
        username: username,
        password: password,
        confirm_password: confirmPassword,
      });
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Enter key ─────────────────────────
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      mode === "login" ? handleLogin() : handleSignup();
    }
  };

  // ── UI ───────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white
                 flex items-center justify-center px-4"
      onKeyDown={handleKeyPress}
    >
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center
                        w-14 h-14 rounded-full bg-blue-600 mb-4"
          >
            <span className="text-white text-2xl">🌉</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">CareBridge</h1>
          <p className="text-gray-500 text-sm mt-1">
            Bridging the gap between medical jargon and patient understanding
          </p>
        </div>

        {/* Mode Toggle — Login / Signup */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => {
              setMode("login");
              clearError();
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
              ${
                mode === "login"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("signup");
              clearError();
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
              ${
                mode === "signup"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-600
                        rounded-lg px-4 py-3 text-sm mb-4"
          >
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {/* ── Signup-only fields ── */}
          {mode === "signup" && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Mallesh M"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearError();
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    clearError();
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Username (both modes) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {mode === "login" ? "Username or Email" : "Username"}
            </label>
            <input
              type="text"
              placeholder={
                mode === "login" ? "Enter username or email" : "Choose a username"
              }
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearError();
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder={
                mode === "signup" ? "Min. 6 characters" : "Enter password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-3
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password — signup only */}
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError();
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                           text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={mode === "login" ? handleLogin : handleSignup}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg
                       font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? mode === "login"
                ? "Signing in..."
                : "Creating account..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}