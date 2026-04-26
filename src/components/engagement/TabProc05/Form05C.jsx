import FormWrapper, { FormSection, Field, Input, Textarea, Select, RadioGroup } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { useEngagement } from "@/hooks/useEngagements";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

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

export default function Form05C({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "05C");
  const { data: eng } = useEngagement(engagementId);

  const targets = d?.targets ?? [];
  const setRow = (i, k, v) => { const n = [...targets]; n[i] = { ...n[i], [k]: v }; updateField("targets", n); };
  const remove = (i) => updateField("targets", targets.filter((_, idx) => idx !== i));
  const add = () => updateField("targets", [...targets, {
    id: Date.now(), area: "E1", kpi: "", baseline_anno: d?.anno_baseline || "",
    baseline_val: "", target_2026: "", target_2028: "", target_2030: "",
    um: "", sbti: "Non allineato (target interno)", note: ""
  }]);

  const targetOk = targets.filter(t => t.kpi && t.baseline_val && t.target_2030).length;

  const sbtiColor = (sbti) => {
    if (!sbti || sbti === "Non allineato (target interno)") return "text-muted-foreground";
    return "text-green-600 font-semibold";
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
      ruleBox="I target quantitativi devono essere: (1) basati su una baseline verificata, (2) scientificamente giustificati per i target climatici (SBTi), (3) approvati dal CdA prima della pubblicazione nel Bilancio di Sostenibilità."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Target totali", value: targets.length, color: "text-foreground" },
          { label: "Con traiettoria completa", value: targetOk, color: "text-primary" },
          { label: "Allineati SBTi", value: targets.filter(t => t.sbti && t.sbti !== "Non allineato (target interno)").length, color: "text-green-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold tabular-nums", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Identificazione e parametri temporali" cols={4}>
        <Field label="Codice progetto"><Input value={d?.codice_progetto ?? eng?.codice_progetto ?? ""} onChange={v => updateField("codice_progetto", v)} /></Field>
        <Field label="Cliente"><Input value={d?.cliente ?? eng?.clienti?.ragione_sociale ?? ""} onChange={v => updateField("cliente", v)} /></Field>
        <Field label="Anno baseline"><Input type="number" value={d?.anno_baseline} onChange={v => updateField("anno_baseline", v)} /></Field>
        <Field label="Target anno 1"><Input type="number" value={d?.anno_target_1} onChange={v => updateField("anno_target_1", v)} /></Field>
        <Field label="Target anno 2"><Input type="number" value={d?.anno_target_2} onChange={v => updateField("anno_target_2", v)} /></Field>
        <Field label="Target anno 3 (lungo termine)"><Input type="number" value={d?.anno_target_3} onChange={v => updateField("anno_target_3", v)} /></Field>
      </FormSection>

      <FormSection title="Commitment SBTi / Science-Based" cols={1}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Percorso SBTi adottato">
            <Select value={d?.sbti_commitment} onChange={v => updateField("sbti_commitment", v)} options={SBTI_PATHS} placeholder="Seleziona..." />
          </Field>
          <Field label="Note impegno SBTi / validazione">
            <Input value={d?.note_sbti} onChange={v => updateField("note_sbti", v)} placeholder="Es. Impegno firmato marzo 2025, validazione attesa giugno 2026" />
          </Field>
        </div>
        <Field label="Metodologia di calcolo riduzione (breve descrizione)">
          <Textarea value={d?.metodo_calcolo} onChange={v => updateField("metodo_calcolo", v)} rows={2}
            placeholder="Es. Riduzione assoluta Scope 1+2 calcolata su baseline verificata..." />
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
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Target {d?.anno_target_1 || "Y1"}</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Target {d?.anno_target_2 || "Y2"}</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-20">Target {d?.anno_target_3 || "Y3"}</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-32">Allineam. SBTi</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[120px]">Note</th>
                <th className="px-2 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {targets.map((t, i) => (
                <tr key={t.id ?? i} className="hover:bg-muted/20">
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
                      className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background text-center font-mono focus:outline-none focus:ring-1 focus:ring-ring" placeholder="—" />
                  </td>
                  {["target_2026", "target_2028", "target_2030"].map(k => (
                    <td key={k} className="px-2 py-2">
                      <input type="text" value={t[k] || ""} onChange={e => setRow(i, k, e.target.value)}
                        className={cn("w-full border rounded px-1.5 py-0.5 text-xs bg-background text-center font-mono focus:outline-none focus:ring-1 focus:ring-ring",
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
                    <input type="text" value={t.note || ""} onChange={e => setRow(i, "note", e.target.value)}
                      className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="note..." />
                  </td>
                  <td className="px-2 py-2">
                    <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive p-1"><Trash2 size={12} /></button>
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
        <Field label="Validato da (CS ESG)"><Input value={d?.validato_da} onChange={v => updateField("validato_da", v)} /></Field>
        <Field label="Data validazione"><Input type="date" value={d?.data_validazione} onChange={v => updateField("data_validazione", v)} /></Field>
        <Field label="Approvazione CdA" span={2}>
          <RadioGroup value={d?.approvazione_cda} onChange={v => updateField("approvazione_cda", v)} options={[
            { value: "approvato", label: "Target approvati dal CdA / Organo di governance" },
            { value: "bozza", label: "In revisione — non ancora approvati" },
            { value: "da_portare", label: "Da portare al prossimo CdA" },
          ]} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}

