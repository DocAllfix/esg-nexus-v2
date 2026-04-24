import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select, RadioGroup } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Target } from "lucide-react";

const AREE = [
  { value: "E1", label: "E1 — Clima e GHG" },
  { value: "E2", label: "E2 — Inquinamento" },
  { value: "E3", label: "E3 — Acqua" },
  { value: "E4", label: "E4 — Biodiversità" },
  { value: "E5", label: "E5 — Rifiuti / Economia circolare" },
  { value: "S1", label: "S1 — Forza lavoro" },
  { value: "S2", label: "S2 — Supply chain sociale" },
  { value: "S3", label: "S3 — Comunità" },
  { value: "S4", label: "S4 — Consumatori" },
  { value: "G1", label: "G1 — Etica / Anticorruzione" },
  { value: "G2", label: "G2 — Governance CdA" },
  { value: "G3", label: "G3 — Risk management" },
];

const SBTI_PATHS = [
  "SBTi 1.5°C Assoluto",
  "SBTi Well-Below 2°C",
  "SBTi Net-Zero (lungo termine)",
  "Science-based equivalente (no SBTi)",
  "Non allineato (target interno)",
];

const INITIAL_TARGETS = [
  { id: 1, area: "E1", kpi: "Riduzione emissioni GHG Scope 1+2 (market-based)", baseline_anno: "2022", baseline_val: "285", target_2026: "256", target_2028: "228", target_2030: "199", um: "tCO2e", sbti: "SBTi 1.5°C Assoluto", note: "Riduzione 30% entro 2030 vs baseline 2022" },
  { id: 2, area: "E1", kpi: "Quota energia rinnovabile", baseline_anno: "2022", baseline_val: "35", target_2026: "60", target_2028: "80", target_2030: "100", um: "%", sbti: "Non allineato (target interno)", note: "100% rinnovabile entro 2030 tramite GO" },
  { id: 3, area: "S1", kpi: "Tasso di frequenza infortuni (TF)", baseline_anno: "2022", baseline_val: "3.2", target_2026: "2.0", target_2028: "1.2", target_2030: "0.5", um: "TF", sbti: "Non allineato (target interno)", note: "Zero infortuni gravi entro 2030" },
  { id: 4, area: "S1", kpi: "Ore formazione pro-capite annue", baseline_anno: "2022", baseline_val: "18", target_2026: "24", target_2028: "30", target_2030: "35", um: "h/dip.", sbti: "Non allineato (target interno)", note: "" },
  { id: 5, area: "S1", kpi: "% donne in ruoli manageriali", baseline_anno: "2022", baseline_val: "22", target_2026: "30", target_2028: "35", target_2030: "40", um: "%", sbti: "Non allineato (target interno)", note: "Piano parità UNI/PdR 125:2022" },
  { id: 6, area: "E5", kpi: "% rifiuti avviati a riciclo", baseline_anno: "2022", baseline_val: "62", target_2026: "72", target_2028: "80", target_2030: "90", um: "%", sbti: "Non allineato (target interno)", note: "" },
];

