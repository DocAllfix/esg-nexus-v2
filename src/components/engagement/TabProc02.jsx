import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Circle, ChevronDown, ChevronRight } from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell
} from "recharts";

// TODO: Replace with Supabase hook
const irosAcme = [];

const SOTTOFASI = [
  { id: "02A", nome: "Perimetro e stakeholder", stato: "completata" },
  { id: "02B", nome: "Questionario interno", stato: "completata" },
  { id: "02C", nome: "Questionario esterno", stato: "completata" },
  { id: "02D", nome: "Doppia materialità", stato: "in_corso" },
  { id: "02E", nome: "Validazione stakeholder", stato: "non_iniziata" },
  { id: "02F", nome: "Matrice materialità", stato: "non_iniziata" },
  { id: "02G", nome: "Approvazione CdA", stato: "non_iniziata" },
  { id: "LOG-02", nome: "Log chiusura", stato: "non_iniziata" },
];

const statoIcon = { completata: CheckCircle2, in_corso: Clock, non_iniziata: Circle };
const areaColors = { E: "#0F766E", S: "#7C3AED", G: "#334155" };

export default function TabProc02({ eng }) {
  const [faseSel, setFaseSel] = useState("02F");

  return (
    <div className="flex gap-4 min-h-[600px]">
      <div className="w-60 shrink-0 bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PROC-02 · Materialità</p>
        </div>
        <div className="divide-y divide-border">
          {SOTTOFASI.map(f => {
            const Icon = statoIcon[f.stato];
            const color = f.stato === "completata" ? "text-primary" : f.stato === "in_corso" ? "text-teal-600" : "text-muted-foreground";
            return (
              <button key={f.id} onClick={() => setFaseSel(f.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors", faseSel === f.id && "bg-primary/5 border-l-2 border-primary")}>
                <Icon size={15} className={color} />
                <div><p className="text-xs font-mono text-muted-foreground">{f.id}</p><p className="text-sm">{f.nome}</p></div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
        {faseSel === "02D" && <IROView />}
        {faseSel === "02F" && <MaterialityMatrix />}
        {faseSel === "02A" && <StakeholderView />}
        {!["02D", "02F", "02A"].includes(faseSel) && (
          <div className="p-6">
            <p className="text-xs font-mono text-muted-foreground mb-1">{faseSel}</p>
            <h2 className="text-base font-semibold mb-3">{SOTTOFASI.find(f => f.id === faseSel)?.nome}</h2>
            <p className="text-sm text-muted-foreground">Form specifico per questa fase.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function IROView() {
  const [expanded, setExpanded] = useState("E1-1");

  return (
    <div className="p-6 overflow-y-auto max-h-full">
      <p className="text-xs font-mono text-muted-foreground mb-1">02D</p>
      <h2 className="text-base font-semibold mb-4">Doppia materialità — Valutazione IRO</h2>
      <div className="space-y-2">
        {irosAcme.map(iro => (
          <div key={iro.id} className={cn("border rounded-lg overflow-hidden", iro.area === "E" ? "border-teal-200" : iro.area === "S" ? "border-purple-200" : "border-slate-200")}>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
              onClick={() => setExpanded(expanded === iro.id ? null : iro.id)}
            >
              <span className={cn("w-6 h-6 rounded text-xs font-bold flex items-center justify-center text-white", iro.area === "E" ? "bg-teal-600" : iro.area === "S" ? "bg-purple-600" : "bg-slate-700")}>
                {iro.area}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{iro.id}</span>
              <span className="text-sm font-medium flex-1 text-left">{iro.tema}</span>
              <span className="text-xs px-1.5 py-0.5 bg-muted rounded">{iro.tipo}</span>
              {iro.materiale_impatto && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Impatto</span>}
              {iro.materiale_fin && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">Finanziario</span>}
              {expanded === iro.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expanded === iro.id && (
              <div className="px-4 pb-4 grid grid-cols-2 gap-4 border-t border-border pt-4 bg-muted/20">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Prospettiva impatto</p>
                  {[["Scala", 4], ["Portata", 3], ["Irreversibilità", 3]].map(([label, val]) => (
                    <div key={label} className="mb-3">
                      <div className="flex justify-between text-xs mb-1"><span>{label}</span><span className="font-semibold">{val}</span></div>
                      <input type="range" min={1} max={5} defaultValue={val} className="w-full accent-primary" />
                    </div>
                  ))}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">Score impatto</span>
                    <span className="text-2xl font-bold">{iro.score_impatto}</span>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", iro.materiale_impatto ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                    {iro.materiale_impatto ? "Materiale" : "Non materiale"}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Prospettiva finanziaria</p>
                  {[["Probabilità", 3], ["Magnitudine", 4]].map(([label, val]) => (
                    <div key={label} className="mb-3">
                      <div className="flex justify-between text-xs mb-1"><span>{label}</span><span className="font-semibold">{val}</span></div>
                      <input type="range" min={1} max={5} defaultValue={val} className="w-full accent-primary" />
                    </div>
                  ))}
                  <div className="mb-3">
                    <p className="text-xs mb-1">Orizzonte temporale</p>
                    <div className="flex gap-2">
                      {[["B", "Breve", "×1.0"], ["M", "Medio", "×0.8"], ["L", "Lungo", "×0.6"]].map(([v, l, m]) => (
                        <label key={v} className="flex-1">
                          <input type="radio" name={`orizzonte-${iro.id}`} value={v} defaultChecked={v === "B"} className="sr-only peer" />
                          <div className="peer-checked:bg-primary peer-checked:text-primary-foreground border border-border rounded px-2 py-1.5 text-xs text-center cursor-pointer transition-colors">
                            <div className="font-semibold">{l}</div>
                            <div className="text-xs opacity-70">{m}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Score finanziario</span>
                    <span className="text-2xl font-bold">{iro.score_finanziario}</span>
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", iro.materiale_fin ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                    {iro.materiale_fin ? "Materiale" : "Non materiale"}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialityMatrix() {
  const [soloMateriali, setSoloMateriali] = useState(false);
  const displayed = soloMateriali ? irosAcme.filter(i => i.materiale_impatto || i.materiale_fin) : irosAcme;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-md text-xs">
        <p className="font-semibold">{d.id} — {d.tema}</p>
        <p>Score impatto: {d.score_impatto}</p>
        <p>Score finanziario: {d.score_finanziario}</p>
        <p>Categoria: {d.categoria?.replace(/_/g, " ")}</p>
      </div>
    );
  };

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div><p className="text-xs font-mono text-muted-foreground">02F</p><h2 className="text-base font-semibold">Matrice di materialità</h2></div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input type="checkbox" checked={soloMateriali} onChange={e => setSoloMateriali(e.target.checked)} className="accent-primary" />
            Mostra solo materiali
          </label>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 mb-4 text-xs">
        {[["E", "Ambientale", "#0F766E"], ["S", "Sociale", "#7C3AED"], ["G", "Governance", "#334155"]].map(([area, label, color]) => (
          <div key={area} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span>{area} — {label}</span>
          </div>
        ))}
      </div>

      {/* Scatter chart */}
      <div className="h-96 bg-muted/10 rounded-lg p-2 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
            <XAxis type="number" dataKey="score_finanziario" domain={[0, 25]} label={{ value: "Rilevanza finanziaria →", position: "bottom", fontSize: 11 }} tick={{ fontSize: 11 }} />
            <YAxis type="number" dataKey="score_impatto" domain={[0, 5]} label={{ value: "↑ Rilevanza impatto", angle: -90, position: "insideLeft", fontSize: 11 }} tick={{ fontSize: 11 }} />
            <ReferenceLine x={9} stroke="#CA8A04" strokeDasharray="4 4" strokeWidth={1.5} />
            <ReferenceLine y={3} stroke="#CA8A04" strokeDasharray="4 4" strokeWidth={1.5} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={displayed}>
              {displayed.map((entry, i) => (
                <Cell key={i} fill={areaColors[entry.area]} fillOpacity={0.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Tabella ranking */}
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {["Codice", "Tema", "Area", "Score impatto", "Score finanziario", "Categoria"].map(h => (
              <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {[...displayed].sort((a, b) => (b.score_impatto + b.score_finanziario) - (a.score_impatto + a.score_finanziario)).map(iro => (
            <tr key={iro.id} className="hover:bg-muted/30">
              <td className="px-4 py-2 font-mono">{iro.id}</td>
              <td className="px-4 py-2">{iro.tema}</td>
              <td className="px-4 py-2">
                <span className="px-2 py-0.5 rounded text-white text-xs font-semibold" style={{ backgroundColor: areaColors[iro.area] }}>{iro.area}</span>
              </td>
              <td className="px-4 py-2 font-semibold">{iro.score_impatto}</td>
              <td className="px-4 py-2 font-semibold">{iro.score_finanziario}</td>
              <td className="px-4 py-2">
                <span className={cn("text-xs px-2 py-0.5 rounded-full",
                  iro.categoria === "DOPPIA" ? "bg-teal-100 text-teal-800" :
                  iro.categoria === "SOLO_IMPATTO" ? "bg-purple-100 text-purple-800" :
                  iro.categoria === "SOLO_FINANZIARIA" ? "bg-amber-100 text-amber-800" :
                  "bg-gray-100 text-gray-600"
                )}>{iro.categoria?.replace(/_/g, " ")}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StakeholderView() {
  const stakeholder = [
    { gruppo: "Azionisti/soci", priorita: "ALTA", engagement: "Report periodici", frequenza: "Trimestrale" },
    { gruppo: "CdA", priorita: "ALTA", engagement: "Presentazioni CdA", frequenza: "Mensile" },
    { gruppo: "Management", priorita: "ALTA", engagement: "Workshop interni", frequenza: "Mensile" },
    { gruppo: "Dipendenti", priorita: "ALTA", engagement: "Survey interna", frequenza: "Annuale" },
    { gruppo: "Clienti", priorita: "ALTA", engagement: "Customer survey", frequenza: "Annuale" },
    { gruppo: "Fornitori", priorita: "MEDIA", engagement: "Questionario fornitori", frequenza: "Annuale" },
    { gruppo: "Comunità locale", priorita: "MEDIA", engagement: "Incontri pubblici", frequenza: "Semestrale" },
    { gruppo: "Media", priorita: "BASSA", engagement: "Comunicati stampa", frequenza: "Annuale" },
  ];
  return (
    <div className="p-6 overflow-y-auto">
      <p className="text-xs font-mono text-muted-foreground mb-1">02A</p>
      <h2 className="text-base font-semibold mb-4">Perimetro e stakeholder registry</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {["Gruppo", "Priorità", "Metodo engagement", "Frequenza"].map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {stakeholder.map(s => (
            <tr key={s.gruppo} className="hover:bg-muted/30">
              <td className="px-4 py-2.5 font-medium">{s.gruppo}</td>
              <td className="px-4 py-2.5">
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                  s.priorita === "ALTA" ? "bg-red-100 text-red-800" : s.priorita === "MEDIA" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600"
                )}>{s.priorita}</span>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">{s.engagement}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{s.frequenza}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}