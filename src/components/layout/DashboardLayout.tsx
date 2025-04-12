
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export default function DashboardLayout() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const toggleSidebarMobile = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar para desktop */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Sidebar para mobile */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute left-0 top-0 h-full w-64 animate-slide-in-right">
            <Sidebar />
            <div className="absolute right-0 top-4 p-2">
              <button
                className="rounded-full bg-white/10 p-2 text-white"
                onClick={toggleSidebarMobile}
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebarMobile={toggleSidebarMobile} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
