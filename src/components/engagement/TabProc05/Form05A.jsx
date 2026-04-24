import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_05A";

const PILASTRI = [
  { key: "E", label: "Ambiente", color: "border-green-300 bg-green-50/40", dot: "bg-green-500" },
  { key: "S", label: "Sociale", color: "border-blue-300 bg-blue-50/40", dot: "bg-blue-500" },
  { key: "G", label: "Governance", color: "border-purple-300 bg-purple-50/40", dot: "bg-purple-500" },
];

export default function Form05A() {
  const [vision, setVision] = useState("Acme Manufacturing S.p.A. si impegna a diventare un'azienda manifatturiera carbon-neutral entro il 2035, leader nel settore automotive per responsabilità sociale e trasparenza di governance, creando valore sostenibile per i propri stakeholder nel lungo periodo.");
  const [mission_esg, setMissionEsg] = useState("Integrare la sostenibilità in ogni processo decisionale, riducendo il proprio impatto ambientale, valorizzando le persone e mantenendo standard etici elevati nella gestione aziendale e nella catena di fornitura.");
  const [pilastri, setPilastri] = useState([
    { key: "E", impegno: "Raggiungere la carbon neutrality operativa (Scope 1+2) entro il 2030 e allinearsi ai target SBTi. Aumentare la quota di energia rinnovabile al 80% entro il 2027. Azzerare i rifiuti in discarica entro il 2028.", drivers: "Pressione clienti OEM (Stellantis), requisiti CSRD, opportunità riduzione costi energetici." },
    { key: "S", impegno: "Zero infortuni gravi entro il 2026. Raggiungere il 40% di donne in posizioni manageriali entro il 2028. Implementare un programma di audit sostenibilità su tutti i fornitori critici entro il 2026.", drivers: "Attrattività talenti, requisiti ESRS S1-S2, riduzione rischi operativi e reputazionali." },
    { key: "G", impegno: "Pubblicare il bilancio di sostenibilità conforme GRI/ESRS annualmente dal 2025. Istituire un Comitato ESG in seno al CdA entro il 2025. Allineare il 20% della remunerazione variabile del management a KPI ESG.", drivers: "Accesso al credito ESG-linked, requisiti CSRD, miglioramento rating ESG." },
  ]);

  const setPilastro = (key, field, value) => setPilastri(p => p.map(pi => pi.key === key ? { ...pi, [field]: value } : pi));

  return (
    <FormWrapper
      formCode="FORM-05A"
      title="Visione Strategica ESG"
      subtitle="Definizione di vision, mission ESG e pilastri strategici per area E/S/G"
      meta={{ "Fase": "PROC-05.1", "Resp.": "Partner + CEO Cliente", "Output": "Vision ESG approvata dal CdA" }}
      ruleBox="🎯 La visione strategica ESG deve essere coerente con il business model aziendale, materialmente ancorata agli IRO identificati e approvata dal vertice."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <FormSection title="Vision & Mission ESG" cols={1}>
        <Field label="Vision ESG (lungo periodo)" required>
          <Textarea value={vision} onChange={setVision} rows={3} />
        </Field>
        <Field label="Mission ESG (impegno operativo)">
          <Textarea value={mission_esg} onChange={setMissionEsg} rows={2} />
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
                  <Textarea value={pi?.impegno || ""} onChange={v => setPilastro(p.key, "impegno", v)} rows={3} />
                </Field>
                <Field label="Driver e motivazioni (business case)">
                  <Textarea value={pi?.drivers || ""} onChange={v => setPilastro(p.key, "drivers", v)} rows={2} />
                </Field>
              </div>
            );
          })}
        </div>
      </FormSection>
    </FormWrapper>
  );
}