export default function Form05C({ eng }) {
  const [targets, setTargets] = useState(INITIAL_TARGETS);
  const [data, setData] = useState({
    codice_progetto: eng?.project_code || "",
    cliente: eng?.cliente_nome || "",
    anno_baseline: "2022",
    anno_target_1: "2026",
    anno_target_2: "2028",
    anno_target_3: "2030",
    sbti_commitment: "",
    note_sbti: "",
    metodo_calcolo: "",
    validato_da: "",
    data_validazione: "",
    approvazione_cda: "",
  });

  const set = (k) => (v) => setData(prev => ({ ...prev, [k]: v }));
  const setRow = (i, k, v) => setTargets(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });
  const remove = (i) => setTargets(p => p.filter((_, idx) => idx !== i));
  const add = () => setTargets(p => [...p, {
    id: Date.now(), area: "E1", kpi: "", baseline_anno: data.anno_baseline,
    baseline_val: "", target_2026: "", target_2028: "", target_2030: "",
    um: "", sbti: "Non allineato (target interno)", note: ""
  }]);

  const targetOk = targets.filter(t => t.kpi && t.baseline_val && t.target_2030).length;

  const sbtiColor = (sbti) => {
    if (!sbti || sbti === "Non allineato (target interno)") return "text-muted-foreground";
    return "text-green-600 dark:text-green-400 font-semibold";
  };

  return (
    <FormWrapper
      formCode="FORM-05C"
      title="Target Quantitativi e Allineamento SBTi"
      subtitle="Obiettivi misurabili per area ESG · Science-based targets · Baseline e traiettorie"
      meta={{
        Fase: "Fase 5.3",
        Input: "FORM-05B (obiettivi SMART) · FORM-04C (KPI ambientali) · FORM-03G (gap critici)",
        Responsabile: "CS ESG + PM",
        Timing: "Settimane 2-3",
        Output: "Tabella target con baseline · traiettorie · allineamento SBTi",
      }}
      ruleBox={<><strong>I target quantitativi devono essere:</strong> (1) basati su una baseline verificata, (2) scientificamente giustificati per i target climatici (SBTi), (3) approvati dal CdA prima della pubblicazione nel Bilancio di Sostenibilità.</>}
      storageKey={`form05c_${eng?.id}`}
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Target totali", value: targets.length, color: "text-foreground" },
          { label: "Con traiettoria completa", value: targetOk, color: "text-primary" },
          { label: "Allineati SBTi", value: targets.filter(t => t.sbti && t.sbti !== "Non allineato (target interno)").length, color: "text-green-600 dark:text-green-400" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold tabular-nums", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Identificazione e parametri temporali" cols={4}>
        <Field label="Codice progetto"><Input value={data.codice_progetto} onChange={set("codice_progetto")} /></Field>
        <Field label="Cliente"><Input value={data.cliente} onChange={set("cliente")} /></Field>
        <Field label="Anno baseline"><Input type="number" value={data.anno_baseline} onChange={set("anno_baseline")} /></Field>
        <Field label="Target anno 1"><Input type="number" value={data.anno_target_1} onChange={set("anno_target_1")} /></Field>
        <Field label="Target anno 2"><Input type="number" value={data.anno_target_2} onChange={set("anno_target_2")} /></Field>
        <Field label="Target anno 3 (lungo termine)"><Input type="number" value={data.anno_target_3} onChange={set("anno_target_3")} /></Field>
      </FormSection>

      <FormSection title="Commitment SBTi / Science-Based" cols={1}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Percorso SBTi adottato">
            <Select value={data.sbti_commitment} onChange={set("sbti_commitment")} options={SBTI_PATHS} placeholder="Seleziona..." />
          </Field>
          <Field label="Note impegno SBTi / validazione">
            <Input value={data.note_sbti} onChange={set("note_sbti")} placeholder="Es. Impegno firmato marzo 2025, validazione attesa giugno 2026" />
          </Field>
        </div>
        <Field label="Metodologia di calcolo riduzione (breve descrizione)">
          <Textarea value={data.metodo_calcolo} onChange={set("metodo_calcolo")} rows={2}
            placeholder="Es. Riduzione assoluta Scope 1+2 calcolata su baseline 2022 verificata da RINA. Scope 3 stimato con EXIOBASE..." />
        </Field>
      </FormSection>

      <FormSection title="Tabella target quantitativi per KPI" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-16">Area</th>
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[200px]">KPI / Indicatore</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">UM</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Baseline</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Target {data.anno_target_1}</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Target {data.anno_target_2}</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Target {data.anno_target_3}</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-32">Allineam. SBTi</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[120px]">Note</th>
                <th className="px-2 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {targets.map((t, i) => (
                <tr key={t.id} className="hover:bg-muted/20">
                  <td className="px-2 py-2">
                    <select value={t.area} onChange={e => setRow(i, "area", e.target.value)}
                      className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring">
                      {AREE.map(a => <option key={a.value} value={a.value}>{a.value}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input type="text" value={t.kpi} onChange={e => setRow(i, "kpi", e.target.value)}
                      className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Nome KPI" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="text" value={t.um} onChange={e => setRow(i, "um", e.target.value)}
                      className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="UM" />
                  </td>
                  <td className="px-2 py-2">
                    <input type="text" value={t.baseline_val} onChange={e => setRow(i, "baseline_val", e.target.value)}
                      className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring text-center font-mono" placeholder="—" />
                  </td>
                  {["target_2026", "target_2028", "target_2030"].map(k => (
                    <td key={k} className="px-2 py-2">
                      <input type="text" value={t[k]} onChange={e => setRow(i, k, e.target.value)}
                        className={cn("w-full border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring text-center font-mono",
                          t[k] ? "border-primary/30 text-primary font-bold" : "border-border text-muted-foreground")} placeholder="—" />
                    </td>
                  ))}
                  <td className="px-2 py-2">
                    <select value={t.sbti} onChange={e => setRow(i, "sbti", e.target.value)}
                      className={cn("w-full border border-border rounded px-1.5 py-0.5 text-[10px] bg-background focus:outline-none focus:ring-1 focus:ring-ring", sbtiColor(t.sbti))}>
                      {SBTI_PATHS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input type="text" value={t.note} onChange={e => setRow(i, "note", e.target.value)}
                      className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="note..." />
                  </td>
                  <td className="px-2 py-2">
                    <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-2">
          <Plus size={14} /> Aggiungi target
        </button>
      </FormSection>

      <FormSection title="Approvazione e governance target" cols={2}>
        <Field label="Validato da (CS ESG)"><Input value={data.validato_da} onChange={set("validato_da")} /></Field>
        <Field label="Data validazione"><Input type="date" value={data.data_validazione} onChange={set("data_validazione")} /></Field>
        <Field label="Approvazione CdA" span={2}>
          <RadioGroup value={data.approvazione_cda} onChange={set("approvazione_cda")} options={[
            { value: "approvato", label: "✅ Target approvati dal CdA / Organo di governance" },
            { value: "bozza", label: "⚠ In revisione — non ancora approvati" },
            { value: "da_portare", label: "🔲 Da portare al prossimo CdA" },
          ]} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}