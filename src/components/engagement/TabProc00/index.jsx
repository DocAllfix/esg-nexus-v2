import { useState } from "react";
import { CheckCircle2, Clock, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormStatuses } from "@/hooks/useFormData";
import Form00A from "./Form00A";
import Form00B from "./Form00B";
import Form00D from "./Form00D";
import Form00C from "./Form00C";
import Form00F from "./Form00F";
import Form00E from "./Form00E";
import Form00G from "./Form00G";

const FASI = [
  { code: "00A", label: "Primo Contatto", sub: "Fase 0.1–0.2", component: Form00A },
  { code: "00B", label: "Pre-Qualifica", sub: "Fase 0.3", component: Form00B },
  { code: "00D", label: "Conflitti Interesse", sub: "Fase 0.4", component: Form00D },
  { code: "00C", label: "Score", sub: "Fase 0.5", component: Form00C },
  { code: "00F", label: "KYC Pre-contratto", sub: "Fase 0.6", component: Form00F },
  { code: "00E", label: "Offerta", sub: "Fase 0.7", component: Form00E },
  { code: "00G", label: "Chiusura Fase 0", sub: "Fase finale", component: Form00G },
];

const STATUS_ICONS = {
  completato: <CheckCircle2 size={14} className="text-green-600 shrink-0" />,
  in_corso: <Clock size={14} className="text-amber-500 shrink-0" />,
  non_iniziato: <Circle size={14} className="text-gray-400 shrink-0" />,
};

export default function TabProc00({ engagementId }) {
  const [active, setActive] = useState("00A");
  const { statuses, progresso } = useFormStatuses(engagementId, "PROC-00");

  const ActiveComponent = FASI.find(f => f.code === active)?.component;

  return (
    <div className="flex gap-6 min-h-full">
      {/* SIDEBAR */}
      <aside className="w-56 shrink-0">
        <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-0">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">PROC-00</p>
            <p className="text-sm font-semibold mt-0.5">Acquisizione Cliente</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progresso</span>
                <span>{progresso}%</span>
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
                  "w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors group",
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

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        {ActiveComponent && <ActiveComponent engagementId={engagementId} />}
      </div>
    </div>
  );
}
