import { useState } from "react";
import { Bell, Search, User, ChevronDown, LogOut, Settings, Menu, Sun, Moon } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/ThemeContext";

export default function Topbar({ onToggleSidebar, onOpenCommandPalette }) {
  const [hasNotifications] = useState(true);
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center border-b border-border bg-card px-4 gap-4">
      {/* Logo + hamburger */}
      <div className="flex items-center gap-3 w-60 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <span className="font-semibold text-base tracking-tight text-primary">
          ESG Suite
        </span>
      </div>

      {/* Search */}
      <button
        onClick={onOpenCommandPalette}
        className="flex-1 max-w-lg flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-muted text-muted-foreground text-sm hover:border-ring transition-colors text-left"
      >
        <Search size={15} />
        <span className="flex-1">Cerca cliente, engagement, KPI…</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-xs font-mono">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Dark mode toggle */}
      <button
        onClick={toggle}
        className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        aria-label={dark ? "Passa al tema chiaro" : "Passa al tema scuro"}
        title={dark ? "Tema chiaro" : "Tema scuro"}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Notifiche */}
      <button className="relative p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors" aria-label="Notifiche">
        <Bell size={18} />
        {hasNotifications && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        )}
      </button>

      {/* Avatar menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
              LF
            </div>
            <span className="text-sm font-medium hidden sm:block">Ing. Luigi Fabbricini</span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => navigate("/impostazioni")}>
            <User size={14} className="mr-2" /> Profilo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/impostazioni")}>
            <Settings size={14} className="mr-2" /> Impostazioni
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/login")} className="text-red-600">
            <LogOut size={14} className="mr-2" /> Esci
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}