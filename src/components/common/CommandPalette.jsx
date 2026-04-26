import { useState, useEffect } from "react";
import { Search, Briefcase, Users, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClienti } from "@/hooks/useClienti";
import { useEngagements } from "@/hooks/useEngagements";

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: clienti = [] } = useClienti();
  const { data: engagements = [] } = useEngagements();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const q = query.toLowerCase();

  const engResults = engagements
    .filter(e => {
      if (!q) return false;
      const code = (e.codice_progetto ?? "").toLowerCase();
      const name = (e.clienti?.ragione_sociale ?? "").toLowerCase();
      return code.includes(q) || name.includes(q);
    })
    .slice(0, 6)
    .map(e => ({
      tipo: "engagement",
      icon: Briefcase,
      label: e.codice_progetto ?? "—",
      sub: e.clienti?.ragione_sociale ?? "—",
      to: `/engagements/${e.id}`,
    }));

  const cliResults = clienti
    .filter(c => {
      if (!q) return false;
      const name = (c.ragione_sociale ?? "").toLowerCase();
      const sett = (c.settore ?? "").toLowerCase();
      return name.includes(q) || sett.includes(q);
    })
    .slice(0, 6)
    .map(c => ({
      tipo: "cliente",
      icon: Users,
      label: c.ragione_sociale ?? "—",
      sub: c.settore ?? "",
      to: `/clienti/${c.id}`,
    }));

  const shortcuts = [
    { icon: LayoutDashboard, label: "Dashboard",  to: "/" },
    { icon: Users,           label: "Clienti",    to: "/clienti" },
    { icon: Briefcase,       label: "Engagement", to: "/engagements" },
  ];

  const displayed = query ? [...engResults, ...cliResults] : shortcuts;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-card border border-border rounded-xl shadow-md overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Cerca cliente, engagement, KPI…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd className="text-xs px-1.5 py-0.5 border border-border rounded font-mono text-muted-foreground">Esc</kbd>
        </div>
        <div className="py-2 max-h-80 overflow-y-auto">
          {displayed.length === 0 && (
            <p className="text-center py-8 text-sm text-muted-foreground">Nessun risultato trovato</p>
          )}
          {displayed.map((item, i) => (
            <button
              key={`${item.to}-${i}`}
              onClick={() => { navigate(item.to); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted text-left transition-colors"
            >
              <item.icon size={16} className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
