import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

const SOTTOFASI = [
  { id: "07A", nome: "Report finale e dossier", stato: "completata" },
  { id: "07B", nome: "Soddisfazione e NPS", stato: "completata" },
  { id: "07C", nome: "Proposta rinnovo", stato: "completata" },
  { id: "07D", nome: "Follow-up 30 gg", stato: "completata" },
  { id: "07E", nome: "Archiviazione", stato: "completata" },
  { id: "07F", nome: "Lesson learned", stato: "completata" },
  { id: "07G", nome: "Chiusura formale", stato: "completata" },
];

const serviziRinnovo = [
  { id: "s1", nome: "Aggiornamento bilancio GRI", obbligatorio: true, prezzo: 8000, selezionato: true },
  { id: "s2", nome: "Reporting CSRD/ESRS", obbligatorio: true, prezzo: 6000, selezionato: true },
  { id: "s3", nome: "Monitoraggio KPI annuale", obbligatorio: true, prezzo: 4000, selezionato: true },
  { id: "s4", nome: "Gap Analysis aggiornamento", obbligatorio: false, prezzo: 5000, selezionato: false },
  { id: "s5", nome: "GHG Inventory aggiornamento", obbligatorio: false, prezzo: 3500, selezionato: true },
  { id: "s6", nome: "Stakeholder engagement", obbligatorio: false, prezzo: 2500, selezionato: false },
  { id: "s7", nome: "Piano azione revisione", obbligatorio: false, prezzo: 3000, selezionato: false },
  { id: "s8", nome: "Comunicazione ESG", obbligatorio: false, prezzo: 4500, selezionato: true },
  { id: "s9", nome: "Training management", obbligatorio: false, prezzo: 2000, selezionato: false },
  { id: "s10", nome: "Supporto assurance", obbligatorio: false, prezzo: 6000, selezionato: false },
];

export default function TabProc07({ eng }) {
  const [faseSel, setFaseSel] = useState("07B");

  return (
    <div className="flex gap-4 min-h-[600px]">
      <div className="w-60 shrink-0 bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PROC-07 · Chiusura</p>
        </div>
        <div className="divide-y divide-border">
          {SOTTOFASI.map(f => (
            <button key={f.id} onClick={() => setFaseSel(f.id)} className={cn("w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors", faseSel === f.id && "bg-primary/5 border-l-2 border-primary")}>
              <CheckCircle2 size={15} className="text-primary" />
              <div><p className="text-xs font-mono text-muted-foreground">{f.id}</p><p className="text-sm">{f.nome}</p></div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
        {faseSel === "07B" && <NPSSurvey />}
        {faseSel === "07C" && <PropostaRinnovo />}
        {!["07B", "07C"].includes(faseSel) && (
          <div className="p-6"><p className="text-xs font-mono text-muted-foreground mb-1">{faseSel}</p><h2 className="text-base font-semibold">{SOTTOFASI.find(f => f.id === faseSel)?.nome}</h2></div>
        )}
      </div>
    </div>
  );
}

function NPSSurvey() {
  const [nps, setNps] = useState(9);

  const categoria = nps >= 9 ? "PROMOTORE" : nps >= 7 ? "PASSIVO" : "DETRATTORE";
  const categoriaColor = nps >= 9 ? "text-green-700 bg-green-100" : nps >= 7 ? "text-amber-700 bg-amber-100" : "text-red-700 bg-red-100";

  return (
    <div className="p-6 overflow-y-auto">
      <p className="text-xs font-mono text-muted-foreground mb-1">07B</p>
      <h2 className="text-base font-semibold mb-6">Soddisfazione cliente e NPS</h2>

      {/* NPS */}
      <div className="bg-muted/20 rounded-xl p-6 mb-6">
        <p className="text-sm font-medium mb-4 text-center">Da 0 a 10, quanto consiglieresti il nostro studio a un collega?</p>
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setNps(i)}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-bold transition-all",
                nps === i ? "bg-primary text-primary-foreground scale-110 shadow-md" :
                i <= 6 ? "bg-red-100 text-red-800 hover:bg-red-200" :
                i <= 8 ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                "bg-green-100 text-green-800 hover:bg-green-200"
              )}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl font-bold">{nps}</span>
          <span className={cn("px-4 py-2 rounded-lg font-semibold", categoriaColor)}>{categoria}</span>
        </div>
      </div>

      {/* Domande soddisfazione */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Valutazione soddisfazione</h3>
        {[
          { label: "Qualità tecnica del lavoro svolto", val: 5 },
          { label: "Rispetto delle scadenze", val: 4 },
          { label: "Comunicazione e aggiornamenti", val: 5 },
          { label: "Supporto nella raccolta dati", val: 4 },
          { label: "Valore aggiunto percepito", val: 5 },
          { label: "Disponibilità del team", val: 5 },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <p className="text-sm flex-1">{item.label}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(v => (
                <div key={v} className={cn("w-7 h-7 rounded flex items-center justify-center text-xs font-bold",
                  v <= item.val ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>{v}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropostaRinnovo() {
  const [servizi, setServizi] = useState(serviziRinnovo);
  const [sconto, setSconto] = useState(5);

  const toggleServizio = (id) => {
    setServizi(prev => prev.map(s => s.id === id && !s.obbligatorio ? { ...s, selezionato: !s.selezionato } : s));
  };

  const lordo = servizi.filter(s => s.selezionato).reduce((sum, s) => sum + s.prezzo, 0);
  const scontato = lordo * (1 - sconto / 100);

  return (
    <div className="p-6 overflow-y-auto">
      <p className="text-xs font-mono text-muted-foreground mb-1">07C</p>
      <h2 className="text-base font-semibold mb-4">Proposta rinnovo</h2>

      <div className="sticky top-0 bg-card border border-border rounded-lg p-4 mb-4 flex items-center justify-between z-10">
        <div>
          <p className="text-xs text-muted-foreground">Totale proposta</p>
          <p className="text-2xl font-bold">€ {scontato.toLocaleString("it-IT")}<span className="text-base font-normal text-muted-foreground"> + IVA</span></p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Sconto fedeltà:</label>
          <div className="flex items-center gap-1">
            <input type="number" min={0} max={30} value={sconto} onChange={e => setSconto(+e.target.value)} className="w-14 border border-border rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-ring" />
            <span className="text-sm">%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {servizi.map(s => (
          <div key={s.id} onClick={() => toggleServizio(s.id)} className={cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all", s.selezionato ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30", s.obbligatorio && "cursor-default")}>
            <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center shrink-0", s.selezionato ? "bg-primary border-primary" : "border-muted-foreground")}>
              {s.selezionato && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{s.nome}</p>
              {s.obbligatorio && <p className="text-xs text-muted-foreground">Incluso (obbligatorio)</p>}
            </div>
            <span className="text-sm font-semibold">€ {s.prezzo.toLocaleString("it-IT")}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="flex-1 py-2.5 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">Salva bozza</button>
        <button className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Invia al cliente</button>
      </div>
    </div>
  );
}