import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Folder, Download, FileText, AlertOctagon,
  CheckCircle2, Clock, Loader2, AlertTriangle
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import ProgressRing from "@/components/common/ProgressRing";
import DataGuard from "@/components/common/DataGuard";
import { cn } from "@/lib/utils";
import TabProc00 from "@/components/engagement/TabProc00/index";
import TabProc01 from "@/components/engagement/TabProc01/index";
import TabProc02 from "@/components/engagement/TabProc02/index";
import TabProc03 from "@/components/engagement/TabProc03/index";
import TabProc04 from "@/components/engagement/TabProc04/index";
import TabProc05 from "@/components/engagement/TabProc05/index";
import TabProc06 from "@/components/engagement/TabProc06/index";
import TabProc07 from "@/components/engagement/TabProc07/index";

// TODO: Replace with Supabase hook
const engagements = [];
const rischi = [];

const TABS = ["Panoramica", "PROC-00", "PROC-01", "PROC-02", "PROC-03", "PROC-04", "PROC-05", "PROC-06", "PROC-07"];

const statoIcona = {
  completata: CheckCircle2,
  in_corso: Loader2,
  non_iniziata: Clock,
};

export default function DettaglioEngagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Panoramica");

  const eng = engagements.find(e => e.id === id);

  if (!eng) return <DataGuard data={null} />;

  const rischiEng = rischi.filter(r => r.classe === "CRITICO" || r.classe === "ALTO").slice(0, 5);

  return (
    <div>
      <PageHeader
        title={eng.project_code}
        breadcrumbs={[
          { label: "Engagement", to: "/engagements" },
          { label: eng.project_code }
        ]}
        subtitle={`${eng.cliente_nome} · Anno ${eng.anno} · ${eng.responsabile}`}
        actions={
          <>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors">
              <Folder size={15} /> Cartella documenti
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors">
              <Download size={15} /> Export dati
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <FileText size={15} /> Genera bilancio
            </button>
          </>
        }
      />

      {/* Header engagement info */}
      <div className="bg-card border border-border rounded-lg px-5 py-4 mb-4 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <StatusBadge status={eng.stato} size="md" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Progresso globale:</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${eng.progress}%` }} />
            </div>
            <span className="text-xs font-semibold">{eng.progress}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Standard:</span>
          <StatusBadge status={eng.standard} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
          <Clock size={13} />
          <span>Avvio {eng.data_avvio}</span>
          <span>→</span>
          <span>Chiusura prevista {eng.data_chiusura_prevista}</span>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-border mb-6 gap-0 overflow-x-auto">
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

      {/* Contenuto tab */}
      {tab === "Panoramica" && (
        <PanoramicaTab eng={eng} rischiEng={rischiEng} onTabChange={setTab} />
      )}
      {tab === "PROC-00" && <TabProc00 eng={eng} />}
      {tab === "PROC-01" && <TabProc01 eng={eng} />}
      {tab === "PROC-02" && <TabProc02 eng={eng} />}
      {tab === "PROC-03" && <TabProc03 eng={eng} />}
      {tab === "PROC-04" && <TabProc04 eng={eng} />}
      {tab === "PROC-05" && <TabProc05 eng={eng} />}
      {tab === "PROC-06" && <TabProc06 eng={eng} />}
      {tab === "PROC-07" && <TabProc07 eng={eng} />}
    </div>
  );
}

function PanoramicaTab({ eng, rischiEng, onTabChange }) {
  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Stato CRM</p>
          <StatusBadge status={eng.stato} size="md" />
          <p className="text-xs text-muted-foreground mt-2">{eng.proc_corrente} in corso</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">GHG Totale (MB)</p>
          <p className="text-3xl font-semibold tabular-nums">{eng.kpi?.ghg_totale || "—"}</p>
          <p className="text-xs text-muted-foreground">tCO₂e</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Temi materiali</p>
          <p className="text-3xl font-semibold tabular-nums">{eng.kpi?.temi_materiali || "—"}</p>
          <p className="text-xs text-muted-foreground">di {eng.kpi?.temi_totali || 24} IRO valutati</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Gap critici</p>
          <p className={cn("text-3xl font-semibold tabular-nums", (eng.kpi?.gap_critici || 0) > 0 ? "text-red-600" : "text-green-700")}>
            {eng.kpi?.gap_critici ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">gap aperti</p>
        </div>
      </div>

      {/* Fasi del processo */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-sm font-semibold mb-4">Fasi del processo</h2>
        <div className="flex items-start gap-2 overflow-x-auto pb-2">
          {eng.fasi?.map((fase, i) => {
            const Icon = statoIcona[fase.stato] || Clock;
            const isCompleted = fase.stato === "completata";
            const isInCorso = fase.stato === "in_corso";
            return (
              <button
                key={fase.code}
                onClick={() => onTabChange(fase.code)}
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
                <p className="text-xs font-medium text-center">{fase.nome}</p>
                <p className="text-xs text-muted-foreground">{fase.progress}%</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rischi + Scadenze */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 pt-5 pb-3 border-b border-border">
            <h2 className="text-sm font-semibold">Rischi aperti (Critici/Alti)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Codice", "Descrizione", "Punteggio", "Owner"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rischiEng.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-4 py-2.5 font-mono">{r.id}</td>
                    <td className="px-4 py-2.5">{r.descrizione}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn("px-1.5 py-0.5 rounded font-bold",
                        r.classe === "CRITICO" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                      )}>{r.punteggio}</span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{r.owner?.split(" ")[1] || r.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold mb-4">Prossime scadenze</h2>
          <div className="space-y-3">
            {[
              { desc: "Raccolta KPI energia", data: "02 mag 2025", urgente: true },
              { desc: "Revisione capitolo 6 bilancio", data: "10 mag 2025", urgente: false },
              { desc: "Follow-up fornitori chiave", data: "15 mag 2025", urgente: false },
              { desc: "Workshop CdA materialità", data: "20 mag 2025", urgente: false },
              { desc: "Deadline freeze dataset", data: "31 mag 2025", urgente: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full shrink-0", item.urgente ? "bg-red-500" : "bg-muted-foreground")} />
                <p className="text-sm flex-1">{item.desc}</p>
                <span className={cn("text-xs shrink-0", item.urgente ? "text-red-600 font-semibold" : "text-muted-foreground")}>{item.data}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
