import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { CheckCircle2, Circle, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const CANALI = ["Sito web aziendale", "Portale GRI Sustainability Disclosure Database", "Investor Relations", "LinkedIn", "Comunicato stampa", "Invio diretto stakeholder"];

const CHECKLIST_PUB = [
  { id: 1,  voce: "Tutti i capitoli approvati dal CdA",                                         critico: true },
  { id: 2,  voce: "Content Index GRI/ESRS completato e revisionato",                            critico: true },
  { id: 3,  voce: "Relazione di assurance limited ricevuta e allegata",                         critico: true },
  { id: 4,  voce: "Revisione legale testi completata (claim, target, dati vincolanti)",         critico: true },
  { id: 5,  voce: "Layout PDF hi-res approvato dal cliente (grafica)",                          critico: true },
  { id: 6,  voce: "Traduzione in inglese (summary executive) disponibile",                      critico: false },
  { id: 7,  voce: "Bilancio caricato su sito web aziendale (sezione IR/Sostenibilità)",        critico: false },
  { id: 8,  voce: "Comunicato stampa redatto e diffuso (ANSA / Ufficio stampa)",               critico: false },
  { id: 9,  voce: "Registrazione GRI Sustainability Disclosure Database effettuata",           critico: false },
  { id: 10, voce: "Invio bilancio a principali stakeholder (banche, clienti OEM, enti)",       critico: false },
];

const toggleArray = (arr, item) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

export default function Form06H({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "06H");

  const checks = d?.checks ?? CHECKLIST_PUB.map(c => ({ ...c, ok: false }));
  const canali = d?.canali ?? [];

  const toggle = (id) => updateField("checks", checks.map(c => c.id === id ? { ...c, ok: !c.ok } : c));
  const toggleCanale = (c) => updateField("canali", toggleArray(canali, c));

  const critiche = checks.filter(c => c.critico);
  const critiOk = critiche.filter(c => c.ok).length;
  const tutteOk = critiOk === critiche.length;

  return (
    <FormWrapper
      formCode="FORM-06H"
      title="Pubblicazione Bilancio di Sostenibilità"
      subtitle="Checklist di pubblicazione, canali di diffusione e gestione file"
      meta={{ "Data pubbl. prevista": d?.data_pub || "—", "Assurance": d?.assurance || "—" }}
      ruleBox={tutteOk ? "Tutti i prerequisiti critici completati — Bilancio pronto per la pubblicazione." : "Completare i prerequisiti critici prima di procedere alla pubblicazione ufficiale."}
      ruleBoxType={tutteOk ? "success" : "warning"}
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className={cn("rounded-xl border-2 p-6 flex items-center gap-6", tutteOk ? "border-green-400 bg-green-50" : "border-amber-300 bg-amber-50")}>
        <div className="text-center">
          <p className={cn("text-5xl font-bold", tutteOk ? "text-green-700" : "text-amber-700")}>{critiOk}/{critiche.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Prerequisiti critici</p>
        </div>
        <div className="flex-1">
          <div className="w-full h-3 bg-white rounded-full">
            <div className={cn("h-full rounded-full transition-all", tutteOk ? "bg-green-500" : "bg-amber-400")} style={{ width: `${(critiOk / critiche.length) * 100}%` }} />
          </div>
          <p className={cn("text-sm font-semibold mt-2", tutteOk ? "text-green-700" : "text-amber-700")}>
            {tutteOk ? "Bilancio pronto per la pubblicazione" : "Completare le voci obbligatorie prima di pubblicare"}
          </p>
        </div>
        <button disabled={!tutteOk} className={cn("px-6 py-3 rounded-lg font-semibold text-sm transition-all", tutteOk ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" : "bg-muted text-muted-foreground cursor-not-allowed")}>
          {tutteOk ? "Pubblica bilancio" : "In attesa..."}
        </button>
      </div>

      <FormSection title="Checklist pre-pubblicazione" cols={1}>
        <div className="space-y-2">
          {checks.map(c => (
            <div key={c.id} onClick={() => toggle(c.id)} className={cn("rounded-lg border p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/10", c.ok ? "border-green-200 bg-green-50/30" : "border-border")}>
              {c.ok ? <CheckCircle2 size={15} className="text-green-600 shrink-0" /> : <Circle size={15} className="text-muted-foreground shrink-0" />}
              <span className="text-sm flex-1">{c.voce}</span>
              {c.critico && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded shrink-0">obbligatorio</span>}
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Dettagli pubblicazione">
        <Field label="Data pubblicazione ufficiale" required>
          <Input type="date" value={d?.data_pub} onChange={v => updateField("data_pub", v)} />
        </Field>
        <Field label="URL pagina web bilancio">
          <Input value={d?.url_web} onChange={v => updateField("url_web", v)} placeholder="https://..." />
        </Field>
        <Field label="Ente assurance e livello">
          <Input value={d?.assurance} onChange={v => updateField("assurance", v)} placeholder="Es. Limited assurance — Deloitte" />
        </Field>
        <Field label="Note e istruzioni distribuzione" span={2}>
          <Textarea value={d?.note_pub} onChange={v => updateField("note_pub", v)} rows={2} />
        </Field>
      </FormSection>

      <FormSection title="Canali di diffusione" cols={1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CANALI.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={canali.includes(c)} onChange={() => toggleCanale(c)} className="accent-primary" />
              {c}
            </label>
          ))}
        </div>
      </FormSection>

      <FormSection title="File output" cols={1}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { tipo: "PDF hi-res", desc: "Stampa e archivio" },
            { tipo: "PDF web",    desc: "Download sito" },
            { tipo: "DOCX sorgente", desc: "Modifica testi" },
          ].map(f => (
            <div key={f.tipo} className="border border-border rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:bg-muted/10 transition-colors">
              <FileText size={28} className="text-muted-foreground" />
              <p className="text-sm font-semibold">{f.tipo}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
              <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                <Download size={12} /> Scarica
              </button>
            </div>
          ))}
        </div>
      </FormSection>
    </FormWrapper>
  );
}
