import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";
import { CheckCircle2, MinusCircle } from "lucide-react";

const DOCUMENTI = [
  { code: "05A", label: "Dichiarazione di Visione e Impegno Strategico" },
  { code: "05B", label: "Obiettivi SMART — approvati" },
  { code: "05C", label: "Target quantitativi e allineamento SBTi" },
  { code: "05D", label: "Catalogo Iniziative ESG con schede" },
  { code: "05E", label: "Budget triennale ESG" },
  { code: "05F", label: "Roadmap visuale 3 anni" },
  { code: "05G", label: "Verbale Workshop CdA di approvazione" },
];

export default function Form05LOG({ eng }) {
  const [docCheck, setDocCheck] = useState(() =>
    Object.fromEntries(DOCUMENTI.map(d => [d.code, { ok: false, data: "" }]))
  );
  const [data, setData] = useState({
    codice_progetto: eng?.project_code || "",
    cliente: eng?.cliente_nome || "",
    n_obiettivi: "",
    n_target: "",
    n_iniziative: "",
    budget_totale: "",
    cda_approvato: false,
    autorizzazione: "",
    data_autorizzazione: "",
    approvato_da: "",
    punti_aperti: "",
    note_passaggio: "",
    data_chiusura: "",
  });

  const set = (k) => (v) => setData(prev => ({ ...prev, [k]: v }));
  const toggleDoc = (code) => setDocCheck(prev => ({ ...prev, [code]: { ...prev[code], ok: !prev[code].ok } }));
  const setDocData = (code, v) => setDocCheck(prev => ({ ...prev, [code]: { ...prev[code], data: v } }));

  const docsOk = Object.values(docCheck).filter(d => d.ok).length;

  return (
    <FormWrapper
      formCode="LOG-05"
      title="Chiusura Fase 5 e Avvio PROC-06"
      subtitle="Checklist documenti · KPI Piano Azione · Approvazione CdA · Passaggio a PROC-06"
      meta={{
        Fase: "Fase 5.8 — LOG",
        Input: "FORM-05A→05G completati · Verbale workshop CdA",
        Responsabile: "CS ESG + PM",
        Timing: "Post-approvazione CdA · entro 1 settimana",
        Output: "Piano ESG approvato · Autorizzazione avvio PROC-06 (Bilancio)",
      }}
      ruleBox={<><strong>Prerequisito per PROC-06:</strong> il Piano di Azione ESG deve essere formalmente approvato dal CdA o dall'organo di governance equivalente prima di procedere alla redazione del Bilancio di Sostenibilità.</>}
      storageKey={`form05log_${eng?.id}`}
    >
      <FormSection title="Identificazione" cols={2}>
        <Field label="Codice progetto"><Input value={data.codice_progetto} onChange={set("codice_progetto")} /></Field>
        <Field label="Cliente"><Input value={data.cliente} onChange={set("cliente")} /></Field>
      </FormSection>

      <FormSection title="Checklist documenti Fase 5" cols={1}>
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

      <FormSection title="KPI Piano Azione" cols={3}>
        <Field label="N. obiettivi SMART approvati"><Input type="number" value={data.n_obiettivi} onChange={set("n_obiettivi")} /></Field>
        <Field label="N. target quantitativi"><Input type="number" value={data.n_target} onChange={set("n_target")} /></Field>
        <Field label="N. iniziative ESG pianificate"><Input type="number" value={data.n_iniziative} onChange={set("n_iniziative")} /></Field>
        <Field label="Budget ESG triennale totale (€)"><Input value={data.budget_totale} onChange={set("budget_totale")} placeholder="€ 0" /></Field>
        <Field label="Approvazione CdA" span={2}>
          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <button onClick={() => set("cda_approvato")(!data.cda_approvato)}
              className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                data.cda_approvato ? "bg-primary border-primary" : "border-border hover:border-primary/50")}>
              {data.cda_approvato && <CheckCircle2 size={10} className="text-primary-foreground" />}
            </button>
            <span className="text-sm font-medium">Piano formalmente approvato dal CdA / Organo di governance</span>
          </label>
        </Field>
      </FormSection>

      <FormSection title="Autorizzazione avvio PROC-06 (Bilancio di Sostenibilità)" cols={1}>
        <Field label="Decisione">
          <RadioGroup value={data.autorizzazione} onChange={set("autorizzazione")} options={[
            { value: "AUTORIZZATO", label: "✅ AUTORIZZATO — Piano ESG approvato, avvio PROC-06 (Redazione Bilancio)" },
            { value: "CONDIZIONATO", label: "⚠ Autorizzazione condizionata — punti aperti documentati" },
            { value: "SOSPESO", label: "⏸ Sospeso — piano da completare o approvare" },
          ]} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data autorizzazione"><Input type="date" value={data.data_autorizzazione} onChange={set("data_autorizzazione")} /></Field>
          <Field label="Approvato da"><Input value={data.approvato_da} onChange={set("approvato_da")} /></Field>
        </div>
        <Field label="Punti aperti"><Textarea value={data.punti_aperti} onChange={set("punti_aperti")} rows={2} /></Field>
      </FormSection>

      <FormSection title="Note passaggio a PROC-06" cols={2}>
        <Field label="Data chiusura Fase 5"><Input type="date" value={data.data_chiusura} onChange={set("data_chiusura")} /></Field>
        <Field label="Approvato da (CS ESG / Partner)"><Input value={data.approvato_da} onChange={set("approvato_da")} /></Field>
        <Field label="Note per il team PROC-06" span={2}>
          <Textarea value={data.note_passaggio} onChange={set("note_passaggio")} rows={3}
            placeholder="Indicazioni per la redazione del Bilancio: temi prioritari, tono comunicativo, aspettative cliente..." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}