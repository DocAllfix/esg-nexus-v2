import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIORITA = ["CRITICA", "ALTA", "MEDIA", "BASSA"];
const AREE = ["E", "S", "G"];
const PAL_COLORS = {
  CRITICA: "border-red-300 bg-red-50/30",
  ALTA: "border-orange-300 bg-orange-50/20",
  MEDIA: "border-yellow-300 bg-yellow-50/10",
  BASSA: "border-border",
};
const BADGE_COLORS = {
  CRITICA: "bg-red-100 text-red-800 border-red-200",
  ALTA: "bg-orange-100 text-orange-800 border-orange-200",
  MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
  BASSA: "bg-gray-100 text-gray-600 border-gray-200",
};

export default function Form03F({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "03F");

  const gaps = d?.gaps ?? [];
  const [filtroArea, setFiltroArea] = useState("TUTTI");
  const [filtroPriorita, setFiltroPriorita] = useState("TUTTI");

  const setRow = (i, k, v) => { const n = [...gaps]; n[i] = { ...n[i], [k]: v }; updateField("gaps", n); };
  const remove = (id) => updateField("gaps", gaps.filter(g => g.id !== id));
  const add = () => updateField("gaps", [...gaps, { id: Date.now(), area: "E", codice: `GAP-${Date.now()}`, titolo: "", descrizione: "", ref: "", priorita: "MEDIA", effort: "Medio", action: "" }]);

  const filtered = gaps.filter(g =>
    (filtroArea === "TUTTI" || g.area === filtroArea) &&
    (filtroPriorita === "TUTTI" || g.priorita === filtroPriorita)
  );

  const stats = PRIORITA.map(p => ({ p, count: gaps.filter(g => g.priorita === p).length }));

  return (
    <FormWrapper
      formCode="FORM-03F"
      title="Sintesi Gap — Registro Completo"
      subtitle="Riepilogo di tutti i gap identificati per area, priorità e piano d'azione"
      meta={{ "Fase": "PROC-03.6", "Resp.": "Analista ESG", "Output": "Gap Register ufficiale" }}
      ruleBox="Il Gap Register alimenta direttamente il Piano di Azione ESG (PROC-05). Prioritizzare i gap CRITICI e ALTI per intervento immediato."
      ruleBoxType="warning"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.p} className={cn("rounded-lg p-3 text-center border", BADGE_COLORS[s.p])}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium">{s.p}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground self-center">Area:</span>
        {["TUTTI", "E", "S", "G"].map(a => (
          <button key={a} onClick={() => setFiltroArea(a)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filtroArea === a ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{a}</button>
        ))}
        <span className="text-xs text-muted-foreground self-center ml-2">Priorità:</span>
        {["TUTTI", ...PRIORITA].map(p => (
          <button key={p} onClick={() => setFiltroPriorita(p)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filtroPriorita === p ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{p}</button>
        ))}
      </div>

      <FormSection title={`Gap rilevati (${filtered.length})`} cols={1}>
        <div className="space-y-3">
          {filtered.map(gap => {
            const i = gaps.findIndex(g => g.id === gap.id);
            return (
              <div key={gap.id} className={cn("rounded-lg border p-4 space-y-2", PAL_COLORS[gap.priorita])}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    <span className="font-mono text-xs font-bold text-muted-foreground">{gap.codice}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", BADGE_COLORS[gap.priorita])}>{gap.priorita}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded font-bold">Area {gap.area}</span>
                    <input value={gap.titolo} onChange={e => setRow(i, "titolo", e.target.value)} className="flex-1 font-semibold text-sm bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 min-w-48" />
                  </div>
                  <button onClick={() => remove(gap.id)} className="text-muted-foreground hover:text-red-500 shrink-0"><Trash2 size={13} /></button>
                </div>
                <textarea value={gap.descrizione} onChange={e => setRow(i, "descrizione", e.target.value)} rows={2} className="w-full border border-border rounded px-2 py-1 text-xs bg-background resize-none" placeholder="Descrizione del gap..." />
                <div className="flex gap-3 text-xs flex-wrap">
                  <label className="flex items-center gap-1 text-muted-foreground">Ref: <input value={gap.ref} onChange={e => setRow(i, "ref", e.target.value)} className="border border-border rounded px-1 py-0.5 bg-background font-mono w-48" /></label>
                  <label className="flex items-center gap-1 text-muted-foreground">Effort: <input value={gap.effort} onChange={e => setRow(i, "effort", e.target.value)} className="border border-border rounded px-1 py-0.5 bg-background w-20" /></label>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Piano d'azione: </label>
                  <input value={gap.action} onChange={e => setRow(i, "action", e.target.value)} className="w-full mt-0.5 border border-border rounded px-2 py-1 text-xs bg-background" placeholder="Azione raccomandata..." />
                </div>
              </div>
            );
          })}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi gap
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}
