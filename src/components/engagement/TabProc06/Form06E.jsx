import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

const STATI_CAPITOLO = ["Da avviare", "In redazione", "Bozza pronta", "In revisione", "Approvato"];

const INITIAL_CAPITOLI = [
  { id: 1,  n: 1,  titolo: "Lettera del CEO e dichiarazione di sostenibilità", parole_target: 800,  parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 2,  n: 2,  titolo: "Profilo aziendale e modello di business",           parole_target: 1500, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 3,  n: 3,  titolo: "Governance della sostenibilità",                    parole_target: 1200, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 4,  n: 4,  titolo: "Processo di analisi di materialità",                parole_target: 1400, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 5,  n: 5,  titolo: "Engagement degli stakeholder",                      parole_target: 900,  parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 6,  n: 6,  titolo: "Ambiente — Cambiamento climatico ed emissioni",     parole_target: 2000, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 7,  n: 7,  titolo: "Ambiente — Energia e risorse",                      parole_target: 1200, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 8,  n: 8,  titolo: "Ambiente — Acqua, rifiuti e biodiversità",          parole_target: 1000, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 9,  n: 9,  titolo: "Sociale — Persone e organizzazione",                parole_target: 1500, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 10, n: 10, titolo: "Sociale — Salute e sicurezza sul lavoro",           parole_target: 1200, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 11, n: 11, titolo: "Sociale — Sviluppo e formazione",                   parole_target: 900,  parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 12, n: 12, titolo: "Sociale — Filiera e fornitori",                     parole_target: 1000, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 13, n: 13, titolo: "Governance — Etica e anti-corruzione",              parole_target: 900,  parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 14, n: 14, titolo: "Piano di miglioramento e obiettivi 2026-2028",      parole_target: 1400, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
  { id: 15, n: 15, titolo: "Content Index GRI / ESRS e nota metodologica",      parole_target: 1200, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" },
];

const STATO_COLOR = {
  "Da avviare":   "text-muted-foreground",
  "In redazione": "text-amber-600",
  "Bozza pronta": "text-blue-600",
  "In revisione": "text-primary",
  "Approvato":    "text-green-600",
};

export default function Form06E({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "06E");

  const capitoli = d?.capitoli ?? INITIAL_CAPITOLI;
  const setRow = (i, k, v) => { const n = [...capitoli]; n[i] = { ...n[i], [k]: v }; updateField("capitoli", n); };
  const remove = (i) => updateField("capitoli", capitoli.filter((_, idx) => idx !== i));
  const add = () => updateField("capitoli", [...capitoli, { id: Date.now(), n: capitoli.length + 1, titolo: "", parole_target: 1000, parole_attuali: 0, stato: "Da avviare", assegnato: "", data_scadenza: "", note: "" }]);

  const totParoleTarget = capitoli.reduce((s, c) => s + (parseInt(c.parole_target) || 0), 0);
  const totParoleAttuali = capitoli.reduce((s, c) => s + (parseInt(c.parole_attuali) || 0), 0);
  const approvati = capitoli.filter(c => c.stato === "Approvato").length;
  const pct = totParoleTarget > 0 ? Math.round((totParoleAttuali / totParoleTarget) * 100) : 0;

  return (
    <FormWrapper
      formCode="FORM-06E"
      title="Piano Editoriale Bilancio di Sostenibilità"
      subtitle="Struttura capitoli · Assegnazioni · Scadenze · Tracciamento avanzamento redazione"
      meta={{
        Fase: "Fase 6.5",
        Input: "FORM-04C/D/E (KPI) · FORM-05A-05C (Piano azione) · FORM-02H (materialità)",
        Responsabile: "CS ESG (editor) + Comunicatore + PM",
        Timing: "Settimane 1-2 (piano) poi parallelamente alla redazione",
        Output: "Piano editoriale condiviso · Struttura capitoli · Milestone redazione",
      }}
      ruleBox="Il piano editoriale è il documento guida della redazione. Definisce struttura, responsabilità, scadenze e target di lunghezza per ogni capitolo. Va condiviso con il cliente prima di iniziare la redazione."
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Capitoli totali", value: capitoli.length, color: "text-foreground" },
          { label: "Approvati", value: approvati, color: "text-green-600" },
          { label: "Parole target", value: totParoleTarget.toLocaleString("it"), color: "text-primary" },
          { label: "% redazione", value: `${pct}%`, color: pct >= 80 ? "text-green-600" : pct >= 40 ? "text-amber-600" : "text-muted-foreground" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold tabular-nums", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Identificazione e parametri editoriali" cols={3}>
        <Field label="Codice progetto"><Input value={d?.codice_progetto} onChange={v => updateField("codice_progetto", v)} /></Field>
        <Field label="Cliente"><Input value={d?.cliente} onChange={v => updateField("cliente", v)} /></Field>
        <Field label="Standard applicati"><Input value={d?.standard} onChange={v => updateField("standard", v)} placeholder="GRI / ESRS / entrambi" /></Field>
        <Field label="Data avvio redazione"><Input type="date" value={d?.data_avvio_redazione} onChange={v => updateField("data_avvio_redazione", v)} /></Field>
        <Field label="Consegna bozza a cliente"><Input type="date" value={d?.data_consegna_bozza} onChange={v => updateField("data_consegna_bozza", v)} /></Field>
        <Field label="Consegna versione finale"><Input type="date" value={d?.data_consegna_finale} onChange={v => updateField("data_consegna_finale", v)} /></Field>
      </FormSection>

      <FormSection title="Struttura e piano editoriale capitoli" cols={1}>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Avanzamento redazione</span>
            <span>{totParoleAttuali.toLocaleString("it")} / {totParoleTarget.toLocaleString("it")} parole ({pct}%)</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all", pct >= 80 ? "bg-green-500" : pct >= 40 ? "bg-amber-500" : "bg-primary")} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-8">#</th>
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[220px]">Titolo capitolo</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Target parole</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Parole attuali</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-28">Stato</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-32">Assegnato</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-28">Scadenza</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[100px]">Note</th>
                <th className="px-2 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {capitoli.map((cap, i) => (
                <tr key={cap.id} className={cn("hover:bg-muted/20", cap.stato === "Approvato" && "bg-green-500/5")}>
                  <td className="px-2 py-2 text-center font-bold text-muted-foreground">{cap.n}</td>
                  <td className="px-3 py-2">
                    <input type="text" value={cap.titolo} onChange={e => setRow(i, "titolo", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="number" value={cap.parole_target} onChange={e => setRow(i, "parole_target", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring text-center" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="number" value={cap.parole_attuali} onChange={e => setRow(i, "parole_attuali", e.target.value)} className={cn("w-full border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring text-center", parseInt(cap.parole_attuali) >= parseInt(cap.parole_target) ? "border-green-500/30 text-green-700" : "border-border")} />
                  </td>
                  <td className="px-2 py-2">
                    <select value={cap.stato} onChange={e => setRow(i, "stato", e.target.value)} className={cn("w-full border border-border rounded px-1 py-0.5 text-xs bg-background focus:outline-none font-medium", STATO_COLOR[cap.stato])}>
                      {STATI_CAPITOLO.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input type="text" value={cap.assegnato} onChange={e => setRow(i, "assegnato", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="date" value={cap.data_scadenza} onChange={e => setRow(i, "data_scadenza", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="text" value={cap.note} onChange={e => setRow(i, "note", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="note..." />
                  </td>
                  <td className="px-2 py-2">
                    <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 size={11} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-2">
          <Plus size={14} /> Aggiungi capitolo
        </button>
      </FormSection>

      <FormSection title="Nota editoriale e istruzioni di stile" cols={1}>
        <Field label="Istruzioni di stile, tono, vincoli di comunicazione">
          <Textarea value={d?.nota_editoriale} onChange={v => updateField("nota_editoriale", v)} rows={4} placeholder="Es. Tono istituzionale ma accessibile. Evitare greenwashing. Ogni claim deve avere dato verificato..." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
