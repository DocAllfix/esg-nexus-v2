import { useState } from "react";
import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_05E";

const AREE_COLORS_DOT = { E: "#10B981", S: "#6366F1", G: "#8B5CF6" };
const TIPO_COLORS = { CapEx: "bg-blue-100 text-blue-800", OpEx: "bg-gray-100 text-gray-700" };

const INITIAL_VOCI = [
  { id: 1, area: "E", ini_ref: "INI-001", voce: "Impianto fotovoltaico 800 kWp", tipo: "CapEx", y1: 320000, y2: 0, y3: 0, note: "Inclusi installazione, strutture, inverter" },
  { id: 2, area: "E", ini_ref: "INI-005", voce: "Percorso SBTi e piano transizione", tipo: "OpEx", y1: 25000, y2: 15000, y3: 10000, note: "" },
  { id: 3, area: "E", ini_ref: "INI-008", voce: "Piano biodiversità ed economia circolare", tipo: "CapEx", y1: 0, y2: 30000, y3: 50000, note: "" },
  { id: 4, area: "S", ini_ref: "INI-002", voce: "Programma Zero Harm H&S", tipo: "OpEx", y1: 35000, y2: 30000, y3: 25000, note: "Formazione, DPI, sistema near-miss" },
  { id: 5, area: "S", ini_ref: "INI-004", voce: "Audit ESG catena di fornitura", tipo: "OpEx", y1: 20000, y2: 25000, y3: 20000, note: "" },
  { id: 6, area: "S", ini_ref: "INI-006", voce: "Policy D&I e parità di genere", tipo: "OpEx", y1: 12000, y2: 15000, y3: 18000, note: "" },
  { id: 7, area: "G", ini_ref: "INI-003", voce: "Whistleblowing e codice etico", tipo: "OpEx", y1: 15000, y2: 8000, y3: 5000, note: "Piattaforma + formazione" },
  { id: 8, area: "G", ini_ref: "INI-007", voce: "Comitato ESG — governance setup", tipo: "OpEx", y1: 5000, y2: 5000, y3: 5000, note: "" },
  { id: 9, area: "G", ini_ref: "—", voce: "Reporting ESG / bilancio sostenibilità", tipo: "OpEx", y1: 18000, y2: 10000, y3: 8000, note: "Costi studio consulenza" },
];

