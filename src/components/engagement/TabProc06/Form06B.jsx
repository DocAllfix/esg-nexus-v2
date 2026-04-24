import { useState } from "react";
import FormWrapper from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";

const CAPS_AMBIENTE = [
  { n: 6, titolo: "Ambiente — Cambiamento climatico ed emissioni", target: 2000 },
  { n: 7, titolo: "Ambiente — Energia e risorse", target: 1200 },
  { n: 8, titolo: "Ambiente — Acqua, rifiuti e biodiversità", target: 1000 },
];

const STANDARD_PER_CAP = {
  6: ["GRI 201-2", "GRI 305-1", "GRI 305-2", "GRI 305-3", "GRI 302-1", "ESRS E1-1", "ESRS E1-4", "ESRS E1-6"],
  7: ["GRI 302-1", "GRI 302-2", "GRI 302-3", "GRI 302-4", "ESRS E1-5"],
  8: ["GRI 303-3", "GRI 303-4", "GRI 306-3", "GRI 306-4", "ESRS E3-1", "ESRS E5-1"],
};

const toggleArray = (arr, item) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

export default function Form06B({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "06B");
  const [capSel, setCapSel] = useState(6);

  const contenuti = d?.contenuti ?? {};
  const stdChecked = d?.std_checked ?? {};

  const toggleStd = (s) => {
    const arr = stdChecked[capSel] || [];
    updateField("std_checked", { ...stdChecked, [capSel]: toggleArray(arr, s) });
  };

  const cap = CAPS_AMBIENTE.find(c => c.n === capSel);
  const parole = (contenuti[capSel] || "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <FormWrapper
      formCode="FORM-06B"
      title="Stesura Sezione Ambiente"
      subtitle="Editor capitoli 6-7-8: Clima, Energia, Acqua/Rifiuti/Biodiversità"
      meta={{ "Capitoli": "6, 7, 8", "Resp.": "Elena Mancini / Sara Greco", "Output": "Testi approvati per stampa" }}
      ruleBox="I testi devono riportare dati quantitativi validati in PROC-04. Ogni affermazione qualitativa deve essere supportata da evidenza documentale."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {CAPS_AMBIENTE.map(c => (
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
              {["**G**", "_C_", "# H1", "## H2", "### H3", "- Lista", "1. Num."].map(b => (
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
                {capSel === 6 && <>
                  <p>• E-01: Scope 1</p>
                  <p>• E-02: Scope 2 MB</p>
                  <p>• E-03: Scope 2 LB</p>
                  <p>• E-04: Scope 3</p>
                </>}
                {capSel === 7 && <>
                  <p>• E-05: Energia totale</p>
                  <p>• E-06: % Rinnovabile</p>
                </>}
                {capSel === 8 && <>
                  <p>• E-07: Consumo idrico</p>
                  <p>• E-08: Rifiuti totali</p>
                  <p>• E-09: % Riciclo</p>
                </>}
              </div>
            </div>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}
