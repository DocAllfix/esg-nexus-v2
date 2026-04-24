import { useState } from "react";
import { CheckCircle2, Clock, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormStatuses } from "@/hooks/useFormData";
import Form03A from "./Form03A";
import Form03B from "./Form03B";
import Form03C from "./Form03C";
import Form03D from "./Form03D";
import Form03E from "./Form03E";
import Form03F from "./Form03F";
import Form03G from "./Form03G";
import Form03H from "./Form03H";

const FASI = [
  { code: "03A", label: "Piano di Audit", sub: "Fase 3.1", component: Form03A },
  { code: "03B", label: "Inventario Documenti", sub: "Fase 3.2", component: Form03B },
  { code: "03C", label: "Audit Ambientale (E)", sub: "Fase 3.3", component: Form03C },
  { code: "03D", label: "Audit Sociale (S)", sub: "Fase 3.4", component: Form03D },
  { code: "03E", label: "Audit Governance (G)", sub: "Fase 3.5", component: Form03E },
  { code: "03F", label: "Gap Register", sub: "Fase 3.6", component: Form03F },
  { code: "03G", label: "Report Diagnosi ESG", sub: "Fase 3.7", component: Form03G },
  { code: "03H", label: "Chiusura Fase 3", sub: "LOG-03", component: Form03H },
];

const STATUS_ICONS = {
  completato: <CheckCircle2 size={14} className="text-green-600 shrink-0" />,
  in_corso: <Clock size={14} className="text-amber-500 shrink-0" />,
  non_iniziato: <Circle size={14} className="text-gray-400 shrink-0" />,
};

export default function TabProc03({ engagementId }) {
  const [active, setActive] = useState("03A");
  const { statuses, progresso } = useFormStatuses(engagementId, "PROC-03");

  const ActiveComponent = FASI.find(f => f.code === active)?.component;

  return (
    <div className="flex gap-6 min-h-full">
      <aside className="w-56 shrink-0">
        <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PROC-03</p>
            <p className="text-sm font-semibold mt-0.5">Gap Analysis</p>
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
        {ActiveComponent && <ActiveComponent engagementId={engagementId} />}
      </div>
    </div>
  );
}
