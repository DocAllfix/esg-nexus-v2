import { useState } from "react";
import { CheckCircle2, Clock, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormStatuses } from "@/hooks/useFormData";
import Form06A from "./Form06A";
import Form06B from "./Form06B";
import Form06C from "./Form06C";
import Form06D from "./Form06D";
import Form06E from "./Form06E";
import Form06F from "./Form06F";
import Form06G from "./Form06G";
import Form06H from "./Form06H";
import Form06LOG from "./Form06LOG";

const FASI = [
  { code: "06A",   label: "Struttura Capitoli",    component: Form06A },
  { code: "06B",   label: "Stesura Ambiente (E)",  component: Form06B },
  { code: "06C",   label: "Stesura Sociale (S)",   component: Form06C },
  { code: "06D",   label: "Stesura Governance (G)", component: Form06D },
  { code: "06E",   label: "Piano Editoriale",      component: Form06E },
  { code: "06F",   label: "Content Index GRI/ESRS", component: Form06F },
  { code: "06G",   label: "Assurance Esterna",     component: Form06G },
  { code: "06H",   label: "Pubblicazione / CdA",   component: Form06H },
  { code: "06LOG", label: "Chiusura Fase 6",        component: Form06LOG },
];

const STATUS_ICONS = {
  completato:   <CheckCircle2 size={14} className="text-green-600 shrink-0" />,
  in_corso:     <Clock size={14} className="text-amber-500 shrink-0" />,
  non_iniziato: <Circle size={14} className="text-gray-400 shrink-0" />,
};

export default function TabProc06({ engagementId }) {
  const [active, setActive] = useState("06A");
  const { statuses, progresso } = useFormStatuses(engagementId, "PROC-06");

  const ActiveComponent = FASI.find(f => f.code === active)?.component;

  return (
    <div className="flex gap-6 min-h-full">
      <aside className="w-56 shrink-0">
        <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PROC-06</p>
            <p className="text-sm font-semibold mt-0.5">Bilancio Sostenibilità</p>
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
                {STATUS_ICONS[statuses?.[fase.code] || "non_iniziato"]}
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
        {ActiveComponent && <ActiveComponent engagementId={engagementId} />}
      </div>
    </div>
  );
}
