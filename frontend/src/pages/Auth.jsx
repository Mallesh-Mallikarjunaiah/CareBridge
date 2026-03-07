// src/pages/Auth.jsx
// Single page that toggles between Login and Signup
// Supports: Google, Email+Password, Phone number

import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  // Toggle between login and signup
  const [mode, setMode] = useState("login");  // "login" | "signup" | "phone"

  // Form fields
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [phone,    setPhone]    = useState("");
  const [otp,      setOtp]      = useState("");

  // UI state
  const [otpSent,  setOtpSent]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  // confirmationResult holds the OTP session from Firebase
  const [confirmationResult, setConfirmationResult] = useState(null);

  const navigate = useNavigate();

  // ── Clear error when user starts typing ──────────────────────
  const clearError = () => setError("");

  // ── Helper: go to dashboard after successful login ───────────
  const onSuccess = () => navigate("/dashboard");

  // ── Google Sign In ───────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Email + Password Login ───────────────────────────────────
  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSuccess();
    } catch (err) {
      // Firebase error codes → human readable messages
      if (err.code === "auth/user-not-found")   setError("No account found with this email.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else if (err.code === "auth/invalid-email")  setError("Invalid email address.");
      else setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Email + Password Signup ──────────────────────────────────
  const handleEmailSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Save the display name to Firebase Auth profile
      await updateProfile(result.user, { displayName: name });
      onSuccess();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("An account with this email already exists.");
      else if (err.code === "auth/invalid-email")   setError("Invalid email address.");
      else if (err.code === "auth/weak-password")   setError("Password is too weak.");
      else setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Phone — Send OTP ─────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // RecaptchaVerifier proves to Firebase this is a real browser
      // "invisible" means it runs silently without showing a puzzle
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      const result = await signInWithPhoneNumber(auth, phone, recaptcha);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Check the phone number format (+1234567890).");
    } finally {
      setLoading(false);
    }
  };

  // ── Phone — Verify OTP ───────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await confirmationResult.confirm(otp);
      onSuccess();
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white
                    flex items-center justify-center px-4">

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center
                          w-14 h-14 rounded-full bg-blue-600 mb-4">
            <span className="text-white text-2xl">🏥</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">CareBridge</h1>
          <p className="text-gray-500 text-sm mt-1">
            Post-operative recovery assistant
          </p>
        </div>

        {/* Mode Toggle — Login / Signup */}
        {mode !== "phone" && (
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("login"); clearError(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                ${mode === "login"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-500 hover:text-gray-700"}`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("signup"); clearError(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
                ${mode === "signup"
                  ? "bg-white text-blue-600 shadow"
                  : "text-gray-500 hover:text-gray-700"}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600
                          rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* ── Phone Login Mode ── */}
        {mode === "phone" ? (
          <div className="space-y-4">
            <button
              onClick={() => { setMode("login"); clearError(); setOtpSent(false); }}
              className="text-blue-600 text-sm flex items-center gap-1 mb-2"
            >
              ← Back
            </button>

            {!otpSent ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); clearError(); }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Include country code e.g. +1 for US
                  </p>
                </div>
                {/* Invisible recaptcha container */}
                <div id="recaptcha-container"></div>
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg
                             font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit code"
                    value={otp}
                    maxLength={6}
                    onChange={e => { setOtp(e.target.value); clearError(); }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3
                               text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                               tracking-widest text-center text-lg"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg
                             font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
          </div>

        ) : (
          /* ── Email + Password Mode (Login or Signup) ── */
          <div className="space-y-4">

            {/* Name field — signup only */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => { setName(e.target.value); clearError(); }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3
                             text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); clearError(); }}
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
                placeholder={mode === "signup" ? "Min. 6 characters" : "Enter password"}
                value={password}
                onChange={e => { setPassword(e.target.value); clearError(); }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                           text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={mode === "login" ? handleEmailLogin : handleEmailSignup}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg
                         font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading
                ? (mode === "login" ? "Signing in..." : "Creating account...")
                : (mode === "login" ? "Sign In"       : "Create Account")}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3
                         border border-gray-300 rounded-lg py-3 text-sm
                         font-medium text-gray-700 hover:bg-gray-50
                         transition disabled:opacity-50"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-4 h-4"
              />
              Continue with Google
            </button>

            {/* Phone Button */}
            <button
              onClick={() => { setMode("phone"); clearError(); }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3
                         border border-gray-300 rounded-lg py-3 text-sm
                         font-medium text-gray-700 hover:bg-gray-50
                         transition disabled:opacity-50"
            >
              📱 Continue with Phone
            </button>

          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing you agree to our Terms of Service
        </p>

      </div>
    </div>
  );
}