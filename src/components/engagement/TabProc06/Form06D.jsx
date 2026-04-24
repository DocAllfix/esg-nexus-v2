import { useState } from "react";
import FormWrapper from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";

const CAPS_GOV = [
  { n: 3,  titolo: "Governance della Sostenibilità", target: 1200 },
  { n: 13, titolo: "Governance — Etica e anti-corruzione", target: 900 },
];

const STANDARD_PER_CAP = {
  3:  ["GRI 2-9", "GRI 2-10", "GRI 2-11", "GRI 2-12", "GRI 2-18", "ESRS G1-1", "ESRS GOV-1"],
  13: ["GRI 205-1", "GRI 205-2", "GRI 205-3", "GRI 419-1", "ESRS G1-3", "ESRS G1-4"],
};

const toggleArray = (arr, item) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

export default function Form06D({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "06D");
  const [capSel, setCapSel] = useState(3);

  const contenuti = d?.contenuti ?? {};
  const stdChecked = d?.std_checked ?? {};

  const toggleStd = (s) => {
    const arr = stdChecked[capSel] || [];
    updateField("std_checked", { ...stdChecked, [capSel]: toggleArray(arr, s) });
  };

  const cap = CAPS_GOV.find(c => c.n === capSel);
  const parole = (contenuti[capSel] || "").trim().split(/\s+/).filter(Boolean).length;

  return (
    <FormWrapper
      formCode="FORM-06D"
      title="Stesura Sezione Governance"
      subtitle="Editor capitoli 3 e 13: Governance ESG e Etica/Anti-corruzione"
      meta={{ "Capitoli": "3, 13", "Resp.": "Sara Greco", "Output": "Testi approvati dal CdA" }}
      ruleBox="I testi di governance devono essere revisionati dal Legale prima dell'approvazione. Le dichiarazioni vincolanti (es. remunerazione) richiedono validazione del CdA."
      ruleBoxType="warning"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {CAPS_GOV.map(c => (
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
                {capSel === 3 && <><p>• G-01: Membri CdA</p><p>• G-02: % Donne CdA</p><p>• G-03: % Indipendenti</p></>}
                {capSel === 13 && <><p>• G-04: Segnalazioni</p><p>• G-05: % Formati etica</p></>}
              </div>
            </div>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}
