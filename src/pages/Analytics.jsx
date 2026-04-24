import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";
import PageHeader from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Users, Briefcase, Euro, Leaf, Shield, Heart } from "lucide-react";

// TODO: Replace with Supabase hook
const engagements = [];
const clienti = [];
const rischi = [];
const kpiLibrary = [];

// ─── Dati derivati dai mock ───────────────────────────────────────────────────

const fatturato_per_anno = [
  { anno: "2023", valore: 45000, engagement: 2 },
  { anno: "2024", valore: 71000, engagement: 3 },
  { anno: "2025", valore: 73000, engagement: 4 },
];

const ghg_trend = [
  { anno: "2022", scope1: 210, scope2_lb: 290, scope3: 780 },
  { anno: "2023", scope1: 195, scope2_lb: 268, scope3: 720 },
  { anno: "2024", scope1: 183, scope2_lb: 246, scope3: 621 },
];

const nps_data = [
  { cliente: "Nova Industrie 2024", nps: 9, categoria: "Promotore" },
];

const proc_durata = [
  { proc: "PROC-00", media_gg: 8 },
  { proc: "PROC-01", media_gg: 12 },
  { proc: "PROC-02", media_gg: 28 },
  { proc: "PROC-03", media_gg: 21 },
  { proc: "PROC-04", media_gg: 35 },
  { proc: "PROC-05", media_gg: 18 },
  { proc: "PROC-06", media_gg: 45 },
  { proc: "PROC-07", media_gg: 10 },
];

const standard_dist = [
  { name: "GRI", value: 1, color: "#14b8a6" },
  { name: "CSRD/ESRS", value: 2, color: "#6366f1" },
  { name: "GRI + ESRS", value: 1, color: "#f59e0b" },
];

const settori_dist = [
  { name: "Automotive", value: 1 },
  { name: "Agroalimentare", value: 1 },
  { name: "Chimica", value: 2 },
];

const kpi_validazione = [
  { area: "E (Ambiente)", validati: 5, da_validare: 4 },
  { area: "S (Sociale)", validati: 5, da_validare: 2 },
  { area: "G (Governance)", validati: 4, da_validare: 1 },
];

const radar_maturita = [
  { subject: "Dati E", acme: 3, bioverde: 4, nova: 5 },
  { subject: "Dati S", acme: 4, bioverde: 3, nova: 5 },
  { subject: "Dati G", acme: 3, bioverde: 2, nova: 5 },
  { subject: "Governance ESG", acme: 3, bioverde: 3, nova: 5 },
  { subject: "Commitment mgmt", acme: 4, bioverde: 4, nova: 5 },
  { subject: "Maturità KPI", acme: 2, bioverde: 3, nova: 5 },
];

// ─── Componenti ───────────────────────────────────────────────────────────────

