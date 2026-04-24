import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";
import { CheckCircle2, MinusCircle, Star } from "lucide-react";

const DOCUMENTI = [
  { code: "07A", label: "Dossier deliverable finale — archiviato" },
  { code: "07B", label: "Questionario NPS/soddisfazione — raccolto e analizzato" },
  { code: "07C", label: "Proposta rinnovo — inviata o archiviata" },
  { code: "07D", label: "Follow-up 30 gg — completato" },
  { code: "07E", label: "Follow-up 3 mesi — completato" },
  { code: "07F", label: "Lesson Learned — documento completato" },
  { code: "07G", label: "Checklist chiusura formale — firmata" },
];

export default function Form07LOG({ eng }) {
  const [docCheck, setDocCheck] = useState(() =>
    Object.fromEntries(DOCUMENTI.map(d => [d.code, { ok: false, data: "" }]))
  );
  const [data, setData] = useState({
    codice_progetto: eng?.project_code || "",
    cliente: eng?.cliente_nome || "",
    nps_score: "",
    nps_categoria: "",
    sat_media: "",
    bilancio_pubblicato: false,
    rinnovo_proposto: false,
    rinnovo_firmato: false,
    knowledge_archiviato: false,
    gdpr_completato: false,
    fatture_pagate: false,
    decisione_chiusura: "",
    data_chiusura: "",
    approvato_da: "",
    note_lessons: "",
    note_finali: "",
  });

  const set = (k) => (v) => setData(prev => ({ ...prev, [k]: v }));
  const toggleDoc = (code) => setDocCheck(prev => ({ ...prev, [code]: { ...prev[code], ok: !prev[code].ok } }));
  const setDocData = (code, v) => setDocCheck(prev => ({ ...prev, [code]: { ...prev[code], data: v } }));

  const docsOk = Object.values(docCheck).filter(d => d.ok).length;

  const npsNum = parseInt(data.nps_score);
  const npsCategoria = !isNaN(npsNum) ? npsNum >= 9 ? "PROMOTORE" : npsNum >= 7 ? "PASSIVO" : "DETRATTORE" : "";
  const npsColor = npsCategoria === "PROMOTORE" ? "text-green-600 dark:text-green-400" :
    npsCategoria === "PASSIVO" ? "text-amber-600 dark:text-amber-400" :
    npsCategoria === "DETRATTORE" ? "text-destructive" : "text-muted-foreground";

  const CHECKLIST_AMMIN = [
    { key: "bilancio_pubblicato", label: "Bilancio di Sostenibilità pubblicato (URL archiviato)" },
    { key: "rinnovo_proposto", label: "Proposta rinnovo inviata al cliente" },
    { key: "rinnovo_firmato", label: "Contratto rinnovo firmato (se applicabile)" },
    { key: "knowledge_archiviato", label: "Lesson Learned e knowledge capture archiviati nel repository" },
    { key: "gdpr_completato", label: "GDPR: dati personali del cliente archiviati/cancellati secondo policy" },
    { key: "fatture_pagate", label: "Fattura finale emessa e pagamento ricevuto" },
  ];

  return (
    <FormWrapper
      formCode="LOG-07"
      title="Chiusura Formale Engagement"
      subtitle="Checklist documenti Fase 7 · KPI engagement · Chiusura amministrativa · Archivio"
      meta={{
        Fase: "Fase 7.9 — LOG Finale",
        Input: "FORM-07A→07G completati · Tutti i dati engagement",
        Responsabile: "PM ESG + Responsabile Studio",
        Timing: "Post follow-up 3 mesi",
        Output: "Engagement chiuso formalmente · Archivio completo · CRM aggiornato",
      }}
      ruleBox={<><strong>Il LOG-07 chiude formalmente l'engagement nel sistema.</strong> Nessuna attività fatturabile può essere avviata dopo questa firma senza un nuovo contratto. Il documento è conservato nel repository per 10 anni (obbligatorio GDPR).</>}
      storageKey={`form07log_${eng?.id}`}
    >
      <FormSection title="Identificazione" cols={2}>
        <Field label="Codice progetto"><Input value={data.codice_progetto} onChange={set("codice_progetto")} /></Field>
        <Field label="Cliente"><Input value={data.cliente} onChange={set("cliente")} /></Field>
      </FormSection>

      <FormSection title="Checklist documenti Fase 7" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest w-20">Codice</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Documento</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-widest w-24">Stato</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-widest w-36">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DOCUMENTI.map(doc => (
                <tr key={doc.code} className={cn("hover:bg-muted/20", docCheck[doc.code].ok && "bg-green-500/5")}>
                  <td className="px-3 py-2.5 font-mono font-bold text-[11px] text-primary">FORM-{doc.code}</td>
                  <td className="px-3 py-2.5 text-foreground">{doc.label}</td>
                  <td className="px-3 py-2.5 text-center">
                    <button onClick={() => toggleDoc(doc.code)} className="flex items-center gap-1.5 mx-auto">
                      {docCheck[doc.code].ok
                        ? <><CheckCircle2 size={14} className="text-green-600 dark:text-green-400" /><span className="text-green-600 dark:text-green-400 font-bold text-[10px]">OK</span></>
                        : <><MinusCircle size={14} className="text-muted-foreground" /><span className="text-muted-foreground text-[10px]">—</span></>}
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <input type="date" value={docCheck[doc.code].data} onChange={e => setDocData(doc.code, e.target.value)}
                      className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-muted/30 border border-border rounded-lg px-4 py-3 flex items-center gap-4">
          <p className={cn("text-2xl font-bold tabular-nums", docsOk === DOCUMENTI.length ? "text-green-600 dark:text-green-400" : docsOk > 0 ? "text-amber-600" : "text-muted-foreground")}>
            {docsOk}/{DOCUMENTI.length}
          </p>
          <p className="text-xs text-muted-foreground">documenti completati</p>
        </div>
      </FormSection>

      {/* NPS */}
      <FormSection title="KPI soddisfazione cliente" cols={1}>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/30 border border-border rounded-xl p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">NPS Score (0-10)</p>
            <input type="number" min="0" max="10" value={data.nps_score} onChange={e => set("nps_score")(e.target.value)}
              className="w-20 border border-border rounded px-2 py-1 text-2xl font-bold text-center bg-background focus:outline-none focus:ring-2 focus:ring-ring mx-auto block" />
            {npsCategoria && (
              <p className={cn("text-sm font-bold mt-2 flex items-center justify-center gap-1", npsColor)}>
                <Star size={12} /> {npsCategoria}
              </p>
            )}
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Soddisfazione media (1-5)</p>
            <input type="number" min="0" max="5" step="0.1" value={data.sat_media} onChange={e => set("sat_media")(e.target.value)}
              className="w-20 border border-border rounded px-2 py-1 text-2xl font-bold text-center bg-background focus:outline-none focus:ring-2 focus:ring-ring mx-auto block" />
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Checklist amminist.</p>
            <div className="space-y-1.5">
              {CHECKLIST_AMMIN.map(({ key, label }) => (
                <label key={key} className="flex items-start gap-2 cursor-pointer">
                  <button onClick={() => set(key)(!data[key])}
                    className={cn("mt-0.5 w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                      data[key] ? "bg-primary border-primary" : "border-border hover:border-primary/50")}>
                    {data[key] && <CheckCircle2 size={8} className="text-primary-foreground" />}
                  </button>
                  <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Lesson Learned sintesi" cols={1}>
        <Field label="Principali lesson learned (da includere nel knowledge base dello studio)">
          <Textarea value={data.note_lessons} onChange={set("note_lessons")} rows={4}
            placeholder="Cosa ha funzionato bene, cosa si può migliorare, raccomandazioni per futuri engagement simili..." />
        </Field>
      </FormSection>

      <FormSection title="Chiusura formale engagement" cols={1}>
        <Field label="Decisione di chiusura">
          <RadioGroup value={data.decisione_chiusura} onChange={set("decisione_chiusura")} options={[
            { value: "CHIUSO", label: "✅ CHIUSO — Engagement completato formalmente, CRM aggiornato a BIL_PUBBLICATO" },
            { value: "PARZIALE", label: "⚠ Parzialmente chiuso — follow-up ancora aperto" },
            { value: "RINNOVATO", label: "🔄 RINNOVATO — Nuovo contratto firmato, engagement continua" },
          ]} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data chiusura formale"><Input type="date" value={data.data_chiusura} onChange={set("data_chiusura")} /></Field>
          <Field label="Responsabile chiusura"><Input value={data.approvato_da} onChange={set("approvato_da")} placeholder="CS ESG / Partner" /></Field>
        </div>
        <Field label="Note finali">
          <Textarea value={data.note_finali} onChange={set("note_finali")} rows={2} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}