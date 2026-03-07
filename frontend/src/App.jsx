// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth       from "./pages/Auth";
import Upload     from "./pages/Upload";
import Dashboard  from "./pages/Dashboard";
import Timeline   from "./pages/Timeline";
import CheckIn    from "./pages/CheckIn";
import CheatSheet from "./pages/CheatSheet";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/upload" replace /> : <Auth />}
      />
      <Route path="/upload" element={
        <ProtectedRoute><Upload /></ProtectedRoute>
      }/>
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      }/>
      <Route path="/timeline" element={
        <ProtectedRoute><Timeline /></ProtectedRoute>
      }/>
      <Route path="/checkin" element={
        <ProtectedRoute><CheckIn /></ProtectedRoute>
      }/>
      <Route path="/cheatsheet" element={
        <ProtectedRoute><CheatSheet /></ProtectedRoute>
      }/>
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