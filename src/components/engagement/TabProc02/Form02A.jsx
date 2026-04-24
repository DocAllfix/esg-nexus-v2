import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIE_STAKEHOLDER = [
  "Dipendenti e rappresentanze sindacali",
  "Management e CdA",
  "Clienti / OEM (es. Stellantis)",
  "Fornitori chiave Tier 1 e Tier 2",
  "Finanziatori / istituti di credito",
  "Investitori e azionisti",
  "Comunità locale e associazioni territoriali",
  "Autorità regolatorie e PA",
  "ONG e associazioni ambientali",
  "Media e stakeholder reputazionali",
];

const PRIORITA = ["Alta", "Media", "Bassa"];
const METODI = ["Questionario online", "Intervista 1:1", "Focus group", "Workshop", "Sondaggio interno", "Analisi desk"];

export default function Form02A({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "02A");

  const stakeholders = d?.stakeholders ?? [];
  const setS = (i, k, v) => {
    const n = [...stakeholders];
    n[i] = { ...n[i], [k]: v };
    updateField("stakeholders", n);
  };
  const removeS = (i) => updateField("stakeholders", stakeholders.filter((_, idx) => idx !== i));
  const addS = () => updateField("stakeholders", [...stakeholders, { id: Date.now(), categoria: "", num_soggetti: 0, priorita: "Media", metodo: "Questionario online", resp_studio: "", resp_cliente: "", target_risposte: 0, risposte_ricevute: 0, note: "" }]);

  const totTargeT = stakeholders.reduce((a, s) => a + (Number(s.target_risposte) || 0), 0);
  const totRicevute = stakeholders.reduce((a, s) => a + (Number(s.risposte_ricevute) || 0), 0);
  const tassoCoinvolgimento = totTargeT > 0 ? Math.round((totRicevute / totTargeT) * 100) : 0;

  return (
    <FormWrapper
      formCode="FORM-02A"
      title="Stakeholder Mapping"
      subtitle="Identificazione e pianificazione del coinvolgimento degli stakeholder"
      meta={{ "Fase": "PROC-02.1", "Resp.": "Consulente Senior", "Output": "Registro stakeholder approvato", "Standard": "GRI 2-29 / ESRS SBM-2" }}
      ruleBox="📌 Identificare tutti gli stakeholder rilevanti. Prioritizzare in base a dipendenza, influenza e impatto. Documentare il metodo di engagement per ogni gruppo."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Gruppi identificati", value: stakeholders.length, color: "text-primary" },
          { label: "Target risposte", value: totTargeT, color: "text-foreground" },
          { label: "Risposte ricevute", value: totRicevute, color: "text-green-700" },
          { label: "Tasso coinvolgimento", value: `${tassoCoinvolgimento}%`, color: tassoCoinvolgimento >= 70 ? "text-green-700" : "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Registro stakeholder" cols={1}>
        <div className="space-y-3">
          {stakeholders.map((s, i) => {
            const perc = s.target_risposte > 0 ? Math.round((s.risposte_ricevute / s.target_risposte) * 100) : 0;
            const priColor = s.priorita === "Alta" ? "border-red-300 bg-red-50/30" : s.priorita === "Media" ? "border-amber-300 bg-amber-50/20" : "border-border bg-muted/10";
            return (
              <div key={s.id || i} className={cn("rounded-lg border p-4 space-y-3", priColor)}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <select value={s.categoria || ""} onChange={e => setS(i, "categoria", e.target.value)} className="flex-1 border border-border rounded px-2 py-1 text-sm bg-background font-medium">
                        <option value="">Seleziona categoria</option>
                        {CATEGORIE_STAKEHOLDER.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select value={s.priorita || "Media"} onChange={e => setS(i, "priorita", e.target.value)} className={cn("border border-border rounded px-2 py-1 text-xs font-semibold", s.priorita === "Alta" ? "bg-red-100 text-red-800" : s.priorita === "Media" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600")}>
                        {PRIORITA.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select value={s.metodo || ""} onChange={e => setS(i, "metodo", e.target.value)} className="border border-border rounded px-2 py-1 text-xs bg-background">
                        {METODI.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-4 flex-wrap text-xs">
                      <label className="flex items-center gap-1"><span className="text-muted-foreground">N. soggetti:</span>
                        <input type="number" value={s.num_soggetti || ""} onChange={e => setS(i, "num_soggetti", e.target.value)} className="w-16 border border-border rounded px-1 py-0.5 bg-background text-center" />
                      </label>
                      <label className="flex items-center gap-1"><span className="text-muted-foreground">Resp. studio:</span>
                        <input value={s.resp_studio || ""} onChange={e => setS(i, "resp_studio", e.target.value)} className="w-20 border border-border rounded px-1 py-0.5 bg-background" />
                      </label>
                      <label className="flex items-center gap-1"><span className="text-muted-foreground">Resp. cliente:</span>
                        <input value={s.resp_cliente || ""} onChange={e => setS(i, "resp_cliente", e.target.value)} className="w-20 border border-border rounded px-1 py-0.5 bg-background" />
                      </label>
                    </div>
                  </div>
                  <button onClick={() => removeS(i)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Risposte:</span>
                  <input type="number" value={s.risposte_ricevute || ""} onChange={e => setS(i, "risposte_ricevute", e.target.value)} className="w-14 border border-border rounded px-1 py-0.5 text-xs bg-background text-center" />
                  <span className="text-xs text-muted-foreground">/</span>
                  <input type="number" value={s.target_risposte || ""} onChange={e => setS(i, "target_risposte", e.target.value)} className="w-14 border border-border rounded px-1 py-0.5 text-xs bg-background text-center" />
                  <div className="flex-1 h-1.5 bg-muted rounded-full">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(perc, 100)}%` }} />
                  </div>
                  <span className={cn("text-xs font-semibold w-10 text-right", perc >= 70 ? "text-green-700" : "text-amber-600")}>{perc}%</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Note: </span>
                  <input value={s.note || ""} onChange={e => setS(i, "note", e.target.value)} className="w-full mt-1 border border-border rounded px-2 py-1 text-xs bg-background" />
                </div>
              </div>
            );
          })}
          <button onClick={addS} className="flex items-center gap-2 text-sm text-primary hover:underline">
            <Plus size={14} /> Aggiungi gruppo stakeholder
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}
