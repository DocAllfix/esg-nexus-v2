import { Bell, Search, ChevronDown, LogOut, Settings, Menu, Sun, Moon, User, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/lib/ThemeContext";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/api/supabaseClient";
import SyncIndicator, { OfflineBadge } from "@/components/common/SyncIndicator";
import { cn } from "@/lib/utils";

function formatRelativeTime(isoString) {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "adesso";
  if (m < 60) return `${m} min fa`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h fa`;
  return `${Math.floor(h / 24)}g fa`;
}

function getEventIcon(tipo) {
  if (tipo === "successo") return CheckCircle2;
  if (tipo === "warning") return AlertTriangle;
  return Clock;
}

function NotificationPanel() {
  const { data: events = [] } = useQuery({
    queryKey: ["notifiche-topbar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("eventi_log")
        .select("id, titolo, descrizione, tipo, created_at")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors" aria-label="Notifiche">
          <Bell size={18} />
          {events.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold">Notifiche recenti</p>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {events.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nessuna notifica</p>
          ) : events.map(ev => {
            const Icon = getEventIcon(ev.tipo);
            return (
              <div key={ev.id} className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  ev.tipo === "successo" ? "bg-green-500/10" : ev.tipo === "warning" ? "bg-amber-500/10" : "bg-muted"
                )}>
                  <Icon size={12} className={
                    ev.tipo === "successo" ? "text-green-600 dark:text-green-400" :
                    ev.tipo === "warning" ? "text-amber-600 dark:text-amber-400" :
                    "text-muted-foreground"
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">{ev.titolo}</p>
                  {ev.descrizione && <p className="text-xs text-muted-foreground mt-0.5">{ev.descrizione}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(ev.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(user) {
  const meta = user?.user_metadata;
  if (meta?.full_name) {
    return meta.full_name
      .split(" ")
      .map(p => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return (user?.email ?? "?").slice(0, 2).toUpperCase();
}

function getDisplayName(user) {
  return user?.user_metadata?.full_name ?? user?.email ?? "Utente";
}

export default function Topbar({ onToggleSidebar, onOpenCommandPalette }) {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch {
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center border-b border-border bg-card px-4 gap-4 print:hidden">
      <div className="flex items-center gap-3 w-60 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <span className="font-semibold text-base tracking-tight text-primary">ESG Suite</span>
      </div>

      <button
        onClick={onOpenCommandPalette}
        className="flex-1 max-w-lg flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-muted text-muted-foreground text-sm hover:border-ring transition-colors text-left"
      >
        <Search size={15} />
        <span className="flex-1">Cerca cliente, engagement, KPI…</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-xs font-mono">⌘K</kbd>
      </button>

      <div className="flex-1" />

      <OfflineBadge />
      <SyncIndicator />

      <button
        onClick={toggle}
        className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        aria-label={dark ? "Passa al tema chiaro" : "Passa al tema scuro"}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <NotificationPanel />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
              {getInitials(user)}
            </div>
            <span className="text-sm font-medium hidden sm:block">{getDisplayName(user)}</span>
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
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut size={14} className="mr-2" /> Esci
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
