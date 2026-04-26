import { useState } from "react";
import { CheckCircle2, Clock, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormStatuses } from "@/hooks/useFormData";
import Form01A from "./Form01A";
import Form01B from "./Form01B";
import Form01C from "./Form01C";
import Form01D from "./Form01D";
import Form01E from "./Form01E";
import Form01F from "./Form01F";
import Form01G from "./Form01G";
import Form01H from "./Form01H";

const FASI = [
  { code: "01A", label: "Contratto Incarico", sub: "Fase 1.1", component: Form01A },
  { code: "01B", label: "Apertura Progetto e Team", sub: "Fase 1.2", component: Form01B },
  { code: "01C", label: "Perimetro Rendicontazione", sub: "Fase 1.3", component: Form01C },
  { code: "01D", label: "Piano Progetto / Gantt", sub: "Fase 1.4", component: Form01D },
  { code: "01E", label: "Verbale Kick-off", sub: "Fase 1.5", component: Form01E },
  { code: "01F", label: "Referenti + RACI", sub: "Fase 1.6", component: Form01F },
  { code: "01G", label: "Risk Register", sub: "Fase 1.7", component: Form01G },
  { code: "01H", label: "Setup Operativo", sub: "Fase 1.8", component: Form01H },
];

const STATUS_ICONS = {
  completato: <CheckCircle2 size={14} className="text-green-600 shrink-0" />,
  in_corso: <Clock size={14} className="text-amber-500 shrink-0" />,
  non_iniziato: <Circle size={14} className="text-gray-400 shrink-0" />,
};

export default function TabProc01({ engagementId }) {
  const [active, setActive] = useState("01A");
  const { statuses, progresso } = useFormStatuses(engagementId, "PROC-01");

  const ActiveComponent = FASI.find(f => f.code === active)?.component;

  return (
    <div className="flex gap-6 min-h-full">
      <aside className="w-56 shrink-0 print:hidden">
        <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PROC-01</p>
            <p className="text-sm font-semibold mt-0.5">Avvio Rapporto</p>
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
