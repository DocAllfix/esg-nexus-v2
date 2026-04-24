import { useState } from "react";
import FormWrapper from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";

const CAPS_SOCIALE = [
  { n: 9,  titolo: "Sociale — Persone e organizzazione", target: 1500 },
  { n: 10, titolo: "Sociale — Salute e sicurezza sul lavoro", target: 1200 },
  { n: 11, titolo: "Sociale — Sviluppo e formazione", target: 900 },
  { n: 12, titolo: "Sociale — Filiera e fornitori", target: 1000 },
];

const STANDARD_PER_CAP = {
  9:  ["GRI 2-7", "GRI 2-8", "GRI 401-1", "GRI 405-1", "ESRS S1-1", "ESRS S1-6"],
  10: ["GRI 403-1", "GRI 403-5", "GRI 403-9", "GRI 403-10", "ESRS S1-14"],
  11: ["GRI 404-1", "GRI 404-2", "GRI 404-3", "ESRS S1-13"],
  12: ["GRI 2-6", "GRI 308-1", "GRI 414-1", "ESRS S2-1", "ESRS S2-4"],
};

const toggleArray = (arr, item) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

export default function Form06C({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "06C");
  const [capSel, setCapSel] = useState(9);

  const contenuti = d?.contenuti ?? {};
  const stdChecked = d?.std_checked ?? {};

  const toggleStd = (s) => {
    const arr = stdChecked[capSel] || [];
    updateField("std_checked", { ...stdChecked, [capSel]: toggleArray(arr, s) });
  };

  const cap = CAPS_SOCIALE.find(c => c.n === capSel);
  const parole = (contenuti[capSel] || "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <FormWrapper
      formCode="FORM-06C"
      title="Stesura Sezione Sociale"
      subtitle="Editor capitoli 9-12: Persone, H&S, Formazione, Filiera"
      meta={{ "Capitoli": "9, 10, 11, 12", "Resp.": "Elena Mancini / Luca Ferri", "Output": "Testi approvati" }}
      ruleBox="Tutti i dati sociali devono provenire dal dataset validato in PROC-04 (Form 04E). Riferire sempre l'anno di rendicontazione."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {CAPS_SOCIALE.map(c => (
          <button key={c.n} onClick={() => setCapSel(c.n)} className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", capSel === c.n ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            Cap. {c.n}
          </button>
        ))}
      </div>

      {cap && (
        <div className="flex gap-4 min-h-[480px] border border-border rounded-xl overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/20">
              <p className="text-sm font-semibold truncate">Cap. {cap.n} — {cap.titolo}</p>
              <span className="text-xs text-muted-foreground">{parole} parole / {cap.target} target</span>
            </div>
            <div className="px-3 py-1.5 border-b border-border flex items-center gap-1 flex-wrap bg-muted/10">
              {["**G**", "_C_", "# H1", "## H2", "### H3", "- Lista", "| Tab |"].map(b => (
                <button key={b} className="px-2 py-0.5 text-xs border border-border rounded hover:bg-muted transition-colors font-mono">{b}</button>
              ))}
            </div>
            <textarea
              value={contenuti[capSel] || ""}
              onChange={e => updateField("contenuti", { ...contenuti, [capSel]: e.target.value })}
              className="flex-1 p-4 text-sm leading-relaxed resize-none focus:outline-none bg-background font-mono"
              placeholder="Inserire il testo del capitolo in formato Markdown..."
            />
          </div>
          <div className="w-52 shrink-0 border-l border-border p-4 bg-muted/10 overflow-y-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Standard linkati</p>
            <div className="space-y-2">
              {(STANDARD_PER_CAP[capSel] || []).map(s => (
                <label key={s} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={(stdChecked[capSel] || []).includes(s)} onChange={() => toggleStd(s)} className="accent-primary" />
                  <span className={cn("font-mono", s.startsWith("ESRS") ? "text-purple-700" : "text-blue-700")}>{s}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">KPI riferimento</p>
              <div className="text-xs text-muted-foreground space-y-1">
                {capSel === 9 && <><p>• S-01: FTE</p><p>• S-04: % Donne</p><p>• S-07: Turnover</p></>}
                {capSel === 10 && <><p>• S-02: TRIR</p></>}
                {capSel === 11 && <><p>• S-03: Ore formazione</p></>}
                {capSel === 12 && <><p>• Fornitori critici</p></>}
              </div>
            </div>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}
