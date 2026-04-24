import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

const AREE = ["E — Ambiente", "S — Sociale", "G — Governance", "Trasversale"];
const STATI_AZIONE = ["In attesa", "In corso", "Completata", "Rinviata", "Bloccata"];

const INITIAL_AZIONI = [
  { id: 1, area: "E — Ambiente",    azione: "Verifica avvio sistema monitoraggio consumi energetici mensile", resp_cliente: "Operations",           stato: "In attesa", avanzamento: "", ostacoli: "" },
  { id: 2, area: "S — Sociale",     azione: "Conferma avvio piano formativo ESG per dipendenti",              resp_cliente: "HR",                   stato: "In attesa", avanzamento: "", ostacoli: "" },
  { id: 3, area: "G — Governance",  azione: "Verifica nomina ESG Committee o referente ESG CdA",             resp_cliente: "CEO / Segreteria CdA", stato: "In attesa", avanzamento: "", ostacoli: "" },
  { id: 4, area: "E — Ambiente",    azione: "Aggiornamento inventario GHG con dati effettivi anno corrente", resp_cliente: "Operations / HSE",     stato: "In attesa", avanzamento: "", ostacoli: "" },
  { id: 5, area: "Trasversale",     azione: "Review primo status report ESG interno",                        resp_cliente: "Referente ESG",        stato: "In attesa", avanzamento: "", ostacoli: "" },
];

const statoColor = (s) => ({
  "In attesa":  "text-muted-foreground",
  "In corso":   "text-amber-600",
  "Completata": "text-green-600",
  "Rinviata":   "text-blue-600",
  "Bloccata":   "text-destructive",
}[s] || "text-muted-foreground");

