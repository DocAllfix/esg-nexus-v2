import { useState } from "react";
import { CheckCircle2, Clock, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Form02A from "./Form02A";
import Form02B from "./Form02B";
import Form02C from "./Form02C";
import Form02D from "./Form02D";
import Form02E from "./Form02E";
import Form02F from "./Form02F";
import Form02G from "./Form02G";
import Form02H from "./Form02H";

const FASI = [
  { code: "02A", label: "Benchmark di Settore", sub: "Fase 2.1", component: Form02A },
  { code: "02B", label: "Mappatura Stakeholder", sub: "Fase 2.2", component: Form02B },
  { code: "02C", label: "Inventario IRO", sub: "Fase 2.3", component: Form02C },
  { code: "02D", label: "Valutazione Interna IRO", sub: "Fase 2.4", component: Form02D },
  { code: "02E", label: "Q. Stakeholder Interni", sub: "Fase 2.5", component: Form02E },
  { code: "02F", label: "Q. Stakeholder Esterni", sub: "Fase 2.5", component: Form02F },
  { code: "02G", label: "Ranking IRO Aggregato", sub: "Fase 2.6", component: Form02G },
  { code: "02H", label: "Matrice Materialità Finale", sub: "Fase 2.7", component: Form02H },
];

const STATUS_ICONS = {
  completato: <CheckCircle2 size={14} className="text-green-600 shrink-0" />,
  in_corso: <Clock size={14} className="text-amber-500 shrink-0" />,
  non_iniziato: <Circle size={14} className="text-gray-400 shrink-0" />,
};

export default function TabProc02() {
  const [active, setActive] = useState("02A");
  const [statuses] = useState({
    "02A": "completato", "02B": "completato", "02C": "completato",
    "02D": "in_corso", "02E": "in_corso",
    "02F": "non_iniziato", "02G": "non_iniziato", "02H": "non_iniziato",
  });

  const ActiveComponent = FASI.find(f => f.code === active)?.component;
  const completati = Object.values(statuses).filter(s => s === "completato").length;
  const progresso = Math.round((completati / FASI.length) * 100);

  return (
    <div className="flex gap-6 min-h-full">
      <aside className="w-56 shrink-0">
        <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PROC-02</p>
            <p className="text-sm font-semibold mt-0.5">Analisi di Materialità</p>
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