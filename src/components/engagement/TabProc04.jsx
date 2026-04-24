import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Circle, Lock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// TODO: Replace with Supabase hook
const ghgData = [];
const kpiLibrary = [];

const SOTTOFASI = [
  { id: "04A", nome: "Piano raccolta dati", stato: "completata" },
  { id: "04B", nome: "GHG Scope 1", stato: "completata" },
  { id: "04C", nome: "GHG Scope 2", stato: "completata" },
  { id: "04D", nome: "GHG Scope 3", stato: "completata" },
  { id: "04E", nome: "KPI E/S/G", stato: "completata" },
  { id: "04F", nome: "Validazione anomalie", stato: "completata" },
  { id: "04G", nome: "Freeze dataset", stato: "completata" },
];

export default function TabProc04({ eng }) {
  const [faseSel, setFaseSel] = useState("04B");

  return (
    <div className="flex gap-4 min-h-[600px]">
      <div className="w-60 shrink-0 bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PROC-04 · Dati GHG</p>
        </div>
        <div className="divide-y divide-border">
          {SOTTOFASI.map(f => {
            const Icon = f.stato === "completata" ? CheckCircle2 : f.stato === "in_corso" ? Clock : Circle;
            return (
              <button key={f.id} onClick={() => setFaseSel(f.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors", faseSel === f.id && "bg-primary/5 border-l-2 border-primary")}>
                <Icon size={15} className={f.stato === "completata" ? "text-primary" : "text-muted-foreground"} />
                <div><p className="text-xs font-mono text-muted-foreground">{f.id}</p><p className="text-sm">{f.nome}</p></div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
        {faseSel === "04B" && <GHGScope />}
        {faseSel === "04E" && <KPILibraryView />}
        {faseSel === "04G" && <FreezeDataset />}
        {!["04B", "04E", "04G"].includes(faseSel) && (
          <div className="p-6">
            <p className="text-xs font-mono text-muted-foreground mb-1">{faseSel}</p>
            <h2 className="text-base font-semibold">{SOTTOFASI.find(f => f.id === faseSel)?.nome}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

function GHGScope() {
  const totScope1 = ghgData.scope1.reduce((s, r) => s + r.emissioni, 0).toFixed(1);
  const totScope2MB = ghgData.scope2_mb.reduce((s, r) => s + r.emissioni, 0).toFixed(1);
  const totScope2LB = ghgData.scope2_lb.reduce((s, r) => s + r.emissioni, 0).toFixed(1);
  const totScope3 = ghgData.scope3.reduce((s, r) => s + r.emissioni, 0).toFixed(1);
  const totMB = (parseFloat(totScope1) + parseFloat(totScope2MB) + parseFloat(totScope3)).toFixed(1);

  const donutData = [
    { name: "Scope 1", value: parseFloat(totScope1) },
    { name: "Scope 2 LB", value: parseFloat(totScope2LB) },
    { name: "Scope 3", value: parseFloat(totScope3) },
  ];
  const colors = ["#0F766E", "#14B8A6", "#7C3AED"];

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div><p className="text-xs font-mono text-muted-foreground">04B · 04C · 04D</p><h2 className="text-base font-semibold">Calcolatore GHG — Scope 1, 2, 3</h2></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {/* Scope 1 */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Scope 1 — Emissioni dirette</h3>
            <GHGTable rows={ghgData.scope1} />
          </div>
          {/* Scope 2 */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Scope 2 — Energia</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Market-Based</p>
                <GHGTable rows={ghgData.scope2_mb} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Location-Based</p>
                <GHGTable rows={ghgData.scope2_lb} />
              </div>
            </div>
          </div>
          {/* Scope 3 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Scope 3 — Emissioni indirette</h3>
            <GHGTable rows={ghgData.scope3} />
          </div>
        </div>

        {/* Riepilogo */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Riepilogo emissioni</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Scope 1</span><span className="font-semibold">{totScope1} tCO₂e</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Scope 2 (MB)</span><span className="font-semibold">{totScope2MB} tCO₂e</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Scope 2 (LB)</span><span className="font-semibold">{totScope2LB} tCO₂e</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Scope 3</span><span className="font-semibold">{totScope3} tCO₂e</span></div>
              <div className="border-t border-border pt-2 flex justify-between font-bold"><span>Totale MB</span><span className="text-primary">{totMB} tCO₂e</span></div>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                  {donutData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v} tCO₂e`} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function GHGTable({ rows }) {
  return (
    <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-muted/40 border-b border-border">
          {["ID", "Descrizione", "Valore", "FE", "Emissioni", "Stato"].map(h => (
            <th key={h} className="px-3 py-2 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map(r => (
          <tr key={r.id} className="hover:bg-muted/20">
            <td className="px-3 py-2 font-mono">{r.id}</td>
            <td className="px-3 py-2">{r.descrizione}</td>
            <td className="px-3 py-2">
              <input type="number" defaultValue={r.valore} className="w-20 border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
            </td>
            <td className="px-3 py-2 text-muted-foreground">{r.fattore}</td>
            <td className="px-3 py-2 font-semibold">{r.emissioni}</td>
            <td className="px-3 py-2">
              <span className={cn("text-xs px-1.5 py-0.5 rounded", r.stato === "validato" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")}>
                {r.stato}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function KPILibraryView() {
  const [areaTab, setAreaTab] = useState("E");
  const kpis = kpiLibrary[areaTab] || [];

  return (
    <div className="p-6 overflow-y-auto">
      <p className="text-xs font-mono text-muted-foreground mb-1">04E</p>
      <h2 className="text-base font-semibold mb-4">KPI Library — E/S/G</h2>
      <div className="flex gap-1 mb-4 bg-muted p-1 rounded-lg w-fit">
        {["E", "S", "G"].map(a => (
          <button key={a} onClick={() => setAreaTab(a)} className={cn("px-5 py-1.5 rounded-md text-sm font-medium transition-colors", areaTab === a ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {a} — {a === "E" ? "Ambiente" : a === "S" ? "Sociale" : "Governance"}
          </button>
        ))}
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {["Codice", "Label", "Unità", "Standard ref", "Valore", "Stato"].map(h => (
              <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {kpis.map(kpi => (
            <tr key={kpi.code} className="hover:bg-muted/30">
              <td className="px-4 py-2.5 font-mono">{kpi.code}</td>
              <td className="px-4 py-2.5">{kpi.label}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{kpi.unita}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{kpi.standard}</td>
              <td className="px-4 py-2.5 font-semibold">{kpi.valore}</td>
              <td className="px-4 py-2.5">
                <span className={cn("text-xs px-2 py-0.5 rounded-full", kpi.stato === "validato" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")}>
                  {kpi.stato}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FreezeDataset() {
  const checks = [
    { ok: true, testo: "85% KPI validati (62 di 83)" },
    { ok: true, testo: "18/18 fonti GHG compilate" },
    { ok: false, testo: "2 anomalie non risolte (consumo energetico, turnover)" },
    { ok: true, testo: "Firma responsabile dati acquisita" },
  ];
  const bloccato = checks.some(c => !c.ok);

  return (
    <div className="p-6 flex flex-col items-center">
      <p className="text-xs font-mono text-muted-foreground mb-1 self-start">04G</p>
      <h2 className="text-base font-semibold mb-8 self-start">Freeze dataset</h2>
      <div className="w-full max-w-lg space-y-3 mb-8">
        {checks.map((c, i) => (
          <div key={i} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border", c.ok ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50")}>
            {c.ok ? <CheckCircle2 size={16} className="text-green-600 shrink-0" /> : <Clock size={16} className="text-amber-600 shrink-0" />}
            <p className="text-sm">{c.testo}</p>
          </div>
        ))}
      </div>
      <button disabled={bloccato} className={cn("px-8 py-4 text-base font-semibold rounded-lg transition-all", bloccato ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
        {bloccato ? (
          <span className="flex items-center gap-2"><Lock size={18} /> Dataset non congelabile (anomalie presenti)</span>
        ) : "Congela dataset"}
      </button>
      <div className="mt-8 w-full max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Snapshot precedenti</p>
        <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
          <thead><tr className="bg-muted/40"><th className="px-3 py-2 text-left">Label</th><th className="px-3 py-2">Data</th><th className="px-3 py-2">Hash SHA-256</th><th className="px-3 py-2">Autore</th></tr></thead>
          <tbody>
            <tr className="border-t border-border"><td className="px-3 py-2">snapshot-v1</td><td className="px-3 py-2 text-center">2025-03-01</td><td className="px-3 py-2 font-mono">a3f2c1d09e4b...</td><td className="px-3 py-2">E. Mancini</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}