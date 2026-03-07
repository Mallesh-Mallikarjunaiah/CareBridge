// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/upload", icon: "📤", label: "Upload" },
  { path: "/dashboard", icon: "🏠", label: "Dashboard" },
  { path: "/timeline", icon: "📅", label: "Timeline" },
  { path: "/checkin", icon: "✅", label: "Check In" },
  { path: "/cheatsheet", icon: "📄", label: "Cheat Sheet" },
  { path: "/chat", icon: "💬", label: "Ask AI" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Works with both Firebase (displayName) and JWT (full_name) user objects
  const userName = user?.full_name || user?.displayName || "User";
  const userEmail = user?.email || "";
  const userInitial = userName[0]?.toUpperCase() || "U";

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg flex-shrink-0">
          🏥
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-sm">CareBridge</h1>
          <p className="text-xs text-gray-400">Recovery Assistant</p>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
            {userInitial}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <span className="text-base">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}