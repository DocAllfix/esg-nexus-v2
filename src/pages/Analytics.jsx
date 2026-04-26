import { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import PageHeader from "@/components/common/PageHeader";
import DataGuard from "@/components/common/DataGuard";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Briefcase, Euro, Shield } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

const COLORS = ["#14b8a6", "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

function KpiStat({ label, value, sub, trend, icon: IconComp, color = "text-primary" }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        {IconComp && <IconComp size={16} className={cn("text-muted-foreground", color)} />}
      </div>
      <p className={cn("text-3xl font-semibold tabular-nums", color)}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      {trend !== undefined && (
        <div className={cn("flex items-center gap-1 mt-2 text-xs font-medium", trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-muted-foreground")}>
          {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : "Stabile"} vs anno prec.
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 pb-2 border-b border-border">
      {children}
    </h2>
  );
}

function EmptyChart({ message = "Dati insufficienti" }) {
  return (
    <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("portfolio");
  const { data, isLoading, error } = useAnalytics();

  const tabs = [
    { id: "portfolio", label: "Portfolio & Fatturato" },
    { id: "esg",       label: "Performance ESG" },
    { id: "operativo", label: "Operativo & Processi" },
    { id: "clienti",   label: "Benchmark Clienti" },
  ];

  return (
    <DataGuard data={data} isLoading={isLoading} error={error}>
      <AnalyticsContent data={data} activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
    </DataGuard>
  );
}

function AnalyticsContent({ data, activeTab, setActiveTab, tabs }) {
  const engagements   = data?.engagements ?? [];
  const fatturato     = data?.fatturato ?? [];
  const rischi        = data?.rischi ?? [];
  const kpiByArea     = data?.kpiByArea ?? {};
  const ghgByScope    = data?.ghgByScope ?? {};
  const engByStandard = data?.engByStandard ?? {};
  const engBySettore  = data?.engBySettore ?? {};

  const engAttivi     = engagements.filter(e => e.stato !== "BIL_PUBBLICATO").length;
  const engCompletati = engagements.filter(e => e.stato === "BIL_PUBBLICATO").length;
  const rischiCritici = rischi.filter(r => (r.score ?? 0) >= 20).length;
  const avgProgress   = engagements.length > 0
    ? Math.round(engagements.reduce((s, e) => s + (e.progresso ?? 0), 0) / engagements.length)
    : 0;
  const fatturatoTot  = fatturato.reduce((s, f) => s + Number(f.fatturato_eur ?? 0), 0);

  const standardDist = Object.entries(engByStandard).map(([name, value], i) => ({
    name: name.replace("_", "/"), value, color: COLORS[i % COLORS.length],
  }));

  const settoriDist = Object.entries(engBySettore).map(([name, value]) => ({ name, value }));

  const fatturatoChart = fatturato.map(f => ({
    anno: String(f.anno),
    valore: Number(f.fatturato_eur ?? 0),
    engagement: Number(f.num_engagement ?? 0),
  }));

  const kpiValidazione = Object.entries(kpiByArea).map(([area, v]) => ({
    area: `${area} (${area === "E" ? "Ambiente" : area === "S" ? "Sociale" : "Governance"})`,
    validati:    v.kpi_compilati,
    da_validare: v.num_kpi - v.kpi_compilati,
  }));

  const ghgChart = Object.entries(ghgByScope).map(([scope, totale]) => ({
    scope: `Scope ${scope}`,
    totale: Number(totale.toFixed(1)),
  }));

  return (
    <div>
      <PageHeader
        title="Analytics"
        breadcrumbs={[{ label: "Analytics" }]}
        subtitle="Analisi aggregata e storica su tutti gli engagement e clienti dello studio"
      />

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <KpiStat label="Fatturato totale"   value={`€${(fatturatoTot / 1000).toFixed(0)}k`} sub="Da fatturazioni emesse/pagate" icon={Euro}       color="text-primary" />
        <KpiStat label="Engagement attivi"  value={engAttivi}     sub="In corso"              icon={Briefcase} color="text-primary" />
        <KpiStat label="Bilanci pubblicati" value={engCompletati} sub="Completati al 100%"    icon={Shield}    color="text-green-600" />
        <KpiStat label="Progresso medio"    value={`${avgProgress}%`} sub="Su tutti gli eng." icon={TrendingUp} color="text-amber-600" />
        <KpiStat label="Rischi critici"     value={rischiCritici} sub="Score ≥ 20"            icon={Shield}    color="text-red-600" />
      </div>

      <div className="flex border-b border-border mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "portfolio" && (
        <div className="space-y-6">
          <SectionTitle>Andamento fatturato annuo (€)</SectionTitle>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Fatturato per anno</p>
              {fatturatoChart.length === 0 ? <EmptyChart /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={fatturatoChart} barCategoryGap="40%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="anno" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={v => [`€${Number(v).toLocaleString("it-IT")}`, "Fatturato"]} />
                    <Bar dataKey="valore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Distribuzione per standard</p>
              {standardDist.length === 0 ? <EmptyChart /> : (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={180}>
                    <PieChart>
                      <Pie data={standardDist} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                        {standardDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 flex-1">
                    {standardDist.map(s => (
                      <div key={s.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-sm text-muted-foreground">{s.name}</span>
                        <span className="ml-auto text-sm font-semibold">{s.value} eng.</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <SectionTitle>Engagement per cliente</SectionTitle>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Cliente", "Settore", "Project code", "Standard", "Stato", "Progresso"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {engagements.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">Dati insufficienti</td></tr>
                ) : engagements.map(e => (
                  <tr key={e.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{e.cliente_nome ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.cliente_settore ?? "—"}</td>
                    <td className="px-4 py-3 font-mono">{e.codice_progetto}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.standard}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.stato}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${e.progresso ?? 0}%` }} />
                        </div>
                        <span>{e.progresso ?? 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "esg" && (
        <div className="space-y-6">
          <SectionTitle>Emissioni GHG aggregate per scope (tCO₂e)</SectionTitle>
          <div className="bg-card border border-border rounded-lg p-5">
            {ghgChart.length === 0 ? <EmptyChart message="Nessun dato GHG disponibile. Inserisci dati nei form PROC-04." /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={ghgChart} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="scope" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} unit=" t" />
                  <Tooltip formatter={v => [`${v} tCO₂e`, "Totale"]} />
                  <Bar dataKey="totale" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Stato validazione KPI per area ESG</p>
              {kpiValidazione.length === 0 ? <EmptyChart message="Dati insufficienti" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={kpiValidazione} layout="vertical" barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="area" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="validati"    name="Compilati"     fill="#14b8a6" radius={[0, 4, 4, 0]} stackId="a" />
                    <Bar dataKey="da_validare" name="Da compilare"  fill="#f59e0b" radius={[0, 4, 4, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Distribuzione settori clienti</p>
              {settoriDist.length === 0 ? <EmptyChart /> : (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={180}>
                    <PieChart>
                      <Pie data={settoriDist} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                        {settoriDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 flex-1">
                    {settoriDist.map((s, i) => (
                      <div key={s.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-sm text-muted-foreground">{s.name}</span>
                        <span className="ml-auto text-sm font-semibold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "operativo" && (
        <div className="space-y-6">
          <SectionTitle>Stato engagement — progresso</SectionTitle>
          <div className="bg-card border border-border rounded-lg p-5">
            {engagements.length === 0 ? <EmptyChart message="Dati insufficienti" /> : (
              <div className="space-y-3">
                {engagements.map(eng => (
                  <div key={eng.id} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-36 shrink-0">{eng.codice_progetto}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", (eng.progresso ?? 0) === 100 ? "bg-green-500" : (eng.progresso ?? 0) >= 60 ? "bg-primary" : "bg-amber-500")}
                        style={{ width: `${eng.progresso ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-10 text-right shrink-0">{eng.progresso ?? 0}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <p className="text-sm font-semibold mb-4">Rischi per score</p>
            {rischi.length === 0 ? <EmptyChart message="Nessun rischio registrato" /> : (
              <div className="space-y-3">
                {[
                  { label: "Critico (≥20)",  min: 20, max: Infinity, color: "bg-red-500",    textColor: "text-red-600" },
                  { label: "Alto (15–19)",    min: 15, max: 20,       color: "bg-orange-400", textColor: "text-orange-600" },
                  { label: "Medio (8–14)",    min: 8,  max: 15,       color: "bg-amber-400",  textColor: "text-amber-600" },
                  { label: "Basso (<8)",      min: 0,  max: 8,        color: "bg-lime-500",   textColor: "text-lime-700" },
                ].map(({ label, min, max, color, textColor }) => {
                  const n = rischi.filter(r => (r.score ?? 0) >= min && (r.score ?? 0) < max).length;
                  const pct = rischi.length > 0 ? Math.round((n / rischi.length) * 100) : 0;
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className={cn("text-xs font-semibold w-24 shrink-0", textColor)}>{label}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold w-6 text-right shrink-0">{n}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "clienti" && (
        <div className="space-y-6">
          <SectionTitle>Confronto dimensionale clienti</SectionTitle>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Cliente", "Settore", "Standard ESG", "Stato engagement", "Progresso"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {engagements.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">Dati insufficienti</td></tr>
                ) : engagements.map(e => (
                  <tr key={e.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{e.cliente_nome ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.cliente_settore ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.standard}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.stato}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${e.progresso ?? 0}%` }} />
                        </div>
                        <span className="text-muted-foreground">{e.progresso ?? 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
