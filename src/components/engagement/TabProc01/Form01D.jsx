import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const STORAGE_KEY = "esg_form_01D";
const INITIAL = acmeFormData["01D"] ?? {};

const RUOLI_COLS = [
  { key: "fabbricini", label: "Fabbricini", sub: "Partner" },
  { key: "mancini", label: "Mancini", sub: "Cons. Sr." },
  { key: "ferri", label: "Ferri", sub: "Analista" },
  { key: "rossetti", label: "Rossetti", sub: "CEO" },
  { key: "caputo", label: "Caputo", sub: "CFO" },
  { key: "ferretti", label: "Ferretti", sub: "HR Mgr" },
  { key: "neri", label: "Neri", sub: "Resp. Prod." },
];

const RACI_VALUES = ["R", "A", "C", "I", ""];
const RACI_COLORS = {
  R: "bg-primary text-primary-foreground",
  A: "bg-purple-600 text-white",
  C: "bg-amber-500 text-white",
  I: "bg-gray-400 text-white",
  "": "bg-transparent text-transparent",
};

export default function Form01D() {
  const [attivita, setAttivita] = useState(INITIAL.attivita || []);
  const setRaci = (i, col, v) => setAttivita(p => { const n = [...p]; n[i] = { ...n[i], [col]: v }; return n; });

  const PROCS_COLORS = {
    "PROC-01": "bg-blue-50 text-blue-700",
    "PROC-02": "bg-purple-50 text-purple-700",
    "PROC-03": "bg-amber-50 text-amber-700",
    "PROC-04": "bg-orange-50 text-orange-700",
    "PROC-05": "bg-teal-50 text-teal-700",
    "PROC-06": "bg-green-50 text-green-700",
    "PROC-07": "bg-indigo-50 text-indigo-700",
  };

  return (
    <FormWrapper
      formCode="FORM-01D"
      title="Matrice RACI"
      subtitle="Responsabilità e accountability per ogni attività del progetto"
      meta={{ "Fase": "PROC-01.4", "Resp.": "Project Manager", "Output": "RACI condiviso e firmato" }}
      ruleBox="🎯 R = Responsible (esegue) · A = Accountable (risponde) · C = Consulted (consultato) · I = Informed (informato). Ogni riga deve avere esattamente 1 A e almeno 1 R."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >
      {/* LEGENDA */}
      <div className="flex flex-wrap gap-3">
        {[["R", "Responsible — chi esegue"], ["A", "Accountable — chi risponde"], ["C", "Consulted — chi viene consultato"], ["I", "Informed — chi viene informato"]].map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className={cn("w-6 h-6 rounded flex items-center justify-center text-xs font-bold", RACI_COLORS[k])}>{k}</span>
            <span className="text-xs text-muted-foreground">{v}</span>
          </div>
        ))}
      </div>

      <FormSection title="Assegnazione RACI" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-3 py-2.5 w-16 font-semibold">Proc.</th>
                <th className="text-left px-3 py-2.5 font-semibold">Attività</th>
                {RUOLI_COLS.map(col => (
                  <th key={col.key} className="px-2 py-2 text-center w-16 font-semibold">
                    <div>{col.label}</div>
                    <div className="font-normal text-muted-foreground text-[10px]">{col.sub}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attivita.map((a, i) => {
                const rCount = RUOLI_COLS.filter(c => a[c.key] === "R").length;
                const aCount = RUOLI_COLS.filter(c => a[c.key] === "A").length;
                const rowWarning = rCount === 0 || aCount !== 1;
                return (
                  <tr key={a.id} className={cn("border-t border-border hover:bg-muted/20", rowWarning && "bg-amber-50/40")}>
                    <td className="px-3 py-2">
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", PROCS_COLORS[a.proc])}>{a.proc}</span>
                    </td>
                    <td className="px-3 py-2 font-medium">{a.nome}</td>
                    {RUOLI_COLS.map(col => (
                      <td key={col.key} className="px-2 py-1.5 text-center">
                        <select
                          value={a[col.key] || ""}
                          onChange={e => setRaci(i, col.key, e.target.value)}
                          className={cn("w-10 h-7 rounded text-xs font-bold text-center cursor-pointer border-0 appearance-none", RACI_COLORS[a[col.key] || ""])}
                        >
                          {RACI_VALUES.map(v => <option key={v} value={v}>{v || "—"}</option>)}
                        </select>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormSection>

      {/* STATISTICHE */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {RUOLI_COLS.map(col => {
          const rCount = attivita.filter(a => a[col.key] === "R").length;
          const aCount = attivita.filter(a => a[col.key] === "A").length;
          return (
            <div key={col.key} className="bg-muted/30 rounded-lg p-3 border border-border">
              <p className="text-sm font-semibold">{col.label}</p>
              <p className="text-xs text-muted-foreground">{col.sub}</p>
              <div className="mt-2 flex gap-3 text-xs">
                <span className={cn("px-1.5 py-0.5 rounded font-bold", RACI_COLORS["R"])}>R×{rCount}</span>
                <span className={cn("px-1.5 py-0.5 rounded font-bold", RACI_COLORS["A"])}>A×{aCount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </FormWrapper>
  );
}