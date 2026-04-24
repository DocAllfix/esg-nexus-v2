import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Select } from "@/components/common/FormWrapper";
import { Plus, Trash2 } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const capitoliBilancio = [];

const STORAGE_KEY = "esg_form_06A";
const STATI = ["bozza", "revisione", "approvato"];
const TEAM = ["Elena Mancini", "Luca Ferri", "Sara Greco", "Mario Testa"];

export default function Form06A() {
  const [capitoli, setCapitoli] = useState(capitoliBilancio);

  const setRow = (n, k, v) => setCapitoli(p => p.map(c => c.n === n ? { ...c, [k]: v } : c));
  const add = () => setCapitoli(p => [...p, { n: p.length + 1, titolo: "Nuovo capitolo", parole: 0, target: 1000, stato: "bozza", assegnato: "Elena Mancini" }]);
  const remove = (n) => setCapitoli(p => p.filter(c => c.n !== n));

  const approvati = capitoli.filter(c => c.stato === "approvato").length;
  const parole_tot = capitoli.reduce((s, c) => s + c.parole, 0);
  const target_tot = capitoli.reduce((s, c) => s + c.target, 0);
  const pct_global = Math.round((parole_tot / target_tot) * 100);

  return (
    <FormWrapper
      formCode="FORM-06A"
      title="Struttura Capitoli Bilancio"
      subtitle="Architettura del documento: 15 capitoli con assegnazione, stato e avanzamento"
      meta={{ "Capitoli": capitoli.length, "Approvati": `${approvati}/${capitoli.length}`, "Parole totali": `${parole_tot.toLocaleString("it-IT")} / ${target_tot.toLocaleString("it-IT")}` }}
      ruleBox="📄 La struttura deve essere approvata dal Partner prima di avviare la stesura. Ogni capitolo deve indicare il responsabile di redazione e il target parole."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* KPI HEADER */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Capitoli approvati", value: `${approvati}/${capitoli.length}`, color: approvati === capitoli.length ? "text-green-700" : "text-amber-600" },
          { label: "In revisione", value: capitoli.filter(c => c.stato === "revisione").length, color: "text-blue-600" },
          { label: "Bozza", value: capitoli.filter(c => c.stato === "bozza").length, color: "text-muted-foreground" },
          { label: "Completamento testi", value: `${pct_global}%`, color: pct_global >= 100 ? "text-green-700" : "text-primary" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Elenco capitoli" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["N.", "Titolo capitolo", "Parole / Target", "Avanz.", "Stato", "Assegnato", ""].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {capitoli.map(cap => {
                const pct = Math.min(100, Math.round((cap.parole / cap.target) * 100));
                return (
                  <tr key={cap.n} className="hover:bg-muted/20">
                    <td className="px-3 py-2 font-bold w-8">{cap.n}</td>
                    <td className="px-3 py-2">
                      <input value={cap.titolo} onChange={e => setRow(cap.n, "titolo", e.target.value)} className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 font-medium" />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <input type="number" value={cap.parole} onChange={e => setRow(cap.n, "parole", Number(e.target.value))} className="w-16 border border-border rounded px-1.5 py-0.5 bg-background text-right" />
                        <span className="text-muted-foreground">/</span>
                        <input type="number" value={cap.target} onChange={e => setRow(cap.n, "target", Number(e.target.value))} className="w-16 border border-border rounded px-1.5 py-0.5 bg-background text-right" />
                      </div>
                    </td>
                    <td className="px-3 py-2 w-24">
                      <div className="flex items-center gap-1">
                        <div className="flex-1 h-1.5 bg-muted rounded-full">
                          <div className={cn("h-full rounded-full", pct >= 100 ? "bg-green-500" : pct >= 70 ? "bg-primary" : "bg-amber-500")} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-muted-foreground w-8 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <select value={cap.stato} onChange={e => setRow(cap.n, "stato", e.target.value)} className={cn("text-xs rounded border px-1.5 py-0.5 font-medium",
                        cap.stato === "approvato" ? "bg-green-100 text-green-800 border-green-200" :
                        cap.stato === "revisione" ? "bg-amber-100 text-amber-800 border-amber-200" :
                        "bg-gray-100 text-gray-600 border-gray-200"
                      )}>
                        {STATI.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select value={cap.assegnato} onChange={e => setRow(cap.n, "assegnato", e.target.value)} className="border border-border rounded px-1.5 py-0.5 text-xs bg-background">
                        {TEAM.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <button onClick={() => remove(cap.n)} className="text-muted-foreground hover:text-red-500"><Trash2 size={12} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
          <Plus size={14} /> Aggiungi capitolo
        </button>
      </FormSection>
    </FormWrapper>
  );
}