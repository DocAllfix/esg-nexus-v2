import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { CheckCircle2, Clock, Lock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const CHECKS_CONFIG = [
  { id: 1, testo: "Tutti i KPI obbligatori compilati (E/S/G)", dettaglio: "Verifica che tutti i KPI abbiano un valore inserito" },
  { id: 2, testo: "GHG Scope 1 e 2 completamente validati", dettaglio: "Scope 1: fonti validate — Scope 2 MB/LB: fonti validate" },
  { id: 3, testo: "GHG Scope 3 compilato (anche stima parziale)", dettaglio: "Almeno le categorie rilevanti inserite" },
  { id: 4, testo: "Anomalie critiche risolte o accettate con nota", dettaglio: "Tutte le anomalie aperte hanno piano di risoluzione" },
  { id: 5, testo: "Dati confronto anno precedente inseriti (≥50% KPI)", dettaglio: "Almeno metà KPI hanno il dato N-1" },
  { id: 6, testo: "Nota metodologica GHG completata (FORM-04B)", dettaglio: "Fattori emissione e boundary documentati" },
  { id: 7, testo: "Responsabile dati cliente ha validato il dataset", dettaglio: "Firma digitale o email di conferma ricevuta" },
];

export default function Form04G({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "04G");

  const checks = d?.checks ?? CHECKS_CONFIG.map(c => ({ ...c, ok: false }));
  const frozen = d?.frozen ?? false;
  const frozen_at = d?.frozen_at ?? null;

  const toggle = (id) => {
    if (frozen) return;
    const n = checks.map(c => c.id === id ? { ...c, ok: !c.ok } : c);
    updateField("checks", n);
  };

  const completate = checks.filter(c => c.ok).length;
  const tutteOk = completate === checks.length;

  const handleFreeze = () => {
    if (!tutteOk || frozen) return;
    updateField("frozen", true);
    updateField("frozen_at", new Date().toISOString());
  };

  return (
    <FormWrapper
      formCode="FORM-04G"
      title="Freeze Dataset — Congelamento Dati"
      subtitle="Validazione finale e blocco del dataset per la rendicontazione"
      meta={{ "Fase": "PROC-04.7", "Resp.": "Partner + Consulente Senior", "Output": "Dataset frozen — Avvio PROC-05" }}
      ruleBox={
        frozen ? "DATASET CONGELATO — Nessuna modifica ai dati è consentita senza approvazione del Partner." :
        tutteOk ? "Tutte le condizioni soddisfatte — freeze dataset autorizzato." :
        `${checks.length - completate} condizioni non ancora soddisfatte. Completare prima del freeze.`
      }
      ruleBoxType={frozen ? "success" : tutteOk ? "success" : "warning"}
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className={cn("rounded-xl border-2 p-6", frozen ? "border-primary bg-primary/5" : tutteOk ? "border-green-400 bg-green-50/30" : "border-amber-300 bg-amber-50/20")}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className={cn("text-4xl font-bold", frozen ? "text-primary" : tutteOk ? "text-green-700" : "text-amber-700")}>{completate}/{checks.length}</p>
            <p className={cn("text-sm font-medium mt-1", frozen ? "text-primary" : tutteOk ? "text-green-700" : "text-amber-700")}>
              {frozen ? `Congelato il ${new Date(frozen_at).toLocaleDateString("it-IT")}` : "Condizioni di freeze"}
            </p>
          </div>
          <button
            onClick={handleFreeze}
            disabled={!tutteOk || frozen}
            className={cn("px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2",
              frozen ? "bg-primary/20 text-primary cursor-default" :
              tutteOk ? "bg-primary text-primary-foreground hover:bg-primary/90" :
              "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {frozen ? <><Shield size={16} /> Dataset congelato</> : !tutteOk ? <><Lock size={16} /> Condizioni non soddisfatte</> : "Congela dataset"}
          </button>
        </div>
        <div className="w-full h-2 bg-white/60 rounded-full mt-4">
          <div className={cn("h-full rounded-full transition-all", tutteOk ? "bg-green-500" : "bg-amber-400")} style={{ width: `${(completate / checks.length) * 100}%` }} />
        </div>
      </div>

      <FormSection title="Condizioni di freeze" cols={1}>
        <div className="space-y-2">
          {checks.map(c => (
            <div key={c.id}
              className={cn("rounded-lg border p-3 flex items-start gap-3 transition-colors",
                !frozen && "cursor-pointer hover:bg-muted/10",
                c.ok ? "border-green-200 bg-green-50/20" : "border-border"
              )}
              onClick={() => toggle(c.id)}
            >
              {c.ok
                ? <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                : <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
              }
              <div>
                <p className="text-sm font-medium">{c.testo}</p>
                <p className="text-xs text-muted-foreground">{c.dettaglio}</p>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Validazione responsabile cliente" cols={2}>
        <Field label="Responsabile validazione dataset">
          <Input value={d?.resp_validazione} onChange={v => updateField("resp_validazione", v)} placeholder="Nome, ruolo, azienda cliente" />
        </Field>
        <Field label="Data conferma validazione">
          <Input type="date" value={d?.data_validazione} onChange={v => updateField("data_validazione", v)} />
        </Field>
        <Field label="Note al freeze" span={2}>
          <Textarea value={d?.note} onChange={v => updateField("note", v)} rows={2}
            placeholder="Indicare eventuali limitazioni del dataset, stime usate, perimetro di rendicontazione." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
