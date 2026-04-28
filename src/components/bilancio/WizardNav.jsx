import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const WIZARD_STEPS = [
  { id: 1, key: "verifica",       label: "Verifica dati",      desc: "Cosa è stato raccolto" },
  { id: 2, key: "identificazione", label: "Identificazione",    desc: "Codice, anno, framework" },
  { id: 3, key: "indici",         label: "Indici GRI / ESRS",  desc: "33 + 16 disclosure" },
  { id: 4, key: "capitoli",       label: "Capitoli",           desc: "15 sezioni del report" },
  { id: 5, key: "anteprima",      label: "Anteprima",          desc: "Documento finale" },
  { id: 6, key: "genera",         label: "Genera",             desc: "Esporta versione" },
];

export default function WizardNav({ currentStep, onStepChange, completedSteps = [] }) {
  return (
    <div className="border-b border-border bg-card">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {WIZARD_STEPS.map((s, i) => {
            const isActive = s.id === currentStep;
            const isDone = completedSteps.includes(s.id);
            const Icon = isDone ? CheckCircle2 : Circle;
            return (
              <button
                key={s.id}
                onClick={() => onStepChange(s.id)}
                className={cn(
                  "flex-1 min-w-0 flex items-start gap-2 px-3 py-2 rounded-md text-left transition-colors",
                  isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-muted/40 border border-transparent"
                )}
              >
                <Icon
                  size={16}
                  className={cn(
                    "shrink-0 mt-0.5",
                    isDone ? "text-green-600" : isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div className="min-w-0">
                  <div className={cn(
                    "text-xs font-semibold",
                    isActive ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {s.id}. {s.label}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
