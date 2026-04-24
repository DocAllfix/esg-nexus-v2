import FormWrapper, { FormSection, Field, Input, Textarea, Select, RadioGroup } from "@/components/common/FormWrapper";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

const SETUP_GRUPPI = [
  {
    cat: "Repository e Documenti",
    items: [
      "Cartella progetto creata su piattaforma condivisa",
      "Struttura sottocartelle create (00-07 + 99_Comunicazioni)",
      "Permessi di accesso configurati (consulenza + referente cliente)",
      "Template raccolta dati E (Ambiente) caricato e condiviso",
      "Template raccolta dati S (Sociale/HR) caricato e condiviso",
      "Template raccolta dati G (Governance) caricato e condiviso",
      "Template KPI ESG annuale (FORM-04B) caricato",
      "FORM-01C (perimetro) versione bozza caricata per commenti",
      "FORM-01D (Gantt) versione approvata caricata",
      "Naming convention comunicata per iscritto al cliente",
    ],
  },
  {
    cat: "Comunicazione e Calendario",
    items: [
      "Canale Teams/Slack/altro creato con tutti i partecipanti",
      "Calendario check-in bisettimanali inserito nell'agenda di tutti",
      "Calendario milestone principali condiviso",
      "Email di benvenuto progetto inviata al cliente",
      "Contatti di emergenza / escalation comunicati per iscritto",
      "Regole di comunicazione condivise (orari, tempi di risposta, canali)",
    ],
  },
  {
    cat: "Gestione Task e Avanzamento",
    items: [
      "Board progetto creato su tool di project management",
      "Task di Fase 2 (Materialità) inserite e assegnate",
      "Scadenze milestone inserite nel tool",
      "Notifiche automatiche configurate",
      "LOG-01 attivato e responsabile dell'aggiornamento nominato",
    ],
  },
  {
    cat: "Accessi Sistemi Cliente (se necessario)",
    items: [
      "Accesso al sistema HR del cliente concordato (solo lettura)",
      "Accesso ai dati energetici/bollette concordato",
      "Credenziali o accessi ricevuti e testati",
      "NDA/accordo riservatezza specifico per accessi siglato",
    ],
  },
  {
    cat: "Amministrazione",
    items: [
      "Fattura di acconto emessa (se prevista dal contratto)",
      "Scheda progetto aperta nel sistema di contabilità",
      "Timesheet di progetto attivato per tutti i membri del team",
      "Scadenza pagamento acconto monitorata in calendario",
    ],
  },
];

