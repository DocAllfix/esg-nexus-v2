import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select } from "@/components/common/FormWrapper";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_06G";

const LIVELLI_ASSURANCE = ["Limited assurance", "Reasonable assurance"];
const ENTI = ["Deloitte", "PwC", "EY", "KPMG", "BDO", "Grant Thornton", "Altro"];
const STANDARD_ASSURANCE = ["ISAE 3000 Revised", "ISAE 3410 (GHG)", "AA1000AS v3", "IDW AsS 821", "Altro"];

const CHECKLIST_ASSURANCE = [
  { id: 1, voce: "Dataset GHG (Scope 1, 2, 3) validato in PROC-04", critico: true },
  { id: 2, voce: "KPI sociali (S-01…S-07) validati con fonti HR", critico: true },
  { id: 3, voce: "KPI governance (G-01…G-05) validati con verbali CdA", critico: true },
  { id: 4, voce: "Content Index GRI/ESRS completato (FORM-06F)", critico: true },
  { id: 5, voce: "Nota metodologica GHG Protocol confermata", critico: true },
  { id: 6, voce: "Perimetro di rendicontazione documentato", critico: true },
  { id: 7, voce: "Lettera di engagement con società di revisione firmata", critico: true },
  { id: 8, voce: "Management representation letter firmata dal CEO/CFO", critico: true },
  { id: 9, voce: "Bozza bilancio inviata alla società per fieldwork", critico: false },
  { id: 10, voce: "Riscontro osservazioni assurance incorporato nel testo", critico: false },
  { id: 11, voce: "Relazione assurance ricevuta e firmata", critico: false },
  { id: 12, voce: "Relazione assurance inserita nel bilancio (appendice)", critico: false },
];

export default function Form06G() {
  const [ente, setEnte] = useState("Deloitte");
  const [livello, setLivello] = useState("Limited assurance");
  const [standard_ass, setStandardAss] = useState("ISAE 3000 Revised");
  const [data_mandato, setDataMandato] = useState("2025-04-01");
  const [data_rilascio, setDataRilascio] = useState("2025-10-15");
  const [perimetro, setPerimetro] = useState("Indicatori ambientali (emissioni GHG Scope 1 e 2 MB, consumo energetico, consumo idrico), indicatori sociali (FTE, TRIR, ore formazione, % donne totale e management), indicatori di governance (composizione CdA).");
  const [osservazioni, setOsservazioni] = useState("L'ente di assurance ha richiesto chiarimenti sul metodo di calcolo del Scope 2 Market-Based e sulla fonte del fattore di emissione gas naturale. Entrambi risolti con documentazione a supporto (contratto GO + DEFRA 2023).");
  const [checks, setChecks] = useState(CHECKLIST_ASSURANCE);
  const toggle = (id) => setChecks(p => p.map(c => c.id === id ? { ...c, ok: !c.ok } : c));

  const critiche = checks.filter(c => c.critico);
  const fatte = checks.filter(c => c.ok).length;
  const critiOk = critiche.filter(c => c.ok).length;
  const tutteOk = critiOk === critiche.length;

  return (
    <FormWrapper
      formCode="FORM-06G"
      title="Assurance del Bilancio"
      subtitle="Gestione del processo di verifica indipendente (limited/reasonable assurance)"
      meta={{ "Ente": ente, "Livello": livello, "Standard": standard_ass, "Rilascio previsto": data_rilascio }}
      ruleBox={tutteOk ? "✅ Prerequisiti assurance completati. Il bilancio è pronto per la fase di fieldwork." : "⚠️ Completare le attività critiche prima di avviare il fieldwork dell'ente di assurance."}
      ruleBoxType={tutteOk ? "success" : "warning"}
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* STATO AVANZAMENTO */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/40 rounded-lg p-4 text-center border border-border">
          <p className="text-2xl font-bold text-primary">{critiOk}/{critiche.length}</p>
          <p className="text-xs text-muted-foreground">Prerequisiti critici</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-4 text-center border border-border">
          <p className="text-2xl font-bold text-foreground">{fatte}/{checks.length}</p>
          <p className="text-xs text-muted-foreground">Totale completate</p>
        </div>
        <div className={cn("rounded-lg p-4 text-center border", tutteOk ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200")}>
          <p className={cn("text-sm font-bold", tutteOk ? "text-green-700" : "text-amber-700")}>{tutteOk ? "✅ Pronto" : "⏳ In corso"}</p>
          <p className="text-xs text-muted-foreground">Stato assurance</p>
        </div>
      </div>

      <FormSection title="Dati mandato assurance">
        <Field label="Società di assurance" required>
          <Select value={ente} onChange={setEnte} options={ENTI} />
        </Field>
        <Field label="Livello di assurance">
          <Select value={livello} onChange={setLivello} options={LIVELLI_ASSURANCE} />
        </Field>
        <Field label="Standard di riferimento">
          <Select value={standard_ass} onChange={setStandardAss} options={STANDARD_ASSURANCE} />
        </Field>
        <Field label="Data mandato">
          <Input type="date" value={data_mandato} onChange={setDataMandato} />
        </Field>
        <Field label="Data rilascio relazione prevista">
          <Input type="date" value={data_rilascio} onChange={setDataRilascio} />
        </Field>
        <Field label="Perimetro degli indicatori soggetti ad assurance" span={2}>
          <Textarea value={perimetro} onChange={setPerimetro} rows={2} />
        </Field>
        <Field label="Osservazioni ricevute e azioni intraprese" span={2}>
          <Textarea value={osservazioni} onChange={setOsservazioni} rows={2} />
        </Field>
      </FormSection>

      <FormSection title="Checklist preparazione assurance" cols={1}>
        <div className="space-y-2">
          {checks.map(c => (
            <div key={c.id} onClick={() => toggle(c.id)} className={cn("rounded-lg border p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/10", c.ok ? "border-green-200 bg-green-50/30" : "border-border")}>
              {c.ok ? <CheckCircle2 size={15} className="text-green-600 shrink-0" /> : <Circle size={15} className="text-muted-foreground shrink-0" />}
              <span className="text-sm flex-1">{c.voce}</span>
              {c.critico && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded shrink-0">critico</span>}
            </div>
          ))}
        </div>
      </FormSection>
    </FormWrapper>
  );
}