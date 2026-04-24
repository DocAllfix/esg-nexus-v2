import { useState } from "react";
import FormWrapper, { FormSection, Field } from "@/components/common/FormWrapper";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_06F";

const STATI_GRI = ["coperto", "parziale", "omesso", "non applicabile"];
const STATI_COLORS = {
  coperto: "bg-green-100 text-green-800",
  parziale: "bg-amber-100 text-amber-800",
  omesso: "bg-red-100 text-red-800",
  "non applicabile": "bg-gray-100 text-gray-600",
};

const INITIAL_DISCLOSURES = [
  { id: 1, standard: "GRI", codice: "GRI 2-1", nome: "Dati organizzativi", stato: "coperto", capitolo: "Cap. 2", pagina: "8", motivo_omissione: "" },
  { id: 2, standard: "GRI", codice: "GRI 2-2", nome: "Entità incluse nel reporting", stato: "coperto", capitolo: "Cap. 2", pagina: "9", motivo_omissione: "" },
  { id: 3, standard: "GRI", codice: "GRI 2-6", nome: "Attività, catena del valore e relazioni commerciali", stato: "coperto", capitolo: "Cap. 2", pagina: "12", motivo_omissione: "" },
  { id: 4, standard: "GRI", codice: "GRI 2-7", nome: "Dipendenti", stato: "coperto", capitolo: "Cap. 9", pagina: "68", motivo_omissione: "" },
  { id: 5, standard: "GRI", codice: "GRI 2-9", nome: "Struttura e composizione della governance", stato: "coperto", capitolo: "Cap. 3", pagina: "18", motivo_omissione: "" },
  { id: 6, standard: "GRI", codice: "GRI 3-1", nome: "Processo per determinare i temi materiali", stato: "coperto", capitolo: "Cap. 4", pagina: "24", motivo_omissione: "" },
  { id: 7, standard: "GRI", codice: "GRI 205-2", nome: "Comunicazione e formazione su politiche e procedure anti-corruzione", stato: "coperto", capitolo: "Cap. 13", pagina: "98", motivo_omissione: "" },
  { id: 8, standard: "GRI", codice: "GRI 302-1", nome: "Consumo di energia all'interno dell'organizzazione", stato: "coperto", capitolo: "Cap. 7", pagina: "58", motivo_omissione: "" },
  { id: 9, standard: "GRI", codice: "GRI 303-3", nome: "Prelievo di acqua", stato: "coperto", capitolo: "Cap. 8", pagina: "64", motivo_omissione: "" },
  { id: 10, standard: "GRI", codice: "GRI 305-1", nome: "Emissioni dirette di GHG (Scope 1)", stato: "coperto", capitolo: "Cap. 6", pagina: "45", motivo_omissione: "" },
  { id: 11, standard: "GRI", codice: "GRI 305-2", nome: "Emissioni indirette di GHG legate all'energia (Scope 2)", stato: "coperto", capitolo: "Cap. 6", pagina: "47", motivo_omissione: "" },
  { id: 12, standard: "GRI", codice: "GRI 305-3", nome: "Altre emissioni indirette di GHG (Scope 3)", stato: "parziale", capitolo: "Cap. 6", pagina: "49", motivo_omissione: "Inventario Scope 3 parziale. Completamento previsto 2025." },
  { id: 13, standard: "GRI", codice: "GRI 306-3", nome: "Rifiuti generati", stato: "coperto", capitolo: "Cap. 8", pagina: "65", motivo_omissione: "" },
  { id: 14, standard: "GRI", codice: "GRI 403-9", nome: "Infortuni sul lavoro", stato: "coperto", capitolo: "Cap. 10", pagina: "72", motivo_omissione: "" },
  { id: 15, standard: "GRI", codice: "GRI 404-1", nome: "Ore medie di formazione per dipendente", stato: "coperto", capitolo: "Cap. 11", pagina: "80", motivo_omissione: "" },
  { id: 16, standard: "GRI", codice: "GRI 405-1", nome: "Diversità negli organi di governance e dipendenti", stato: "coperto", capitolo: "Cap. 9", pagina: "69", motivo_omissione: "" },
  { id: 17, standard: "ESRS", codice: "ESRS E1-1", nome: "Piano di transizione per la mitigazione del cambiamento climatico", stato: "parziale", capitolo: "Cap. 6", pagina: "44", motivo_omissione: "Piano transizione in sviluppo (completamento 2026)." },
  { id: 18, standard: "ESRS", codice: "ESRS E1-6", nome: "Emissioni di gas a effetto serra lordi", stato: "coperto", capitolo: "Cap. 6", pagina: "45", motivo_omissione: "" },
  { id: 19, standard: "ESRS", codice: "ESRS S1-1", nome: "Politiche relative alla propria forza lavoro", stato: "coperto", capitolo: "Cap. 9", pagina: "68", motivo_omissione: "" },
  { id: 20, standard: "ESRS", codice: "ESRS S1-14", nome: "Salute e sicurezza sul lavoro", stato: "coperto", capitolo: "Cap. 10", pagina: "72", motivo_omissione: "" },
  { id: 21, standard: "ESRS", codice: "ESRS G1-3", nome: "Prevenzione e rilevamento della corruzione attiva e passiva", stato: "coperto", capitolo: "Cap. 13", pagina: "98", motivo_omissione: "" },
  { id: 22, standard: "ESRS", codice: "ESRS GOV-1", nome: "Ruolo degli organi di amministrazione, gestione e controllo", stato: "coperto", capitolo: "Cap. 3", pagina: "18", motivo_omissione: "" },
];

