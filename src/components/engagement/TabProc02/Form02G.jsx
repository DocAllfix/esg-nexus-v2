import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { useEngagement } from "@/hooks/useEngagements";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

const SOGLIA_IMP = 3.0;
const SOGLIA_FIN = 9.0;

const TEMI = [
  { cat: "AMBIENTE (E)", id: "E1-1", label: "Emissioni GHG Scope 1" },
  { cat: "AMBIENTE (E)", id: "E1-2", label: "Emissioni GHG Scope 2" },
  { cat: "AMBIENTE (E)", id: "E1-3", label: "Emissioni GHG Scope 3" },
  { cat: "AMBIENTE (E)", id: "E1-4", label: "Rischi fisici clima" },
  { cat: "AMBIENTE (E)", id: "E1-5", label: "Rischio transizione / ETS" },
  { cat: "AMBIENTE (E)", id: "E1-6", label: "Opportunità efficienza energetica" },
  { cat: "AMBIENTE (E)", id: "E2",   label: "Inquinamento aria/acqua/suolo" },
  { cat: "AMBIENTE (E)", id: "E3",   label: "Gestione risorse idriche" },
  { cat: "AMBIENTE (E)", id: "E4",   label: "Biodiversità" },
  { cat: "AMBIENTE (E)", id: "E5",   label: "Rifiuti ed economia circolare" },
  { cat: "SOCIALE (S)",  id: "S1-1", label: "Infortuni e sicurezza" },
  { cat: "SOCIALE (S)",  id: "S1-2", label: "Formazione e sviluppo" },
  { cat: "SOCIALE (S)",  id: "S1-3", label: "Diversità e inclusione" },
  { cat: "SOCIALE (S)",  id: "S1-4", label: "Gender pay gap" },
  { cat: "SOCIALE (S)",  id: "S1-5", label: "Benessere e welfare" },
  { cat: "SOCIALE (S)",  id: "S2",   label: "Supply chain sociale" },
  { cat: "SOCIALE (S)",  id: "S3",   label: "Comunità locali" },
  { cat: "SOCIALE (S)",  id: "S4",   label: "Consumatori e prodotti" },
  { cat: "GOVERNANCE (G)", id: "G1-1", label: "Anticorruzione" },
  { cat: "GOVERNANCE (G)", id: "G1-2", label: "Whistleblowing" },
  { cat: "GOVERNANCE (G)", id: "G1-3", label: "Privacy e cybersecurity" },
  { cat: "GOVERNANCE (G)", id: "G2",   label: "Struttura CdA" },
  { cat: "GOVERNANCE (G)", id: "G3",   label: "Rischi TCFD" },
  { cat: "GOVERNANCE (G)", id: "G4",   label: "Fiscalità responsabile" },
];

const FONTI = [
  { key: "mgmt", label: "Mgmt (40%)", peso: 0.40 },
  { key: "dip",  label: "Dip. (25%)", peso: 0.25 },
  { key: "ext",  label: "Ext. (25%)", peso: 0.25 },
  { key: "desk", label: "Desk (10%)", peso: 0.10 },
];

function weightedAvg(values) {
  let sum = 0, w = 0;
  values.forEach(([v, p]) => { const n = parseFloat(v); if (!isNaN(n)) { sum += n * p; w += p; } });
  return w > 0 ? Math.round((sum / w) * 100) / 100 : null;
}

const catColors = {
  "AMBIENTE (E)": "text-teal-600 bg-teal-500/10",
  "SOCIALE (S)": "text-amber-600 bg-amber-500/10",
  "GOVERNANCE (G)": "text-blue-600 bg-blue-500/10",
};

