import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { useEngagement } from "@/hooks/useEngagements";
import { cn } from "@/lib/utils";
import { CheckCircle2, MinusCircle } from "lucide-react";

const DOCUMENTI = [
  { code: "03A", label: "Piano di Audit e Pianificazione" },
  { code: "03B", label: "Registro Inventario Documentazione e Pre-Analisi" },
  { code: "03C", label: "Checklist Audit Ambientale (E) — rating compilati" },
  { code: "03D", label: "Checklist Audit Sociale (S) — rating compilati" },
  { code: "03E", label: "Checklist Audit Governance (G) — rating compilati" },
  { code: "03F", label: "Schede Interviste Strutturate — tutte validate" },
  { code: "03G", label: "Report di Diagnosi ESG — approvato dal cliente" },
];

const DEFAULT_DOC_CHECK = Object.fromEntries(DOCUMENTI.map(d => [d.code, { ok: false, data: "" }]));

export default function Form03H({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "03H");
  const { data: eng } = useEngagement(engagementId);

  const docCheck = d?.doc_check ?? DEFAULT_DOC_CHECK;

  const toggleDoc = (code) => updateField("doc_check", { ...docCheck, [code]: { ...docCheck[code], ok: !docCheck[code]?.ok } });
  const setDocData = (code, v) => updateField("doc_check", { ...docCheck, [code]: { ...docCheck[code], data: v } });

  const docsOk = Object.values(docCheck).filter(x => x.ok).length;

  return (
    <FormWrapper
      formCode="LOG-03"
      title="Chiusura Fase 3 e Avvio PROC-04/05"
      subtitle="Checklist documenti · KPI Fase 3 · Autorizzazione formale · Passaggio alla fase successiva"
      meta={{
        Fase: "Fase 3.8",
        Input: "FORM-03G (Report approvato) · Tutti i form precedenti",
        Responsabile: "CS ESG + PM + Management cliente",
        Timing: "Post approvazione Report · entro 1 settimana",
        Output: "Autorizzazione PROC-04/05 · Chiusura Fase 3",
      }}
      ruleBox={<><strong>Checklist finale:</strong> verifica completezza di tutti i documenti prodotti nella Fase 3 e dei KPI. L'autorizzazione avvio PROC-04/05 richiede tutti gli output completi e il Report approvato dal cliente.</>}
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <FormSection title="Identificazione" cols={2}>
        <Field label="Codice progetto"><Input value={d?.codice_progetto ?? eng?.codice_progetto ?? ""} onChange={v => updateField("codice_progetto", v)} /></Field>
        <Field label="Cliente"><Input value={d?.cliente ?? eng?.clienti?.ragione_sociale ?? ""} onChange={v => updateField("cliente", v)} /></Field>
      </FormSection>

      <FormSection title="Checklist documenti prodotti nella Fase 3" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px] w-20">Codice</th>
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">Titolo / contenuto</th>
                <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground uppercase tracking-widest text-[10px] w-24">Stato</th>
                <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground uppercase tracking-widest text-[10px] w-36">Data completam.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DOCUMENTI.map(doc => {
                const entry = docCheck[doc.code] || { ok: false, data: "" };
                return (
                  <tr key={doc.code} className={cn("hover:bg-muted/20", entry.ok && "bg-green-500/5")}>
                    <td className="px-3 py-2.5 font-mono font-bold text-[11px] text-primary">FORM-{doc.code}</td>
                    <td className="px-3 py-2.5 text-foreground">{doc.label}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={() => toggleDoc(doc.code)} className="flex items-center gap-1.5 mx-auto">
                        {entry.ok
                          ? <><CheckCircle2 size={14} className="text-green-600" /><span className="text-green-600 font-bold text-[10px]">OK</span></>
                          : <><MinusCircle size={14} className="text-muted-foreground" /><span className="text-muted-foreground text-[10px]">—</span></>
                        }
                      </button>
                    </td>
                    <td className="px-3 py-2.5">
                      <input type="date" value={entry.data || ""} onChange={e => setDocData(doc.code, e.target.value)}
                        className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-muted/30 border border-border rounded-lg px-4 py-3 flex items-center gap-4">
          <p className={cn("text-2xl font-bold tabular-nums", docsOk === DOCUMENTI.length ? "text-green-600" : docsOk > 0 ? "text-amber-600" : "text-muted-foreground")}>
            {docsOk}/{DOCUMENTI.length}
          </p>
          <p className="text-xs text-muted-foreground">documenti completati</p>
        </div>
      </FormSection>

      <FormSection title="KPI della Fase 3 — rilevati e target" cols={1}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {[
            { label: "Rating medio E (1-5)", key: "rating_E" },
            { label: "Rating medio S (1-5)", key: "rating_S" },
            { label: "Rating medio G (1-5)", key: "rating_G" },
            { label: "Gap critici (rating 1)", key: "gap_critici" },
            { label: "Non conformi (rating 2)", key: "gap_bad" },
            { label: "Requisiti valutati totali", key: "requisiti_valutati" },
          ].map(({ label, key }) => (
            <div key={key} className="bg-muted/30 border border-border rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
              <input type="text" value={d?.[key] || ""} onChange={e => updateField(key, e.target.value)}
                className="w-full border border-border rounded px-2 py-1 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring font-bold"
                placeholder="—" />
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">KPI</th>
                <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground uppercase tracking-widest text-[10px] w-24">Target</th>
                <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground uppercase tracking-widest text-[10px] w-36">Valore</th>
                <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground uppercase tracking-widest text-[10px] w-16">OK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-2.5 font-medium">Durata audit vs pianificata</td>
                <td className="px-3 py-2.5 text-center text-muted-foreground">≤ 120%</td>
                <td className="px-3 py-2.5">
                  <input type="text" value={d?.durata_vs_piano || ""} onChange={e => updateField("durata_vs_piano", e.target.value)}
                    className="w-full border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Es. 5/4 = 125%" />
                </td>
                <td className="px-3 py-2.5 text-center">
                  <button onClick={() => updateField("kpi_durata_ok", !d?.kpi_durata_ok)}>
                    {d?.kpi_durata_ok ? <CheckCircle2 size={16} className="text-green-600 mx-auto" /> : <MinusCircle size={16} className="text-muted-foreground mx-auto" />}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-medium">Soddisfazione cliente post-diagnosi (1-5)</td>
                <td className="px-3 py-2.5 text-center text-muted-foreground">≥ 4.0</td>
                <td className="px-3 py-2.5">
                  <input type="number" min="0" max="5" step="0.1" value={d?.sat_cliente || ""} onChange={e => updateField("sat_cliente", e.target.value)}
                    className="w-full border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                </td>
                <td className="px-3 py-2.5 text-center">
                  <button onClick={() => updateField("kpi_sat_ok", !d?.kpi_sat_ok)}>
                    {d?.kpi_sat_ok ? <CheckCircle2 size={16} className="text-green-600 mx-auto" /> : <MinusCircle size={16} className="text-muted-foreground mx-auto" />}
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-medium">Gap critici documentati con piano</td>
                <td className="px-3 py-2.5 text-center text-muted-foreground">100%</td>
                <td className="px-3 py-2.5 text-center text-muted-foreground text-xs">{d?.gap_critici || "—"} gap critici rilevati</td>
                <td className="px-3 py-2.5 text-center">
                  <button onClick={() => updateField("kpi_crit_doc", !d?.kpi_crit_doc)}>
                    {d?.kpi_crit_doc ? <CheckCircle2 size={16} className="text-green-600 mx-auto" /> : <MinusCircle size={16} className="text-muted-foreground mx-auto" />}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="Autorizzazione avvio PROC-04 (Raccolta Dati) + PROC-05 (Piano d'Azione)" cols={1}>
        <Field label="Decisione">
          <RadioGroup value={d?.autorizzazione} onChange={v => updateField("autorizzazione", v)} options={[
            { value: "AUTORIZZATO", label: "AUTORIZZATO — avvio PROC-04 e PROC-05 in parallelo" },
            { value: "CONDIZIONATO", label: "Autorizzazione condizionata — punti aperti documentati" },
            { value: "SOSPESO", label: "Sospeso — richiesti approfondimenti su specifici gap" },
          ]} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data autorizzazione"><Input type="date" value={d?.data_autorizzazione} onChange={v => updateField("data_autorizzazione", v)} /></Field>
          <Field label="Approvato da (CS ESG / Partner)"><Input value={d?.approvato_da} onChange={v => updateField("approvato_da", v)} /></Field>
        </div>
        <Field label="Punti aperti (se condizionato)">
          <Textarea value={d?.punti_aperti} onChange={v => updateField("punti_aperti", v)} rows={2} />
        </Field>
      </FormSection>

      <FormSection title="Note finali e passaggio a PROC-04/05" cols={1}>
        <Field label="Note per il team PROC-04 (Raccolta Dati) e PROC-05 (Piano d'Azione)">
          <Textarea value={d?.note_passaggio} onChange={v => updateField("note_passaggio", v)} rows={4} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data chiusura Fase 3"><Input type="date" value={d?.data_chiusura} onChange={v => updateField("data_chiusura", v)} /></Field>
          <Field label="Data prossima revisione Report"><Input type="date" value={d?.prossima_revisione} onChange={v => updateField("prossima_revisione", v)} /></Field>
        </div>
      </FormSection>
    </FormWrapper>
  );
}

