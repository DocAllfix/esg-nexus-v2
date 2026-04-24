import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATI = ["validato", "da_validare", "anomalia"];
const STATO_COLORS = { validato: "bg-green-100 text-green-800", da_validare: "bg-amber-100 text-amber-800", anomalia: "bg-red-100 text-red-800" };
const SCOPE_COLORS = ["#0F766E", "#14B8A6", "#F59E0B"];

const EMPTY_ROW = () => ({ id: Date.now() + Math.random(), descrizione: "", unita: "", valore: "", fattore: 0, fonte_fe: "", emissioni: 0, stato: "da_validare" });

function GHGTable({ rows, onUpdate, onAdd, onRemove }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
            {["Descrizione", "Unità", "Valore attività", "FE", "Fonte FE", "Emissioni tCO₂e", "Stato", ""].map(h => (
              <th key={h} className="text-left px-3 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r, i) => (
            <tr key={r.id ?? i} className={cn("hover:bg-muted/20", r.stato === "anomalia" && "bg-red-50/20")}>
              <td className="px-3 py-2"><input value={r.descrizione || ""} onChange={e => onUpdate(i, "descrizione", e.target.value)} className="w-32 border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none" /></td>
              <td className="px-3 py-2"><input value={r.unita || ""} onChange={e => onUpdate(i, "unita", e.target.value)} className="w-16 border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none" /></td>
              <td className="px-3 py-2">
                <input type="number" value={r.valore || ""} onChange={e => onUpdate(i, "valore", e.target.value)}
                  className="w-24 border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
              </td>
              <td className="px-3 py-2"><input type="number" step="0.0001" value={r.fattore || ""} onChange={e => onUpdate(i, "fattore", e.target.value)} className="w-20 border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none" /></td>
              <td className="px-3 py-2"><input value={r.fonte_fe || ""} onChange={e => onUpdate(i, "fonte_fe", e.target.value)} className="w-24 border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none" /></td>
              <td className="px-3 py-2 font-bold text-primary">{typeof r.emissioni === "number" ? r.emissioni.toFixed(1) : "—"}</td>
              <td className="px-3 py-2">
                <select value={r.stato || "da_validare"} onChange={e => onUpdate(i, "stato", e.target.value)}
                  className={cn("rounded px-1.5 py-0.5 text-xs font-medium border-0", STATO_COLORS[r.stato] || "bg-gray-100")}>
                  {STATI.map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td className="px-2 py-2"><button onClick={() => onRemove(i)} className="text-muted-foreground hover:text-red-500"><Trash2 size={12} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onAdd} className="flex items-center gap-2 text-xs text-primary hover:underline mt-2">
        <Plus size={12} /> Aggiungi riga
      </button>
    </div>
  );
}

export default function Form04B({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "04B");

  const scope1 = d?.scope1 ?? [];
  const scope2_mb = d?.scope2_mb ?? [];
  const scope2_lb = d?.scope2_lb ?? [];
  const scope3 = d?.scope3 ?? [];

  const updateRow = (field, rows, i, k, v) => {
    const n = [...rows];
    const fe = k === "fattore" ? parseFloat(v) || 0 : (n[i].fattore || 0);
    const val = k === "valore" ? parseFloat(v) || 0 : parseFloat(n[i].valore) || 0;
    n[i] = { ...n[i], [k]: v, emissioni: parseFloat((val * (k === "fattore" ? parseFloat(v) || 0 : fe)).toFixed(1)) };
    updateField(field, n);
  };

  const tot = (rows) => rows.reduce((s, r) => s + (Number(r.emissioni) || 0), 0);
  const tot1 = tot(scope1), tot2mb = tot(scope2_mb), tot2lb = tot(scope2_lb), tot3 = tot(scope3);
  const totMB = tot1 + tot2mb + tot3;
  const totLB = tot1 + tot2lb + tot3;

  const donutData = [
    { name: "Scope 1", value: parseFloat(tot1.toFixed(1)) },
    { name: "Scope 2 (LB)", value: parseFloat(tot2lb.toFixed(1)) },
    { name: "Scope 3", value: parseFloat(tot3.toFixed(1)) },
  ].filter(x => x.value > 0);

  return (
    <FormWrapper
      formCode="FORM-04B"
      title="Calcolatore GHG — Scope 1, 2, 3"
      subtitle="Inventario emissioni con calcolo automatico e validazione per fonte"
      meta={{ "Fase": "PROC-04.2–4", "Resp.": "Analista ESG", "Standard": "GRI 305 / ESRS E1-6 / GHG Protocol" }}
      ruleBox="Inserire i valori di attività per ogni fonte. Le emissioni sono calcolate automaticamente (valore × fattore emissione). Modificare lo stato per segnalare anomalie."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 grid grid-cols-2 gap-3">
          {[
            { label: "Scope 1 totale", value: `${tot1.toFixed(1)} tCO₂e`, color: "text-teal-700" },
            { label: "Scope 2 MB", value: `${tot2mb.toFixed(1)} tCO₂e`, color: "text-teal-600" },
            { label: "Scope 2 LB", value: `${tot2lb.toFixed(1)} tCO₂e`, color: "text-teal-500" },
            { label: "Scope 3 parziale", value: `${tot3.toFixed(1)} tCO₂e`, color: "text-violet-600" },
            { label: "Totale Market-Based", value: `${totMB.toFixed(1)} tCO₂e`, color: "text-primary" },
            { label: "Totale Location-Based", value: `${totLB.toFixed(1)} tCO₂e`, color: "text-muted-foreground" },
          ].map(k => (
            <div key={k.label} className="bg-muted/40 rounded-lg p-3 border border-border">
              <p className={cn("text-xl font-bold", k.color)}>{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </div>
        {donutData.length > 0 && (
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                  {donutData.map((_, i) => <Cell key={i} fill={SCOPE_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v} tCO₂e`} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <FormSection title="Scope 1 — Emissioni dirette" cols={1}>
        <GHGTable rows={scope1}
          onUpdate={(i, k, v) => updateRow("scope1", scope1, i, k, v)}
          onAdd={() => updateField("scope1", [...scope1, EMPTY_ROW()])}
          onRemove={(i) => updateField("scope1", scope1.filter((_, idx) => idx !== i))} />
      </FormSection>

      <FormSection title="Scope 2 — Energia indiretta" cols={1}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Market-Based (MB)</p>
            <GHGTable rows={scope2_mb}
              onUpdate={(i, k, v) => updateRow("scope2_mb", scope2_mb, i, k, v)}
              onAdd={() => updateField("scope2_mb", [...scope2_mb, EMPTY_ROW()])}
              onRemove={(i) => updateField("scope2_mb", scope2_mb.filter((_, idx) => idx !== i))} />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Location-Based (LB)</p>
            <GHGTable rows={scope2_lb}
              onUpdate={(i, k, v) => updateRow("scope2_lb", scope2_lb, i, k, v)}
              onAdd={() => updateField("scope2_lb", [...scope2_lb, EMPTY_ROW()])}
              onRemove={(i) => updateField("scope2_lb", scope2_lb.filter((_, idx) => idx !== i))} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Scope 3 — Emissioni indirette nella catena del valore" cols={1}>
        <GHGTable rows={scope3}
          onUpdate={(i, k, v) => updateRow("scope3", scope3, i, k, v)}
          onAdd={() => updateField("scope3", [...scope3, EMPTY_ROW()])}
          onRemove={(i) => updateField("scope3", scope3.filter((_, idx) => idx !== i))} />
      </FormSection>

      <FormSection title="Note metodologiche" cols={1}>
        <Field label="Fattori di emissione adottati e fonti">
          <Textarea value={d?.nota} onChange={v => updateField("nota", v)} rows={3} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