export default function Form06F() {
  const [disclosures, setDisclosures] = useState(INITIAL_DISCLOSURES);
  const [filterStd, setFilterStd] = useState("TUTTI");
  const [filterStato, setFilterStato] = useState("TUTTI");

  const setRow = (id, k, v) => setDisclosures(p => p.map(d => d.id === id ? { ...d, [k]: v } : d));
  const remove = (id) => setDisclosures(p => p.filter(d => d.id !== id));
  const add = () => setDisclosures(p => [...p, { id: Date.now(), standard: "GRI", codice: "", nome: "", stato: "coperto", capitolo: "", pagina: "", motivo_omissione: "" }]);

  const filtered = disclosures.filter(d =>
    (filterStd === "TUTTI" || d.standard === filterStd) &&
    (filterStato === "TUTTI" || d.stato === filterStato)
  );

  const coperti = disclosures.filter(d => d.stato === "coperto").length;
  const parziali = disclosures.filter(d => d.stato === "parziale").length;
  const omessi = disclosures.filter(d => d.stato === "omesso").length;

  return (
    <FormWrapper
      formCode="FORM-06F"
      title="Content Index GRI / ESRS"
      subtitle="Registro completo dei disclosure standard con stato di copertura e riferimento capitolo"
      meta={{ "Disclosure totali": disclosures.length, "Coperti": coperti, "Parziali": parziali, "Omessi/N.A.": omessi }}
      ruleBox="📋 Il Content Index è il documento ufficiale di conformità agli standard. Ogni disclosure omesso deve riportare la motivazione. Il Content Index va pubblicato in appendice al bilancio."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* KPI */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Coperti", value: coperti, color: "text-green-700", bg: "bg-green-50 border-green-200" },
          { label: "Parziali", value: parziali, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
          { label: "Omessi", value: omessi, color: "text-red-600", bg: "bg-red-50 border-red-200" },
          { label: "% Copertura", value: `${Math.round((coperti / disclosures.length) * 100)}%`, color: "text-primary", bg: "bg-muted/40 border-border" },
        ].map(k => (
          <div key={k.label} className={cn("rounded-lg p-3 text-center border", k.bg)}>
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* FILTRI */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-muted-foreground">Standard:</span>
        {["TUTTI", "GRI", "ESRS"].map(s => (
          <button key={s} onClick={() => setFilterStd(s)} className={cn("text-xs px-2 py-0.5 rounded border", filterStd === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{s}</button>
        ))}
        <span className="text-xs text-muted-foreground ml-2">Stato:</span>
        {["TUTTI", ...STATI_GRI].map(s => (
          <button key={s} onClick={() => setFilterStato(s)} className={cn("text-xs px-2 py-0.5 rounded border", filterStato === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{s}</button>
        ))}
      </div>

      <FormSection title={`Disclosure (${filtered.length} / ${disclosures.length})`} cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Std", "Codice", "Disclosure", "Stato", "Capitolo", "Pagina", "Nota omissione", ""].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(d => (
                <tr key={d.id} className="hover:bg-muted/20">
                  <td className="px-3 py-2">
                    <select value={d.standard} onChange={e => setRow(d.id, "standard", e.target.value)} className={cn("text-xs px-1.5 py-0.5 rounded font-bold border-0", d.standard === "GRI" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800")}>
                      <option>GRI</option><option>ESRS</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 font-mono">
                    <input value={d.codice} onChange={e => setRow(d.id, "codice", e.target.value)} className="w-24 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 font-bold" />
                  </td>
                  <td className="px-3 py-2">
                    <input value={d.nome} onChange={e => setRow(d.id, "nome", e.target.value)} className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" style={{ minWidth: 200 }} />
                  </td>
                  <td className="px-3 py-2">
                    <select value={d.stato} onChange={e => setRow(d.id, "stato", e.target.value)} className={cn("text-xs px-1.5 py-0.5 rounded border-0 font-medium", STATI_COLORS[d.stato])}>
                      {STATI_GRI.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input value={d.capitolo} onChange={e => setRow(d.id, "capitolo", e.target.value)} className="w-16 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" />
                  </td>
                  <td className="px-3 py-2">
                    <input value={d.pagina} onChange={e => setRow(d.id, "pagina", e.target.value)} className="w-12 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 text-center" />
                  </td>
                  <td className="px-3 py-2">
                    <input value={d.motivo_omissione} onChange={e => setRow(d.id, "motivo_omissione", e.target.value)} placeholder={d.stato !== "coperto" ? "Motivazione omissione..." : ""} className="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 text-muted-foreground" style={{ minWidth: 160 }} />
                  </td>
                  <td className="px-3 py-2"><button onClick={() => remove(d.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
          <Plus size={14} /> Aggiungi disclosure
        </button>
      </FormSection>
    </FormWrapper>
  );
}