export default function Form07E({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "07E");

  const azioni = d?.azioni ?? INITIAL_AZIONI;
  const setRow = (i, k, v) => { const n = [...azioni]; n[i] = { ...n[i], [k]: v }; updateField("azioni", n); };
  const remove = (i) => updateField("azioni", azioni.filter((_, idx) => idx !== i));
  const add = () => updateField("azioni", [...azioni, { id: Date.now(), area: "", azione: "", resp_cliente: "", stato: "In attesa", avanzamento: "", ostacoli: "" }]);

  const completate = azioni.filter(a => a.stato === "Completata").length;
  const inCorso = azioni.filter(a => a.stato === "In corso").length;
  const bloccate = azioni.filter(a => a.stato === "Bloccata").length;

  return (
    <FormWrapper
      formCode="FORM-07E"
      title="Follow-up a 3 Mesi"
      subtitle="Verifica avanzamento Piano ESG · Azioni da roadmap · Opportunità rinnovo"
      meta={{
        Fase: "Fase 7.5",
        Input: "FORM-05D (schede iniziativa) · FORM-07D (follow-up 30gg) · Piano ESG approvato",
        Responsabile: "PM ESG",
        Timing: "3 mesi dalla pubblicazione del Bilancio",
        Output: "Report avanzamento · Nuove raccomandazioni · Pre-qualifica rinnovo",
      }}
      ruleBox="Il follow-up a 3 mesi è il primo touchpoint post-progetto. Verifica che il cliente abbia avviato le azioni prioritarie del Piano ESG ed è il momento migliore per sondare l'interesse al rinnovo annuale."
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Azioni monitorate", value: azioni.length,  color: "text-foreground" },
          { label: "Completate",         value: completate,     color: "text-green-600" },
          { label: "In corso",           value: inCorso,        color: "text-amber-600" },
          { label: "Bloccate",           value: bloccate,       color: "text-destructive" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold tabular-nums", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Informazioni incontro di follow-up" cols={3}>
        <Field label="Codice progetto"><Input value={d?.codice_progetto} onChange={v => updateField("codice_progetto", v)} /></Field>
        <Field label="Cliente"><Input value={d?.cliente} onChange={v => updateField("cliente", v)} /></Field>
        <Field label="Data follow-up"><Input type="date" value={d?.data_followup} onChange={v => updateField("data_followup", v)} /></Field>
        <Field label="Modalità (presenza/call/email)"><Input value={d?.modalita} onChange={v => updateField("modalita", v)} placeholder="Call Teams 60 min" /></Field>
        <Field label="Partecipanti" span={2}><Input value={d?.partecipanti} onChange={v => updateField("partecipanti", v)} placeholder="Es. PM, Referente ESG cliente, CEO" /></Field>
      </FormSection>

      <FormSection title="Monitoraggio azioni Piano ESG" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Area</th>
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[200px]">Azione / Iniziativa</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-28">Resp. cliente</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-28">Stato</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[150px]">Avanzamento dichiarato</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[120px]">Ostacoli / note</th>
                <th className="px-2 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {azioni.map((a, i) => (
                <tr key={a.id} className="hover:bg-muted/20">
                  <td className="px-2 py-2">
                    <select value={a.area} onChange={e => setRow(i, "area", e.target.value)} className="w-full border border-border rounded px-1 py-0.5 text-[10px] bg-background focus:outline-none">
                      <option value="">—</option>
                      {AREE.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input value={a.azione} onChange={e => setRow(i, "azione", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                  </td>
                  <td className="px-2 py-2">
                    <input value={a.resp_cliente} onChange={e => setRow(i, "resp_cliente", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none" />
                  </td>
                  <td className="px-2 py-2">
                    <select value={a.stato} onChange={e => setRow(i, "stato", e.target.value)} className={cn("w-full border border-border rounded px-1 py-0.5 text-xs bg-background focus:outline-none font-medium", statoColor(a.stato))}>
                      {STATI_AZIONE.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input value={a.avanzamento} onChange={e => setRow(i, "avanzamento", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none" placeholder="Es. 50% completato..." />
                  </td>
                  <td className="px-2 py-2">
                    <input value={a.ostacoli} onChange={e => setRow(i, "ostacoli", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none" placeholder="ostacoli..." />
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
          <Plus size={14} /> Aggiungi azione
        </button>
      </FormSection>

      <FormSection title="Valutazione complessiva" cols={1}>
        <Field label="Valutazione generale avanzamento Piano ESG">
          <Textarea value={d?.valutazione_generale} onChange={v => updateField("valutazione_generale", v)} rows={3} placeholder="Sintesi: quante azioni avviate, livello di commitment del management..." />
        </Field>
        <Field label="Criticità emerse">
          <Textarea value={d?.criticita_emerse} onChange={v => updateField("criticita_emerse", v)} rows={2} />
        </Field>
        <Field label="Punti di forza / eccellenze dichiarate dal cliente">
          <Textarea value={d?.punti_forza} onChange={v => updateField("punti_forza", v)} rows={2} />
        </Field>
        <Field label="Raccomandazioni per i prossimi 3 mesi">
          <Textarea value={d?.raccomandazioni} onChange={v => updateField("raccomandazioni", v)} rows={3} />
        </Field>
      </FormSection>

      <FormSection title="Pre-qualifica rinnovo" cols={1}>
        <Field label="Interesse al rinnovo per ciclo successivo">
          <RadioGroup value={d?.interesse_rinnovo} onChange={v => updateField("interesse_rinnovo", v)} options={[
            { value: "ALTO",  label: "Alto — cliente esprime chiaramente interesse a rinnovare" },
            { value: "MEDIO", label: "Medio — possibile, da qualificare meglio al prossimo follow-up" },
            { value: "BASSO", label: "Basso — cliente non mostra interesse o ha budget ridotto" },
          ]} />
        </Field>
        <Field label="Note opportunità rinnovo">
          <Textarea value={d?.opportunita_rinnovo} onChange={v => updateField("opportunita_rinnovo", v)} rows={2} placeholder="Scope rinnovo ipotizzato, budget indicativo, timeline..." />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data prossimo follow-up (6 mesi)"><Input type="date" value={d?.prossimo_followup} onChange={v => updateField("prossimo_followup", v)} /></Field>
          <Field label="Compilato da"><Input value={d?.compilato_da} onChange={v => updateField("compilato_da", v)} /></Field>
        </div>
      </FormSection>
    </FormWrapper>
  );
}
