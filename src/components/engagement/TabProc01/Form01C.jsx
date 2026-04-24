import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Circle } from "lucide-react";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const STORAGE_KEY = "esg_form_01C";
const INITIAL = acmeFormData["01C"] ?? {};

const STATI = {
  completata: { label: "Completata", cls: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
  in_corso: { label: "In corso", cls: "bg-teal-100 text-teal-800 border-teal-200", icon: Clock },
  non_iniziata: { label: "Non iniziata", cls: "bg-gray-100 text-gray-500 border-gray-200", icon: Circle },
};

const PROCS = ["PROC-00", "PROC-01", "PROC-02", "PROC-03", "PROC-04", "PROC-05", "PROC-06", "PROC-07"];
const PROC_COLORS = {
  "PROC-00": "bg-gray-100 text-gray-700",
  "PROC-01": "bg-blue-100 text-blue-800",
  "PROC-02": "bg-purple-100 text-purple-800",
  "PROC-03": "bg-amber-100 text-amber-800",
  "PROC-04": "bg-orange-100 text-orange-800",
  "PROC-05": "bg-teal-100 text-teal-800",
  "PROC-06": "bg-green-100 text-green-800",
  "PROC-07": "bg-indigo-100 text-indigo-800",
};

export default function Form01C() {
  const [milestone, setMilestone] = useState(INITIAL.milestone || []);
  const setMs = (i, k, v) => setMilestone(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });

  const completate = milestone.filter(m => m.stato === "completata").length;
  const inCorso = milestone.filter(m => m.stato === "in_corso").length;

  return (
    <FormWrapper
      formCode="FORM-01C"
      title="Piano di Progetto — Milestone"
      subtitle="Gantt semplificato con milestone principali del progetto"
      meta={{ "Fase": "PROC-01.3", "Resp.": "Project Manager", "Output": "Baseline Gantt approvata" }}
      ruleBox="📅 Aggiornare date effettive ad ogni milestone raggiunta. Le milestone in ritardo >7 giorni richiedono notifica al partner."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >
      {/* KPI */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Totale", value: milestone.length, color: "text-foreground" },
          { label: "Completate", value: completate, color: "text-green-700" },
          { label: "In corso", value: inCorso, color: "text-teal-700" },
          { label: "Non iniziate", value: milestone.length - completate - inCorso, color: "text-muted-foreground" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Milestone di progetto" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-3 py-2 w-10">ID</th>
                <th className="text-left px-3 py-2 w-24">Fase</th>
                <th className="text-left px-3 py-2">Milestone</th>
                <th className="px-3 py-2 text-center">Target</th>
                <th className="px-3 py-2 text-center">Effettiva</th>
                <th className="px-3 py-2 text-center">Stato</th>
                <th className="text-left px-3 py-2">Resp.</th>
              </tr>
            </thead>
            <tbody>
              {milestone.map((m, i) => {
                const cfg = STATI[m.stato] || STATI.non_iniziata;
                const Icon = cfg.icon;
                const isLate = m.stato !== "completata" && m.data_target && new Date(m.data_target) < new Date();
                return (
                  <tr key={m.id} className={cn("border-t border-border hover:bg-muted/20", isLate && "bg-red-50/40")}>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{m.id}</td>
                    <td className="px-3 py-2">
                      <select value={m.proc} onChange={e => setMs(i, "proc", e.target.value)} className={cn("text-xs font-medium px-2 py-0.5 rounded border border-border", PROC_COLORS[m.proc])}>
                        {PROCS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2 font-medium">{m.nome}</td>
                    <td className="px-3 py-2 text-center">
                      <input type="date" value={m.data_target} onChange={e => setMs(i, "data_target", e.target.value)} className={cn("border border-border rounded px-2 py-0.5 text-xs bg-background", isLate && "border-red-400")} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="date" value={m.data_effettiva} onChange={e => setMs(i, "data_effettiva", e.target.value)} className="border border-border rounded px-2 py-0.5 text-xs bg-background" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <select value={m.stato} onChange={e => setMs(i, "stato", e.target.value)} className={cn("text-xs font-medium px-2 py-0.5 rounded border", cfg.cls)}>
                        {Object.entries(STATI).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input value={m.resp} onChange={e => setMs(i, "resp", e.target.value)} className="w-24 border border-border rounded px-2 py-0.5 text-xs bg-background" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormSection>

      {/* GANTT VISIVO SEMPLIFICATO */}
      <FormSection title="Cronoprogramma visivo" cols={1}>
        <div className="space-y-1.5">
          {milestone.map(m => {
            const cfg = STATI[m.stato] || STATI.non_iniziata;
            return (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-8">{m.id}</span>
                <span className={cn("text-xs px-1.5 py-0.5 rounded border shrink-0", PROC_COLORS[m.proc])}>{m.proc}</span>
                <span className="text-xs flex-1 truncate">{m.nome}</span>
                <span className="text-xs text-muted-foreground w-24 text-right shrink-0">{m.data_target}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full border shrink-0", cfg.cls)}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </FormSection>
    </FormWrapper>
  );
}