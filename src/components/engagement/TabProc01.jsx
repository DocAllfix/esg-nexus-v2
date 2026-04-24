import { useState } from "react";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/common/StatusBadge";
import { CheckCircle2, Clock, Circle, AlertOctagon, AlertTriangle, AlertCircle } from "lucide-react";

// TODO: Replace with Supabase hook
const rischi = [];

const SOTTOFASI = [
  { id: "01A", nome: "Contratto", stato: "completata" },
  { id: "01B", nome: "Team e kickoff", stato: "completata" },
  { id: "01C", nome: "Setup Drive", stato: "completata" },
  { id: "01D", nome: "Gantt progetto", stato: "completata" },
  { id: "01E", nome: "Kickoff meeting", stato: "completata" },
  { id: "01F", nome: "Piano comunicazione", stato: "completata" },
  { id: "01G", nome: "Risk Register", stato: "completata" },
  { id: "LOG-01", nome: "Log chiusura", stato: "completata" },
];

const statoIcon = { completata: CheckCircle2, in_corso: Clock, non_iniziata: Circle };

export default function TabProc01({ eng }) {
  const [faseSel, setFaseSel] = useState("01G");

  return (
    <div className="flex gap-4 min-h-[600px]">
      <div className="w-60 shrink-0 bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PROC-01 · Avvio rapporto</p>
        </div>
        <div className="divide-y divide-border">
          {SOTTOFASI.map(f => {
            const Icon = statoIcon[f.stato];
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
        {faseSel === "01A" && <FaseContratto />}
        {faseSel === "01G" && <RiskRegister />}
        {faseSel === "01B" && <RACIMatrix />}
        {!["01A", "01G", "01B"].includes(faseSel) && (
          <div className="p-6">
            <p className="text-xs font-mono text-muted-foreground mb-1">{faseSel}</p>
            <h2 className="text-base font-semibold mb-4">{SOTTOFASI.find(f => f.id === faseSel)?.nome}</h2>
            <p className="text-sm text-muted-foreground">Form e documenti per questa fase.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FaseContratto() {
  const clausole = [
    "Oggetto della prestazione definito in modo specifico", "Corrispettivo determinato", "Modalità di pagamento definite",
    "Riservatezza e trattamento dati (GDPR)", "Proprietà intellettuale dei deliverable", "Responsabilità del consulente",
    "Obblighi del cliente (accesso ai dati)", "Clausola di recesso", "Foro competente", "Firma digitale o cartacea",
    "Allegato A — Descrizione servizi", "Allegato B — Piano di progetto"
  ];
  const [checked, setChecked] = useState(clausole.reduce((acc, c) => ({ ...acc, [c]: true }), {}));
  const [importo] = useState(25000);
  const iva = importo * 0.22;
  const totale = importo + iva;
  const allOk = Object.values(checked).every(Boolean);

  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div><p className="text-xs font-mono text-muted-foreground">01A</p><h2 className="text-base font-semibold">Contratto</h2></div>
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Salva</button>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Clausole obbligatorie</h3>
          <div className="space-y-2">
            {clausole.map(cl => (
              <label key={cl} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={checked[cl]} onChange={e => setChecked(prev => ({ ...prev, [cl]: e.target.checked }))} className="accent-primary" />
                {cl}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Importi</h3>
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm"><span>Importo netto</span><span className="font-semibold">€ {importo.toLocaleString("it-IT")}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground"><span>IVA 22%</span><span>€ {iva.toLocaleString("it-IT")}</span></div>
            <div className="flex justify-between text-sm font-bold border-t border-border pt-2"><span>Totale</span><span>€ {totale.toLocaleString("it-IT")}</span></div>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Validazione contratto</h3>
            {allOk ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-lg">
                <CheckCircle2 size={16} /><span className="text-sm font-medium">Contratto valido — tutte le clausole verificate</span>
              </div>
            ) : (
              <div className="text-red-700 bg-red-50 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium mb-2">Clausole mancanti:</p>
                <ul className="text-xs list-disc list-inside space-y-1">
                  {clausole.filter(c => !checked[c]).map(c => <li key={c}>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RACIMatrix() {
  const task = ["Avvio progetto e kickoff", "Raccolta documenti cliente", "Analisi materialità", "Distribuzione questionari", "Gap analysis", "Calcolo GHG", "Raccolta KPI", "Stesura bilancio", "Revisione bozza", "Approvazione CdA", "Pubblicazione"];
  const ruoli = ["Cons. Senior", "Analista", "Sust. Mgr", "CEO", "CFO"];
  const [raci, setRaci] = useState({});
  const get = (t, r) => raci[`${t}-${r}`] || "";
  const set_ = (t, r, v) => setRaci(prev => ({ ...prev, [`${t}-${r}`]: v }));
  const raciColors = { R: "bg-blue-100 text-blue-800", A: "bg-primary/20 text-primary", C: "bg-purple-100 text-purple-800", I: "bg-gray-100 text-gray-700", "": "" };

  return (
    <div className="p-6 overflow-auto">
      <p className="text-xs font-mono text-muted-foreground mb-1">01B</p>
      <h2 className="text-base font-semibold mb-4">Team e RACI Matrix</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 bg-muted/40 border border-border">Task</th>
              {ruoli.map(r => <th key={r} className="px-3 py-2 bg-muted/40 border border-border text-center">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {task.map(t => (
              <tr key={t}>
                <td className="px-3 py-2 border border-border text-sm">{t}</td>
                {ruoli.map(r => (
                  <td key={r} className="px-2 py-1 border border-border text-center">
                    <select
                      value={get(t, r)}
                      onChange={e => set_(t, r, e.target.value)}
                      className={cn("w-full text-center text-xs rounded px-1 py-1 border-0 outline-none cursor-pointer font-bold", raciColors[get(t, r)])}
                    >
                      {["", "R", "A", "C", "I"].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-3">R = Responsible · A = Accountable · C = Consulted · I = Informed</p>
    </div>
  );
}

function RiskRegister() {
  const classeIcons = { CRITICO: AlertOctagon, ALTO: AlertTriangle, MEDIO: AlertCircle };
  const classeColors = { CRITICO: "text-red-600", ALTO: "text-orange-600", MEDIO: "text-yellow-600", BASSO: "text-lime-600" };

  return (
    <div className="p-6 overflow-auto">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div><p className="text-xs font-mono text-muted-foreground">01G</p><h2 className="text-base font-semibold">Risk Register</h2></div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tabella */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Cod.", "Descrizione", "P", "I", "Score", "Classe", "Stato"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rischi.map(r => {
                const Icon = classeIcons[r.classe];
                return (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono">{r.id}</td>
                    <td className="px-3 py-2 max-w-[180px] truncate">{r.descrizione}</td>
                    <td className="px-3 py-2 text-center">{r.probabilita}</td>
                    <td className="px-3 py-2 text-center">{r.impatto}</td>
                    <td className="px-3 py-2 text-center font-bold">{r.punteggio}</td>
                    <td className="px-3 py-2">
                      <span className={cn("flex items-center gap-1 font-semibold", classeColors[r.classe])}>
                        {Icon && <Icon size={12} />} {r.classe}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={r.stato === "Aperto" ? "ALTO" : r.stato === "In gestione" ? "in_corso" : "completata"} label={r.stato} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Heatmap 5x5 */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Heatmap P × I</h3>
          <div className="relative">
            <div className="grid grid-cols-5 gap-1">
              {[5, 4, 3, 2, 1].map(prob => (
                [1, 2, 3, 4, 5].map(imp => {
                  const score = prob * imp;
                  const rischiInCella = rischi.filter(r => r.probabilita === prob && r.impatto === imp);
                  const cellColor = score >= 15 ? "bg-red-200" : score >= 9 ? "bg-orange-200" : score >= 6 ? "bg-yellow-200" : "bg-green-200";
                  return (
                    <div key={`${prob}-${imp}`} className={cn("h-14 rounded flex items-center justify-center relative", cellColor)}>
                      {rischiInCella.map(r => (
                        <div key={r.id} className="absolute flex items-center justify-center" title={r.descrizione}>
                          <span className="text-xs font-mono font-bold bg-white/80 px-1 rounded">{r.id}</span>
                        </div>
                      ))}
                      {rischiInCella.length === 0 && <span className="text-xs text-muted-foreground opacity-50">{score}</span>}
                    </div>
                  );
                })
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              {["P1", "P2", "P3", "P4", "P5"].map(l => <span key={l}>{l}</span>)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Asse X = Impatto · Asse Y = Probabilità (5→1)</p>
          </div>
        </div>
      </div>
    </div>
  );
}