import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AREE_COLORS_DOT = { E: "#10B981", S: "#6366F1", G: "#8B5CF6" };
const TIPO_COLORS = { CapEx: "bg-blue-100 text-blue-800", OpEx: "bg-gray-100 text-gray-700" };

export default function Form05E({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "05E");

  const voci = d?.voci ?? [];
  const setRow = (i, k, v) => {
    const n = [...voci];
    n[i] = { ...n[i], [k]: k === "y1" || k === "y2" || k === "y3" ? Number(v) : v };
    updateField("voci", n);
  };
  const remove = (id) => updateField("voci", voci.filter(v => v.id !== id));
  const add = () => updateField("voci", [...voci, { id: Date.now(), area: "E", ini_ref: "", voce: "", tipo: "OpEx", y1: 0, y2: 0, y3: 0, note: "" }]);

  const totY1 = voci.reduce((s, v) => s + (v.y1 || 0), 0);
  const totY2 = voci.reduce((s, v) => s + (v.y2 || 0), 0);
  const totY3 = voci.reduce((s, v) => s + (v.y3 || 0), 0);
  const tot3Y = totY1 + totY2 + totY3;

  const barData = ["E", "S", "G"].map(a => ({
    area: `Area ${a}`,
    Y1: voci.filter(v => v.area === a).reduce((s, v) => s + (v.y1 || 0), 0),
    Y2: voci.filter(v => v.area === a).reduce((s, v) => s + (v.y2 || 0), 0),
    Y3: voci.filter(v => v.area === a).reduce((s, v) => s + (v.y3 || 0), 0),
  }));

  const fmt = (v) => `€ ${v.toLocaleString("it-IT")}`;

  return (
    <FormWrapper
      formCode="FORM-05E"
      title="Budget Piano ESG — 3 Anni"
      subtitle="Piano economico per voce, area e anno con visualizzazione grafica"
      meta={{ "Fase": "PROC-05.5", "Resp.": "Partner + CFO Cliente", "Output": "Budget approvato board" }}
      ruleBox="Distinguere CapEx (investimenti) da OpEx (costi ricorrenti). Il budget deve essere approvato dal CFO prima della presentazione al CdA."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
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

      {barData.some(d => d.Y1 + d.Y2 + d.Y3 > 0) && (
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
      )}

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
                <tr key={v.id ?? i} className="hover:bg-muted/20">
                  <td className="px-3 py-2 text-center">
                    <select value={v.area} onChange={e => setRow(i, "area", e.target.value)} className="text-xs font-bold rounded border-0 bg-transparent" style={{ color: AREE_COLORS_DOT[v.area] }}>
                      {["E","S","G"].map(a => <option key={a}>{a}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2"><input value={v.ini_ref || ""} onChange={e => setRow(i, "ini_ref", e.target.value)} className="w-full bg-transparent border-0 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" /></td>
                  <td className="px-3 py-2"><input value={v.voce || ""} onChange={e => setRow(i, "voce", e.target.value)} className="w-full bg-transparent border-0 text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 font-medium" /></td>
                  <td className="px-3 py-2 text-center">
                    <select value={v.tipo || "OpEx"} onChange={e => setRow(i, "tipo", e.target.value)} className={cn("text-xs px-1.5 py-0.5 rounded border-0 font-medium", TIPO_COLORS[v.tipo] || "bg-gray-100")}>
                      <option>CapEx</option><option>OpEx</option>
                    </select>
                  </td>
                  {["y1","y2","y3"].map(k => (
                    <td key={k} className="px-3 py-2 text-right">
                      <input type="number" value={v[k] ?? 0} onChange={e => setRow(i, k, e.target.value)} className="w-24 text-right border border-border rounded px-2 py-0.5 bg-background font-semibold focus:outline-none" />
                    </td>
                  ))}
                  <td className="px-3 py-2"><input value={v.note || ""} onChange={e => setRow(i, "note", e.target.value)} className="w-full bg-transparent border-0 text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" /></td>
                  <td className="px-3 py-2"><button onClick={() => remove(v.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={12} /></button></td>
                </tr>
              ))}
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
          <Textarea value={d?.nota} onChange={v => updateField("nota", v)} rows={3} placeholder="Es. CapEx fotovoltaico al netto di Credito d'imposta 4.0..." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
