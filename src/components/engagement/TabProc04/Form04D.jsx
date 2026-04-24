import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

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

export default function Form04D({ eng }) {
  const [kpiData, setKpiData] = useState(() =>
    Object.fromEntries(
      KPI_SOC.filter(k => k.id).map(k => [k.id, { N1: "", N: "", src: "", note: "", val: false }])
    )
  );
  const [data, setData] = useState({
    codice_progetto: eng?.project_code || "",
    cliente: eng?.cliente_nome || "",
    anno_rend: "",
    anno_N1: "",
    raccolto_da: "",
    data_raccolta: "",
    note_area_s: "",
  });

  const set = (k) => (v) => setData(prev => ({ ...prev, [k]: v }));
  const setKpi = (id, field, value) => setKpiData(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

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
      ruleBox={<><strong>KPI Sociali — Area S.</strong> KPI conformi a ESRS S1-S4 (CSRD) e GRI 400 series. Include forza lavoro, sicurezza (TF, TG), formazione, D&I, supply chain. Dati HR devono essere riconciliati con Payroll — tolleranza zero sul numero dipendenti.</>}
      storageKey={`form04d_${eng?.id}`}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "KPI totali", value: kpis.length, color: "text-foreground" },
          { label: "Compilati (N)", value: filled, color: "text-primary" },
          { label: "Validati ✓", value: validated, color: "text-green-600 dark:text-green-400" },
          { label: "Mancanti", value: kpis.length - filled, color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold tabular-nums", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Identificazione" cols={3}>
        <Field label="Codice progetto"><Input value={data.codice_progetto} onChange={set("codice_progetto")} /></Field>
        <Field label="Cliente"><Input value={data.cliente} onChange={set("cliente")} /></Field>
        <Field label="Anno N"><Input type="number" value={data.anno_rend} onChange={set("anno_rend")} /></Field>
        <Field label="Anno N-1"><Input type="number" value={data.anno_N1} onChange={set("anno_N1")} /></Field>
        <Field label="Raccolto da"><Input value={data.raccolto_da} onChange={set("raccolto_da")} /></Field>
        <Field label="Data raccolta"><Input type="date" value={data.data_raccolta} onChange={set("data_raccolta")} /></Field>
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
                      <td colSpan={8} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400">
                        {row.cat}
                      </td>
                    </tr>
                  );
                }
                const d = kpiData[row.id];
                return (
                  <tr key={row.id} className="hover:bg-muted/20">
                    <td className="px-3 py-2 font-medium text-foreground">{row.kpi}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground text-[10px]">{row.std}</td>
                    <td className="px-2 py-2 text-center text-muted-foreground text-[10px]">{row.um}</td>
                    <td className="px-2 py-2">
                      <input type="text" value={d.N1} onChange={e => setKpi(row.id, "N1", e.target.value)}
                        className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="—" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="text" value={d.N} onChange={e => setKpi(row.id, "N", e.target.value)}
                        className={cn("w-full border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring font-medium",
                          d.N ? "border-primary/30 bg-primary/5" : "border-border")} placeholder="—" />
                    </td>
                    <td className="px-2 py-2">
                      <input type="text" value={d.src} onChange={e => setKpi(row.id, "src", e.target.value)}
                        className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        placeholder={row.src} />
                    </td>
                    <td className="px-2 py-2">
                      <input type="text" value={d.note} onChange={e => setKpi(row.id, "note", e.target.value)}
                        className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" placeholder="note..." />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button onClick={() => setKpi(row.id, "val", !d.val)}>
                        <CheckCircle2 size={14} className={cn(d.val ? "text-green-600 dark:text-green-400" : "text-border hover:text-primary/50")} />
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
          <Textarea value={data.note_area_s} onChange={set("note_area_s")} rows={4}
            placeholder="Documenta: infortuni mortali, controversie sindacali, modifiche perimetro HR, ecc." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}