import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "@/components/common/CommandPalette";
import { cn } from "@/lib/utils";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background font-inter">
      <Topbar
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCommandPalette={() => setCmdOpen(true)}
      />
      <Sidebar collapsed={sidebarCollapsed} />
      <main className={cn(
        "pt-14 transition-all duration-300",
        sidebarCollapsed ? "pl-16" : "pl-60"
      )}>
        <div className="px-8 py-6 min-h-[calc(100vh-56px)]">
          <Outlet />
        </div>
      </main>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}