export default function Form02G({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "02G");
  const { data: eng } = useEngagement(engagementId);

  const scores = d?.scores ?? {};

  const getAggImp = useCallback((tId) =>
    weightedAvg(FONTI.map(f => [scores[`${tId}_${f.key}_imp`] || "", f.peso])), [scores]);
  const getAggFin = useCallback((tId) =>
    weightedAvg(FONTI.map(f => [scores[`${tId}_${f.key}_fin`] || "", f.peso])), [scores]);

  const materiali = TEMI.filter(t => {
    const si = getAggImp(t.id), sf = getAggFin(t.id);
    return (si !== null && si >= SOGLIA_IMP) || (sf !== null && sf >= SOGLIA_FIN);
  });

  let lastCat = "";

  return (
    <FormWrapper
      formCode="FORM-02G"
      title="Elaborazione Scoring e Ranking IRO"
      subtitle="24 temi aggregati · Score ponderato 40/25/25/10 · Soglie live · USO INTERNO"
      meta={{
        "Fase": "Fase 2.6",
        "Input": "FORM-02D (valutazione interna) · FORM-02E/F (risposte stakeholder)",
        "Resp.": "Analista ESG Senior + CS ESG",
        "Timing": "Settimane 5-6",
        "Output": "Ranking IRO · Score finali · Lista IRO materiali",
      }}
      ruleBox={
        <><strong>Aggregazione pesata:</strong> Management 40% · Dipendenti interni 25% · Stakeholder esterni 25% · Benchmark/desk 10%.
        Score impatto su scala 1-5 (soglia <strong>3.0</strong>) · Score finanziario su scala 1-25 (soglia <strong>9.0</strong>).</>
      }
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <FormSection title="Identificazione" cols={3}>
        <Field label="Codice progetto"><Input value={d?.codice_progetto ?? eng?.codice_progetto ?? ""} onChange={v => updateField("codice_progetto", v)} /></Field>
        <Field label="Cliente"><Input value={d?.cliente ?? eng?.clienti?.ragione_sociale ?? ""} onChange={v => updateField("cliente", v)} /></Field>
        <Field label="Analista responsabile"><Input value={d?.analista} onChange={v => updateField("analista", v)} /></Field>
        <Field label="Data elaborazione"><Input type="date" value={d?.data_elab} onChange={v => updateField("data_elab", v)} /></Field>
        <Field label="N. questionari interni raccolti"><Input value={d?.n_quest_int} onChange={v => updateField("n_quest_int", v)} placeholder="n. / % su target" /></Field>
        <Field label="N. questionari esterni raccolti"><Input value={d?.n_quest_ext} onChange={v => updateField("n_quest_ext", v)} placeholder="n. / % su target" /></Field>
      </FormSection>

      <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 flex items-center gap-6 flex-wrap text-sm">
        <div>
          <p className="text-2xl font-bold tabular-nums text-primary">{materiali.length}</p>
          <p className="text-xs text-muted-foreground">temi materiali</p>
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums">{TEMI.filter(t => getAggImp(t.id) !== null || getAggFin(t.id) !== null).length}</p>
          <p className="text-xs text-muted-foreground">valutati</p>
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums text-green-600">
            {TEMI.filter(t => { const si = getAggImp(t.id), sf = getAggFin(t.id); return si !== null && si >= SOGLIA_IMP && sf !== null && sf >= SOGLIA_FIN; }).length}
          </p>
          <p className="text-xs text-muted-foreground">doppia materialità</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          Soglie: Impatto ≥ {SOGLIA_IMP} · Finanziario ≥ {SOGLIA_FIN}
        </div>
      </div>

      <FormSection title="Score aggregato IMPATTO + FINANZIARIO per-fonte" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase text-[10px] min-w-[60px]">ID</th>
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground uppercase text-[10px] min-w-[160px]">Tema</th>
                {FONTI.map(f => (
                  <th key={f.key} className="px-2 py-2.5 text-center font-semibold text-muted-foreground uppercase text-[10px] w-16 whitespace-nowrap">
                    {f.label}<br/><span className="text-[9px] font-normal">IMP</span>
                  </th>
                ))}
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground uppercase text-[10px] w-16">AGG.IMP</th>
                {FONTI.map(f => (
                  <th key={f.key+"fin"} className="px-2 py-2.5 text-center font-semibold text-muted-foreground uppercase text-[10px] w-16 whitespace-nowrap">
                    {f.label.split(" ")[0]}<br/><span className="text-[9px] font-normal">FIN</span>
                  </th>
                ))}
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground uppercase text-[10px] w-16">AGG.FIN</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground uppercase text-[10px] w-14">MAT?</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground uppercase text-[10px] w-20">ESRS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TEMI.map(t => {
                const showCat = t.cat !== lastCat;
                if (showCat) lastCat = t.cat;
                const si = getAggImp(t.id);
                const sf = getAggFin(t.id);
                const matImp = si !== null && si >= SOGLIA_IMP;
                const matFin = sf !== null && sf >= SOGLIA_FIN;
                const isMat = matImp || matFin;
                return (
                  <>
                    {showCat && (
                      <tr key={t.cat}>
                        <td colSpan={15} className={cn("px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider", catColors[t.cat])}>
                          {t.cat}
                        </td>
                      </tr>
                    )}
                    <tr key={t.id} className="hover:bg-muted/20">
                      <td className="px-3 py-2 font-mono font-bold text-[10px] text-muted-foreground">{t.id}</td>
                      <td className="px-3 py-2 font-medium text-foreground">{t.label}</td>
                      {FONTI.map(f => (
                        <td key={f.key} className="px-1 py-2 text-center">
                          <input type="number" step="0.1" min="0" max="5"
                            value={scores[`${t.id}_${f.key}_imp`] || ""}
                            onChange={e => updateField("scores", { ...scores, [`${t.id}_${f.key}_imp`]: e.target.value })}
                            className="w-12 border border-border rounded px-1 py-0.5 text-center text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                            placeholder="0"
                          />
                        </td>
                      ))}
                      <td className={cn("px-2 py-2 text-center font-bold tabular-nums text-[11px]",
                        si !== null ? matImp ? "bg-green-500/10 text-green-700" : "text-muted-foreground" : "text-muted-foreground/40"
                      )}>
                        {si !== null ? si.toFixed(2) : "—"}
                      </td>
                      {FONTI.map(f => (
                        <td key={f.key+"fin"} className="px-1 py-2 text-center">
                          <input type="number" step="0.1" min="0" max="25"
                            value={scores[`${t.id}_${f.key}_fin`] || ""}
                            onChange={e => updateField("scores", { ...scores, [`${t.id}_${f.key}_fin`]: e.target.value })}
                            className="w-12 border border-border rounded px-1 py-0.5 text-center text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                            placeholder="0"
                          />
                        </td>
                      ))}
                      <td className={cn("px-2 py-2 text-center font-bold tabular-nums text-[11px]",
                        sf !== null ? matFin ? "bg-green-500/10 text-green-700" : "text-muted-foreground" : "text-muted-foreground/40"
                      )}>
                        {sf !== null ? sf.toFixed(2) : "—"}
                      </td>
                      <td className="px-2 py-2 text-center">
                        {(si !== null || sf !== null) ? (
                          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            isMat ? "bg-green-500/10 text-green-700 border-green-500/30" : "bg-muted text-muted-foreground border-border"
                          )}>
                            {isMat ? "SÌ" : "no"}
                          </span>
                        ) : <span className="text-muted-foreground/40 text-[10px]">—</span>}
                      </td>
                      <td className="px-2 py-2">
                        <input type="text"
                          value={scores[`${t.id}_esrs`] || ""}
                          onChange={e => updateField("scores", { ...scores, [`${t.id}_esrs`]: e.target.value })}
                          className="w-full border border-border rounded px-1.5 py-0.5 text-[10px] bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                          placeholder="ESRS"
                        />
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="Rettifiche qualitative" cols={1}>
        <Field label="IRO/Temi elevati in soglia per motivi qualitativi (specificare e motivare)">
          <Textarea value={d?.elevati} onChange={v => updateField("elevati", v)} rows={2} />
        </Field>
        <Field label="IRO/Temi abbassati in soglia per motivi qualitativi (specificare e motivare)">
          <Textarea value={d?.abbassati} onChange={v => updateField("abbassati", v)} rows={2} />
        </Field>
        <Field label="Note sulla robustezza del dataset">
          <Textarea value={d?.note_robustezza} onChange={v => updateField("note_robustezza", v)} rows={2} />
        </Field>
      </FormSection>

      <FormSection title="Validazione CS ESG" cols={2}>
        <Field label="Validato da (CS ESG)"><Input value={d?.validato_da} onChange={v => updateField("validato_da", v)} /></Field>
        <Field label="Data validazione"><Input type="date" value={d?.data_validazione} onChange={v => updateField("data_validazione", v)} /></Field>
      </FormSection>
    </FormWrapper>
  );
}

