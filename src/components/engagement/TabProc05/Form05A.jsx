import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";

const PILASTRI = [
  { key: "E", label: "Ambiente", color: "border-green-300 bg-green-50/40", dot: "bg-green-500" },
  { key: "S", label: "Sociale", color: "border-blue-300 bg-blue-50/40", dot: "bg-blue-500" },
  { key: "G", label: "Governance", color: "border-purple-300 bg-purple-50/40", dot: "bg-purple-500" },
];

const DEFAULT_PILASTRI = [
  { key: "E", impegno: "", drivers: "" },
  { key: "S", impegno: "", drivers: "" },
  { key: "G", impegno: "", drivers: "" },
];

export default function Form05A({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "05A");

  const pilastri = d?.pilastri ?? DEFAULT_PILASTRI;
  const setPilastro = (key, field, value) => {
    const n = pilastri.map(pi => pi.key === key ? { ...pi, [field]: value } : pi);
    updateField("pilastri", n);
  };

  return (
    <FormWrapper
      formCode="FORM-05A"
      title="Visione Strategica ESG"
      subtitle="Definizione di vision, mission ESG e pilastri strategici per area E/S/G"
      meta={{ "Fase": "PROC-05.1", "Resp.": "Partner + CEO Cliente", "Output": "Vision ESG approvata dal CdA" }}
      ruleBox="La visione strategica ESG deve essere coerente con il business model aziendale, materialmente ancorata agli IRO identificati e approvata dal vertice."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <FormSection title="Vision & Mission ESG" cols={1}>
        <Field label="Vision ESG (lungo periodo)">
          <Textarea value={d?.vision} onChange={v => updateField("vision", v)} rows={3} placeholder="Descrivere la visione di lungo periodo dell'azienda in ambito sostenibilità..." />
        </Field>
        <Field label="Mission ESG (impegno operativo)">
          <Textarea value={d?.mission_esg} onChange={v => updateField("mission_esg", v)} rows={2} placeholder="Descrivere l'impegno operativo concreto per la sostenibilità..." />
        </Field>
      </FormSection>

      <FormSection title="Pilastri strategici E / S / G" cols={1}>
        <div className="space-y-4">
          {PILASTRI.map(p => {
            const pi = pilastri.find(x => x.key === p.key);
            return (
              <div key={p.key} className={cn("rounded-xl border-2 p-5 space-y-3", p.color)}>
                <div className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full", p.dot)} />
                  <span className="font-bold text-sm">Pilastro {p.key} — {p.label}</span>
                </div>
                <Field label="Impegni strategici principali">
                  <Textarea value={pi?.impegno || ""} onChange={v => setPilastro(p.key, "impegno", v)} rows={3} placeholder="Elencare i principali impegni strategici per quest'area..." />
                </Field>
                <Field label="Driver e motivazioni (business case)">
                  <Textarea value={pi?.drivers || ""} onChange={v => setPilastro(p.key, "drivers", v)} rows={2} placeholder="Motivazioni, pressioni di mercato, requisiti normativi..." />
                </Field>
              </div>
            );
          })}
        </div>
      </FormSection>
    </FormWrapper>
  );
}
