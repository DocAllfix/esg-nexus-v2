import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { useEngagement } from "@/hooks/useEngagements";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const KPI_SOC = [
  { cat: "S1 — OCCUPAZIONE E PROFILO FORZA LAVORO (ESRS S1-6 / GRI 401-405)" },
  { id: "s01", kpi: "Dipendenti totali (FTE)",                      std: "GRI 2-7",    um: "n",       src: "Payroll/HR" },
  { id: "s02", kpi: "% donne sul totale dipendenti",                std: "GRI 405-1",  um: "n / %",   src: "Payroll/HR" },
  { id: "s03", kpi: "% donne in posizioni manageriali",             std: "GRI 405-1",  um: "%",       src: "Payroll/HR" },
  { id: "s04", kpi: "% donne in C-suite / dirigenza",               std: "ESRS S1-16", um: "%",       src: "Payroll/HR" },
  { id: "s05", kpi: "Dipendenti tempo indeterminato",               std: "GRI 2-7",    um: "n / %",   src: "Payroll/HR" },
  { id: "s06", kpi: "Dipendenti tempo determinato",                 std: "GRI 2-7",    um: "n / %",   src: "Payroll/HR" },
  { id: "s07", kpi: "Dipendenti part-time",                         std: "GRI 2-7",    um: "n / %",   src: "Payroll/HR" },
  { id: "s08", kpi: "Nuove assunzioni totali",                      std: "GRI 401-1",  um: "n",       src: "Payroll/HR" },
  { id: "s09", kpi: "Cessazioni volontarie (turnover)",             std: "GRI 401-1",  um: "n / %",   src: "Payroll/HR" },
  { id: "s10", kpi: "Tasso di turnover totale",                     std: "GRI 401-1",  um: "%",       src: "Calcolo" },
  { id: "s11", kpi: "Lavoratori con disabilità (L.68/99)",          std: "ESRS S1",    um: "n / %",   src: "HR/Payroll" },
  { id: "s12", kpi: "Lavoratori interinali/in appalto",             std: "GRI 2-8",    um: "n",       src: "Operations/HR" },
  { cat: "S1 — SALUTE E SICUREZZA (ESRS S1-14 / GRI 403)" },
  { id: "s13", kpi: "Ore lavorate totali",                          std: "GRI 403",    um: "h",       src: "Payroll/RSPP" },
  { id: "s14", kpi: "N. infortuni sul lavoro",                      std: "GRI 403-9",  um: "n",       src: "Reg.Infortuni" },
  { id: "s15", kpi: "Tasso di Frequenza (TF)",                      std: "GRI 403-9",  um: "TF",      src: "Calcolo" },
  { id: "s16", kpi: "N. infortuni con assenza > 1 giorno",          std: "ESRS S1-14", um: "n",       src: "Reg.Infortuni" },
  { id: "s17", kpi: "Giorni persi per infortuni",                   std: "GRI 403-9",  um: "gg",      src: "Reg.Infortuni" },
  { id: "s18", kpi: "Tasso di Gravità (TG)",                        std: "GRI 403-9",  um: "TG",      src: "Calcolo" },
  { id: "s19", kpi: "N. malattie professionali riconosciute",       std: "GRI 403-10", um: "n",       src: "INAIL/HR" },
  { id: "s20", kpi: "Tasso di assenteismo",                         std: "ESRS S1",    um: "%",       src: "Payroll" },
  { id: "s21", kpi: "N. infortuni mortali",                         std: "GRI 403-9",  um: "n",       src: "Reg.Infortuni" },
  { cat: "S1 — FORMAZIONE E SVILUPPO (ESRS S1 / GRI 404)" },
  { id: "s22", kpi: "Ore formazione totali erogate",                std: "GRI 404-1",  um: "h",       src: "Reg.Formazione" },
  { id: "s23", kpi: "Ore formazione pro-capite",                    std: "GRI 404-1",  um: "h/dip.",  src: "Calcolo" },
  { id: "s24", kpi: "Ore formazione pro-capite (donne)",            std: "GRI 404-1",  um: "h/dip.",  src: "Calcolo" },
  { id: "s25", kpi: "Ore formazione pro-capite (uomini)",           std: "GRI 404-1",  um: "h/dip.",  src: "Calcolo" },
  { id: "s26", kpi: "Spesa in formazione (€)",                      std: "GRI 404",    um: "€",       src: "HR/CFO" },
  { id: "s27", kpi: "% dipendenti che hanno ricevuto formazione",   std: "GRI 404-1",  um: "%",       src: "Reg.Formazione" },
  { cat: "S1 — REMUNERAZIONE E D&I (ESRS S1-16 / GRI 405)" },
  { id: "s28", kpi: "Retribuzione lorda media annua (F)",           std: "ESRS S1-16", um: "€",       src: "Payroll" },
  { id: "s29", kpi: "Retribuzione lorda media annua (M)",           std: "ESRS S1-16", um: "€",       src: "Payroll" },
  { id: "s30", kpi: "Gender pay gap (livello junior)",              std: "GRI 405-2",  um: "%",       src: "Payroll" },
  { id: "s31", kpi: "Gender pay gap (livello senior)",              std: "GRI 405-2",  um: "%",       src: "Payroll" },
  { id: "s32", kpi: "Rapporto CEO pay ratio",                       std: "GRI 2-21",   um: "x",       src: "Payroll/CFO" },
  { cat: "S2-S4 — SUPPLY CHAIN, COMUNITÀ, CONSUMATORI" },
  { id: "s33", kpi: "N. fornitori totali",                          std: "GRI 2-6",    um: "n",       src: "Acquisti" },
  { id: "s34", kpi: "N. fornitori valutati su criteri ESG",         std: "GRI 414-1",  um: "n / %",   src: "Acquisti" },
  { id: "s35", kpi: "N. fornitori qualificati ESG",                 std: "GRI 414-1",  um: "n",       src: "Acquisti" },
  { id: "s36", kpi: "Investimenti comunità locale (€)",             std: "GRI 413-1",  um: "€",       src: "CFO/CSR" },
  { id: "s37", kpi: "N. reclami clienti ricevuti",                  std: "GRI 418-1",  um: "n",       src: "CRM/Vendite" },
  { id: "s38", kpi: "N. reclami clienti risolti",                   std: "GRI 418-1",  um: "n / %",   src: "CRM/Vendite" },
];

