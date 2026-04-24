import { useState } from "react";
import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_07B";

const DOMANDE_SAT = [
  { id: 1, label: "Qualità tecnica del lavoro svolto" },
  { id: 2, label: "Rispetto delle scadenze concordate" },
  { id: 3, label: "Comunicazione e aggiornamenti durante il progetto" },
  { id: 4, label: "Supporto nella raccolta e validazione dati" },
  { id: 5, label: "Valore aggiunto percepito per l'azienda" },
  { id: 6, label: "Disponibilità e reattività del team" },
];

export default function Form07B() {
  const [nps, setNps] = useState(9);
  const [voti, setVoti] = useState({ 1: 5, 2: 4, 3: 5, 4: 4, 5: 5, 6: 5 });
  const [feedback_libero, setFeedbackLibero] = useState("Il team ha dimostrato grande competenza tecnica e disponibilità. La gestione della raccolta dati GHG è stata particolarmente apprezzata. Si suggerisce di anticipare alcuni deliverable per allinearsi meglio ai tempi interni del CdA.");
  const [data_somm, setDataSomm] = useState("2025-11-20");
  const [somministrato_a, setSomministratoA] = useState("Marco Bianchi (CEO), Laura Rossi (Sustainability Manager)");

  const categoria = nps >= 9 ? "PROMOTORE" : nps >= 7 ? "PASSIVO" : "DETRATTORE";
  const catColor = nps >= 9 ? "text-green-700 bg-green-100 border-green-200" : nps >= 7 ? "text-amber-700 bg-amber-100 border-amber-200" : "text-red-700 bg-red-100 border-red-200";
  const media_sat = (Object.values(voti).reduce((s, v) => s + v, 0) / DOMANDE_SAT.length).toFixed(1);

  return (
    <FormWrapper
      formCode="FORM-07B"
      title="Soddisfazione Cliente e NPS"
      subtitle="Rilevazione Net Promoter Score e valutazione qualitativa del servizio"
      meta={{ "NPS": nps, "Categoria": categoria, "Media soddisfazione": `${media_sat}/5`, "Data": data_somm }}
      ruleBox="⭐ L'NPS e la soddisfazione cliente sono KPI interni dello studio. Un NPS ≥ 9 abilita il cliente alla categoria 'Reference' per case history e referral."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* NPS */}
      <div className="bg-muted/30 rounded-xl p-6 border border-border">
        <p className="text-sm font-medium text-center mb-4">Da 0 a 10, quanto consiglieresti il nostro studio a un collega o partner?</p>
        <div className="flex justify-center gap-1.5 mb-5 flex-wrap">
          {Array.from({ length: 11 }, (_, i) => (
            <button key={i} onClick={() => setNps(i)} className={cn(
              "w-10 h-10 rounded-lg text-sm font-bold transition-all",
              nps === i ? "bg-primary text-primary-foreground scale-110 shadow-md ring-2 ring-primary ring-offset-1" :
              i <= 6 ? "bg-red-100 text-red-700 hover:bg-red-200" :
              i <= 8 ? "bg-amber-100 text-amber-700 hover:bg-amber-200" :
              "bg-green-100 text-green-700 hover:bg-green-200"
            )}>{i}</button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4">
          <span className="text-5xl font-bold tabular-nums">{nps}</span>
          <div className={cn("px-4 py-2 rounded-xl border font-bold text-lg", catColor)}>{categoria}</div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-3 px-1">
          <span>0 = Per niente propenso</span>
          <span>10 = Estremamente propenso</span>
        </div>
      </div>

      {/* SODDISFAZIONE */}
      <FormSection title="Valutazione soddisfazione (1-5 stelle)" cols={1}>
        <div className="space-y-4">
          {DOMANDE_SAT.map(d => (
            <div key={d.id} className="flex items-center gap-4">
              <p className="text-sm flex-1">{d.label}</p>
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => setVoti(p => ({ ...p, [d.id]: v }))} className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                    v <= voti[d.id] ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/70"
                  )}>{v}</button>
                ))}
              </div>
              <span className={cn("text-sm font-bold w-6 text-right", voti[d.id] >= 4 ? "text-green-700" : voti[d.id] >= 3 ? "text-amber-600" : "text-red-600")}>{voti[d.id]}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Media soddisfazione</span>
            <span className={cn("text-xl font-bold", Number(media_sat) >= 4 ? "text-green-700" : "text-amber-600")}>{media_sat} / 5</span>
          </div>
        </div>
      </FormSection>

      <FormSection title="Feedback qualitativo" cols={1}>
        <Field label="Commento libero / suggerimenti del cliente">
          <Textarea value={feedback_libero} onChange={setFeedbackLibero} rows={3} placeholder="Riportare verbatim il feedback del cliente o le note del consulente..." />
        </Field>
      </FormSection>

      <FormSection title="Metadati rilevazione">
        <Field label="Data somministrazione">
          <input type="date" value={data_somm} onChange={e => setDataSomm(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </Field>
        <Field label="Somministrato a">
          <input value={somministrato_a} onChange={e => setSomministratoA(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}