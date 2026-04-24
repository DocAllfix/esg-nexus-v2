import { useState } from "react";
import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const ghgData = [];

const STORAGE_KEY = "esg_form_04B";

const STATI = ["validato", "da_validare", "anomalia"];
const STATO_COLORS = { validato: "bg-green-100 text-green-800", da_validare: "bg-amber-100 text-amber-800", anomalia: "bg-red-100 text-red-800" };
const SCOPE_COLORS = ["#0F766E", "#14B8A6", "#F59E0B"];

export default function Form04B() {
  const [rows1, setRows1] = useState(ghgData.scope1.map(r => ({ ...r })));
  const [rows2mb, setRows2mb] = useState(ghgData.scope2_mb.map(r => ({ ...r })));
  const [rows2lb, setRows2lb] = useState(ghgData.scope2_lb.map(r => ({ ...r })));
  const [rows3, setRows3] = useState(ghgData.scope3.map(r => ({ ...r })));
  const [nota, setNota] = useState("Fattori di emissione: DEFRA 2023 per combustibili e trasporti, IPCC AR6 per F-gas (GWP100), GSE 2023 per la rete elettrica italiana. Scope 2 market-based = 0 in virtù della copertura 100% con certificati GO. GHG Protocol Corporate Standard, perimetro operativo.");

  const setRow = (setter, i, k, v) => setter(p => { const n = [...p]; n[i] = { ...n[i], [k]: v, emissioni: k === "valore" ? parseFloat((Number(v) * n[i].fattore).toFixed(1)) : n[i].emissioni }; return n; });

  const tot1 = rows1.reduce((s, r) => s + (r.emissioni || 0), 0);
  const tot2mb = rows2mb.reduce((s, r) => s + (r.emissioni || 0), 0);
  const tot2lb = rows2lb.reduce((s, r) => s + (r.emissioni || 0), 0);
  const tot3 = rows3.reduce((s, r) => s + (r.emissioni || 0), 0);
  const totMB = tot1 + tot2mb + tot3;
  const totLB = tot1 + tot2lb + tot3;

  const donutData = [
    { name: "Scope 1", value: parseFloat(tot1.toFixed(1)) },
    { name: "Scope 2 (LB)", value: parseFloat(tot2lb.toFixed(1)) },
    { name: "Scope 3", value: parseFloat(tot3.toFixed(1)) },
  ].filter(d => d.value > 0);

  return (
    <FormWrapper
      formCode="FORM-04B/C/D"
      title="Calcolatore GHG — Scope 1, 2, 3"
      subtitle="Inventario emissioni con calcolo automatico e validazione per fonte"
      meta={{ "Fase": "PROC-04.2–4", "Resp.": "Luca Ferri", "Standard": "GRI 305 / ESRS E1-6 / GHG Protocol" }}
      ruleBox="🌍 Inserire i valori di attività per ogni fonte. Le emissioni sono calcolate automaticamente (valore × fattore emissione). Modificare lo stato per segnalare anomalie."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* RIEPILOGO + DONUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 grid grid-cols-2 gap-3">
          {[
            { label: "Scope 1 totale", value: `${tot1.toFixed(1)} tCO₂e`, color: "text-teal-700" },
            { label: "Scope 2 MB", value: `${tot2mb.toFixed(1)} tCO₂e`, color: "text-teal-600" },
            { label: "Scope 2 LB", value: `${tot2lb.toFixed(1)} tCO₂e`, color: "text-teal-500" },
            { label: "Scope 3 parziale", value: `${tot3.toFixed(1)} tCO₂e`, color: "text-violet-600" },
            { label: "Totale Market-Based", value: `${totMB.toFixed(1)} tCO₂e`, color: "text-primary font-bold text-lg" },
            { label: "Totale Location-Based", value: `${totLB.toFixed(1)} tCO₂e`, color: "text-muted-foreground" },
          ].map(k => (
            <div key={k.label} className="bg-muted/40 rounded-lg p-3 border border-border">
              <p className={cn("text-xl font-bold", k.color)}>{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                {donutData.map((_, i) => <Cell key={i} fill={SCOPE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v} tCO₂e`} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABELLE */}
      <FormSection title="Scope 1 — Emissioni dirette" cols={1}>
        <GHGTable rows={rows1} onChange={(i, k, v) => setRow(setRows1, i, k, v)} />
      </FormSection>

      <FormSection title="Scope 2 — Energia indiretta" cols={1}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Market-Based (MB)</p>
            <GHGTable rows={rows2mb} onChange={(i, k, v) => setRow(setRows2mb, i, k, v)} />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Location-Based (LB)</p>
            <GHGTable rows={rows2lb} onChange={(i, k, v) => setRow(setRows2lb, i, k, v)} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Scope 3 — Emissioni indirette nella catena del valore" cols={1}>
        <GHGTable rows={rows3} onChange={(i, k, v) => setRow(setRows3, i, k, v)} />
      </FormSection>

      <FormSection title="Note metodologiche" cols={1}>
        <Field label="Fattori di emissione adottati e fonti">
          <Textarea value={nota} onChange={setNota} rows={3} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}

function GHGTable({ rows, onChange }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
            {["ID", "Descrizione", "Unità", "Valore attività", "FE", "Fonte FE", "Emissioni tCO₂e", "Stato"].map(h => (
              <th key={h} className="text-left px-3 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r, i) => (
            <tr key={r.id} className={cn("hover:bg-muted/20", r.stato === "anomalia" && "bg-red-50/20")}>
              <td className="px-3 py-2 font-mono font-bold">{r.id}</td>
              <td className="px-3 py-2">{r.descrizione}</td>
              <td className="px-3 py-2 text-muted-foreground">{r.unita}</td>
              <td className="px-3 py-2">
                <input type="number" value={r.valore} onChange={e => onChange(i, "valore", e.target.value)}
                  className="w-24 border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
              </td>
              <td className="px-3 py-2 font-mono text-muted-foreground">{r.fattore}</td>
              <td className="px-3 py-2 text-muted-foreground text-xs">{r.fonte}</td>
              <td className="px-3 py-2 font-bold text-primary">{r.emissioni.toFixed(1)}</td>
              <td className="px-3 py-2">
                <select value={r.stato} onChange={e => onChange(i, "stato", e.target.value)}
                  className={cn("rounded px-1.5 py-0.5 text-xs font-medium border-0", STATO_COLORS[r.stato] || "bg-gray-100")}>
                  {STATI.map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}