import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATI = ["bozza", "revisione", "approvato"];
const STATO_COLOR = {
  approvato: "bg-green-100 text-green-800 border-green-200",
  revisione: "bg-amber-100 text-amber-800 border-amber-200",
  bozza: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function Form06A({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "06A");

  const capitoli = d?.capitoli ?? [];
  const setRow = (n, k, v) => updateField("capitoli", capitoli.map(c => c.n === n ? { ...c, [k]: v } : c));
  const add = () => updateField("capitoli", [...capitoli, { n: capitoli.length + 1, titolo: "Nuovo capitolo", parole: 0, target: 1000, stato: "bozza", assegnato: "" }]);
  const remove = (n) => updateField("capitoli", capitoli.filter(c => c.n !== n));

  const approvati = capitoli.filter(c => c.stato === "approvato").length;
  const parole_tot = capitoli.reduce((s, c) => s + (c.parole || 0), 0);
  const target_tot = capitoli.reduce((s, c) => s + (c.target || 0), 0);
  const pct_global = target_tot > 0 ? Math.round((parole_tot / target_tot) * 100) : 0;

  return (
    <FormWrapper
      formCode="FORM-06A"
      title="Struttura Capitoli Bilancio"
      subtitle="Architettura del documento: capitoli con assegnazione, stato e avanzamento"
      meta={{ "Capitoli": capitoli.length, "Approvati": `${approvati}/${capitoli.length}`, "Parole totali": `${parole_tot.toLocaleString("it-IT")} / ${target_tot.toLocaleString("it-IT")}` }}
      ruleBox="La struttura deve essere approvata dal Partner prima di avviare la stesura. Ogni capitolo deve indicare il responsabile di redazione e il target parole."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Capitoli approvati", value: `${approvati}/${capitoli.length}`, color: approvati > 0 && approvati === capitoli.length ? "text-green-700" : "text-amber-600" },
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
                const pct = cap.target > 0 ? Math.min(100, Math.round(((cap.parole || 0) / cap.target) * 100)) : 0;
                return (
                  <tr key={cap.n} className="hover:bg-muted/20">
                    <td className="px-3 py-2 font-bold w-8">{cap.n}</td>
                    <td className="px-3 py-2">
                      <input value={cap.titolo || ""} onChange={e => setRow(cap.n, "titolo", e.target.value)} className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 font-medium" />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <input type="number" value={cap.parole || 0} onChange={e => setRow(cap.n, "parole", Number(e.target.value))} className="w-16 border border-border rounded px-1.5 py-0.5 bg-background text-right focus:outline-none" />
                        <span className="text-muted-foreground">/</span>
                        <input type="number" value={cap.target || 0} onChange={e => setRow(cap.n, "target", Number(e.target.value))} className="w-16 border border-border rounded px-1.5 py-0.5 bg-background text-right focus:outline-none" />
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
                      <select value={cap.stato || "bozza"} onChange={e => setRow(cap.n, "stato", e.target.value)} className={cn("text-xs rounded border px-1.5 py-0.5 font-medium", STATO_COLOR[cap.stato] || "bg-gray-100 text-gray-600 border-gray-200")}>
                        {STATI.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input value={cap.assegnato || ""} onChange={e => setRow(cap.n, "assegnato", e.target.value)} className="border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none" placeholder="Assegnato a..." />
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
