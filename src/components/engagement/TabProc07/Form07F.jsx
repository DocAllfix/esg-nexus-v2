import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIE = ["Processo", "Comunicazione", "Dati e raccolta", "Team e competenze", "Cliente", "Strumenti"];
const TIPI = ["Cosa ha funzionato ✅", "Da migliorare ⚠️", "Idea per il futuro 💡"];
const TIPO_COLORS = {
  "Cosa ha funzionato ✅": "border-green-200 bg-green-50/30",
  "Da migliorare ⚠️":     "border-amber-200 bg-amber-50/30",
  "Idea per il futuro 💡": "border-blue-200 bg-blue-50/30",
};

export default function Form07F({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "07F");
  const [filterTipo, setFilterTipo] = useState("TUTTI");
  const [filterCat,  setFilterCat]  = useState("TUTTI");

  const lessons = d?.lessons ?? [];
  const setRow = (id, k, v) => updateField("lessons", lessons.map(l => l.id === id ? { ...l, [k]: v } : l));
  const remove = (id) => updateField("lessons", lessons.filter(l => l.id !== id));
  const add = () => updateField("lessons", [...lessons, { id: Date.now(), categoria: "Processo", tipo: "Cosa ha funzionato ✅", titolo: "", descrizione: "", azione: "", priorita: "Media" }]);

  const filtered = lessons.filter(l =>
    (filterTipo === "TUTTI" || l.tipo === filterTipo) &&
    (filterCat  === "TUTTI" || l.categoria === filterCat)
  );

  return (
    <FormWrapper
      formCode="FORM-07F"
      title="Lesson Learned"
      subtitle="Capitalizzazione della conoscenza acquisita nel progetto per miglioramento continuo"
      meta={{ "Lesson totali": lessons.length, "Da migliorare": lessons.filter(l => l.tipo?.includes("migliorare")).length, "Idee future": lessons.filter(l => l.tipo?.includes("futuro")).length }}
      ruleBox="Le lesson learned vengono condivise con tutto il team ESG nella riunione di retrospettiva mensile. Le azioni con priorità Alta devono essere assegnate entro 2 settimane."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-muted-foreground">Tipo:</span>
        {["TUTTI", ...TIPI].map(t => (
          <button key={t} onClick={() => setFilterTipo(t)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filterTipo === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{t}</button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-muted-foreground">Categoria:</span>
        {["TUTTI", ...CATEGORIE].map(c => (
          <button key={c} onClick={() => setFilterCat(c)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filterCat === c ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{c}</button>
        ))}
      </div>

      <FormSection title={`Lesson learned (${filtered.length})`} cols={1}>
        <div className="space-y-3">
          {filtered.map(l => (
            <div key={l.id} className={cn("rounded-xl border-2 p-4 space-y-2", TIPO_COLORS[l.tipo] || "border-border")}>
              <div className="flex items-center gap-2 flex-wrap">
                <select value={l.tipo} onChange={e => setRow(l.id, "tipo", e.target.value)} className="text-xs rounded border border-border px-1.5 py-0.5 bg-background font-medium">
                  {TIPI.map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={l.categoria} onChange={e => setRow(l.id, "categoria", e.target.value)} className="text-xs rounded border border-border px-1.5 py-0.5 bg-background">
                  {CATEGORIE.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={l.priorita} onChange={e => setRow(l.id, "priorita", e.target.value)} className={cn("text-xs rounded border-0 px-1.5 py-0.5 font-medium ml-auto", l.priorita === "Alta" ? "bg-red-100 text-red-700" : l.priorita === "Media" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600")}>
                  {["Alta","Media","Bassa"].map(p => <option key={p}>{p}</option>)}
                </select>
                <button onClick={() => remove(l.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={13} /></button>
              </div>
              <input value={l.titolo} onChange={e => setRow(l.id, "titolo", e.target.value)} placeholder="Titolo lesson learned" className="w-full font-semibold text-sm border border-border rounded px-2 py-1 bg-background" />
              <textarea value={l.descrizione} onChange={e => setRow(l.id, "descrizione", e.target.value)} rows={2} placeholder="Descrizione..." className="w-full text-xs border border-border rounded px-2 py-1 bg-background resize-none" />
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Azione raccomandata:</p>
                <textarea value={l.azione} onChange={e => setRow(l.id, "azione", e.target.value)} rows={1} placeholder="Azione da intraprendere..." className="w-full text-xs border border-border rounded px-2 py-1 bg-background resize-none font-medium" />
              </div>
            </div>
          ))}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi lesson learned
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}
