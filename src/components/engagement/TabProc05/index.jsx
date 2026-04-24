import { useState } from "react";
import { CheckCircle2, Clock, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Form05A from "./Form05A";
import Form05B from "./Form05B";
import Form05C from "./Form05C";
import Form05D from "./Form05D";
import Form05E from "./Form05E";
import Form05F from "./Form05F";
import Form05G from "./Form05G";
import Form05LOG from "./Form05LOG";

const FASI = [
  { code: "05A", label: "Visione Strategica", sub: "Fase 5.1", component: Form05A },
  { code: "05B", label: "Obiettivi SMART", sub: "Fase 5.2", component: Form05B },
  { code: "05C", label: "Target Quantitativi / SBTi", sub: "Fase 5.3", component: Form05C },
  { code: "05D", label: "Catalogo Iniziative", sub: "Fase 5.4", component: Form05D },
  { code: "05E", label: "Budget 3 Anni", sub: "Fase 5.5", component: Form05E },
  { code: "05F", label: "Roadmap", sub: "Fase 5.6", component: Form05F },
  { code: "05G", label: "Workshop CdA", sub: "Fase 5.7", component: Form05G },
  { code: "05LOG", label: "Chiusura Fase 5", sub: "LOG-05", component: Form05LOG },
];

const STATUS_ICONS = {
  completato: <CheckCircle2 size={14} className="text-green-600 shrink-0" />,
  in_corso: <Clock size={14} className="text-amber-500 shrink-0" />,
  non_iniziato: <Circle size={14} className="text-gray-400 shrink-0" />,
};

export default function TabProc05() {
  const [active, setActive] = useState("05A");
  const [statuses] = useState({
    "05A": "completato", "05B": "completato", "05C": "non_iniziato",
    "05D": "in_corso", "05E": "in_corso", "05F": "non_iniziato",
    "05G": "non_iniziato", "05LOG": "non_iniziato",
  });

  const ActiveComponent = FASI.find(f => f.code === active)?.component;
  const completati = Object.values(statuses).filter(s => s === "completato").length;
  const progresso = Math.round((completati / FASI.length) * 100);

  return (
    <div className="flex gap-6 min-h-full">
      <aside className="w-56 shrink-0">
        <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PROC-05</p>
            <p className="text-sm font-semibold mt-0.5">Piano di Azione ESG</p>
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