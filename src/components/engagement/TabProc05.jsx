import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SOTTOFASI = [
  { id: "05A", nome: "Visione strategica", stato: "completata" },
  { id: "05B", nome: "Obiettivi SMART", stato: "completata" },
  { id: "05C", nome: "Target numerici", stato: "completata" },
  { id: "05D", nome: "Iniziative", stato: "completata" },
  { id: "05E", nome: "Budget", stato: "completata" },
  { id: "05F", nome: "Roadmap", stato: "completata" },
  { id: "05G", nome: "Workshop CdA", stato: "completata" },
];

const iniziative = [
  { id: "INI-001", titolo: "Installazione pannelli fotovoltaici impianto principale", area: "E", orizzonte: "B", owner: "G. Verdi", progress: 45, fonte: "gap", stato: "In corso" },
  { id: "INI-002", titolo: "Programma formazione sicurezza H&S", area: "S", orizzonte: "B", owner: "L. Rossi", progress: 80, fonte: "gap", stato: "In corso" },
  { id: "INI-003", titolo: "Policy anti-corruzione e formazione", area: "G", orizzonte: "B", owner: "M. Bianchi", progress: 60, fonte: "gap", stato: "In corso" },
  { id: "INI-004", titolo: "Audit catena di fornitura fornitori tier-1", area: "S", orizzonte: "M", owner: "L. Rossi", progress: 10, fonte: "strategica", stato: "Non avviata" },
  { id: "INI-005", titolo: "Target Science-Based Targets (SBTi)", area: "E", orizzonte: "M", owner: "E. Mancini", progress: 0, fonte: "strategica", stato: "Non avviata" },
  { id: "INI-006", titolo: "Piano biodiversità e land-use", area: "E", orizzonte: "L", owner: "E. Mancini", progress: 0, fonte: "strategica", stato: "Non avviata" },
];

const budgetData = [
  { anno: "Y1", E: 85000, S: 45000, G: 20000 },
  { anno: "Y2", E: 120000, S: 60000, G: 25000 },
  { anno: "Y3", E: 95000, S: 55000, G: 30000 },
];

