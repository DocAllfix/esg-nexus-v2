import { cn } from "@/lib/utils";

const RACI_ROLES = ["PM Consul.", "CS ESG", "Ref. ESG", "HR", "Operations", "Legale", "CEO"];

const RACI_ROWS = [
  { task: "Definizione perimetro",      proc: "PROC-01", raci: ["A", "C", "R", "I", "I", "C", "A"] },
  { task: "Analisi di materialità",     proc: "PROC-02", raci: ["R", "A", "C", "C", "C", "I", "I"] },
  { task: "Gap analysis E",             proc: "PROC-03", raci: ["R", "A", "I", "I", "C", "I", "I"] },
  { task: "Gap analysis S",             proc: "PROC-03", raci: ["R", "A", "I", "R", "C", "C", "I"] },
  { task: "Gap analysis G",             proc: "PROC-03", raci: ["R", "A", "I", "I", "I", "R", "A"] },
  { task: "Raccolta dati ambientali",   proc: "PROC-04", raci: ["C", "I", "R", "I", "R", "I", "I"] },
  { task: "Raccolta dati HR/Sociale",   proc: "PROC-04", raci: ["C", "I", "R", "R", "C", "C", "I"] },
  { task: "Raccolta dati governance",   proc: "PROC-04", raci: ["C", "I", "R", "I", "I", "R", "A"] },
  { task: "Roadmap e Piano ESG",        proc: "PROC-05", raci: ["R", "A", "C", "C", "C", "I", "I"] },
  { task: "Redazione Bilancio",         proc: "PROC-06", raci: ["R", "A", "C", "C", "C", "C", "I"] },
  { task: "Revisione e approvazione",   proc: "PROC-06", raci: ["C", "A", "C", "I", "I", "I", "R"] },
  { task: "Assurance esterna",          proc: "PROC-06", raci: ["C", "A", "I", "I", "I", "I", "I"] },
  { task: "Pubblicazione",              proc: "PROC-06", raci: ["C", "A", "R", "I", "I", "I", "A"] },
  { task: "Chiusura e follow-up",       proc: "PROC-07", raci: ["R", "A", "C", "I", "I", "I", "I"] },
];

const RACI_CELL_STYLE = {
  R: "bg-primary/15 text-primary font-bold",
  A: "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold",
  C: "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold",
  I: "text-muted-foreground",
};

const PROC_COLOR = {
  "PROC-01": "text-teal-600 dark:text-teal-400",
  "PROC-02": "text-amber-600 dark:text-amber-400",
  "PROC-03": "text-blue-600 dark:text-blue-400",
  "PROC-04": "text-purple-600 dark:text-purple-400",
  "PROC-05": "text-teal-600 dark:text-teal-400",
  "PROC-06": "text-orange-600 dark:text-orange-400",
  "PROC-07": "text-slate-500",
};

export default function RaciMatrix() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">👥 Matrice RACI — Responsabilità per attività trasversale ai processi ESG</p>
        <div className="flex items-center gap-5 text-[11px] flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex w-5 h-5 rounded items-center justify-center bg-primary/15 text-primary font-bold text-[11px]">R</span>
            <span className="text-muted-foreground">Responsible — Chi esegue</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex w-5 h-5 rounded items-center justify-center bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-[11px]">A</span>
            <span className="text-muted-foreground">Accountable — Chi risponde</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex w-5 h-5 rounded items-center justify-center bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">C</span>
            <span className="text-muted-foreground">Consulted — Chi viene consultato</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex w-5 h-5 rounded items-center justify-center border border-border text-muted-foreground text-[11px]">I</span>
            <span className="text-muted-foreground">Informed — Chi viene informato</span>
          </span>
        </div>
      </div>

      {/* Tabella */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px] min-w-[180px]">Attività</th>
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">Processo</th>
                {RACI_ROLES.map(r => (
                  <th key={r} className="px-3 py-3 text-center font-semibold text-muted-foreground uppercase tracking-widest text-[10px] whitespace-nowrap">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RACI_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-foreground">{row.task}</td>
                  <td className={cn("px-3 py-2.5 font-mono text-[10px] font-semibold", PROC_COLOR[row.proc])}>{row.proc}</td>
                  {row.raci.map((cell, j) => (
                    <td key={j} className="px-3 py-2.5 text-center">
                      <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded text-[11px]", RACI_CELL_STYLE[cell] || "")}>
                        {cell}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}