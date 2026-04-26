import { CheckCircle2, Clock, Circle, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormData } from "@/hooks/useFormData";

const GATES = [
  {
    id: "G1",
    sett: "Sett. 2",
    deliverable: "Contratto firmato + FORM-01A/01B/01C firmati + Piano di Progetto approvato",
    responsabili: "CS ESG + PM + CEO cliente",
    sblocca: "Avvio formale PROC-02 (Materialità). Fatturazione prima tranche.",
  },
  {
    id: "G2",
    sett: "Sett. 7",
    deliverable: "Mappa di Materialità approvata dal CdA cliente (FORM-02E firmato)",
    responsabili: "CS ESG + PM + CdA cliente",
    sblocca: "Avvio formale PROC-03 (Gap Analysis). Avvio parallelo PROC-04 (Raccolta Dati) se concordato.",
  },
  {
    id: "G3",
    sett: "Sett. 13",
    deliverable: "Report di Diagnosi ESG approvato e firmato (FORM-03G)",
    responsabili: "CS ESG + PM + CEO cliente",
    sblocca: "Avvio formale PROC-04 (Raccolta Dati). Avvio parallelo PROC-05 (Piano Azione).",
  },
  {
    id: "G4",
    sett: "Sett. 17",
    deliverable: "Data Freeze dataset ESG — FORM-04F firmato dal cliente",
    responsabili: "CS ESG + Referente ESG cliente",
    sblocca: "Avvio PROC-06 sezioni dati (cap. 12 e capitoli tematici con KPI).",
  },
  {
    id: "G5",
    sett: "Sett. 17-18",
    deliverable: "Piano ESG approvato dal CdA — Verbale delibera firmato",
    responsabili: "CdA cliente",
    sblocca: "Completamento PROC-06 sezione Piano (cap. 10). Bilancio completo per revisioni.",
  },
  {
    id: "G6",
    sett: "Sett. 26",
    deliverable: "Bilancio approvato dal CdA e pubblicato — URL live + attestazione assurance",
    responsabili: "CdA cliente + CS ESG",
    sblocca: "Avvio PROC-07 (Chiusura). Progetto formalmente concluso.",
  },
];

const STATO_OPTIONS = ["Aperto", "In corso", "Completato", "A rischio"];

const statoStyle = {
  Aperto:     "bg-muted text-muted-foreground border-border",
  "In corso": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Completato: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
  "A rischio":"bg-destructive/10 text-destructive border-destructive/30",
};

const statoIcon = {
  Aperto:     Circle,
  "In corso": Clock,
  Completato: CheckCircle2,
  "A rischio": Flag,
};

export default function GateTracker({ engagementId }) {
  const { data: d, updateField } = useFormData(engagementId, "GATE");
  const stati = d?.stati ?? {};
  const date  = d?.date  ?? {};

  const completati = Object.values(stati).filter(v => v === "Completato").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">🚦 Gate Tracker — Milestone chiave del progetto ESG</p>
        <p className="text-xs text-muted-foreground">6 gate di controllo che sbloccano le fasi successive · Ogni gate richiede un deliverable firmato</p>
        <div className="flex items-center gap-2 mt-3">
          {GATES.map(g => {
            const s = stati[g.id] ?? "Aperto";
            const Icon = statoIcon[s];
            return (
              <div key={g.id} className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold", statoStyle[s])}>
                <Icon size={10} />
                {g.id}
              </div>
            );
          })}
          <span className="ml-auto text-xs text-muted-foreground">{completati}/6 completati</span>
        </div>
      </div>

      {/* Gate cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {GATES.map(g => {
          const stato = stati[g.id] ?? "Aperto";
          const Icon = statoIcon[stato];
          const isCompletato = stato === "Completato";
          const isRischio = stato === "A rischio";
          return (
            <div key={g.id} className={cn(
              "bg-card border rounded-xl p-5 transition-all",
              isCompletato && "border-green-500/30 bg-green-500/5",
              isRischio && "border-destructive/30 bg-destructive/5",
              !isCompletato && !isRischio && "border-border"
            )}>
              {/* Gate header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm", statoStyle[stato])}>
                    {g.id}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{g.sett}</p>
                    <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold mt-0.5", statoStyle[stato])}>
                      <Icon size={9} />
                      {stato}
                    </div>
                  </div>
                </div>
                <select
                  value={stato}
                  onChange={e => updateField("stati", { ...stati, [g.id]: e.target.value })}
                  className="border border-border rounded-md px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {STATO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Deliverable */}
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Deliverable</p>
                <p className="text-xs text-foreground leading-relaxed">{g.deliverable}</p>
              </div>

              {/* Responsabili */}
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Responsabili</p>
                <p className="text-xs text-muted-foreground">{g.responsabili}</p>
              </div>

              {/* Sblocca */}
              <div className="bg-muted/40 border border-border/60 rounded-lg px-3 py-2 mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Sblocca →</p>
                <p className="text-xs text-foreground">{g.sblocca}</p>
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Data prevista</p>
                  <input type="date"
                    value={date[g.id]?.prevista ?? ""}
                    onChange={e => updateField("date", { ...date, [g.id]: { ...(date[g.id] ?? {}), prevista: e.target.value } })}
                    className="w-full border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Data effettiva</p>
                  <input type="date"
                    value={date[g.id]?.effettiva ?? ""}
                    onChange={e => updateField("date", { ...date, [g.id]: { ...(date[g.id] ?? {}), effettiva: e.target.value } })}
                    className="w-full border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
