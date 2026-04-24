import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select } from "@/components/common/FormWrapper";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const irosAcme = [];

const STORAGE_KEY = "esg_form_02D";

const STANDARD_GRI = {
  "E1-1": "GRI 305 / ESRS E1", "E1-2": "GRI 305 / ESRS E1", "E1-3": "GRI 302 / ESRS E1",
  "E2-1": "GRI 305-7 / ESRS E2", "E3-1": "GRI 303 / ESRS E3",
  "E4-1": "GRI 304 / ESRS E4", "E5-1": "GRI 306 / ESRS E5",
  "S1-1": "GRI 403 / ESRS S1", "S1-2": "GRI 404 / ESRS S1", "S1-3": "GRI 405 / ESRS S1",
  "S2-1": "GRI 414 / ESRS S2", "S3-1": "GRI 413 / ESRS S3",
  "G1-1": "GRI 205 / ESRS G1", "G1-2": "GRI 2 / ESRS G1", "G2-1": "GRI 415 / ESRS G1",
};

const materiali = irosAcme.filter(i => i.materiale_impatto || i.materiale_fin);

const INITIAL_MAPPING = materiali.map(iro => ({
  id: iro.id,
  tema: iro.tema,
  area: iro.area,
  categoria: iro.categoria,
  standard: STANDARD_GRI[iro.id] || "Da definire",
  kpi_previsti: "",
  referente_cliente: "",
  capitolo_bilancio: "",
  incluso: true,
  note_perimetro: "",
}));

export default function Form02D() {
  const [mapping, setMapping] = useState(INITIAL_MAPPING);
  const [nota_metodologica, setNotaMetodologica] = useState("Il perimetro del bilancio include tutti i temi in doppia materialità e quelli con solo materialità di impatto. I temi con sola materialità finanziaria sono inclusi con disclosure ridotta. I temi non materiali sono esclusi con motivazione documentata.");
  const setRow = (i, k, v) => setMapping(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });

  const inclusi = mapping.filter(m => m.incluso).length;
  const AREA_DOT = { E: "bg-green-500", S: "bg-blue-500", G: "bg-purple-500" };

  return (
    <FormWrapper
      formCode="FORM-02D"
      title="Perimetro Bilancio — Mapping IRO"
      subtitle="Definizione del perimetro di rendicontazione per ogni tema materiale"
      meta={{ "Fase": "PROC-02.4", "Resp.": "Consulente Senior", "Standard": "GRI 3-2 / ESRS 1 §AR16", "Output": "Perimetro e GRI Content Index iniziale" }}
      ruleBox="📋 Per ogni tema materiale definire: standard di riferimento, KPI previsti, referente interno, capitolo del bilancio in cui sarà rendicontato. Documentare le esclusioni."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Temi materiali totali", value: materiali.length, color: "text-foreground" },
          { label: "Inclusi nel bilancio", value: inclusi, color: "text-green-700" },
          { label: "Esclusi / ridotti", value: materiali.length - inclusi, color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Mapping temi materiali → bilancio" cols={1}>
        <div className="space-y-3">
          {mapping.map((m, i) => (
            <div key={m.id} className={cn("rounded-lg border p-4 space-y-3", m.incluso ? "border-border" : "border-gray-200 bg-gray-50/50 opacity-70")}>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => setRow(i, "incluso", !m.incluso)}>
                  {m.incluso ? <CheckCircle2 size={18} className="text-green-600" /> : <Circle size={18} className="text-muted-foreground" />}
                </button>
                <div className={cn("w-5 h-5 rounded-full shrink-0", AREA_DOT[m.area])} />
                <span className="font-mono text-xs text-muted-foreground font-bold">{m.id}</span>
                <span className="font-semibold text-sm flex-1">{m.tema}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{m.standard}</span>
              </div>
              {m.incluso && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-0.5">KPI previsti</label>
                    <input value={m.kpi_previsti} onChange={e => setRow(i, "kpi_previsti", e.target.value)} placeholder="Es. GHG Sc.1, Sc.2, intensità" className="w-full border border-border rounded px-2 py-1 text-xs bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-0.5">Referente cliente</label>
                    <input value={m.referente_cliente} onChange={e => setRow(i, "referente_cliente", e.target.value)} placeholder="Nome referente" className="w-full border border-border rounded px-2 py-1 text-xs bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-0.5">Capitolo bilancio</label>
                    <input value={m.capitolo_bilancio} onChange={e => setRow(i, "capitolo_bilancio", e.target.value)} placeholder="Es. Cap. 6 — Clima" className="w-full border border-border rounded px-2 py-1 text-xs bg-background" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-xs text-muted-foreground block mb-0.5">Note perimetro</label>
                    <input value={m.note_perimetro} onChange={e => setRow(i, "note_perimetro", e.target.value)} placeholder="Eventuali esclusioni parziali o limiti di rendicontazione" className="w-full border border-border rounded px-2 py-1 text-xs bg-background" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Nota metodologica" cols={1}>
        <Field label="Criteri di inclusione/esclusione e nota al perimetro">
          <Textarea value={nota_metodologica} onChange={setNotaMetodologica} rows={4} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}