export default function Form01H({ eng }) {
  const [checked, setChecked] = useState({});
  const [data, setData] = useState({
    codice_progetto: eng?.project_code || "",
    cliente: eng?.cliente_nome || "",
    pm: eng?.responsabile || "",
    data_completamento: "",
    stato_setup: "",
    note_setup: "",
    firma_pm: "",
    firma_pm_data: "",
    firma_cli: "",
    firma_cli_data: "",
  });

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const set = (k) => (v) => setData(prev => ({ ...prev, [k]: v }));

  const totalItems = SETUP_GRUPPI.reduce((acc, g) => acc + g.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((checkedCount / totalItems) * 100);

  let idx = 0;
  const gruppiConIdx = SETUP_GRUPPI.map(g => ({
    ...g,
    items: g.items.map(item => ({ label: item, key: `item_${idx++}` })),
  }));

  return (
    <FormWrapper
      formCode="FORM-01H"
      title="Checklist Setup Operativo"
      subtitle="30 voci di setup in 5 aree · Repository · Comunicazione · Task · Accessi · Amministrazione"
      meta={{
        Fase: "Fase 1.8",
        Input: "Kick-off completato · Accessi cliente concordati",
        Responsabile: "Project Manager ESG + IT",
        Timing: "Entro 3 gg lav. dal kick-off",
        Output: "Repository attivo · Canali operativi · Template condivisi",
      }}
      ruleBox={<><strong>Setup completo prima dell'avvio PROC-02 (Materialità).</strong> Entro 3 giorni lavorativi dal kick-off.</>}
      storageKey={`form01h_${eng?.id}`}
    >
      <FormSection title="Identificazione" cols={4}>
        <Field label="Codice progetto"><Input value={data.codice_progetto} onChange={set("codice_progetto")} /></Field>
        <Field label="Cliente"><Input value={data.cliente} onChange={set("cliente")} /></Field>
        <Field label="PM responsabile"><Input value={data.pm} onChange={set("pm")} /></Field>
        <Field label="Data completamento"><Input type="date" value={data.data_completamento} onChange={set("data_completamento")} /></Field>
      </FormSection>

      <FormSection title="Checklist attività di setup" cols={1}>
        {/* Progress */}
        <div className="bg-muted/40 border border-border rounded-lg px-4 py-3 flex items-center gap-6 mb-4">
          <div>
            <p className="text-2xl font-bold tabular-nums">{checkedCount} <span className="text-sm font-normal text-muted-foreground">/ {totalItems}</span></p>
            <p className="text-xs text-muted-foreground mt-0.5">voci completate</p>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Completamento setup</span><span className={cn(pct >= 95 ? "text-green-600" : pct >= 70 ? "text-amber-600" : "text-destructive")}>{pct}%</span></div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all", pct >= 95 ? "bg-green-500" : pct >= 70 ? "bg-amber-500" : "bg-destructive")} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {gruppiConIdx.map(g => (
          <div key={g.cat} className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 pb-1 border-b border-border">{g.cat}</p>
            <div className="space-y-1.5">
              {g.items.map(({ label, key }) => (
                <label key={key} className="flex items-start gap-2.5 cursor-pointer group">
                  <button
                    onClick={() => toggle(key)}
                    className={cn(
                      "mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                      checked[key] ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"
                    )}
                  >
                    {checked[key] && <CheckCircle2 size={10} className="text-primary-foreground" />}
                  </button>
                  <span className={cn("text-xs leading-snug", checked[key] ? "line-through text-muted-foreground" : "text-foreground")}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </FormSection>

      <FormSection title="Struttura Repository standard" cols={1}>
        <div className="bg-muted/30 border border-border rounded-lg p-4 font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre">
{`📁 ESG-AAAA-TIPO-NNN_[NomeCliente]/
   ├── 📁 00_Acquisizione/
   ├── 📁 01_Avvio/
   ├── 📁 02_Materialita/
   ├── 📁 03_GapAnalysis/
   ├── 📁 04_RaccoltaDati/
   ├── 📁 05_PianoAzione/
   ├── 📁 06_BilancioDiSostenibilita/
   ├── 📁 07_Chiusura/
   ├── 📁 99_Comunicazioni/
   └── 📄 LOG-01_Registro_Attivita.xlsx`}
        </div>
      </FormSection>

      <FormSection title="Setup completato — Avvio Fase 2" cols={1}>
        <Field label="Stato setup">
          <RadioGroup
            value={data.stato_setup}
            onChange={set("stato_setup")}
            options={[
              { value: "completato", label: "✅ SETUP COMPLETATO — Tutti i punti verificati — Autorizzazione avvio PROC-02" },
              { value: "parziale", label: "⚠ SETUP PARZIALE — Punti mancanti documentati — Avvio condizionato" },
            ]}
          />
        </Field>
        <Field label="Note / punti mancanti" span={2}><Textarea value={data.note_setup} onChange={set("note_setup")} rows={2} /></Field>
      </FormSection>

      <FormSection title="Firme" cols={4}>
        <Field label="PM Consulenza"><Input value={data.firma_pm} onChange={set("firma_pm")} /></Field>
        <Field label="Data firma PM"><Input type="date" value={data.firma_pm_data} onChange={set("firma_pm_data")} /></Field>
        <Field label="Referente Cliente"><Input value={data.firma_cli} onChange={set("firma_cli")} /></Field>
        <Field label="Data firma Cliente"><Input type="date" value={data.firma_cli_data} onChange={set("firma_cli_data")} /></Field>
      </FormSection>
    </FormWrapper>
  );
}