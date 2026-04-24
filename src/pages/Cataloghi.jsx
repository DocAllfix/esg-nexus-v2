import { useState } from "react";
import { Search, Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const irosAcme = [];
const kpiLibrary = [];
const ghgData = [];

const TABS = ["IRO", "Temi materiali", "KPI Library", "Fonti GHG", "GRI Disclosures", "ESRS Disclosures", "Stakeholder", "SDGs"];

export default function Cataloghi() {
  const [tab, setTab] = useState("IRO");
  const [search, setSearch] = useState("");

  return (
    <div>
      <PageHeader
        title="Cataloghi"
        breadcrumbs={[{ label: "Cataloghi" }]}
        subtitle="Gestione dei cataloghi di sistema — IRO, KPI, GRI, ESRS e altro"
      />

      <div className="flex gap-0 border-b border-border mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSearch(""); }}
            className={cn("px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap", tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Cerca in ${tab}…`}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Nuova riga
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {tab === "IRO" && <IROTable search={search} />}
        {tab === "KPI Library" && <KPITable search={search} />}
        {tab === "Fonti GHG" && <GHGTable search={search} />}
        {!["IRO", "KPI Library", "Fonti GHG"].includes(tab) && <GenericTable tab={tab} />}
      </div>
    </div>
  );
}

function IROTable({ search }) {
  const filtered = irosAcme.filter(r => r.tema.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()));
  const areaColors = { E: "bg-teal-100 text-teal-800", S: "bg-purple-100 text-purple-800", G: "bg-slate-100 text-slate-700" };

  return (
    <table className="w-full text-xs">
      <thead><tr className="border-b border-border bg-muted/40">
        {["Codice", "Tema", "Area", "Tipo", "Prospettiva", "Score impatto", "Score finanziario", "Categoria"].map(h => (
          <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
        ))}
      </tr></thead>
      <tbody className="divide-y divide-border">
        {filtered.map(iro => (
          <tr key={iro.id} className="hover:bg-muted/30">
            <td className="px-4 py-3 font-mono font-semibold">{iro.id}</td>
            <td className="px-4 py-3">{iro.tema}</td>
            <td className="px-4 py-3"><span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", areaColors[iro.area])}>{iro.area}</span></td>
            <td className="px-4 py-3 font-mono">{iro.tipo}</td>
            <td className="px-4 py-3 text-muted-foreground">{iro.prospettiva}</td>
            <td className="px-4 py-3 font-semibold">{iro.score_impatto}</td>
            <td className="px-4 py-3 font-semibold">{iro.score_finanziario}</td>
            <td className="px-4 py-3">
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
  );
}

function KPITable({ search }) {
  const all = [...(kpiLibrary.E || []), ...(kpiLibrary.S || []), ...(kpiLibrary.G || [])];
  const filtered = all.filter(k => k.label.toLowerCase().includes(search.toLowerCase()) || k.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <table className="w-full text-xs">
      <thead><tr className="border-b border-border bg-muted/40">
        {["Codice", "Label", "Unità", "Standard ref", "Stato"].map(h => (
          <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
        ))}
      </tr></thead>
      <tbody className="divide-y divide-border">
        {filtered.map(k => (
          <tr key={k.code} className="hover:bg-muted/30">
            <td className="px-4 py-3 font-mono font-semibold">{k.code}</td>
            <td className="px-4 py-3">{k.label}</td>
            <td className="px-4 py-3 text-muted-foreground">{k.unita}</td>
            <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{k.standard}</td>
            <td className="px-4 py-3">
              <span className={cn("text-xs px-2 py-0.5 rounded-full", k.stato === "validato" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800")}>{k.stato}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GHGTable({ search }) {
  const all = [...ghgData.scope1, ...ghgData.scope2_mb, ...ghgData.scope2_lb, ...ghgData.scope3];
  const filtered = all.filter(r => r.descrizione.toLowerCase().includes(search.toLowerCase()));

  return (
    <table className="w-full text-xs">
      <thead><tr className="border-b border-border bg-muted/40">
        {["ID", "Descrizione", "Unità", "Fattore emissione", "Fonte", "Anno"].map(h => (
          <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
        ))}
      </tr></thead>
      <tbody className="divide-y divide-border">
        {filtered.map(r => (
          <tr key={r.id} className="hover:bg-muted/30">
            <td className="px-4 py-3 font-mono">{r.id}</td>
            <td className="px-4 py-3">{r.descrizione}</td>
            <td className="px-4 py-3 text-muted-foreground">{r.unita}</td>
            <td className="px-4 py-3 font-semibold">{r.fattore}</td>
            <td className="px-4 py-3">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{r.fonte}</span>
            </td>
            <td className="px-4 py-3 text-muted-foreground">2023</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GenericTable({ tab }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search size={20} className="text-muted-foreground" />
      </div>
      <p className="text-sm font-medium mb-1">Catalogo {tab}</p>
      <p className="text-xs text-muted-foreground">Questo catalogo sarà popolato dal backend Supabase</p>
    </div>
  );
}