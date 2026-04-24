import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { CheckCircle2, Clock, Lock, Shield, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_04G";

const CHECKS_CONFIG = [
  { id: 1, testo: "Tutti i KPI obbligatori compilati (E/S/G)", dettaglio: "21/21 KPI con valore inserito", ok: true },
  { id: 2, testo: "GHG Scope 1 e 2 completamente validati", dettaglio: "Scope 1: 3/3 fonti ✓ — Scope 2 MB/LB: 2/2 fonti ✓", ok: true },
  { id: 3, testo: "GHG Scope 3 compilato (anche stima parziale)", dettaglio: "3/3 categorie inserite (cat.1 parziale con nota)", ok: true },
  { id: 4, testo: "Anomalie critiche risolte o accettate con nota", dettaglio: "2 anomalie risolte, 2 in risoluzione avanzata", ok: false },
  { id: 5, testo: "Dati confronto anno precedente inseriti (≥50% KPI)", dettaglio: "12/21 KPI con dato 2023 ✓", ok: true },
  { id: 6, testo: "Nota metodologica GHG completata (FORM-04B)", dettaglio: "Fattori emissione e boundary documentati ✓", ok: true },
  { id: 7, testo: "Responsabile dati cliente ha validato il dataset", dettaglio: "Firma digitale o email di conferma richiesta", ok: false },
];

const SNAPSHOTS_PRECEDENTI = [
  { label: "snapshot-v1", data: "2025-03-01", hash: "a3f2c1d09e4b7f2c", autore: "E. Mancini", note: "Prima bozza dati GHG Scope 1-2" },
  { label: "snapshot-v2", data: "2025-04-10", hash: "b7d4e2a1f9c3084d", autore: "L. Ferri", note: "Aggiornamento KPI S e G" },
];

export default function Form04G() {
  const [checks, setChecks] = useState(CHECKS_CONFIG);
  const [frozen, setFrozen] = useState(false);
  const [frozenAt, setFrozenAt] = useState(null);
  const [resp_validazione, setRespValidazione] = useState("Laura Rossi — Sustainability Manager, Acme Manufacturing S.p.A.");
  const [data_validazione, setDataValidazione] = useState("2025-05-02");
  const [note, setNote] = useState("Il dataset è da considerarsi finale per la rendicontazione FY2024. Eventuali aggiornamenti successivi al freeze richiedono approvazione del Partner responsabile dell'engagement.");

  const toggle = (id) => setChecks(p => p.map(c => c.id === id ? { ...c, ok: !c.ok } : c));
  const tutteOk = checks.every(c => c.ok);
  const completate = checks.filter(c => c.ok).length;

  const handleFreeze = () => {
    if (!tutteOk) return;
    setFrozen(true);
    setFrozenAt(new Date());
  };

  return (
    <FormWrapper
      formCode="FORM-04G"
      title="Freeze Dataset — Congelamento Dati"
      subtitle="Validazione finale e blocco del dataset per la rendicontazione"
      meta={{ "Fase": "PROC-04.7", "Resp.": "Partner + Consulente Senior", "Output": "Dataset frozen — Avvio PROC-05" }}
      ruleBox={frozen ? "❄️ DATASET CONGELATO — Nessuna modifica ai dati è consentita senza approvazione del Partner." : tutteOk ? "✅ Tutte le condizioni soddisfatte — freeze dataset autorizzato." : `⚠️ ${CHECKS_CONFIG.length - completate} condizioni non ancora soddisfatte. Completare prima del freeze.`}
      ruleBoxType={frozen ? "success" : tutteOk ? "success" : "warning"}
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* PROGRESS */}
      <div className={cn("rounded-xl border-2 p-6", frozen ? "border-primary bg-primary/5" : tutteOk ? "border-green-400 bg-green-50" : "border-amber-300 bg-amber-50")}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className={cn("text-4xl font-bold", frozen ? "text-primary" : tutteOk ? "text-green-700" : "text-amber-700")}>{completate}/{checks.length}</p>
            <p className={cn("text-sm font-medium mt-1", frozen ? "text-primary" : tutteOk ? "text-green-700" : "text-amber-700")}>
              {frozen ? `❄️ Congelato il ${frozenAt?.toLocaleDateString("it-IT")}` : "Condizioni di freeze"}
            </p>
          </div>
          <button
            onClick={handleFreeze}
            disabled={!tutteOk || frozen}
            className={cn("px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-2",
              frozen ? "bg-primary/20 text-primary cursor-default"
              : tutteOk ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {frozen ? <><Shield size={16} /> Dataset congelato</> : !tutteOk ? <><Lock size={16} /> Condizioni non soddisfatte</> : "❄️ Congela dataset"}
          </button>
        </div>
        <div className="w-full h-2 bg-white/60 rounded-full mt-4">
          <div className="h-full rounded-full transition-all bg-current" style={{ width: `${(completate / checks.length) * 100}%`, color: tutteOk ? "#16a34a" : "#d97706" }} />
        </div>
      </div>

      {/* CHECKLIST */}
      <FormSection title="Condizioni di freeze" cols={1}>
        <div className="space-y-2">
          {checks.map(c => (
            <div key={c.id} className={cn("rounded-lg border p-3 flex items-start gap-3 cursor-pointer hover:bg-muted/10",
              c.ok ? "border-green-200 bg-green-50/20" : "border-border"
            )} onClick={() => !frozen && toggle(c.id)}>
              {c.ok ? <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" /> : <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />}
              <div>
                <p className="text-sm font-medium">{c.testo}</p>
                <p className="text-xs text-muted-foreground">{c.dettaglio}</p>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Validazione responsabile cliente">
        <Field label="Responsabile validazione dataset" required>
          <Input value={resp_validazione} onChange={setRespValidazione} />
        </Field>
        <Field label="Data conferma validazione" required>
          <Input type="date" value={data_validazione} onChange={setDataValidazione} />
        </Field>
        <Field label="Note al freeze" span={2}>
          <Textarea value={note} onChange={setNote} rows={2} />
        </Field>
      </FormSection>

      {/* SNAPSHOTS */}
      <FormSection title="Snapshot precedenti" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-3 py-2">Label</th>
                <th className="text-left px-3 py-2">Data</th>
                <th className="text-left px-3 py-2">Hash SHA-256</th>
                <th className="text-left px-3 py-2">Autore</th>
                <th className="text-left px-3 py-2">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SNAPSHOTS_PRECEDENTI.map(s => (
                <tr key={s.label} className="hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono font-bold">{s.label}</td>
                  <td className="px-3 py-2">{s.data}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{s.hash}...</td>
                  <td className="px-3 py-2">{s.autore}</td>
                  <td className="px-3 py-2 text-muted-foreground">{s.note}</td>
                </tr>
              ))}
              {frozen && (
                <tr className="bg-primary/5 border-t-2 border-primary">
                  <td className="px-3 py-2 font-mono font-bold text-primary">snapshot-v3 🔒</td>
                  <td className="px-3 py-2">{frozenAt?.toLocaleDateString("it-IT")}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">c9a1b3d7e2f40852...</td>
                  <td className="px-3 py-2">E. Mancini</td>
                  <td className="px-3 py-2 text-primary font-medium">Dataset finale FY2024</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </FormSection>
    </FormWrapper>
  );
}