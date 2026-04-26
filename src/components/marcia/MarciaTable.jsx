import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFormData } from "@/hooks/useFormData";

// 35 sessioni di lavoro esatte dalla Tabella di Marcia originale
const SESSIONI = [
  { n: 1,  sett: "Sett. 1",    proc: "PROC-01 Avvio",         nome: "Kick-off Interno",                       tipo: "Interno",   cons: "CS ESG, PM",            cliente: "—",                                 gate: "—" },
  { n: 2,  sett: "Sett. 1",    proc: "PROC-01 Avvio",         nome: "Kick-off con il Cliente",                tipo: "Workshop",  cons: "CS ESG, PM",            cliente: "CEO, CFO, Ref. ESG, HR, Operations", gate: "—" },
  { n: 3,  sett: "Sett. 1-2",  proc: "PROC-01 Avvio",         nome: "Setup Operativo e Piattaforme",          tipo: "Interno",   cons: "PM",                    cliente: "Ref. ESG, IT",                       gate: "—" },
  { n: 4,  sett: "Sett. 2",    proc: "PROC-01 Avvio",         nome: "Definizione Perimetro e Standard",       tipo: "Workshop",  cons: "CS ESG, PM",            cliente: "CEO, CFO, Legale",                   gate: "G1" },
  { n: 5,  sett: "Sett. 2-3",  proc: "PROC-01 Avvio",         nome: "Risk Register e Piano di Progetto",      tipo: "Interno",   cons: "CS ESG, PM",            cliente: "—",                                 gate: "—" },
  { n: 6,  sett: "Sett. 3-4",  proc: "PROC-02 Materialità",   nome: "Benchmark Settoriale e Mappatura Stakeholder", tipo: "Interno", cons: "CS ESG, Analista Senior", cliente: "—",                          gate: "—" },
  { n: 7,  sett: "Sett. 4",    proc: "PROC-02 Materialità",   nome: "Workshop Inventario IRO",                tipo: "Workshop",  cons: "CS ESG, Analista Senior", cliente: "CEO, CFO, HR, Operations, Legale", gate: "—" },
  { n: 8,  sett: "Sett. 4-6",  proc: "PROC-02 Materialità",   nome: "Engagement Stakeholder (survey)",        tipo: "Interno",   cons: "PM, Analista",          cliente: "Sustainability Manager",             gate: "—" },
  { n: 9,  sett: "Sett. 6",    proc: "PROC-02 Materialità",   nome: "Analisi Risultati Survey",               tipo: "Interno",   cons: "CS ESG, Analista Senior", cliente: "—",                              gate: "—" },
  { n: 10, sett: "Sett. 7",    proc: "PROC-02 Materialità",   nome: "Workshop Validazione Mappa Materialità", tipo: "Workshop",  cons: "CS ESG, PM",            cliente: "CEO, CdA (almeno 3 cons.), HR, Ops", gate: "G2" },
  { n: 11, sett: "Sett. 7-8",  proc: "PROC-03 Gap Analysis",  nome: "Audit Documentale E (Ambiente)",         tipo: "Interno",   cons: "Analista ESG (E)",      cliente: "Operations, EHS Manager",            gate: "—" },
  { n: 12, sett: "Sett. 7-8",  proc: "PROC-03 Gap Analysis",  nome: "Audit Documentale S (Sociale)",          tipo: "Interno",   cons: "Analista ESG (S)",      cliente: "HR, Legale",                         gate: "—" },
  { n: 13, sett: "Sett. 7-8",  proc: "PROC-03 Gap Analysis",  nome: "Audit Documentale G (Governance)",       tipo: "Interno",   cons: "Analista ESG (G)",      cliente: "CFO, Legale, Segreteria CdA",        gate: "—" },
  { n: 14, sett: "Sett. 8-9",  proc: "PROC-03 Gap Analysis",  nome: "Interviste Gap Analysis",                tipo: "Interno",   cons: "CS ESG, PM",            cliente: "CEO, CFO, HR, Operations, Legale",   gate: "—" },
  { n: 15, sett: "Sett. 9",    proc: "PROC-03 Gap Analysis",  nome: "Presentazione Report Gap Analysis",      tipo: "Workshop",  cons: "CS ESG, PM",            cliente: "CEO, CFO, HR, Operations",           gate: "—" },
  { n: 16, sett: "Sett. 9-10", proc: "PROC-03 Gap Analysis",  nome: "Condivisione Diagnosi con CdA",          tipo: "Workshop",  cons: "CS ESG",                cliente: "CdA completo",                       gate: "G3" },
  { n: 17, sett: "Sett. 9-10", proc: "PROC-04 Raccolta Dati", nome: "Piano Raccolta Dati e Template",         tipo: "Interno",   cons: "CS ESG, PM, Analisti",  cliente: "Ref. ESG",                           gate: "—" },
  { n: 18, sett: "Sett. 10-11",proc: "PROC-04 Raccolta Dati", nome: "Raccolta Dati Ambientali (E)",           tipo: "Interno",   cons: "Analista (E)",          cliente: "Operations, EHS",                    gate: "—" },
  { n: 19, sett: "Sett. 10-11",proc: "PROC-04 Raccolta Dati", nome: "Raccolta Dati Sociali (S)",              tipo: "Interno",   cons: "Analista (S)",          cliente: "HR",                                 gate: "—" },
  { n: 20, sett: "Sett. 10-11",proc: "PROC-04 Raccolta Dati", nome: "Raccolta Dati Governance (G)",           tipo: "Interno",   cons: "Analista (G)",          cliente: "CFO, Legale, Segreteria CdA",        gate: "—" },
  { n: 21, sett: "Sett. 11",   proc: "PROC-04 Raccolta Dati", nome: "Calcolo GHG e Impronta Carbonio",        tipo: "Interno",   cons: "CS ESG, Analista (E)",  cliente: "—",                                  gate: "—" },
  { n: 22, sett: "Sett. 11-12",proc: "PROC-04 Raccolta Dati", nome: "Validazione Dati con Cliente",           tipo: "Workshop",  cons: "CS ESG, PM",            cliente: "Ref. ESG, CFO",                      gate: "—" },
  { n: 23, sett: "Sett. 12-13",proc: "PROC-04 Raccolta Dati", nome: "Freeze Dataset e Accettazione",          tipo: "Consegna",  cons: "CS ESG, PM",            cliente: "Ref. ESG, CEO",                      gate: "G4" },
  { n: 24, sett: "Sett. 10-12",proc: "PROC-05 Piano ESG",     nome: "Definizione Roadmap Strategica",         tipo: "Interno",   cons: "CS ESG, PM",            cliente: "—",                                  gate: "—" },
  { n: 25, sett: "Sett. 12-13",proc: "PROC-05 Piano ESG",     nome: "Workshop Roadmap con Management",        tipo: "Workshop",  cons: "CS ESG, PM",            cliente: "CEO, CFO, HR, Operations",           gate: "—" },
  { n: 26, sett: "Sett. 14",   proc: "PROC-05 Piano ESG",     nome: "Approvazione Piano ESG — CdA",           tipo: "Workshop",  cons: "CS ESG",                cliente: "CdA completo",                       gate: "G5" },
  { n: 27, sett: "Sett. 12-14",proc: "PROC-06 Bilancio",      nome: "Redazione Bozza R1",                     tipo: "Interno",   cons: "CS ESG, PM, Analisti",  cliente: "—",                                  gate: "—" },
  { n: 28, sett: "Sett. 15-16",proc: "PROC-06 Bilancio",      nome: "Revisione R1 con Cliente",               tipo: "Consegna",  cons: "CS ESG, PM",            cliente: "CEO, Ref. ESG, CFO",                 gate: "—" },
  { n: 29, sett: "Sett. 16-17",proc: "PROC-06 Bilancio",      nome: "Revisione R2 — Feedback e Modifiche",    tipo: "Interno",   cons: "CS ESG, PM, Analisti",  cliente: "—",                                  gate: "—" },
  { n: 30, sett: "Sett. 17",   proc: "PROC-06 Bilancio",      nome: "Revisione R2 con Cliente",               tipo: "Consegna",  cons: "CS ESG, PM",            cliente: "CEO, Ref. ESG, CFO",                 gate: "—" },
  { n: 31, sett: "Sett. 18-19",proc: "PROC-06 Bilancio",      nome: "Revisione R3 — Seconda Tornata",         tipo: "Interno",   cons: "CS ESG, PM",            cliente: "—",                                  gate: "—" },
  { n: 32, sett: "Sett. 19-20",proc: "PROC-06 Bilancio",      nome: "Revisione R3 con Cliente",               tipo: "Consegna",  cons: "CS ESG, PM",            cliente: "CEO, Ref. ESG",                      gate: "—" },
  { n: 33, sett: "Sett. 20-23",proc: "PROC-06 Bilancio",      nome: "Revisione R4 Definitiva + GRI Index",    tipo: "Interno",   cons: "CS ESG, PM",            cliente: "—",                                  gate: "—" },
  { n: 34, sett: "Sett. 24-26",proc: "PROC-06 Bilancio",      nome: "Assurance Esterna (limited)",            tipo: "Validazione",cons: "CS ESG (supporto)",    cliente: "Verificatore indipendente",          gate: "—" },
  { n: 35, sett: "Sett. 26",   proc: "PROC-06 Bilancio",      nome: "Approvazione CdA e Pubblicazione",       tipo: "Consegna",  cons: "CS ESG, PM, Comunicatore", cliente: "CEO, CdA, Marketing",             gate: "G6" },
];

