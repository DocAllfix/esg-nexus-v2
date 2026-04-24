import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";
import { CheckCircle2, MinusCircle } from "lucide-react";

const DOCUMENTI = [
  { code: "06A", label: "Piano editoriale e struttura capitoli" },
  { code: "06B", label: "Sezioni narrative Ambiente (E) — approvate" },
  { code: "06C", label: "Sezioni narrative Sociale (S) — approvate" },
  { code: "06D", label: "Sezioni narrative Governance (G) — approvate" },
  { code: "06E", label: "Piano editoriale e scadenze — completato" },
  { code: "06F", label: "GRI/ESRS Content Index — compilato e verificato" },
  { code: "06G", label: "Assurance esterna — attestazione ricevuta" },
  { code: "06H", label: "Delibera CdA e pubblicazione finale" },
];

export default function Form06LOG({ eng }) {
  const [docCheck, setDocCheck] = useState(() =>
    Object.fromEntries(DOCUMENTI.map(d => [d.code, { ok: false, data: "" }]))
  );
  const [data, setData] = useState({
    codice_progetto: eng?.project_code || "",
    cliente: eng?.cliente_nome || "",
    n_pagine: "",
    n_capitoli: "",
    gri_coperti: "",
    esrs_coperti: "",
    assurance_ente: "",
    assurance_livello: "",
    delibera_cda: false,
    url_pubblicazione: "",
    autorizzazione: "",
    data_pubblicazione: "",
    approvato_da: "",
    note_finali: "",
  });

  const set = (k) => (v) => setData(prev => ({ ...prev, [k]: v }));
  const toggleDoc = (code) => setDocCheck(prev => ({ ...prev, [code]: { ...prev[code], ok: !prev[code].ok } }));
  const setDocData = (code, v) => setDocCheck(prev => ({ ...prev, [code]: { ...prev[code], data: v } }));
  const docsOk = Object.values(docCheck).filter(d => d.ok).length;

  return (
    <FormWrapper
      formCode="LOG-06"
      title="Chiusura Fase 6 — Bilancio Pubblicato"
      subtitle="Checklist documenti · KPI editoriali · Delibera CdA · Pubblicazione · Avvio PROC-07"
      meta={{
        Fase: "Fase 6.9 — LOG",
        Input: "FORM-06A→06H completati · Delibera CdA",
        Responsabile: "CS ESG + PM + Cliente",
        Timing: "Post-pubblicazione Bilancio",
        Output: "Bilancio pubblicato · Archivio completo · Avvio PROC-07 (Chiusura)",
      }}
      ruleBox={<><strong>Il Bilancio di Sostenibilità è il deliverable principale del progetto.</strong> La sua pubblicazione formale (con delibera CdA) completa la Fase 6 e apre la fase 7 di chiusura engagement e follow-up.</>}
      storageKey={`form06log_${eng?.id}`}
    >
      <FormSection title="Identificazione" cols={2}>
        <Field label="Codice progetto"><Input value={data.codice_progetto} onChange={set("codice_progetto")} /></Field>
        <Field label="Cliente"><Input value={data.cliente} onChange={set("cliente")} /></Field>
      </FormSection>

      <FormSection title="Checklist documenti Fase 6" cols={1}>
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

      <FormSection title="KPI editoriali Bilancio" cols={3}>
        <Field label="N. pagine totali"><Input type="number" value={data.n_pagine} onChange={set("n_pagine")} /></Field>
        <Field label="N. capitoli"><Input type="number" value={data.n_capitoli} onChange={set("n_capitoli")} /></Field>
        <Field label="Standard GRI — disclosure coperte"><Input value={data.gri_coperti} onChange={set("gri_coperti")} placeholder="es. 42/60" /></Field>
        <Field label="Standard ESRS — disclosure coperte"><Input value={data.esrs_coperti} onChange={set("esrs_coperti")} placeholder="es. 15/28" /></Field>
        <Field label="Ente di assurance"><Input value={data.assurance_ente} onChange={set("assurance_ente")} placeholder="es. Deloitte, RINA, Bureau Veritas" /></Field>
        <Field label="Livello assurance"><Input value={data.assurance_livello} onChange={set("assurance_livello")} placeholder="Limited / Reasonable" /></Field>
      </FormSection>

      <FormSection title="Pubblicazione e delibera" cols={1}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="URL pubblicazione bilancio">
            <Input value={data.url_pubblicazione} onChange={set("url_pubblicazione")} placeholder="https://..." />
          </Field>
          <Field label="Data pubblicazione ufficiale">
            <Input type="date" value={data.data_pubblicazione} onChange={set("data_pubblicazione")} />
          </Field>
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <button onClick={() => set("delibera_cda")(!data.delibera_cda)}
            className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
              data.delibera_cda ? "bg-primary border-primary" : "border-border hover:border-primary/50")}>
            {data.delibera_cda && <CheckCircle2 size={10} className="text-primary-foreground" />}
          </button>
          <span className="text-sm font-medium">Delibera CdA di approvazione del Bilancio ricevuta e archiviata</span>
        </label>
      </FormSection>

      <FormSection title="Autorizzazione avvio PROC-07 (Chiusura Engagement)" cols={1}>
        <Field label="Decisione">
          <RadioGroup value={data.autorizzazione} onChange={set("autorizzazione")} options={[
            { value: "AUTORIZZATO", label: "✅ AUTORIZZATO — Bilancio pubblicato, avvio PROC-07 (Chiusura e Follow-up)" },
            { value: "CONDIZIONATO", label: "⚠ In attesa — pubblicazione imminente" },
            { value: "SOSPESO", label: "⏸ Sospeso — revisioni ancora in corso" },
          ]} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Approvato da (CS ESG / Partner)"><Input value={data.approvato_da} onChange={set("approvato_da")} /></Field>
          <Field label="Data chiusura Fase 6"><Input type="date" value={data.data_pubblicazione} onChange={set("data_pubblicazione")} /></Field>
        </div>
        <Field label="Note finali">
          <Textarea value={data.note_finali} onChange={set("note_finali")} rows={3}
            placeholder="Comunicazione a cliente, archivio repository, next steps PROC-07..." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}