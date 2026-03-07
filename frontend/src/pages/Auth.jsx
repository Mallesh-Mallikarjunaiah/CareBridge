// src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const clearError = () => setError("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter your username/email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login({ username_or_email: username, password });
      navigate("/upload");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
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
      await signup({ full_name: fullName, email, mobile_number: mobile, username, password, confirm_password: confirmPassword });
      navigate("/upload");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") mode === "login" ? handleLogin() : handleSignup();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8" onKeyDown={handleKeyPress}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200 mb-4">
            <span className="text-white text-3xl">🌉</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            CareBridge
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Bridging the gap between medical jargon and patient understanding
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-100/50 border border-white/60 p-8">
          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-6">
            <button
              onClick={() => { setMode("login"); clearError(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === "login"
                  ? "bg-white text-blue-600 shadow-md shadow-blue-100"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode("signup"); clearError(); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                mode === "signup"
                  ? "bg-white text-blue-600 shadow-md shadow-blue-100"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" placeholder="John Doe" value={fullName}
                    onChange={(e) => { setFullName(e.target.value); clearError(); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
                  <input type="tel" placeholder="9876543210" value={mobile}
                    onChange={(e) => { setMobile(e.target.value); clearError(); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {mode === "login" ? "Username or Email" : "Username"}
              </label>
              <input type="text"
                placeholder={mode === "login" ? "Enter username or email" : "Choose a username"}
                value={username}
                onChange={(e) => { setUsername(e.target.value); clearError(); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "Min. 6 characters" : "Enter password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-16 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <input type="password" placeholder="Re-enter password" value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
              </div>
            )}

            <button
              onClick={mode === "login" ? handleLogin : handleSignup}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-blue-200/50 mt-2"
            >
              {loading
                ? (mode === "login" ? "Signing in..." : "Creating account...")
                : (mode === "login" ? "Sign In" : "Create Account")}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing you agree to our Terms of Service
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          CareBridge v1.0 — Built for better healthcare communication
        </p>
      </div>
    </div>
  );
}