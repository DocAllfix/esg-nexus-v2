import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select, CheckboxGroup } from "@/components/common/FormWrapper";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_02A";

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

const INITIAL_STAKEHOLDERS = [
  { id: 1, categoria: "Dipendenti e rappresentanze sindacali", num_soggetti: 1240, priorita: "Alta", metodo: "Questionario online", resp_studio: "Ferri", resp_cliente: "Ferretti", target_risposte: 250, risposte_ricevute: 187, note: "Questionario somministrato via piattaforma ESG Suite. Follow-up telefonico ai non rispondenti dopo 7 gg." },
  { id: 2, categoria: "Management e CdA", num_soggetti: 12, priorita: "Alta", metodo: "Intervista 1:1", resp_studio: "Mancini", resp_cliente: "Rossetti", target_risposte: 12, risposte_ricevute: 10, note: "Interviste individuali 45 min. CEO, CFO, Resp. Produzione, HR, Legal già intervistati." },
  { id: 3, categoria: "Clienti / OEM (es. Stellantis)", num_soggetti: 5, priorita: "Alta", metodo: "Intervista 1:1", resp_studio: "Fabbricini", resp_cliente: "Rossetti", target_risposte: 5, risposte_ricevute: 3, note: "Incontro con buyer sustainability Stellantis IT e DE. 2 interviste da fissare." },
  { id: 4, categoria: "Fornitori chiave Tier 1 e Tier 2", num_soggetti: 28, priorita: "Alta", metodo: "Questionario online", resp_studio: "Ferri", resp_cliente: "Neri", target_risposte: 20, risposte_ricevute: 14, note: "Top 28 fornitori per volume acquistato. Template invitato via email con reminder automatico." },
  { id: 5, categoria: "Finanziatori / istituti di credito", num_soggetti: 3, priorita: "Media", metodo: "Analisi desk", resp_studio: "Mancini", resp_cliente: "Caputo", target_risposte: 3, risposte_ricevute: 3, note: "Analisi requisiti ESG dei 3 istituti principali (Intesa, Unicredit, BNL). Nessun engagement diretto richiesto." },
  { id: 6, categoria: "Comunità locale e associazioni territoriali", num_soggetti: 4, priorita: "Media", metodo: "Focus group", resp_studio: "Ferri", resp_cliente: "Ferretti", target_risposte: 4, risposte_ricevute: 2, note: "Focus group pianificato con Comune di Brescia e Legambiente locale. 2 presenti su 4." },
  { id: 7, categoria: "Autorità regolatorie e PA", num_soggetti: 2, priorita: "Bassa", metodo: "Analisi desk", resp_studio: "Mancini", resp_cliente: "", target_risposte: 2, risposte_ricevute: 2, note: "Analisi normativa CSRD e requisiti INAIL. Nessun coinvolgimento diretto." },
];

export default function Form02A() {
  const [stakeholders, setStakeholders] = useState(INITIAL_STAKEHOLDERS);
  const setS = (i, k, v) => setStakeholders(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });
  const removeS = (i) => setStakeholders(p => p.filter((_, idx) => idx !== i));
  const addS = () => setStakeholders(p => [...p, { id: Date.now(), categoria: "", num_soggetti: 0, priorita: "Media", metodo: "Questionario online", resp_studio: "", resp_cliente: "", target_risposte: 0, risposte_ricevute: 0, note: "" }]);

  const totTargeT = stakeholders.reduce((a, s) => a + (Number(s.target_risposte) || 0), 0);
  const totRicevute = stakeholders.reduce((a, s) => a + (Number(s.risposte_ricevute) || 0), 0);
  const tassoCoinvolgimento = totTargeT > 0 ? Math.round((totRicevute / totTargeT) * 100) : 0;

  return (
    <FormWrapper
      formCode="FORM-02A"
      title="Stakeholder Mapping"
      subtitle="Identificazione e pianificazione del coinvolgimento degli stakeholder"
      meta={{ "Fase": "PROC-02.1", "Resp.": "Consulente Senior", "Output": "Registro stakeholder approvato", "Standard": "GRI 2-29 / ESRS SBM-2" }}
      ruleBox="📌 Identificare tutti gli stakeholder rilevanti per l'organizzazione. Prioritizzare in base a dipendenza, influenza e impatto. Documentare il metodo di engagement per ogni gruppo."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* KPI */}
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
              <div key={s.id} className={cn("rounded-lg border p-4 space-y-3", priColor)}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <select value={s.categoria} onChange={e => setS(i, "categoria", e.target.value)} className="flex-1 border border-border rounded px-2 py-1 text-sm bg-background font-medium">
                        <option value="">Seleziona categoria</option>
                        {CATEGORIE_STAKEHOLDER.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select value={s.priorita} onChange={e => setS(i, "priorita", e.target.value)} className={cn("border border-border rounded px-2 py-1 text-xs font-semibold", s.priorita === "Alta" ? "bg-red-100 text-red-800" : s.priorita === "Media" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600")}>
                        {PRIORITA.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select value={s.metodo} onChange={e => setS(i, "metodo", e.target.value)} className="border border-border rounded px-2 py-1 text-xs bg-background">
                        {METODI.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-4 flex-wrap text-xs">
                      <label className="flex items-center gap-1"><span className="text-muted-foreground">N. soggetti:</span>
                        <input type="number" value={s.num_soggetti} onChange={e => setS(i, "num_soggetti", e.target.value)} className="w-16 border border-border rounded px-1 py-0.5 bg-background text-center" />
                      </label>
                      <label className="flex items-center gap-1"><span className="text-muted-foreground">Resp. studio:</span>
                        <input value={s.resp_studio} onChange={e => setS(i, "resp_studio", e.target.value)} className="w-20 border border-border rounded px-1 py-0.5 bg-background" />
                      </label>
                      <label className="flex items-center gap-1"><span className="text-muted-foreground">Resp. cliente:</span>
                        <input value={s.resp_cliente} onChange={e => setS(i, "resp_cliente", e.target.value)} className="w-20 border border-border rounded px-1 py-0.5 bg-background" />
                      </label>
                    </div>
                  </div>
                  <button onClick={() => removeS(i)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>

                {/* Progress risposte */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Risposte:</span>
                  <input type="number" value={s.risposte_ricevute} onChange={e => setS(i, "risposte_ricevute", e.target.value)} className="w-14 border border-border rounded px-1 py-0.5 text-xs bg-background text-center" />
                  <span className="text-xs text-muted-foreground">/</span>
                  <input type="number" value={s.target_risposte} onChange={e => setS(i, "target_risposte", e.target.value)} className="w-14 border border-border rounded px-1 py-0.5 text-xs bg-background text-center" />
                  <div className="flex-1 h-1.5 bg-muted rounded-full">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(perc, 100)}%` }} />
                  </div>
                  <span className={cn("text-xs font-semibold w-10 text-right", perc >= 70 ? "text-green-700" : "text-amber-600")}>{perc}%</span>
                </div>

                <div>
                  <span className="text-xs text-muted-foreground">Note: </span>
                  <input value={s.note} onChange={e => setS(i, "note", e.target.value)} className="w-full mt-1 border border-border rounded px-2 py-1 text-xs bg-background" />
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