import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Circle, AlertCircle } from "lucide-react";

const SOTTOFASI = [
  { id: "03A", nome: "Piano audit", stato: "completata" },
  { id: "03B", nome: "Documenti richiesti", stato: "completata" },
  { id: "03C", nome: "Audit area E", stato: "completata" },
  { id: "03D", nome: "Audit area S", stato: "completata" },
  { id: "03E", nome: "Audit area G", stato: "completata" },
  { id: "03F", nome: "Sintesi gap", stato: "completata" },
  { id: "03G", nome: "Report diagnosi", stato: "completata" },
];

const checklistE = [
  { cat: "E1.1 Inventario emissioni GHG", items: [
    { q: "L'organizzazione ha identificato le fonti di emissione Scope 1?", ref: "ESRS E1-6 / GRI 305-1", rating: 4 },
    { q: "È presente un sistema di misurazione delle emissioni Scope 2?", ref: "GRI 305-2", rating: 3 },
    { q: "Le emissioni Scope 3 sono stimate con metodo documentato?", ref: "GRI 305-3 / ESRS E1-6", rating: 2 },
  ]},
  { cat: "E1.2 Riduzione emissioni", items: [
    { q: "Esistono target di riduzione GHG con scadenze definite?", ref: "GRI 305-5 / ESRS E1-4", rating: 3 },
    { q: "Il piano di transizione climatica è stato approvato dal CdA?", ref: "ESRS E1-1", rating: 1 },
  ]},
  { cat: "E2.1 Energia", items: [
    { q: "Il consumo energetico totale è tracciato per fonte?", ref: "GRI 302-1 / ESRS E1-5", rating: 4 },
    { q: "È presente una politica sull'efficienza energetica?", ref: "GRI 302-4", rating: 3 },
  ]},
];

const ratingLabels = ["Critico", "Basso", "Medio", "Buono", "Conforme"];
const ratingColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-600"];

export default function TabProc03({ eng }) {
  const [faseSel, setFaseSel] = useState("03G");

  return (
    <div className="flex gap-4 min-h-[600px]">
      <div className="w-60 shrink-0 bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PROC-03 · Gap Analysis</p>
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
        {faseSel === "03C" && <ChecklistArea />}
        {faseSel === "03G" && <ReportDiagnosi />}
        {!["03C", "03G"].includes(faseSel) && (
          <div className="p-6">
            <p className="text-xs font-mono text-muted-foreground mb-1">{faseSel}</p>
            <h2 className="text-base font-semibold">{SOTTOFASI.find(f => f.id === faseSel)?.nome}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

function ChecklistArea() {
  const [ratings, setRatings] = useState(
    checklistE.flatMap(cat => cat.items.map((item, i) => ({ key: `${cat.cat}-${i}`, val: item.rating })))
      .reduce((acc, { key, val }) => ({ ...acc, [key]: val }), {})
  );
  const allRatings = Object.values(ratings);
  const avg = (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1);

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div>
          <p className="text-xs font-mono text-muted-foreground">03C</p>
          <h2 className="text-base font-semibold">Audit area E — Ambiente</h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{avg}<span className="text-base font-normal text-muted-foreground"> / 5</span></p>
          <p className="text-xs text-muted-foreground">{allRatings.filter(r => r <= 2).length} gap critici rilevati</p>
        </div>
      </div>
      <div className="space-y-6">
        {checklistE.map(cat => (
          <div key={cat.cat}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{cat.cat}</h3>
            <div className="space-y-3">
              {cat.items.map((item, i) => {
                const key = `${cat.cat}-${i}`;
                const val = ratings[key] || item.rating;
                return (
                  <div key={i} className={cn("p-4 rounded-lg border", val <= 2 ? "border-red-200 bg-red-50/30" : "border-border")}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <p className="text-sm">{item.q}</p>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded shrink-0 font-mono">{item.ref}</span>
                    </div>
                    <div className="flex gap-2">
                      {ratingLabels.map((label, ri) => (
                        <button
                          key={ri}
                          onClick={() => setRatings(prev => ({ ...prev, [key]: ri + 1 }))}
                          className={cn(
                            "flex-1 py-1.5 rounded text-xs font-medium transition-all",
                            val === ri + 1 ? `${ratingColors[ri]} text-white` : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                          )}
                        >
                          {ri + 1} · {label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportDiagnosi() {
  const aree = [
    { area: "E", label: "Ambiente", voto: 3.2, livello: "MEDIO", gap_critici: 3, gap: [5, 3, 4, 2, 1], top_gap: ["Piano transizione climatica assente", "Scope 3 non misurato", "Target riduzione non definiti"] },
    { area: "S", label: "Sociale", voto: 3.8, livello: "BUONO", gap_critici: 1, gap: [2, 1, 4, 5, 3], top_gap: ["Gap retributivo di genere non monitorato"] },
    { area: "G", label: "Governance", voto: 3.5, livello: "BUONO", gap_critici: 1, gap: [1, 2, 3, 4, 5], top_gap: ["Politica anti-corruzione non formalizzata"] },
  ];
  const levelColor = { "BUONO": "text-green-700 bg-green-100", "MEDIO": "text-amber-700 bg-amber-100", "CRITICO": "text-red-700 bg-red-100" };

  return (
    <div className="p-6 overflow-y-auto">
      <p className="text-xs font-mono text-muted-foreground mb-1">03G</p>
      <h2 className="text-base font-semibold mb-4">Report di diagnosi — Dashboard Gap</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {aree.map(a => (
          <div key={a.area} className={cn("border rounded-lg p-4", a.area === "E" ? "border-teal-200" : a.area === "S" ? "border-purple-200" : "border-slate-200")}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Area {a.area}</p>
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", levelColor[a.livello])}>{a.livello}</span>
            </div>
            <p className="text-3xl font-bold tabular-nums">{a.voto} <span className="text-base font-normal text-muted-foreground">/ 5</span></p>
            <div className="flex items-end gap-0.5 mt-3 h-8">
              {a.gap.map((h, i) => (
                <div key={i} className={cn("flex-1 rounded-sm", ratingColors[i])} style={{ height: `${(h / 5) * 100}%` }} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{a.gap_critici} gap critici (rating 1-2)</p>
            <div className="mt-3 space-y-1.5">
              {a.top_gap.map((g, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <AlertCircle size={12} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{g}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-3 border-2 border-dashed border-primary/30 rounded-lg text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
        Genera iniziative dai gap critici →
      </button>
    </div>
  );
}