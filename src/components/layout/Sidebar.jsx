import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Briefcase, BarChart3,
  BookOpen, Settings, ChevronDown, ChevronRight, GitBranch
} from "lucide-react";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const engagements = [];

const navMain = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Users, label: "Clienti", to: "/clienti" },
  { icon: Briefcase, label: "Engagement", to: "/engagements" },
  { icon: GitBranch, label: "Stato Avanzamento", to: "/stato-avanzamento" },
  { icon: BarChart3, label: "Analytics", to: "/analytics" },
];

const navTools = [
  { icon: BookOpen, label: "Cataloghi", to: "/cataloghi" },
  { icon: Settings, label: "Impostazioni", to: "/impostazioni" },
];

const statoColori = {
  MATERIALITA_IN_CORSO: "bg-green-500",
  DATI_VALIDAZIONE: "bg-green-500",
  BIL_PUBBLICATO: "bg-gray-900",
  CONTRATTO_FIRMATO: "bg-purple-500",
  ACQUISIZIONE: "bg-blue-500",
  CRITICO: "bg-red-500",
};

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const [engOpen, setEngOpen] = useState(false);
  const attivi = engagements.filter(e => e.stato !== "BIL_PUBBLICATO").slice(0, 5);

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <aside className={cn(
      "fixed left-0 top-14 bottom-0 z-20 flex flex-col border-r border-border bg-card transition-all duration-300",
      collapsed ? "w-16" : "w-60"
    )}>
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {/* Sezione principale */}
        <div className="mb-6">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Principale
            </p>
          )}
          {navMain.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mb-0.5",
                isActive(item.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <item.icon size={17} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Engagement attivi shortcut */}
        {!collapsed && (
          <div className="mb-6">
            <button
              onClick={() => setEngOpen(!engOpen)}
              className="flex items-center justify-between w-full px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Engagement attivi</span>
              {engOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
            {engOpen && (
              <div className="space-y-0.5">
                {attivi.map((eng) => (
                  <Link
                    key={eng.id}
                    to={`/engagements/${eng.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-foreground hover:bg-muted transition-colors group"
                  >
                    <span className={cn("w-2 h-2 rounded-full shrink-0", statoColori[eng.stato] || "bg-gray-400")} />
                    <span className="font-mono text-xs text-muted-foreground shrink-0">{eng.project_code.split("-").slice(0,3).join("-")}</span>
                    <span className="truncate text-foreground">{eng.cliente_nome.split(" ")[0]}</span>
                  </Link>
                ))}
                <Link to="/engagements" className="block px-3 py-1.5 text-xs text-primary hover:underline">
                  Vedi tutti →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Strumenti */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Strumenti
            </p>
          )}
          {navTools.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors mb-0.5",
                isActive(item.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <item.icon size={17} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer sidebar */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground">ESG Suite v2.1</p>
          <p className="text-xs text-muted-foreground">© 2025 Studio Consulenza</p>
        </div>
      )}
    </aside>
  );
}