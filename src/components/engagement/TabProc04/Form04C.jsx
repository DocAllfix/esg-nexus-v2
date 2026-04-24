import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

// KPI Ambientali — 22 KPI da PROC-04 HTML originale
const KPI_ENV = [
  { cat: "E1 — ENERGIA (ESRS E1-5 / GRI 302)" },
  { id: "e01", kpi: "Consumo energetico totale",              std: "GRI 302-1",   um: "MWh",      form: "Σ(kWh + gas + carburanti) ÷ 1000",               src: "Bollette" },
  { id: "e02", kpi: "Consumo energia elettrica",              std: "GRI 302-1",   um: "MWh",      form: "Σ kWh dalle bollette elettriche",                 src: "Bollette ENEL" },
  { id: "e03", kpi: "Consumo gas naturale (convertito)",      std: "GRI 302-1",   um: "MWh",      form: "Smc × 10,55 kWh/Smc (PCI) ÷ 1000",              src: "Bollette gas" },
  { id: "e04", kpi: "Consumo carburanti (convertiti)",        std: "GRI 302-1",   um: "MWh",      form: "Litri × FE_energetico ÷ 1000",                   src: "Schede carburante" },
  { id: "e05", kpi: "Energia da fonti rinnovabili",           std: "GRI 302-1",   um: "MWh / %",  form: "kWh GO + autoproduzione",                        src: "Fornitore / GO" },
  { id: "e06", kpi: "Intensità energetica",                   std: "GRI 302-3",   um: "MWh/M€",   form: "Totale MWh ÷ Fatturato M€",                      src: "Calcolo" },
  { id: "e07", kpi: "Riduzione consumi vs anno base",         std: "GRI 302-4",   um: "MWh",      form: "Consumo base − Consumo N",                        src: "Calcolo" },
  { cat: "E1 — EMISSIONI GHG (ESRS E1-6 / GRI 305)" },
  { id: "e08", kpi: "Emissioni GHG Scope 1 lordi",           std: "GRI 305-1",   um: "tCO2e",    form: "Da FORM-04B",                                     src: "FORM-04B" },
  { id: "e09", kpi: "Emissioni GHG Scope 2 (market-based)",  std: "GRI 305-2",   um: "tCO2e",    form: "Da FORM-04B — FE contratto/AIB",                  src: "FORM-04B" },
  { id: "e10", kpi: "Emissioni GHG Scope 2 (location-based)",std: "GRI 305-2",   um: "tCO2e",    form: "Da FORM-04B — FE IEA nazionale",                  src: "FORM-04B" },
  { id: "e11", kpi: "Emissioni GHG Scope 3 totali",          std: "GRI 305-3",   um: "tCO2e",    form: "Da FORM-04B — Σ categorie rilevanti",             src: "FORM-04B" },
  { id: "e12", kpi: "Intensità GHG Scope 1+2",               std: "GRI 305-4",   um: "tCO2e/M€", form: "(Sc1+Sc2) ÷ Fatturato M€",                        src: "Calcolo" },
  { id: "e13", kpi: "Riduzione emissioni vs anno base",       std: "GRI 305-5",   um: "tCO2e",    form: "Emissioni base − Anno N",                         src: "Calcolo" },
  { cat: "E3 — ACQUA E SCARICHI (ESRS E3 / GRI 303)" },
  { id: "e14", kpi: "Prelievo idrico totale",                 std: "GRI 303-3",   um: "m³",       form: "Σ consumi da bollette idriche per fonte",         src: "Bollette idriche" },
  { id: "e15", kpi: "Scarichi idrici totali",                 std: "GRI 303-4",   um: "m³",       form: "Σ scarichi (fogna, corpo idrico, riciclo)",       src: "Autorizzazione AUA" },
  { id: "e16", kpi: "Intensità idrica",                       std: "GRI 303-1",   um: "m³/M€",    form: "Prelievo totale ÷ Fatturato M€",                  src: "Calcolo" },
  { cat: "E5 — RIFIUTI (ESRS E5 / GRI 306)" },
  { id: "e17", kpi: "Rifiuti totali prodotti",                std: "GRI 306-3",   um: "t",        form: "Σ tonnellate da MUD/FIR",                         src: "MUD/Reg. rifiuti" },
  { id: "e18", kpi: "Rifiuti pericolosi",                     std: "GRI 306-3",   um: "t",        form: "Σ tonnellate CER pericolosi",                     src: "MUD/FIR" },
  { id: "e19", kpi: "Rifiuti non pericolosi",                 std: "GRI 306-3",   um: "t",        form: "Rifiuti totali − Pericolosi",                     src: "Calcolo" },
  { id: "e20", kpi: "Rifiuti avviati a recupero/riciclo",    std: "GRI 306-4",   um: "t / %",    form: "Σ tonnellate R — % = R / Totale",                 src: "MUD" },
  { id: "e21", kpi: "Rifiuti smaltiti in discarica",         std: "GRI 306-5",   um: "t",        form: "Σ tonnellate destinate a D",                      src: "MUD" },
  { id: "e22", kpi: "Intensità rifiuti",                      std: "GRI 306-3",   um: "t/M€",     form: "Rifiuti totali ÷ Fatturato M€",                   src: "Calcolo" },
];

