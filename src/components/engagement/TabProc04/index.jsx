import { useState } from "react";
import { CheckCircle2, Clock, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Form04A from "./Form04A";
import Form04B from "./Form04B";
import Form04C from "./Form04C";
import Form04D from "./Form04D";
import Form04E from "./Form04E";
import Form04F from "./Form04F";
import Form04G from "./Form04G";

const FASI = [
  { code: "04A", label: "Piano Raccolta Dati", sub: "Fase 4.1", component: Form04A },
  { code: "04B", label: "Calcoli GHG Scope 1/2/3", sub: "Fase 4.2", component: Form04B },
  { code: "04C", label: "KPI Ambientali (E)", sub: "Fase 4.3", component: Form04C },
  { code: "04D", label: "KPI Sociali (S)", sub: "Fase 4.4", component: Form04D },
  { code: "04E", label: "KPI Governance (G)", sub: "Fase 4.5", component: Form04E },
  { code: "04F", label: "Validazione Quality Check", sub: "Fase 4.6", component: Form04F },
  { code: "04G", label: "Freeze Dataset / LOG-04", sub: "Fase 4.7", component: Form04G },
];

const STATUS_ICONS = {
  completato: <CheckCircle2 size={14} className="text-green-600 shrink-0" />,
  in_corso: <Clock size={14} className="text-amber-500 shrink-0" />,
  non_iniziato: <Circle size={14} className="text-gray-400 shrink-0" />,
};

export default function TabProc04() {
  const [active, setActive] = useState("04A");
  const [statuses] = useState({
    "04A": "completato", "04B": "completato", "04C": "in_corso",
    "04D": "in_corso", "04E": "non_iniziato",
    "04F": "non_iniziato", "04G": "non_iniziato",
  });

  const ActiveComponent = FASI.find(f => f.code === active)?.component;
  const completati = Object.values(statuses).filter(s => s === "completato").length;
  const progresso = Math.round((completati / FASI.length) * 100);

  return (
    <div className="flex gap-6 min-h-full">
      <aside className="w-56 shrink-0">
        <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PROC-04</p>
            <p className="text-sm font-semibold mt-0.5">Raccolta Dati GHG & KPI</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progresso</span><span>{progresso}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progresso}%` }} />
              </div>
            </div>
          </div>
          <nav className="py-2">
            {FASI.map(fase => (
              <button
                key={fase.code}
                onClick={() => setActive(fase.code)}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors",
                  active === fase.code
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "hover:bg-muted text-foreground"
                )}
              >
                {STATUS_ICONS[statuses[fase.code] || "non_iniziato"]}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-semibold truncate", active === fase.code ? "text-primary" : "")}>
                    FORM-{fase.code}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{fase.label}</p>
                </div>
                {active === fase.code && <ChevronRight size={12} className="text-primary shrink-0" />}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}