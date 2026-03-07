// src/App.jsx
// ──────────────────────────────────────────────
// CareBridge — Main App with Routing
// ──────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Timeline from "./pages/Timeline";
import CheckIn from "./pages/CheckIn";
import CheatSheet from "./pages/CheatSheet";

// ── Protected Route — redirects to /auth if not logged in ──
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public route — redirect to dashboard if already logged in */}
      <Route
        path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
      />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/timeline" element={
        <ProtectedRoute><Timeline /></ProtectedRoute>
      } />
      <Route path="/checkin" element={
        <ProtectedRoute><CheckIn /></ProtectedRoute>
      } />
      <Route path="/cheatsheet" element={
        <ProtectedRoute><CheatSheet /></ProtectedRoute>
      } />

      {/* Default — redirect to auth */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}