export default function Form04C({ eng }) {
  const [kpiData, setKpiData] = useState(() =>
    Object.fromEntries(
      KPI_ENV.filter(k => k.id).map(k => [k.id, { N1: "", N: "", src: "", note: "", val: false }])
    )
  );
  const [data, setData] = useState({
    codice_progetto: eng?.project_code || "",
    cliente: eng?.cliente_nome || "",
    anno_rend: "",
    anno_N1: "",
    raccolto_da: "",
    data_raccolta: "",
    note_area_e: "",
  });

  const set = (k) => (v) => setData(prev => ({ ...prev, [k]: v }));
  const setKpi = (id, field, value) => setKpiData(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const kpis = KPI_ENV.filter(k => k.id);
  const filled = kpis.filter(k => kpiData[k.id]?.N).length;
  const validated = kpis.filter(k => kpiData[k.id]?.val).length;

  return (
    <FormWrapper
      formCode="FORM-04C"
      title="KPI Ambientali — Area E"
      subtitle="Energia, GHG, acqua, rifiuti — ESRS E1/E3/E5 & GRI 300"
      meta={{
        Fase: "Fase 4.3",
        Input: "Bollette energia/gas/acqua, MUD, registro rifiuti, dati GHG (FORM-04B)",
        Responsabile: "Analista ESG",
        Timing: "Settimana 2-3",
        Output: "Dataset KPI Ambientali compilato e validato",
      }}
      ruleBox={<><strong>KPI Ambientali — Area E.</strong> KPI conformi a ESRS E1-E5 (CSRD) e GRI 300 series. Le emissioni GHG arrivano dai calcoli FORM-04B. Per ogni KPI compila Anno N, N-1 per trend, fonte documentale e valida con ✓.</>}
      storageKey={`form04c_${eng?.id}`}
    >
      {/* Stats */}
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
        <Field label="Anno di rendicontazione (N)"><Input type="number" value={data.anno_rend} onChange={set("anno_rend")} /></Field>
        <Field label="Anno N-1 (per confronto)"><Input type="number" value={data.anno_N1} onChange={set("anno_N1")} /></Field>
        <Field label="Raccolto da"><Input value={data.raccolto_da} onChange={set("raccolto_da")} /></Field>
        <Field label="Data raccolta"><Input type="date" value={data.data_raccolta} onChange={set("data_raccolta")} /></Field>
      </FormSection>

      <FormSection title="KPI Ambientali" cols={1}>
        <div className="bg-muted/20 border border-border/60 rounded-lg px-3 py-2 text-xs text-muted-foreground mb-3">
          Lascia vuoto "Valore N-1" se è il primo anno. Valida ✓ solo quando il valore è verificato contro la fonte primaria.
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
              {KPI_ENV.map((row, i) => {
                if (row.cat) {
                  return (
                    <tr key={i}>
                      <td colSpan={8} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-400">
                        {row.cat}
                      </td>
                    </tr>
                  );
                }
                const d = kpiData[row.id];
                return (
                  <tr key={row.id} className={cn("hover:bg-muted/20", d.N && "bg-green-500/3")}>
                    <td className="px-3 py-2">
                      <p className="font-medium text-foreground">{row.kpi}</p>
                      <p className="text-[10px] text-muted-foreground">{row.form}</p>
                    </td>
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

      <FormSection title="Note e osservazioni area Ambiente" cols={1}>
        <Field label="Note metodologiche, variazioni significative, KPI omessi e motivazione">
          <Textarea value={data.note_area_e} onChange={set("note_area_e")} rows={4}
            placeholder="Documenta: scelte metodologiche, variazioni rispetto a N-1, KPI omessi e motivazione, stime usate." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}