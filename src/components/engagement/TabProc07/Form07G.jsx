import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { CheckCircle2, Circle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_07G";

const CHECKLIST_CHIUSURA = [
  { id: 1, voce: "Bilancio di sostenibilità pubblicato (FORM-06H)", proc: "PROC-06", critico: true },
  { id: 2, voce: "Dossier finale completo consegnato al cliente (FORM-07A)", proc: "PROC-07", critico: true },
  { id: 3, voce: "NPS raccolto e registrato (FORM-07B)", proc: "PROC-07", critico: true },
  { id: 4, voce: "Proposta di rinnovo inviata al cliente (FORM-07C)", proc: "PROC-07", critico: true },
  { id: 5, voce: "Follow-up 30 giorni completato (FORM-07D)", proc: "PROC-07", critico: true },
  { id: 6, voce: "Lesson learned documentate (FORM-07F)", proc: "PROC-07", critico: true },
  { id: 7, voce: "Documentazione archiviata su SharePoint/Drive con accessi corretti", proc: "PROC-07", critico: true },
  { id: 8, voce: "Tutte le fatture emesse e i pagamenti ricevuti", proc: "Admin", critico: true },
  { id: 9, voce: "Retrospettiva team interna completata (30 min)", proc: "PROC-07", critico: false },
  { id: 10, voce: "Scheda cliente aggiornata nel CRM con KPI finali e NPS", proc: "CRM", critico: false },
  { id: 11, voce: "Case history redatta per uso interno (se cliente autorizza)", proc: "Marketing", critico: false },
  { id: 12, voce: "Iscrizione al programma referral (se NPS ≥ 9)", proc: "BD", critico: false },
];

export default function Form07G() {
  const [checks, setChecks] = useState(CHECKLIST_CHIUSURA.map((c, i) => ({ ...c, ok: i < 7 })));
  const [data_chiusura, setDataChiusura] = useState("2025-12-31");
  const [chiuso_da, setChiusoDa] = useState("Elena Mancini");
  const [note_finali, setNoteFinali] = useState("Engagement ESG-2025-ACM-001 completato con successo. Primo bilancio di sostenibilità conforme GRI e CSRD pubblicato. Cliente molto soddisfatto (NPS 9). Proposta rinnovo FY2025 inviata — decisione attesa entro fine dicembre 2025. Opportunità identificata: dashboard KPI e supporto rating EcoVadis.");
  const [chiusoFormalmente, setChiusoFormalmente] = useState(false);

  const toggle = (id) => setChecks(p => p.map(c => c.id === id ? { ...c, ok: !c.ok } : c));

  const critiche = checks.filter(c => c.critico);
  const critiOk = critiche.filter(c => c.ok).length;
  const tutteOk = critiOk === critiche.length;

  return (
    <FormWrapper
      formCode="FORM-07G"
      title="Chiusura Formale Engagement"
      subtitle="Validazione finale e chiusura ufficiale del progetto ESG nel gestionale"
      meta={{ "Engagement": "ESG-2025-ACM-001", "Data chiusura": data_chiusura, "Chiuso da": chiuso_da }}
      ruleBox={tutteOk ? "✅ Tutti i prerequisiti soddisfatti — Engagement pronto per la chiusura formale." : "⚠️ Completare le attività obbligatorie prima di chiudere formalmente l'engagement."}
      ruleBoxType={tutteOk ? "success" : "warning"}
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* STATUS FINALE */}
      {chiusoFormalmente ? (
        <div className="rounded-2xl border-2 border-green-400 bg-green-50 p-8 text-center space-y-3">
          <Trophy size={48} className="text-green-600 mx-auto" />
          <p className="text-2xl font-bold text-green-700">Engagement chiuso con successo!</p>
          <p className="text-sm text-green-600">ESG-2025-ACM-001 · Chiuso il {data_chiusura} da {chiuso_da}</p>
          <div className="flex justify-center gap-6 pt-2">
            <div className="text-center"><p className="text-3xl font-bold text-green-700">9</p><p className="text-xs text-green-600">NPS</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-green-700">100%</p><p className="text-xs text-green-600">Completamento</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-green-700">PROMOTORE</p><p className="text-xs text-green-600">Categoria cliente</p></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className={cn("rounded-lg p-4 text-center border", tutteOk ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200")}>
            <p className={cn("text-3xl font-bold", tutteOk ? "text-green-700" : "text-amber-600")}>{critiOk}/{critiche.length}</p>
            <p className="text-xs text-muted-foreground">Prerequisiti critici</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-4 text-center border border-border">
            <p className="text-3xl font-bold text-foreground">{checks.filter(c => c.ok).length}/{checks.length}</p>
            <p className="text-xs text-muted-foreground">Attività completate</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-4 text-center border border-border">
            <p className="text-3xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground">Completamento progetto</p>
          </div>
        </div>
      )}

      <FormSection title="Checklist di chiusura" cols={1}>
        <div className="space-y-2">
          {checks.map(c => (
            <div key={c.id} onClick={() => toggle(c.id)} className={cn("rounded-lg border p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/10", c.ok ? "border-green-200 bg-green-50/20" : "border-border")}>
              {c.ok ? <CheckCircle2 size={15} className="text-green-600 shrink-0" /> : <Circle size={15} className="text-muted-foreground shrink-0" />}
              <span className="text-sm flex-1">{c.voce}</span>
              <span className="text-xs text-muted-foreground font-mono">{c.proc}</span>
              {c.critico && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded shrink-0">obbligatorio</span>}
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Dati di chiusura formale">
        <Field label="Data chiusura formale" required>
          <Input type="date" value={data_chiusura} onChange={setDataChiusura} />
        </Field>
        <Field label="Chiuso da (Partner responsabile)">
          <Input value={chiuso_da} onChange={setChiusoDa} />
        </Field>
        <Field label="Note finali sull'engagement" span={2}>
          <Textarea value={note_finali} onChange={setNoteFinali} rows={3} />
        </Field>
      </FormSection>

      {!chiusoFormalmente && (
        <div className="pt-2">
          <button
            disabled={!tutteOk}
            onClick={() => setChiusoFormalmente(true)}
            className={cn("w-full py-4 rounded-xl font-bold text-lg transition-all", tutteOk ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" : "bg-muted text-muted-foreground cursor-not-allowed")}
          >
            {tutteOk ? "🏆 Chiudi engagement formalmente" : `Completa le ${critiche.length - critiOk} attività obbligatorie rimanenti`}
          </button>
        </div>
      )}
    </FormWrapper>
  );
}