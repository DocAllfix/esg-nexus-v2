import { useState } from "react";
import { Search, Database } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataGuard from "@/components/common/DataGuard";
import { cn } from "@/lib/utils";
import { useCatalogoIro, useKpiDefinizioni } from "@/hooks/useCataloghi";

const TABS = [
  { id: "IRO",        label: "IRO",                wired: true  },
  { id: "TEMI",       label: "Temi materiali",     wired: false },
  { id: "KPI",        label: "KPI Library",        wired: true  },
  { id: "GHG",        label: "Fonti GHG",          wired: false },
  { id: "GRI",        label: "GRI Disclosures",    wired: false },
  { id: "ESRS",       label: "ESRS Disclosures",   wired: false },
  { id: "STAKE",      label: "Stakeholder",        wired: false },
  { id: "SDG",        label: "SDGs",               wired: false },
];

const areaColors = {
  E: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  S: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  G: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
};

const categoriaColors = {
  Clima:        "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  Energia:      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Acqua:        "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  Biodiversità: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Lavoro:       "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  Etica:        "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Compliance:   "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export default function Cataloghi() {
  const [tab, setTab] = useState("IRO");
  const [search, setSearch] = useState("");

  return (
    <div>
      <PageHeader
        title="Cataloghi"
        breadcrumbs={[{ label: "Cataloghi" }]}
        subtitle="Cataloghi di sistema — IRO, KPI Library e altri standard"
      />

      <div className="flex gap-0 border-b border-border mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSearch(""); }}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(tab === "IRO" || tab === "KPI") && (
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Cerca in ${TABS.find(t => t.id === tab)?.label ?? ""}…`}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {tab === "IRO" && <IROTable search={search} />}
        {tab === "KPI" && <KPITable search={search} />}
        {!["IRO", "KPI"].includes(tab) && (
          <ComingSoonTable label={TABS.find(t => t.id === tab)?.label ?? ""} />
        )}
      </div>
    </div>
  );
}

function IROTable({ search }) {
  const { data, isLoading, error } = useCatalogoIro();

  return (
    <DataGuard data={data} isLoading={isLoading} error={error}>
      <IROTableInner rows={data ?? []} search={search} />
    </DataGuard>
  );
}

function IROTableInner({ rows, search }) {
  const q = search.toLowerCase();
  const filtered = q
    ? rows.filter(r =>
        (r.codice ?? "").toLowerCase().includes(q) ||
        (r.tema ?? "").toLowerCase().includes(q) ||
        (r.categoria ?? "").toLowerCase().includes(q)
      )
    : rows;

  if (filtered.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Nessuna voce trovata
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {["Codice", "Tema", "Area", "Tipo", "Prospettiva", "Score impatto", "Score finanziario", "Categoria"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map(iro => (
            <tr key={iro.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-mono font-semibold">{iro.codice}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{iro.tema}</div>
                {iro.descrizione && (
                  <div className="text-muted-foreground text-[11px] mt-0.5 line-clamp-1 max-w-md">{iro.descrizione}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", areaColors[iro.area])}>
                  {iro.area}
                </span>
              </td>
              <td className="px-4 py-3 font-mono">{iro.tipo}</td>
              <td className="px-4 py-3 text-muted-foreground">{iro.prospettiva ?? "—"}</td>
              <td className="px-4 py-3 font-semibold tabular-nums">
                {iro.score_impatto != null ? Number(iro.score_impatto).toFixed(1) : "—"}
              </td>
              <td className="px-4 py-3 font-semibold tabular-nums">
                {iro.score_finanziario != null ? Number(iro.score_finanziario).toFixed(1) : "—"}
              </td>
              <td className="px-4 py-3">
                {iro.categoria && (
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                    categoriaColors[iro.categoria] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  )}>
                    {iro.categoria}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KPITable({ search }) {
  const { data, isLoading, error } = useKpiDefinizioni();

  return (
    <DataGuard data={data} isLoading={isLoading} error={error}>
      <KPITableInner rows={data ?? []} search={search} />
    </DataGuard>
  );
}

function KPITableInner({ rows, search }) {
  const q = search.toLowerCase();
  const filtered = q
    ? rows.filter(r =>
        (r.code ?? "").toLowerCase().includes(q) ||
        (r.label ?? "").toLowerCase().includes(q) ||
        (r.framework ?? "").toLowerCase().includes(q)
      )
    : rows;

  if (filtered.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Nessun KPI trovato
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {["Codice", "Label", "Area", "Unità", "Framework", "Descrizione"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {filtered.map(k => (
            <tr key={k.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-mono font-semibold">{k.code}</td>
              <td className="px-4 py-3 font-medium">{k.label}</td>
              <td className="px-4 py-3">
                <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", areaColors[k.area])}>
                  {k.area}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{k.unita ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{k.framework ?? "—"}</td>
              <td className="px-4 py-3 text-muted-foreground line-clamp-2 max-w-md">{k.descrizione ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComingSoonTable({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Database size={20} className="text-muted-foreground" />
      </div>
      <p className="text-sm font-medium mb-1">Catalogo {label}</p>
      <p className="text-xs text-muted-foreground max-w-xs">
        Questo catalogo sarà disponibile in una versione successiva. La struttura del DB
        non include ancora la tabella corrispondente.
      </p>
    </div>
  );
}