function KpiStat({ label, value, sub, trend, icon: IconComp, color = "text-primary" }) {
  const Icon = IconComp;
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        {Icon && <Icon size={16} className={cn("text-muted-foreground", color)} />}
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

const COLORS = ["#14b8a6", "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("portfolio");

  const totale_fatturato = engagements.reduce((s, e) => s + (e.importo_netto || 0), 0);
  const eng_attivi = engagements.filter(e => e.stato !== "BIL_PUBBLICATO").length;
  const eng_completati = engagements.filter(e => e.stato === "BIL_PUBBLICATO").length;
  const rischi_critici = rischi.filter(r => r.classe === "CRITICO").length;
  const avg_progress = Math.round(engagements.reduce((s, e) => s + e.progress, 0) / engagements.length);

  const tabs = [
    { id: "portfolio", label: "Portfolio & Fatturato" },
    { id: "esg", label: "Performance ESG" },
    { id: "operativo", label: "Operativo & Processi" },
    { id: "clienti", label: "Benchmark Clienti" },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        breadcrumbs={[{ label: "Analytics" }]}
        subtitle="Analisi aggregata e storica su tutti gli engagement e clienti dello studio"
      />

      {/* KPI header */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <KpiStat label="Fatturato totale" value={`€${(totale_fatturato / 1000).toFixed(0)}k`} sub="Tutti gli engagement" trend={3} icon={Euro} color="text-primary" />
        <KpiStat label="Engagement attivi" value={eng_attivi} sub="In corso" icon={Briefcase} color="text-primary" />
        <KpiStat label="Bilanci pubblicati" value={eng_completati} sub="Completati al 100%" icon={Shield} color="text-green-600" />
        <KpiStat label="Progresso medio" value={`${avg_progress}%`} sub="Su tutti gli eng." icon={TrendingUp} color="text-amber-600" />
        <KpiStat label="Rischi critici" value={rischi_critici} sub="Aperti / In gestione" icon={Shield} color="text-red-600" />
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-border mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Portfolio & Fatturato ──────────────────────────────────────── */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          <SectionTitle>Andamento fatturato annuo (€)</SectionTitle>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Fatturato per anno</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={fatturato_per_anno} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="anno" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `€${v / 1000}k`} />
                  <Tooltip formatter={v => [`€${v.toLocaleString("it-IT")}`, "Fatturato"]} />
                  <Bar dataKey="valore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Distribuzione per standard</p>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={standard_dist} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                      {standard_dist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {standard_dist.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-sm text-muted-foreground">{s.name}</span>
                      <span className="ml-auto text-sm font-semibold">{s.value} eng.</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <SectionTitle>Engagement per cliente</SectionTitle>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Cliente", "Settore", "N. Eng.", "Fatturato totale", "Standard", "Dipendenti", "NPS"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clienti.map(c => {
                  const engs = engagements.filter(e => e.cliente_id === c.id);
                  const fat = engs.reduce((s, e) => s + (e.importo_netto || 0), 0);
                  const nps_eng = engs.find(e => e.nps);
                  return (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{c.ragione_sociale}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.settore}</td>
                      <td className="px-4 py-3 font-semibold">{engs.length}</td>
                      <td className="px-4 py-3 font-semibold text-primary">€{fat.toLocaleString("it-IT")}</td>
                      <td className="px-4 py-3 text-muted-foreground">{[...new Set(engs.map(e => e.standard))].join(", ")}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.dipendenti}</td>
                      <td className="px-4 py-3">
                        {nps_eng ? (
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", nps_eng.nps >= 9 ? "bg-green-100 text-green-800" : nps_eng.nps >= 7 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800")}>
                            {nps_eng.nps}/10
                          </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: Performance ESG ─────────────────────────────────────────────── */}
      {activeTab === "esg" && (
        <div className="space-y-6">
          <SectionTitle>Trend emissioni GHG (tCO₂e) — Acme Manufacturing</SectionTitle>
          <div className="bg-card border border-border rounded-lg p-5">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={ghg_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="anno" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="scope1" name="Scope 1" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="scope2_lb" name="Scope 2 (LB)" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="scope3" name="Scope 3" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">Riduzione Scope 1: -12.9% in 2 anni · Scope 2 MB: 0 tCO₂e grazie a GO certificati</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Stato validazione KPI per area ESG</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={kpi_validazione} layout="vertical" barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="area" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="validati" name="Validati" fill="#14b8a6" radius={[0, 4, 4, 0]} stackId="a" />
                  <Bar dataKey="da_validare" name="Da validare" fill="#f59e0b" radius={[0, 4, 4, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Distribuzione settori clienti</p>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={settori_dist} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                      {settori_dist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {settori_dist.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                      <span className="text-sm text-muted-foreground">{s.name}</span>
                      <span className="ml-auto text-sm font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <SectionTitle>KPI ESG chiave — Acme Manufacturing (ultimo rilevamento)</SectionTitle>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "GHG Scope 1", value: "183.1 tCO₂e", icon: Leaf, color: "text-green-600", sub: "−4.1% vs 2023" },
              { label: "GHG Scope 2 MB", value: "0 tCO₂e", icon: Leaf, color: "text-primary", sub: "100% rinnovabile" },
              { label: "Infortuni (TRIR)", value: "1.8", icon: Heart, color: "text-red-500", sub: "Per mln ore lavorate" },
              { label: "Donne in CdA", value: "28.6%", icon: Users, color: "text-indigo-600", sub: "GRI 405-1" },
            ].map(k => (
              <div key={k.label} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{k.label}</p>
                  <k.icon size={14} className={k.color} />
                </div>
                <p className={cn("text-2xl font-semibold tabular-nums", k.color)}>{k.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: Operativo & Processi ─────────────────────────────────────────── */}
      {activeTab === "operativo" && (
        <div className="space-y-6">
          <SectionTitle>Durata media per fase procedurale (giorni)</SectionTitle>
          <div className="bg-card border border-border rounded-lg p-5">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={proc_durata} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="proc" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit=" gg" />
                <Tooltip formatter={v => [`${v} giorni`, "Durata media"]} />
                <Bar dataKey="media_gg" name="Giorni medi" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                  {proc_durata.map((entry, i) => (
                    <Cell key={i} fill={entry.media_gg > 30 ? "#f59e0b" : "hsl(var(--primary))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">In giallo le fasi con durata &gt;30 giorni — candidate a ottimizzazione</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Stato engagement correnti</p>
              <div className="space-y-3">
                {engagements.map(eng => (
                  <div key={eng.id} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-36 shrink-0">{eng.project_code}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", eng.progress === 100 ? "bg-green-500" : eng.progress >= 60 ? "bg-primary" : "bg-amber-500")}
                        style={{ width: `${eng.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold w-10 text-right shrink-0">{eng.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <p className="text-sm font-semibold mb-4">Rischi per classe — portafoglio</p>
              <div className="space-y-3">
                {["CRITICO", "ALTO", "MEDIO", "BASSO"].map(classe => {
                  const n = rischi.filter(r => r.classe === classe).length;
                  const pct = Math.round((n / rischi.length) * 100);
                  const color = { CRITICO: "bg-red-500", ALTO: "bg-orange-400", MEDIO: "bg-amber-400", BASSO: "bg-lime-500" }[classe];
                  return (
                    <div key={classe} className="flex items-center gap-3">
                      <span className={cn("text-xs font-semibold w-16 shrink-0", { CRITICO: "text-red-600", ALTO: "text-orange-600", MEDIO: "text-amber-600", BASSO: "text-lime-700" }[classe])}>{classe}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold w-6 text-right shrink-0">{n}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">Rischio più frequente: <span className="font-semibold text-foreground">Dati GHG incompleti</span></p>
              </div>
            </div>
          </div>

          <SectionTitle>NPS clienti raccolti</SectionTitle>
          <div className="bg-card border border-border rounded-lg p-5">
            {nps_data.length > 0 ? (
              <div className="space-y-3">
                {nps_data.map(n => (
                  <div key={n.cliente} className="flex items-center gap-4">
                    <span className="text-sm w-52 shrink-0">{n.cliente}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={cn("w-6 h-6 rounded text-xs flex items-center justify-center font-semibold", i < n.nps ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{i + 1}</div>
                      ))}
                    </div>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", n.categoria === "Promotore" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")}>{n.categoria}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nessun NPS ancora raccolto.</p>
            )}
            <p className="text-xs text-muted-foreground mt-4">Il NPS viene raccolto in PROC-07 alla chiusura di ogni engagement.</p>
          </div>
        </div>
      )}

      {/* ── TAB: Benchmark Clienti ───────────────────────────────────────────── */}
      {activeTab === "clienti" && (
        <div className="space-y-6">
          <SectionTitle>Maturità ESG per cliente (radar)</SectionTitle>
          <div className="bg-card border border-border rounded-lg p-5">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radar_maturita}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <Radar name="Acme Manufacturing" dataKey="acme" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} />
                <Radar name="Bioverde S.r.l." dataKey="bioverde" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                <Radar name="Nova Industrie" dataKey="nova" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2 text-center">Score 1–5 basato sui dati raccolti nei PROC-00B, PROC-03 e PROC-04</p>
          </div>

          <SectionTitle>Confronto dimensionale clienti</SectionTitle>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Cliente", "Settore", "Dipendenti", "Fatturato (M€)", "Quotato", "Standard ESG", "Stato engagement"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clienti.map(c => {
                  const ultEng = [...engagements].filter(e => e.cliente_id === c.id).sort((a, b) => b.anno - a.anno)[0];
                  return (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{c.ragione_sociale}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.settore}</td>
                      <td className="px-4 py-3 tabular-nums">{c.dipendenti}</td>
                      <td className="px-4 py-3 tabular-nums">€{c.fatturato}M</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", c.quotato === "Sì" ? "bg-indigo-100 text-indigo-800" : "bg-muted text-muted-foreground")}>
                          {c.quotato}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{ultEng?.standard || "—"}</td>
                      <td className="px-4 py-3">
                        {ultEng && (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${ultEng.progress}%` }} />
                            </div>
                            <span className="text-muted-foreground">{ultEng.progress}%</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {[
              { label: "Cliente con più engagement", value: "Nova Industrie S.p.A.", sub: "2 engagement (2024 + 2025)", color: "text-indigo-600" },
              { label: "Fatturato medio per eng.", value: `€${Math.round(totale_fatturato / engagements.length / 1000)}k`, sub: "Media su 4 engagement", color: "text-primary" },
              { label: "Settore prevalente", value: "Chimica", sub: "2 engagement su 4", color: "text-amber-600" },
            ].map(k => (
              <div key={k.label} className="bg-card border border-border rounded-lg p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{k.label}</p>
                <p className={cn("text-xl font-semibold", k.color)}>{k.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{k.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}