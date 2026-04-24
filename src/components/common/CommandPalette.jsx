import { useState, useEffect } from "react";
import { Search, Briefcase, Users, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

// TODO: Replace with Supabase hook
const clienti = [];
const engagements = [];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

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

  const results = [
    ...engagements.filter(e =>
      e.project_code.toLowerCase().includes(query.toLowerCase()) ||
      e.cliente_nome.toLowerCase().includes(query.toLowerCase())
    ).map(e => ({ tipo: "engagement", icon: Briefcase, label: e.project_code, sub: e.cliente_nome, to: `/engagements/${e.id}` })),
    ...clienti.filter(c =>
      c.ragione_sociale.toLowerCase().includes(query.toLowerCase())
    ).map(c => ({ tipo: "cliente", icon: Users, label: c.ragione_sociale, sub: c.settore, to: `/clienti/${c.id}` })),
  ];

  const shortcuts = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/" },
    { icon: Users, label: "Clienti", to: "/clienti" },
    { icon: Briefcase, label: "Engagement", to: "/engagements" },
  ];

  const displayed = query ? results : shortcuts;

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
              key={i}
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