const KPI_IDS_S = KPI_SOC.filter(k => k.id).map(k => k.id);
const DEFAULT_KPI_S = Object.fromEntries(KPI_IDS_S.map(id => [id, { N1: "", N: "", src: "", note: "", val: false }]));

export default function Form04D({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "04D");
  const { data: eng } = useEngagement(engagementId);

  const kpiData = d?.kpi_data ?? DEFAULT_KPI_S;
  const setKpi = (id, field, value) => updateField("kpi_data", { ...kpiData, [id]: { ...(kpiData[id] || {}), [field]: value } });

  const kpis = KPI_SOC.filter(k => k.id);
  const filled = kpis.filter(k => kpiData[k.id]?.N).length;
  const validated = kpis.filter(k => kpiData[k.id]?.val).length;

  return (
    <FormWrapper
      formCode="FORM-04D"
      title="KPI Sociali — Area S"
      subtitle="HR, salute e sicurezza, formazione, D&I — ESRS S1/S4 & GRI 400"
      meta={{
        Fase: "Fase 4.4",
        Input: "Payroll, Registro infortuni, Registro formazione, Dati HR",
        Responsabile: "Analista ESG + HR cliente",
        Timing: "Settimana 2-3",
        Output: "Dataset KPI Sociali compilato e validato",
      }}
      ruleBox={<><strong>KPI Sociali — Area S.</strong> KPI conformi a ESRS S1-S4 (CSRD) e GRI 400 series. Include forza lavoro, sicurezza (TF, TG), formazione, D&I, supply chain.</>}
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "KPI totali", value: kpis.length, color: "text-foreground" },
          { label: "Compilati (N)", value: filled, color: "text-primary" },
          { label: "Validati ✓", value: validated, color: "text-green-600" },
          { label: "Mancanti", value: kpis.length - filled, color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold tabular-nums", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Identificazione" cols={3}>
        <Field label="Codice progetto"><Input value={d?.codice_progetto ?? eng?.codice_progetto ?? ""} onChange={v => updateField("codice_progetto", v)} /></Field>
        <Field label="Cliente"><Input value={d?.cliente ?? eng?.clienti?.ragione_sociale ?? ""} onChange={v => updateField("cliente", v)} /></Field>
        <Field label="Anno N"><Input type="number" value={d?.anno_rend} onChange={v => updateField("anno_rend", v)} /></Field>
        <Field label="Anno N-1"><Input type="number" value={d?.anno_N1} onChange={v => updateField("anno_N1", v)} /></Field>
        <Field label="Raccolto da"><Input value={d?.raccolto_da} onChange={v => updateField("raccolto_da", v)} /></Field>
        <Field label="Data raccolta"><Input type="date" value={d?.data_raccolta} onChange={v => updateField("data_raccolta", v)} /></Field>
      </FormSection>

      <FormSection title="KPI Sociali" cols={1}>
        <div className="bg-muted/20 border border-border/60 rounded-lg px-3 py-2 text-xs text-muted-foreground mb-3">
          Per TF e TG seguire formule GRI 403-9 esatte. Per gender pay gap calcolare su categorie omogenee.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[200px]">KPI</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-16">Std</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-16">UM</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-24">Valore N-1</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-24">Valore N</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-36">Fonte</th>
                <th className="px-2 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-widest min-w-[120px]">Note</th>
                <th className="px-2 py-2.5 text-center font-semibold text-muted-foreground text-[10px] uppercase tracking-widest w-10">✓</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {KPI_SOC.map((row, i) => {
                if (row.cat) {
                  return (
                    <tr key={i}>
                      <td colSpan={8} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700">
                        {row.cat}
                      </td>
                    </tr>
                  );
                }
                const cell = kpiData[row.id] || { N1: "", N: "", src: "", note: "", val: false };
                return (
                  <tr key={row.id} className="hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium text-foreground">{row.kpi}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground text-[10px]">{row.std}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground text-[10px]">{row.um}</td>
                    <td className="px-2 py-2"><input type="text" value={cell.N1} onChange={e => setKpi(row.id, "N1", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="—" /></td>
                    <td className="px-2 py-2"><input type="text" value={cell.N} onChange={e => setKpi(row.id, "N", e.target.value)} className={cn("w-full border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring font-medium", cell.N ? "border-primary/30 bg-primary/5" : "border-border")} placeholder="—" /></td>
                    <td className="px-2 py-2"><input type="text" value={cell.src} onChange={e => setKpi(row.id, "src", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder={row.src} /></td>
                    <td className="px-2 py-2"><input type="text" value={cell.note} onChange={e => setKpi(row.id, "note", e.target.value)} className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="note..." /></td>
                    <td className="px-2 py-2 text-center">
                      <button onClick={() => setKpi(row.id, "val", !cell.val)}>
                        <CheckCircle2 size={14} className={cn(cell.val ? "text-green-600" : "text-border hover:text-primary/50")} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="Note e osservazioni area Sociale" cols={1}>
        <Field label="Note metodologiche, eventi rilevanti, KPI omessi">
          <Textarea value={d?.note_area_s} onChange={v => updateField("note_area_s", v)} rows={4}
            placeholder="Documenta: infortuni mortali, controversie sindacali, modifiche perimetro HR, ecc." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}

