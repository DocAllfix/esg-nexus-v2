import { useParams } from "react-router-dom";
import { useState } from "react";
import { Folder, Download, FileText, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { downloadJson } from "@/lib/csvExport";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import DataGuard from "@/components/common/DataGuard";
import { cn } from "@/lib/utils";
import { useEngagement } from "@/hooks/useEngagements";
import { useRischi } from "@/hooks/useRischi";
import { useScadenze } from "@/hooks/useScadenze";
import TabProc00 from "@/components/engagement/TabProc00/index";
import TabProc01 from "@/components/engagement/TabProc01/index";
import TabProc02 from "@/components/engagement/TabProc02/index";
import TabProc03 from "@/components/engagement/TabProc03/index";
import TabProc04 from "@/components/engagement/TabProc04/index";
import TabProc05 from "@/components/engagement/TabProc05/index";
import TabProc06 from "@/components/engagement/TabProc06/index";
import TabProc07 from "@/components/engagement/TabProc07/index";

const TABS = ["Panoramica", "PROC-00", "PROC-01", "PROC-02", "PROC-03", "PROC-04", "PROC-05", "PROC-06", "PROC-07"];

const statoIcona = {
  completata:   CheckCircle2,
  in_corso:     Loader2,
  non_iniziata: Clock,
};

export default function DettaglioEngagement() {
  const { id } = useParams();
  const [tab, setTab] = useState("Panoramica");

  const { data: eng, isLoading, error } = useEngagement(id);
  const { data: rischi = [] } = useRischi(id);
  const { data: scadenze = [] } = useScadenze(id);

  return (
    <DataGuard data={eng} isLoading={isLoading} error={error}>
      <DettaglioContent
        id={id}
        eng={eng}
        rischi={rischi}
        scadenze={scadenze}
        tab={tab}
        setTab={setTab}
      />
    </DataGuard>
  );
}

function DettaglioContent({ id, eng, rischi, scadenze, tab, setTab }) {
  const clienteNome = eng?.clienti?.ragione_sociale ?? "—";
  const rischiAlti = rischi
    .filter(r => r.score >= 15 || r.score >= 12)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title={eng?.codice_progetto}
        breadcrumbs={[
          { label: "Engagement", to: "/engagements" },
          { label: eng?.codice_progetto },
        ]}
        subtitle={`${clienteNome} · Anno ${eng?.anno_rendicontazione}`}
        actions={
          <div className="flex items-center gap-2 print:hidden">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors">
              <Folder size={15} /> Cartella documenti
            </button>
            <button
              onClick={() => downloadJson(
                `engagement-${eng?.codice_progetto ?? id}`,
                { engagement: eng, rischi, scadenze, exportedAt: new Date().toISOString() }
              )}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
            >
              <Download size={15} /> Export dati
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <FileText size={15} /> Genera bilancio
            </button>
          </div>
        }
      />

      <div className="bg-card border border-border rounded-lg px-5 py-4 mb-4 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <StatusBadge status={eng?.stato} size="md" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Progresso globale:</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${eng?.progresso ?? 0}%` }} />
            </div>
            <span className="text-xs font-semibold">{eng?.progresso ?? 0}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Standard:</span>
          <StatusBadge status={eng?.standard} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
          <Clock size={13} />
          <span>Avvio {eng?.data_avvio ?? "—"}</span>
          <span>→</span>
          <span>Chiusura prevista {eng?.data_fine_prevista ?? "—"}</span>
        </div>
      </div>

      <div className="flex border-b border-border mb-6 gap-0 overflow-x-auto print:hidden">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Panoramica" && (
        <PanoramicaTab eng={eng} rischiAlti={rischiAlti} scadenze={scadenze} onTabChange={setTab} />
      )}
      {tab === "PROC-00" && <TabProc00 engagementId={id} />}
      {tab === "PROC-01" && <TabProc01 engagementId={id} />}
      {tab === "PROC-02" && <TabProc02 engagementId={id} />}
      {tab === "PROC-03" && <TabProc03 engagementId={id} />}
      {tab === "PROC-04" && <TabProc04 engagementId={id} />}
      {tab === "PROC-05" && <TabProc05 engagementId={id} />}
      {tab === "PROC-06" && <TabProc06 engagementId={id} />}
      {tab === "PROC-07" && <TabProc07 engagementId={id} />}
    </div>
  );
}

