import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATI = ["validato", "da_validare", "anomalia"];
const STATO_COLORS = { validato: "bg-green-100 text-green-800", da_validare: "bg-amber-100 text-amber-800", anomalia: "bg-red-100 text-red-800" };
const AREA_LABELS = { E: "Ambiente", S: "Sociale", G: "Governance" };

const EMPTY_KPI = () => ({ id: Date.now() + Math.random(), code: "", label: "", unita: "", valore: "", valore_prev: "", standard: "", stato: "da_validare", note: "" });

export default function Form04E({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "04E");
  const [areaTab, setAreaTab] = useState("E");

  const kpis_E = d?.kpis_E ?? [];
  const kpis_S = d?.kpis_S ?? [];
  const kpis_G = d?.kpis_G ?? [];

  const byArea = { E: kpis_E, S: kpis_S, G: kpis_G };
  const fieldByArea = { E: "kpis_E", S: "kpis_S", G: "kpis_G" };

  const currentKpis = byArea[areaTab] || [];
  const fieldName = fieldByArea[areaTab];

  const setKpi = (i, field, val) => {
    const n = [...currentKpis]; n[i] = { ...n[i], [field]: val }; updateField(fieldName, n);
  };
  const addKpi = () => updateField(fieldName, [...currentKpis, EMPTY_KPI()]);
  const removeKpi = (i) => updateField(fieldName, currentKpis.filter((_, idx) => idx !== i));

  const validati = (arr) => arr.filter(k => k.stato === "validato").length;
  const allKpis = [...kpis_E, ...kpis_S, ...kpis_G];
  const totValidati = validati(allKpis);

  return (
    <FormWrapper
      formCode="FORM-04E"
      title="KPI Library E/S/G — Raccolta e Validazione"
      subtitle="Inserimento valori, fonti e stato di validazione per ogni KPI"
      meta={{ "Fase": "PROC-04.5", "Resp.": "Team raccolta dati", "Standard": "GRI / ESRS", "Output": "KPI validati per bilancio" }}
      ruleBox="Inserire il valore di ogni KPI e impostare lo stato di validazione. I KPI con anomalia devono essere risolti prima del freeze dataset."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "KPI totali", value: allKpis.length, color: "text-foreground" },
          { label: "Validati", value: totValidati, color: "text-green-700" },
          { label: "Da risolvere", value: allKpis.length - totValidati, color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {["E", "S", "G"].map(a => (
          <button key={a} onClick={() => setAreaTab(a)}
            className={cn("px-5 py-1.5 rounded-md text-sm font-medium transition-colors",
              areaTab === a ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}>
            {a} — {AREA_LABELS[a]}
          </button>
        ))}
      </div>

      <FormSection title={`KPI Area ${areaTab} — ${AREA_LABELS[areaTab]} (${validati(currentKpis)}/${currentKpis.length} validati)`} cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-3 py-2 w-20">Codice</th>
                <th className="text-left px-3 py-2">KPI</th>
                <th className="px-3 py-2 text-center w-20">Unità</th>
                <th className="px-3 py-2 text-center w-32">Valore N</th>
                <th className="px-3 py-2 text-center w-32">Valore N-1</th>
                <th className="px-3 py-2 text-left">Standard ref.</th>
                <th className="px-3 py-2 text-center w-28">Stato</th>
                <th className="px-3 py-2 text-left">Note</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentKpis.map((kpi, i) => (
                <tr key={kpi.id ?? i} className={cn("hover:bg-muted/20", kpi.stato === "anomalia" && "bg-red-50/20")}>
                  <td className="px-3 py-2"><input value={kpi.code || ""} onChange={e => setKpi(i, "code", e.target.value)} className="w-16 font-mono font-bold border border-border rounded px-1.5 py-0.5 bg-background text-xs focus:outline-none" /></td>
                  <td className="px-3 py-2"><input value={kpi.label || ""} onChange={e => setKpi(i, "label", e.target.value)} className="w-full font-medium border border-border rounded px-1.5 py-0.5 bg-background text-xs focus:outline-none" /></td>
                  <td className="px-3 py-2 text-center"><input value={kpi.unita || ""} onChange={e => setKpi(i, "unita", e.target.value)} className="w-16 text-center border border-border rounded px-1.5 py-0.5 bg-background text-xs focus:outline-none text-muted-foreground" /></td>
                  <td className="px-3 py-2 text-center">
                    <input type="number" value={kpi.valore || ""} onChange={e => setKpi(i, "valore", e.target.value)}
                      className="w-24 text-center border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring font-bold" />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input type="number" value={kpi.valore_prev || ""} onChange={e => setKpi(i, "valore_prev", e.target.value)}
                      placeholder="—" className="w-24 text-center border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground" />
                  </td>
                  <td className="px-3 py-2"><input value={kpi.standard || ""} onChange={e => setKpi(i, "standard", e.target.value)} className="w-full font-mono text-xs border border-border rounded px-1.5 py-0.5 bg-background text-muted-foreground focus:outline-none" /></td>
                  <td className="px-3 py-2 text-center">
                    <select value={kpi.stato || "da_validare"} onChange={e => setKpi(i, "stato", e.target.value)}
                      className={cn("rounded px-1.5 py-0.5 text-xs font-medium border-0", STATO_COLORS[kpi.stato] || "bg-gray-100")}>
                      {STATI.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input value={kpi.note || ""} onChange={e => setKpi(i, "note", e.target.value)}
                      placeholder="Note..." className="w-full bg-transparent border-0 text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" />
                  </td>
                  <td className="px-2 py-2"><button onClick={() => removeKpi(i)} className="text-muted-foreground hover:text-red-500"><Trash2 size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addKpi} className="flex items-center gap-2 text-xs text-primary hover:underline mt-2">
          <Plus size={12} /> Aggiungi KPI
        </button>
      </FormSection>
    </FormWrapper>
  );
}