export default function Form05E() {
  const [voci, setVoci] = useState(INITIAL_VOCI);
  const [nota, setNota] = useState("Il budget include sia CapEx (investimenti una tantum) che OpEx (costi ricorrenti). I valori sono al netto di eventuali incentivi fiscali (credito d'imposta 4.0, Certificati Bianchi per il fotovoltaico). Il budget Y1 comprende anche i costi di consulenza per la presente fase di reporting.");

  const setRow = (i, k, v) => setVoci(p => { const n = [...p]; n[i] = { ...n[i], [k]: k === "y1" || k === "y2" || k === "y3" ? Number(v) : v }; return n; });
  const remove = (id) => setVoci(p => p.filter(v => v.id !== id));
  const add = () => setVoci(p => [...p, { id: Date.now(), area: "E", ini_ref: "", voce: "", tipo: "OpEx", y1: 0, y2: 0, y3: 0, note: "" }]);

  const totY1 = voci.reduce((s, v) => s + v.y1, 0);
  const totY2 = voci.reduce((s, v) => s + v.y2, 0);
  const totY3 = voci.reduce((s, v) => s + v.y3, 0);
  const tot3Y = totY1 + totY2 + totY3;

  const barData = ["E", "S", "G"].map(a => ({
    area: `Area ${a}`,
    Y1: voci.filter(v => v.area === a).reduce((s, v) => s + v.y1, 0),
    Y2: voci.filter(v => v.area === a).reduce((s, v) => s + v.y2, 0),
    Y3: voci.filter(v => v.area === a).reduce((s, v) => s + v.y3, 0),
    fill: AREE_COLORS_DOT[a],
  }));

  const fmt = (v) => `€ ${v.toLocaleString("it-IT")}`;

  return (
    <FormWrapper
      formCode="FORM-05E"
      title="Budget Piano ESG — 3 Anni"
      subtitle="Piano economico per voce, area e anno con visualizzazione grafica"
      meta={{ "Fase": "PROC-05.5", "Resp.": "Partner + CFO Cliente", "Output": "Budget approvato board" }}
      ruleBox="💶 Distinguere CapEx (investimenti) da OpEx (costi ricorrenti). Il budget deve essere approvato dal CFO prima della presentazione al CdA."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* TOTALI */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Budget Anno 1", value: fmt(totY1), color: "text-foreground" },
          { label: "Budget Anno 2", value: fmt(totY2), color: "text-foreground" },
          { label: "Budget Anno 3", value: fmt(totY3), color: "text-foreground" },
          { label: "Budget totale 3Y", value: fmt(tot3Y), color: "text-primary" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-lg font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* BAR CHART */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="area" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={v => fmt(v)} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="Y1" name="Anno 1" fill="#0F766E" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Y2" name="Anno 2" fill="#14B8A6" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Y3" name="Anno 3" fill="#6EE7B7" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TABELLA */}
      <FormSection title="Dettaglio voci di budget" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="px-3 py-2 text-center w-12">Area</th>
                <th className="text-left px-3 py-2 w-20">Ini ref</th>
                <th className="text-left px-3 py-2">Voce di costo</th>
                <th className="px-3 py-2 text-center w-16">Tipo</th>
                <th className="px-3 py-2 text-right w-28">Anno 1</th>
                <th className="px-3 py-2 text-right w-28">Anno 2</th>
                <th className="px-3 py-2 text-right w-28">Anno 3</th>
                <th className="text-left px-3 py-2">Note</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {voci.map((v, i) => (
                <tr key={v.id} className="hover:bg-muted/20">
                  <td className="px-3 py-2 text-center">
                    <select value={v.area} onChange={e => setRow(i, "area", e.target.value)} className="text-xs font-bold rounded border-0 bg-transparent" style={{ color: AREE_COLORS_DOT[v.area] }}>
                      {["E","S","G"].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2"><input value={v.ini_ref} onChange={e => setRow(i, "ini_ref", e.target.value)} className="w-full bg-transparent border-0 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" /></td>
                  <td className="px-3 py-2"><input value={v.voce} onChange={e => setRow(i, "voce", e.target.value)} className="w-full bg-transparent border-0 text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 font-medium" /></td>
                  <td className="px-3 py-2 text-center">
                    <select value={v.tipo} onChange={e => setRow(i, "tipo", e.target.value)} className={cn("text-xs px-1.5 py-0.5 rounded border-0 font-medium", TIPO_COLORS[v.tipo])}>
                      <option>CapEx</option><option>OpEx</option>
                    </select>
                  </td>
                  {["y1","y2","y3"].map(k => (
                    <td key={k} className="px-3 py-2 text-right">
                      <input type="number" value={v[k]} onChange={e => setRow(i, k, e.target.value)} className="w-24 text-right border border-border rounded px-2 py-0.5 bg-background font-semibold" />
                    </td>
                  ))}
                  <td className="px-3 py-2"><input value={v.note} onChange={e => setRow(i, "note", e.target.value)} className="w-full bg-transparent border-0 text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" /></td>
                  <td className="px-3 py-2"><button onClick={() => remove(v.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={12} /></button></td>
                </tr>
              ))}
              {/* TOTALI */}
              <tr className="bg-muted/40 font-bold text-sm border-t-2 border-border">
                <td colSpan={4} className="px-3 py-2">TOTALE</td>
                <td className="px-3 py-2 text-right">{fmt(totY1)}</td>
                <td className="px-3 py-2 text-right">{fmt(totY2)}</td>
                <td className="px-3 py-2 text-right">{fmt(totY3)}</td>
                <td colSpan={2} className="px-3 py-2 text-right text-primary">{fmt(tot3Y)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
          <Plus size={14} /> Aggiungi voce
        </button>
      </FormSection>

      <FormSection title="Note al budget" cols={1}>
        <Field label="Assunzioni, incentivi fiscali, note metodologiche">
          <Textarea value={nota} onChange={setNota} rows={3} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}