const TIPO_BADGE = {
  Workshop:   "bg-primary/10 text-primary border-primary/20",
  Interno:    "bg-muted text-muted-foreground border-border",
  Consegna:   "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  Validazione:"bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const PROC_COLOR = {
  "PROC-01 Avvio":          "text-teal-600 dark:text-teal-400",
  "PROC-02 Materialità":    "text-amber-600 dark:text-amber-400",
  "PROC-03 Gap Analysis":   "text-blue-600 dark:text-blue-400",
  "PROC-04 Raccolta Dati":  "text-purple-600 dark:text-purple-400",
  "PROC-05 Piano ESG":      "text-teal-600 dark:text-teal-400",
  "PROC-06 Bilancio":       "text-orange-600 dark:text-orange-400",
};

const STATO_OPTIONS = ["Aperto", "In corso", "Completato", "Rimandato"];

export default function MarciaTable({ engagementId }) {
  const { data: d, updateField } = useFormData(engagementId, "MARCIA");
  const stati = d?.stati ?? {};
  const date  = d?.date  ?? {};

  const [filterProc, setFilterProc] = useState("tutti");

  const procOptions = ["tutti", ...new Set(SESSIONI.map(s => s.proc))];
  const filtered = filterProc === "tutti" ? SESSIONI : SESSIONI.filter(s => s.proc === filterProc);

  const completate = Object.values(stati).filter(v => v === "Completato").length;
  const inCorso    = Object.values(stati).filter(v => v === "In corso").length;

  return (
    <div className="space-y-4">
      {/* Intestazione */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">SISTEMA DI GESTIONE ESG — TABELLA DI MARCIA DEL PROGETTO</p>
        <p className="text-xs text-muted-foreground">Pianificazione incontri, contenuti, evidenze e output per ogni settimana del ciclo ESG completo · Compilare le date nella colonna DATA prima del kick-off</p>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <span><span className="font-bold text-foreground">{completate}</span> <span className="text-muted-foreground">completate</span></span>
          <span><span className="font-bold text-amber-600">{inCorso}</span> <span className="text-muted-foreground">in corso</span></span>
          <span><span className="font-bold text-muted-foreground">{SESSIONI.length - completate - inCorso}</span> <span className="text-muted-foreground">aperte</span></span>
        </div>
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Filtra per processo:</span>
        {procOptions.map(p => (
          <button key={p} onClick={() => setFilterProc(p)}
            className={cn("px-2.5 py-1 text-xs rounded-md border transition-colors",
              filterProc === p ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
            )}>
            {p === "tutti" ? "Tutti" : p.replace(/^PROC-\d+ /, "")}
          </button>
        ))}
      </div>

      {/* Tabella */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-3 text-center font-semibold text-muted-foreground uppercase tracking-widest text-[10px] w-8">#</th>
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px] whitespace-nowrap">Settimana</th>
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px] whitespace-nowrap">Data</th>
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px] whitespace-nowrap min-w-[120px]">Fase / Procedura</th>
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px] min-w-[200px]">Incontro / Attività</th>
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">Tipo</th>
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px] whitespace-nowrap">Consulenza</th>
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px] min-w-[160px]">Partecipanti cliente</th>
                <th className="px-3 py-3 text-center font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">Gate</th>
                <th className="px-3 py-3 text-left font-semibold text-muted-foreground uppercase tracking-widest text-[10px] min-w-[110px]">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(s => {
                const stato = stati[s.n] ?? "Aperto";
                const isCompletato = stato === "Completato";
                const isInCorso = stato === "In corso";
                return (
                  <tr key={s.n} className={cn("hover:bg-muted/20 transition-colors",
                    isCompletato && "opacity-60",
                  )}>
                    <td className="px-3 py-2.5 text-center">
                      <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{s.n}</span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{s.sett}</td>

                    <td className="px-3 py-2.5">
                      <input
                        type="date"
                        value={date[s.n] ?? ""}
                        onChange={e => updateField("date", { ...date, [s.n]: e.target.value })}
                        className="border border-border rounded px-1.5 py-0.5 text-[10px] bg-background focus:outline-none focus:ring-1 focus:ring-ring w-[110px]"
                      />
                    </td>
                    <td className={cn("px-3 py-2.5 font-medium whitespace-nowrap text-[10px]", PROC_COLOR[s.proc] || "text-foreground")}>
                      {s.proc}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground">{s.nome}</td>
                    <td className="px-3 py-2.5">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold whitespace-nowrap", TIPO_BADGE[s.tipo] || TIPO_BADGE.Interno)}>
                        {s.tipo}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground text-[11px]">{s.cons}</td>
                    <td className="px-3 py-2.5 text-muted-foreground text-[11px]">{s.cliente}</td>
                    <td className="px-3 py-2.5 text-center">
                      {s.gate !== "—" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20 text-[10px] font-bold whitespace-nowrap">
                          {s.gate}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        value={stato}
                        onChange={e => updateField("stati", { ...stati, [s.n]: e.target.value })}
                        className={cn(
                          "border rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer",
                          isCompletato ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400" :
                          isInCorso ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400" :
                          "bg-background border-border text-muted-foreground"
                        )}
                      >
                        {STATO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}