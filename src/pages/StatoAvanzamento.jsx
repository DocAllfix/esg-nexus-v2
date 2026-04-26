import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2, Clock, Circle, ChevronRight, Search,
  Briefcase, LayoutGrid, CalendarDays, Milestone, FileSearch, Users2
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import DataGuard from "@/components/common/DataGuard";
import { cn } from "@/lib/utils";
import MarciaTable from "@/components/marcia/MarciaTable";
import GateTracker from "@/components/marcia/GateTracker";
import RaciMatrix from "@/components/marcia/RaciMatrix";
import EvidenzeView from "@/components/marcia/EvidenzeView";
import { supabase } from "@/api/supabaseClient";

const FASI = [
  { code: "PROC-00", label: "Acquisizione" },
  { code: "PROC-01", label: "Avvio" },
  { code: "PROC-02", label: "Materialità" },
  { code: "PROC-03", label: "Gap Analysis" },
  { code: "PROC-04", label: "Raccolta Dati" },
  { code: "PROC-05", label: "Piano ESG" },
  { code: "PROC-06", label: "Bilancio" },
  { code: "PROC-07", label: "Chiusura" },
];

function useEngagementsWithFasi() {
  return useQuery({
    queryKey: ["engagements_with_fasi"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engagements")
        .select("*, clienti(ragione_sociale), engagement_fasi(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

function getFaseStato(eng, faseCode) {
  const fase = eng.engagement_fasi?.find(f => f.proc_code === faseCode);
  if (!fase) return { stato: "non_iniziata", progresso: 0 };
  return { stato: fase.stato ?? "non_iniziata", progresso: fase.progresso ?? 0 };
}

function FaseCell({ stato, progresso, onClick }) {
  const isCompletata = stato === "completata";
  const isInCorso = stato === "in_corso";

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full h-10 rounded-lg border flex items-center justify-center transition-all hover:scale-105",
        isCompletata && "bg-green-500/10 border-green-500/25",
        isInCorso && "bg-primary/8 border-primary/25",
        !isCompletata && !isInCorso && "bg-transparent border-border/50"
      )}
    >
      {isCompletata && <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />}
      {isInCorso && (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-bold text-primary tabular-nums leading-none">{progresso}%</span>
          <div className="w-6 h-0.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${progresso}%` }} />
          </div>
        </div>
      )}
      {!isCompletata && !isInCorso && <Circle size={12} className="text-border" />}
    </button>
  );
}

const TABS = [
  { id: "matrix",   label: "Matrice avanzamento", icon: LayoutGrid },
  { id: "marcia",   label: "Tabella di Marcia",   icon: CalendarDays },
  { id: "gate",     label: "Gate Tracker",         icon: Milestone },
  { id: "evidenze", label: "Evidenze",             icon: FileSearch },
  { id: "raci",     label: "RACI",                 icon: Users2 },
];

export default function StatoAvanzamento() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matrix");
  const [search, setSearch] = useState("");
  const [selectedEngagementId, setSelectedEngagementId] = useState("");

  const { data: engagements = [], isLoading, error } = useEngagementsWithFasi();
  const effectiveEngId = selectedEngagementId || engagements[0]?.id || null;

  const totFasi    = engagements.length * FASI.length;
  const fasiFilled = engagements.reduce((acc, eng) =>
    acc + (eng.engagement_fasi?.filter(f => f.stato === "completata").length ?? 0), 0);
  const fasiInCorso = engagements.reduce((acc, eng) =>
    acc + (eng.engagement_fasi?.filter(f => f.stato === "in_corso").length ?? 0), 0);
  const pctGlobale = totFasi > 0 ? Math.round((fasiFilled / totFasi) * 100) : 0;

  const engFiltered = engagements.filter(eng => {
    const q = search.toLowerCase();
    return !q ||
      (eng.clienti?.ragione_sociale ?? "").toLowerCase().includes(q) ||
      (eng.codice_progetto ?? "").toLowerCase().includes(q);
  });

  return (
    <DataGuard data={engagements} isLoading={isLoading} error={error}>
      <div className="space-y-5">
        <PageHeader
          title="Tabella di Marcia ESG"
          subtitle="Governance di progetto — pianificazione incontri, gate, evidenze e RACI trasversale"
          breadcrumbs={[{ label: "Stato Avanzamento" }]}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Engagement monitorati", value: engagements.length, sub: `${engagements.filter(e => e.stato !== "BIL_PUBBLICATO").length} attivi`, icon: Briefcase, color: "text-primary bg-primary/10" },
            { label: "Fasi completate", value: fasiFilled, sub: `su ${totFasi} totali`, icon: CheckCircle2, color: "text-green-600 bg-green-500/10 dark:text-green-400" },
            { label: "Fasi in corso", value: fasiInCorso, sub: "attualmente attive", icon: Clock, color: "text-amber-600 bg-amber-500/10 dark:text-amber-400" },
            { label: "Completamento globale", value: `${pctGlobale}%`, sub: "portafoglio", icon: LayoutGrid, color: "text-primary bg-primary/10" },
          ].map(k => (
            <div key={k.label} className="bg-card border border-border rounded-xl px-4 py-4 flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", k.color)}>
                <k.icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold tabular-nums leading-none">{k.value}</p>
                <p className="text-xs font-medium text-foreground mt-0.5 truncate">{k.label}</p>
                <p className="text-[11px] text-muted-foreground">{k.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex border-b border-border gap-0 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                  activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}>
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        {activeTab === "matrix" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Cerca cliente o codice..."
                  className="pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring w-56"
                />
              </div>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> Completata</span>
                <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> In corso</span>
                <span className="flex items-center gap-1.5"><Circle size={12} className="text-border" /> Non iniziata</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-[11px] uppercase tracking-widest min-w-[210px]">
                        Engagement
                      </th>
                      {FASI.map(f => (
                        <th key={f.code} className="px-1 py-3.5 text-center min-w-[70px]">
                          <div className="font-mono font-bold text-[10px] text-foreground">{f.code.replace("PROC-", "P")}</div>
                          <div className="text-muted-foreground text-[9px] mt-0.5 whitespace-nowrap">{f.label}</div>
                        </th>
                      ))}
                      <th className="px-4 py-3.5 text-left font-semibold text-muted-foreground text-[11px] uppercase tracking-widest min-w-[130px]">
                        Avanzamento
                      </th>
                      <th className="px-3 py-3.5 text-center font-semibold text-muted-foreground text-[11px] uppercase tracking-widest">
                        Standard
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {engFiltered.map(eng => {
                      const fasiEng = FASI.map(f => ({ ...f, ...getFaseStato(eng, f.code) }));
                      const completate = fasiEng.filter(f => f.stato === "completata").length;
                      const pct = Math.round((completate / FASI.length) * 100);
                      const isChiuso = eng.stato === "BIL_PUBBLICATO";

                      return (
                        <tr key={eng.id} className={cn("transition-colors hover:bg-muted/20", isChiuso && "opacity-70")}>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => navigate(`/engagements/${eng.id}`)}
                              className="text-left group/btn flex items-center gap-2 w-full"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                    {(eng.codice_progetto ?? "").split("-").slice(0, 3).join("-")}
                                  </span>
                                  <StatusBadge status={eng.stato} />
                                </div>
                                <p className="font-semibold text-xs truncate max-w-[160px]">{eng.clienti?.ragione_sociale ?? "—"}</p>
                                <p className="text-muted-foreground text-[10px]">{eng.anno_rendicontazione}</p>
                              </div>
                              <ChevronRight size={12} className="text-muted-foreground shrink-0 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            </button>
                          </td>
                          {fasiEng.map(fase => (
                            <td key={fase.code} className="px-1 py-2">
                              <FaseCell
                                stato={fase.stato}
                                progresso={fase.progresso}
                                onClick={() => navigate(`/engagements/${eng.id}`)}
                              />
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs font-bold tabular-nums">{pct}%</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">{completate}/{FASI.length} fasi</p>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <StatusBadge status={eng.standard} />
                          </td>
                        </tr>
                      );
                    })}
                    {engFiltered.length === 0 && (
                      <tr>
                        <td colSpan={FASI.length + 3} className="text-center py-12 text-muted-foreground text-sm">
                          Nessun engagement trovato
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {["marcia", "gate", "evidenze"].includes(activeTab) && (
          <div className="flex items-center gap-3 pb-2">
            <span className="text-xs text-muted-foreground shrink-0">Engagement:</span>
            <select
              value={effectiveEngId ?? ""}
              onChange={e => setSelectedEngagementId(e.target.value)}
              className="border border-border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring max-w-xs"
            >
              {engagements.length === 0 && (
                <option value="">Nessun engagement disponibile</option>
              )}
              {engagements.map(eng => (
                <option key={eng.id} value={eng.id}>
                  {eng.codice_progetto ?? "—"} — {eng.clienti?.ragione_sociale ?? "—"}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === "marcia"   && <MarciaTable   engagementId={effectiveEngId} />}
        {activeTab === "gate"     && <GateTracker   engagementId={effectiveEngId} />}
        {activeTab === "evidenze" && <EvidenzeView  engagementId={effectiveEngId} />}
        {activeTab === "raci"     && <RaciMatrix />}
      </div>
    </DataGuard>
  );
}
