import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, FileText, Download } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";

// TODO: Replace with Supabase hook
const capitoliBilancio = [];

const SOTTOFASI = [
  { id: "06A", nome: "Struttura capitoli", stato: "completata" },
  { id: "06B", nome: "Stesura ambiente", stato: "completata" },
  { id: "06C", nome: "Stesura sociale", stato: "completata" },
  { id: "06D", nome: "Stesura governance", stato: "completata" },
  { id: "06E", nome: "Stesura strategia", stato: "completata" },
  { id: "06F", nome: "Content Index GRI/ESRS", stato: "completata" },
  { id: "06G", nome: "Assurance", stato: "completata" },
  { id: "06H", nome: "Pubblicazione", stato: "completata" },
];

const griDisclosures = [
  { codice: "GRI 2-1", nome: "Dati organizzativi", stato: "coperto", capitolo: "Cap. 2", pagina: 8 },
  { codice: "GRI 2-6", nome: "Attività, catena del valore e relazioni commerciali", stato: "coperto", capitolo: "Cap. 2", pagina: 12 },
  { codice: "GRI 3-1", nome: "Processo per determinare i temi materiali", stato: "coperto", capitolo: "Cap. 4", pagina: 24 },
  { codice: "GRI 305-1", nome: "Emissioni dirette GHG (Scope 1)", stato: "coperto", capitolo: "Cap. 6", pagina: 45 },
  { codice: "GRI 305-2", nome: "Emissioni GHG indirette legate all'energia (Scope 2)", stato: "coperto", capitolo: "Cap. 6", pagina: 47 },
  { codice: "GRI 305-3", nome: "Altre emissioni GHG indirette (Scope 3)", stato: "omesso", capitolo: "—", pagina: null },
  { codice: "GRI 302-1", nome: "Consumo di energia all'interno dell'organizzazione", stato: "coperto", capitolo: "Cap. 7", pagina: 58 },
  { codice: "GRI 403-9", nome: "Infortuni sul lavoro", stato: "coperto", capitolo: "Cap. 10", pagina: 72 },
  { codice: "GRI 404-1", nome: "Ore medie di formazione annua per dipendente", stato: "coperto", capitolo: "Cap. 11", pagina: 80 },
  { codice: "GRI 405-1", nome: "Diversità negli organi di governance", stato: "coperto", capitolo: "Cap. 9", pagina: 68 },
];

export default function TabProc06({ eng }) {
  const [faseSel, setFaseSel] = useState("06A");

  return (
    <div className="flex gap-4 min-h-[600px]">
      <div className="w-60 shrink-0 bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/40">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PROC-06 · Bilancio</p>
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
        {faseSel === "06A" && <StrutturaCapitoli />}
        {faseSel === "06F" && <ContentIndex />}
        {faseSel === "06H" && <Pubblicazione />}
        {faseSel === "06B" && <EditorCapitolo />}
        {!["06A", "06F", "06H", "06B"].includes(faseSel) && (
          <div className="p-6"><p className="text-xs font-mono text-muted-foreground mb-1">{faseSel}</p><h2 className="text-base font-semibold">{SOTTOFASI.find(f => f.id === faseSel)?.nome}</h2></div>
        )}
      </div>
    </div>
  );
}

