import { useState } from "react";
import { CheckCircle2, Clock, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Form07A from "./Form07A";
import Form07B from "./Form07B";
import Form07C from "./Form07C";
import Form07D from "./Form07D";
import Form07E from "./Form07E";
import Form07F from "./Form07F";
import Form07G from "./Form07G";
import Form07LOG from "./Form07LOG";

const FASI = [
  { code: "07A", label: "Dossier finale", sub: "Fase 7.1", component: Form07A },
  { code: "07B", label: "Soddisfazione & NPS", sub: "Fase 7.2", component: Form07B },
  { code: "07C", label: "Proposta rinnovo", sub: "Fase 7.3", component: Form07C },
  { code: "07D", label: "Follow-up 30 gg", sub: "Fase 7.4", component: Form07D },
  { code: "07E", label: "Follow-up 3 Mesi", sub: "Fase 7.5", component: Form07E },
  { code: "07F", label: "Lesson Learned", sub: "Fase 7.6", component: Form07F },
  { code: "07G", label: "Chiusura formale", sub: "Fase 7.7", component: Form07G },
  { code: "07LOG", label: "Chiusura Engagement", sub: "LOG-07 Finale", component: Form07LOG },
];

const STATUS_ICONS = {
  completato: <CheckCircle2 size={14} className="text-green-600 shrink-0" />,
  in_corso: <Clock size={14} className="text-amber-500 shrink-0" />,
  non_iniziato: <Circle size={14} className="text-gray-400 shrink-0" />,
};

export default function TabProc07() {
  const [active, setActive] = useState("07B");
  const [statuses] = useState({
    "07A": "completato", "07B": "completato", "07C": "in_corso",
    "07D": "in_corso", "07E": "non_iniziato", "07F": "non_iniziato",
    "07G": "non_iniziato", "07LOG": "non_iniziato",
  });

  const ActiveComponent = FASI.find(f => f.code === active)?.component;
  const completati = Object.values(statuses).filter(s => s === "completato").length;
  const progresso = Math.round((completati / FASI.length) * 100);

  return (
    <div className="flex gap-6 min-h-full">
      <aside className="w-56 shrink-0">
        <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PROC-07</p>
            <p className="text-sm font-semibold mt-0.5">Chiusura Engagement</p>
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