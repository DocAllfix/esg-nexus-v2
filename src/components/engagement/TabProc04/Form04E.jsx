import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const kpiLibrary = [];

const STORAGE_KEY = "esg_form_04E";

const STATI = ["validato", "da_validare", "anomalia"];
const STATO_COLORS = { validato: "bg-green-100 text-green-800", da_validare: "bg-amber-100 text-amber-800", anomalia: "bg-red-100 text-red-800" };

const AREA_LABELS = { E: "Ambiente", S: "Sociale", G: "Governance" };
const AREA_COLORS = { E: "border-green-200", S: "border-blue-200", G: "border-purple-200" };

export default function Form04E() {
  const [areaTab, setAreaTab] = useState("E");
  const [kpis, setKpis] = useState({
    E: kpiLibrary.E.map(k => ({ ...k })),
    S: kpiLibrary.S.map(k => ({ ...k })),
    G: kpiLibrary.G.map(k => ({ ...k })),
  });

  const setKpi = (area, i, field, val) => setKpis(prev => {
    const copy = { ...prev, [area]: [...prev[area]] };
    copy[area][i] = { ...copy[area][i], [field]: val };
    return copy;
  });

  const currentKpis = kpis[areaTab] || [];
  const validati = currentKpis.filter(k => k.stato === "validato").length;
  const anomalie = currentKpis.filter(k => k.stato === "anomalia").length;

  const allKpis = [...kpis.E, ...kpis.S, ...kpis.G];
  const totValidati = allKpis.filter(k => k.stato === "validato").length;
  const totAll = allKpis.length;

  return (
    <FormWrapper
      formCode="FORM-04E"
      title="KPI Library E/S/G — Raccolta e Validazione"
      subtitle="Inserimento valori, fonti e stato di validazione per ogni KPI"
      meta={{ "Fase": "PROC-04.5", "Resp.": "Team raccolta dati", "Standard": "GRI / ESRS", "Output": "KPI validati per bilancio" }}
      ruleBox="📋 Inserire il valore di ogni KPI e impostare lo stato di validazione. I KPI con anomalia devono essere risolti prima del freeze dataset."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* STATS GLOBALI */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "KPI totali", value: totAll, color: "text-foreground" },
          { label: "Validati", value: totValidati, color: "text-green-700" },
          { label: "Da risolvere", value: totAll - totValidati, color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* TAB AREE */}
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

      <FormSection title={`KPI Area ${areaTab} — ${AREA_LABELS[areaTab]} (${validati}/${currentKpis.length} validati)`} cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-3 py-2 w-20">Codice</th>
                <th className="text-left px-3 py-2">KPI</th>
                <th className="px-3 py-2 text-center w-20">Unità</th>
                <th className="px-3 py-2 text-center w-32">Valore 2024</th>
                <th className="px-3 py-2 text-center w-32">Valore 2023</th>
                <th className="px-3 py-2 text-left">Standard ref.</th>
                <th className="px-3 py-2 text-center w-28">Stato</th>
                <th className="px-3 py-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentKpis.map((kpi, i) => (
                <tr key={kpi.code} className={cn("hover:bg-muted/20", kpi.stato === "anomalia" && "bg-red-50/20")}>
                  <td className="px-3 py-2 font-mono font-bold">{kpi.code}</td>
                  <td className="px-3 py-2 font-medium">{kpi.label}</td>
                  <td className="px-3 py-2 text-center text-muted-foreground">{kpi.unita}</td>
                  <td className="px-3 py-2 text-center">
                    <input type="number" value={kpi.valore} onChange={e => setKpi(areaTab, i, "valore", e.target.value)}
                      className="w-24 text-center border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring font-bold" />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input type="number" value={kpi.valore_prev || ""} onChange={e => setKpi(areaTab, i, "valore_prev", e.target.value)}
                      placeholder="—"
                      className="w-24 text-center border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground" />
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{kpi.standard}</td>
                  <td className="px-3 py-2 text-center">
                    <select value={kpi.stato} onChange={e => setKpi(areaTab, i, "stato", e.target.value)}
                      className={cn("rounded px-1.5 py-0.5 text-xs font-medium border-0", STATO_COLORS[kpi.stato])}>
                      {STATI.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input value={kpi.note || ""} onChange={e => setKpi(areaTab, i, "note", e.target.value)}
                      placeholder="Note..." className="w-full bg-transparent border-0 text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>
    </FormWrapper>
  );
}