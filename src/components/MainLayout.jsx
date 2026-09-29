import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import { ToastProvider } from "../context/ToastContext.jsx";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}