export default function TabProc05({ eng }) {
  const [faseSel, setFaseSel] = useState("05D");

  return (
    <div className="flex gap-4 min-h-[600px]">
      <div className="w-60 shrink-0 bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PROC-05 · Piano azione</p>
        </div>
        <div className="divide-y divide-border">
          {SOTTOFASI.map(f => (
            <button key={f.id} onClick={() => setFaseSel(f.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors", faseSel === f.id && "bg-primary/5 border-l-2 border-primary")}>
              <CheckCircle2 size={15} className="text-primary" />
              <div><p className="text-xs font-mono text-muted-foreground">{f.id}</p><p className="text-sm">{f.nome}</p></div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
        {faseSel === "05D" && <KanbanView />}
        {faseSel === "05E" && <BudgetView />}
        {faseSel === "05F" && <RoadmapView />}
        {!["05D", "05E", "05F"].includes(faseSel) && (
          <div className="p-6">
            <p className="text-xs font-mono text-muted-foreground mb-1">{faseSel}</p>
            <h2 className="text-base font-semibold">{SOTTOFASI.find(f => f.id === faseSel)?.nome}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanView() {
  const colonne = ["Non avviata", "In corso", "Completata", "Sospesa"];
  const areaColors = { E: "bg-teal-100 text-teal-800", S: "bg-purple-100 text-purple-800", G: "bg-slate-100 text-slate-800" };

  return (
    <div className="p-6 overflow-auto">
      <p className="text-xs font-mono text-muted-foreground mb-1">05D</p>
      <h2 className="text-base font-semibold mb-4">Kanban iniziative</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {colonne.map(col => {
          const items = iniziative.filter(i => i.stato === col);
          return (
            <div key={col} className="min-w-[240px] flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{col}</h3>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map(ini => (
                  <div key={ini.id} className="bg-card border border-border rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all">
                    <p className="font-mono text-xs text-muted-foreground mb-1">{ini.id}</p>
                    <p className="text-sm font-medium leading-snug mb-2">{ini.titolo}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", areaColors[ini.area])}>{ini.area}</span>
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{ini.orizzonte === "B" ? "Breve" : ini.orizzonte === "M" ? "Medio" : "Lungo"}</span>
                      {ini.fonte === "gap" && <span className="text-xs text-muted-foreground flex items-center gap-0.5">⚠ Gap</span>}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${ini.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{ini.progress}%</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-xs text-muted-foreground">
                    Nessuna iniziativa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BudgetView() {
  return (
    <div className="p-6 overflow-y-auto">
      <p className="text-xs font-mono text-muted-foreground mb-1">05E</p>
      <h2 className="text-base font-semibold mb-4">Budget Piano ESG</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border bg-muted/40">
              {["Area", "Voce", "Tipo", "Y1", "Y2", "Y3"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {[
                { area: "E", voce: "Fotovoltaico", tipo: "CapEx", y1: 75000, y2: 80000, y3: 50000 },
                { area: "E", voce: "Energy audit", tipo: "OpEx", y1: 10000, y2: 40000, y3: 45000 },
                { area: "S", voce: "Formazione H&S", tipo: "OpEx", y1: 25000, y2: 35000, y3: 30000 },
                { area: "S", voce: "Audit fornitori", tipo: "OpEx", y1: 20000, y2: 25000, y3: 25000 },
                { area: "G", voce: "Policy & compliance", tipo: "OpEx", y1: 20000, y2: 25000, y3: 30000 },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-3 py-2 font-bold text-xs" style={{ color: r.area === "E" ? "#0F766E" : r.area === "S" ? "#7C3AED" : "#334155" }}>{r.area}</td>
                  <td className="px-3 py-2">{r.voce}</td>
                  <td className="px-3 py-2"><span className={cn("text-xs px-1.5 py-0.5 rounded", r.tipo === "CapEx" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700")}>{r.tipo}</span></td>
                  <td className="px-3 py-2">€ {r.y1.toLocaleString("it-IT")}</td>
                  <td className="px-3 py-2">€ {r.y2.toLocaleString("it-IT")}</td>
                  <td className="px-3 py-2">€ {r.y3.toLocaleString("it-IT")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Budget per anno e area</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="anno" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `€ ${v.toLocaleString("it-IT")}`} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="E" name="Ambiente" fill="#0F766E" />
                <Bar dataKey="S" name="Sociale" fill="#7C3AED" />
                <Bar dataKey="G" name="Governance" fill="#334155" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapView() {
  const orizzonti = [
    { label: "Breve (0–1 anno)", key: "B" },
    { label: "Medio (1–3 anni)", key: "M" },
    { label: "Lungo (3–5 anni)", key: "L" },
  ];
  const areaColors = { E: "border-teal-300 bg-teal-50", S: "border-purple-300 bg-purple-50", G: "border-slate-300 bg-slate-50" };

  return (
    <div className="p-6 overflow-auto">
      <p className="text-xs font-mono text-muted-foreground mb-1">05F</p>
      <h2 className="text-base font-semibold mb-4">Roadmap strategica — 3 orizzonti</h2>
      <div className="grid grid-cols-3 gap-4">
        {orizzonti.map(or => {
          const items = iniziative.filter(i => i.orizzonte === or.key);
          return (
            <div key={or.key} className="bg-muted/20 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-4">{or.label}</h3>
              <div className="space-y-2">
                {items.map(ini => (
                  <div key={ini.id} className={cn("border rounded-lg p-3", areaColors[ini.area])}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold">{ini.area}</span>
                      <span className="font-mono text-xs text-muted-foreground">{ini.id}</span>
                    </div>
                    <p className="text-xs leading-snug">{ini.titolo}</p>
                  </div>
                ))}
                {items.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Nessuna iniziativa</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}