function PanoramicaTab({ eng, rischiAlti, scadenze, onTabChange }) {
  const fasi = eng?.engagement_fasi ?? [];
  const faseCorrente = fasi.find(f => f.stato === "in_corso")?.proc_code ?? "—";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Stato CRM</p>
          <StatusBadge status={eng?.stato} size="md" />
          <p className="text-xs text-muted-foreground mt-2">{faseCorrente} in corso</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Progresso</p>
          <p className="text-3xl font-semibold tabular-nums">{eng?.progresso ?? 0}<span className="text-lg">%</span></p>
          <p className="text-xs text-muted-foreground">completamento globale</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Fasi completate</p>
          <p className="text-3xl font-semibold tabular-nums">
            {fasi.filter(f => f.stato === "completata").length}
            <span className="text-lg text-muted-foreground">/{fasi.length || 8}</span>
          </p>
          <p className="text-xs text-muted-foreground">PROC-00 → PROC-07</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Rischi aperti alti</p>
          <p className={cn("text-3xl font-semibold tabular-nums", rischiAlti.length > 0 ? "text-red-600" : "text-green-700")}>
            {rischiAlti.length}
          </p>
          <p className="text-xs text-muted-foreground">score ≥ 12</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-sm font-semibold mb-4">Fasi del processo</h2>
        {fasi.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nessuna fase registrata</p>
        ) : (
          <div className="flex items-start gap-2 overflow-x-auto pb-2">
            {fasi.map((fase) => {
              const Icon = statoIcona[fase.stato] || Clock;
              const isCompleted = fase.stato === "completata";
              const isInCorso = fase.stato === "in_corso";
              return (
                <button
                  key={fase.proc_code}
                  onClick={() => onTabChange(fase.proc_code)}
                  className="flex flex-col items-center gap-2 min-w-[80px] group"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted ? "bg-primary border-primary" : isInCorso ? "bg-teal-50 border-primary" : "bg-muted border-border"
                  )}>
                    <Icon size={16} className={cn(
                      isCompleted ? "text-primary-foreground" : isInCorso ? "text-primary" : "text-muted-foreground",
                      isInCorso && "animate-spin"
                    )} />
                  </div>
                  <p className="text-xs font-medium text-center">{fase.label}</p>
                  <p className="text-xs text-muted-foreground">{fase.progresso ?? 0}%</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 pt-5 pb-3 border-b border-border">
            <h2 className="text-sm font-semibold">Rischi aperti (score ≥ 12)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Codice", "Descrizione", "Score", "Stato"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rischiAlti.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">Nessun rischio critico</td></tr>
                ) : rischiAlti.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-4 py-2.5 font-mono text-xs">{r.codice ?? "—"}</td>
                    <td className="px-4 py-2.5">{r.descrizione}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn("px-1.5 py-0.5 rounded font-bold",
                        r.score >= 20 ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                      )}>{r.score}</span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{r.stato}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold mb-4">Prossime scadenze</h2>
          <div className="space-y-3">
            {scadenze.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nessuna scadenza registrata</p>
            ) : scadenze.slice(0, 5).map((item) => {
              const urgente = item.priorita === "alta" || item.priorita === "critica";
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full shrink-0", urgente ? "bg-red-500" : "bg-muted-foreground")} />
                  <p className="text-sm flex-1">{item.titolo}</p>
                  <span className={cn("text-xs shrink-0", urgente ? "text-red-600 font-semibold" : "text-muted-foreground")}>
                    {item.data_scadenza}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