function StrutturaCapitoli() {
  const approvati = capitoliBilancio.filter(c => c.stato === "approvato").length;
  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div><p className="text-xs font-mono text-muted-foreground">06A</p><h2 className="text-base font-semibold">Struttura — 15 capitoli</h2></div>
        <div className="text-right"><p className="text-sm font-semibold">{approvati} / {capitoliBilancio.length} approvati</p></div>
      </div>
      <table className="w-full text-xs">
        <thead><tr className="border-b border-border bg-muted/40">
          {["N.", "Titolo", "Parole", "Stato", "Assegnato a", "Azioni"].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-border">
          {capitoliBilancio.map(cap => {
            const pct = Math.min(100, (cap.parole / cap.target) * 100);
            return (
              <tr key={cap.n} className="hover:bg-muted/30">
                <td className="px-4 py-2.5 font-semibold">{cap.n}</td>
                <td className="px-4 py-2.5">{cap.titolo}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", pct >= 100 ? "bg-green-500" : pct >= 70 ? "bg-primary" : "bg-amber-500")} style={{ width: `${pct}%` }} />
                    </div>
                    <span>{cap.parole}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5"><StatusBadge status={cap.stato} /></td>
                <td className="px-4 py-2.5 text-muted-foreground">{cap.assegnato}</td>
                <td className="px-4 py-2.5">
                  <button className="text-xs text-primary hover:underline">Apri editor</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EditorCapitolo() {
  const [contenuto, setContenuto] = useState(`## Ambiente — Cambiamento climatico ed emissioni

Nel corso del 2025, **Acme Manufacturing S.p.A.** ha intrapreso un percorso strutturato di misurazione e gestione delle proprie emissioni di gas a effetto serra (GHG), in conformità al GHG Protocol Corporate Standard e ai requisiti dell'ESRS E1.

### Inventario emissioni GHG

L'inventario è stato condotto distinguendo le tre categorie di emissioni previste dal GHG Protocol:

- **Scope 1** (emissioni dirette): 183,1 tCO₂e, principalmente da combustione di gas naturale e flotta aziendale
- **Scope 2 Market-Based**: 0 tCO₂e grazie all'approvvigionamento di energia elettrica al 100% da fonti rinnovabili certificate (GO)
- **Scope 2 Location-Based**: 245,7 tCO₂e applicando il mix di rete nazionale

Le emissioni di **Scope 3** sono state stimate parzialmente; l'organizzazione si impegna a completare l'inventario nel corso del 2026.`);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <p className="text-sm font-semibold">Cap. 6 — Ambiente — Cambiamento climatico ed emissioni</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{contenuto.length} car.</span>
            <span>Salvato 2 sec fa</span>
          </div>
        </div>
        <div className="p-2 border-b border-border flex items-center gap-1 flex-wrap">
          {["G", "C", "S", "H1", "H2", "H3", "≡", "1.", "🔗"].map(b => (
            <button key={b} className="px-2 py-1 text-xs border border-border rounded hover:bg-muted transition-colors font-mono">{b}</button>
          ))}
        </div>
        <textarea
          value={contenuto}
          onChange={e => setContenuto(e.target.value)}
          className="flex-1 p-4 text-sm leading-relaxed resize-none focus:outline-none bg-background font-mono"
        />
      </div>
      <div className="w-52 shrink-0 border-l border-border p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Standard linkati</p>
        {["GRI 305-1", "GRI 305-2", "GRI 305-3", "GRI 302-1", "ESRS E1-6", "ESRS E1-1", "ESRS E1-4"].map(s => (
          <label key={s} className="flex items-center gap-2 text-xs mb-2 cursor-pointer">
            <input type="checkbox" defaultChecked={["GRI 305-1", "GRI 305-2", "ESRS E1-6"].includes(s)} className="accent-primary" />
            <span className="font-mono">{s}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ContentIndex() {
  const coperti = griDisclosures.filter(g => g.stato === "coperto").length;
  return (
    <div className="p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div><p className="text-xs font-mono text-muted-foreground">06F</p><h2 className="text-base font-semibold">Content Index GRI</h2></div>
        <div className="text-right"><p className="text-sm font-semibold">{coperti} di {griDisclosures.length} disclosure coperti</p></div>
      </div>
      <table className="w-full text-xs">
        <thead><tr className="border-b border-border bg-muted/40">
          {["Codice", "Disclosure", "Stato", "Capitolo", "Pagina"].map(h => <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>)}
        </tr></thead>
        <tbody className="divide-y divide-border">
          {griDisclosures.map(g => (
            <tr key={g.codice} className="hover:bg-muted/30">
              <td className="px-4 py-2.5 font-mono">{g.codice}</td>
              <td className="px-4 py-2.5">{g.nome}</td>
              <td className="px-4 py-2.5">
                <span className={cn("text-xs px-2 py-0.5 rounded-full", g.stato === "coperto" ? "bg-green-100 text-green-800" : g.stato === "omesso" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600")}>
                  {g.stato}
                </span>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">{g.capitolo}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{g.pagina || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pubblicazione() {
  const approvati = capitoliBilancio.filter(c => c.stato === "approvato").length;
  const tuttiOk = approvati === 15;

  return (
    <div className="p-6 flex flex-col items-center text-center">
      <p className="text-xs font-mono text-muted-foreground mb-1 self-start">06H</p>
      <h2 className="text-base font-semibold mb-6 self-start">Pubblicazione bilancio</h2>
      <div className="w-full max-w-lg space-y-3 mb-8">
        {[
          { ok: approvati === 15, testo: `${approvati}/15 capitoli approvati` },
          { ok: true, testo: "Content Index GRI completato (42/60 disclosure)" },
          { ok: true, testo: "Assurance Limited Deloitte — firmata" },
          { ok: true, testo: "Revisione legale testi completata" },
        ].map((c, i) => (
          <div key={i} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border text-left", c.ok ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50")}>
            <CheckCircle2 size={16} className={c.ok ? "text-green-600 shrink-0" : "text-amber-500 shrink-0"} />
            <p className="text-sm">{c.testo}</p>
          </div>
        ))}
      </div>
      <button className="px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all mb-6">
        Pubblica bilancio
      </button>
      <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
        {[["PDF hi-res", "15.2 MB"], ["PDF web", "3.4 MB"], ["DOCX", "8.1 MB"]].map(([tipo, size]) => (
          <div key={tipo} className="border border-border rounded-lg p-4 flex flex-col items-center gap-2">
            <FileText size={24} className="text-muted-foreground" />
            <p className="text-sm font-medium">{tipo}</p>
            <p className="text-xs text-muted-foreground">{size}</p>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline"><Download size={12} /> Scarica</button>
          </div>
        ))}
      </div>
    </div>
  );
}