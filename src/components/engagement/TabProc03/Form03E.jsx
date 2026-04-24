import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";

const checklistG = [
  { cat: "G1 — Governance ESG e Struttura", items: [
    { q: "La governance ESG è integrata nella struttura del CdA (comitato ESG o simile)?", ref: "GRI 2-9 / ESRS G1-1" },
    { q: "Il CdA approva formalmente le politiche e gli obiettivi ESG?", ref: "ESRS G1-1" },
    { q: "Esistono indicatori ESG nei sistemi di incentivazione del management?", ref: "ESRS G1-1" },
    { q: "I risk ESG sono integrati nel risk management aziendale?", ref: "ESRS 2-IRO / GRI 2-25" },
  ]},
  { cat: "G1 — Etica, Anti-corruzione e Compliance", items: [
    { q: "Il codice etico è aggiornato (max 3 anni) e include anti-corruzione?", ref: "GRI 205-1 / ESRS G1-3" },
    { q: "I dipendenti ricevono formazione documentata su anti-corruzione?", ref: "GRI 205-2" },
    { q: "È attivo un canale di whistleblowing conforme D.Lgs. 24/2023?", ref: "GRI 2-26 / ESRS G1-3" },
    { q: "Sono stati rilevati o segnalati episodi di corruzione nell'anno?", ref: "GRI 205-3" },
    { q: "Esiste una policy per la gestione dei conflitti di interesse?", ref: "ESRS G1-3" },
  ]},
  { cat: "G1 — Trasparenza e Rendicontazione", items: [
    { q: "L'azienda pubblica già un bilancio di sostenibilità o DNF?", ref: "GRI 2-3 / CSRD" },
    { q: "I dati ESG sono sottoposti a verifica/assurance esterna?", ref: "GRI 2-5 / ESRS 1 §AR72" },
    { q: "Esiste un processo di raccolta dati ESG strutturato e documentato?", ref: "ESRS 1" },
  ]},
  { cat: "G2 — Lobbying e Relazioni Istituzionali", items: [
    { q: "Le posizioni di lobbying e le affiliazioni ad associazioni di categoria sono dichiarate?", ref: "GRI 415-1 / ESRS G1-4" },
    { q: "Le donazioni politiche sono dichiarate o espressamente vietate?", ref: "GRI 415-1" },
  ]},
];

const ratingLabels = ["Critico", "Basso", "Medio", "Buono", "Conforme"];
const ratingColors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-lime-500", "bg-green-600"];

export default function Form03E({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "03E");

  const ratings = d?.ratings ?? {};
  const notes = d?.notes ?? {};

  const allRatings = Object.values(ratings).map(Number).filter(n => !isNaN(n));
  const avg = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : "—";
  const critici = allRatings.filter(r => r <= 1).length;
  const bassi = allRatings.filter(r => r === 2).length;
  const levelColor = avg !== "—" ? (parseFloat(avg) >= 4 ? "text-green-700" : parseFloat(avg) >= 3 ? "text-amber-600" : "text-red-600") : "text-muted-foreground";

  return (
    <FormWrapper
      formCode="FORM-03E"
      title="Audit Area G — Governance"
      subtitle="Checklist di conformità per la governance ESG, etica e anti-corruzione"
      meta={{ "Fase": "PROC-03.5", "Resp.": "Analista ESG", "Standard": "GRI 2/205/415 + ESRS G1–G2" }}
      ruleBox="Valutare la maturità della governance ESG. I gap su whistleblowing e bilancio di sostenibilità sono tipicamente critici per le aziende nella fase di prima rendicontazione."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Score medio Area G", value: `${avg}/5`, color: levelColor },
          { label: "Criteri valutati", value: allRatings.length, color: "text-foreground" },
          { label: "Gap critici (1)", value: critici, color: "text-red-600" },
          { label: "Gap bassi (2)", value: bassi, color: "text-orange-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {checklistG.map(cat => (
        <FormSection key={cat.cat} title={cat.cat} cols={1}>
          <div className="space-y-3">
            {cat.items.map((item, i) => {
              const key = `${cat.cat}-${i}`;
              const val = ratings[key] ? Number(ratings[key]) : 0;
              return (
                <div key={i} className={cn("p-4 rounded-lg border", val <= 1 && val > 0 ? "border-red-300 bg-red-50/30" : val === 2 ? "border-orange-200 bg-orange-50/20" : "border-border")}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-sm font-medium">{item.q}</p>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded shrink-0 font-mono">{item.ref}</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {ratingLabels.map((label, ri) => (
                      <button key={ri} onClick={() => updateField("ratings", { ...ratings, [key]: ri + 1 })}
                        className={cn("flex-1 py-1.5 rounded text-xs font-medium transition-all",
                          val === ri + 1 ? `${ratingColors[ri]} text-white shadow-sm` : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                        )}>
                        {ri + 1} · {label}
                      </button>
                    ))}
                  </div>
                  {val > 0 && val <= 2 && (
                    <input value={notes[key] || ""} onChange={e => updateField("notes", { ...notes, [key]: e.target.value })}
                      placeholder="Descrivi il gap rilevato..."
                      className="w-full border border-orange-200 rounded px-2 py-1 text-xs bg-background" />
                  )}
                </div>
              );
            })}
          </div>
        </FormSection>
      ))}
    </FormWrapper>
  );
}
