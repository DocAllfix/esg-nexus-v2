import { useState } from "react";
import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const acmeFormData = {};
// TODO: Replace with Supabase hook
const irosAcme = [];

const STORAGE_KEY = "esg_form_02B";

// IRO da mock data

const AREE = ["E", "S", "G"];
const AREA_COLORS = { E: "bg-green-100 text-green-800", S: "bg-blue-100 text-blue-800", G: "bg-purple-100 text-purple-800" };
const AREA_LABELS = { E: "Ambiente", S: "Sociale", G: "Governance" };
const TIPO_LABELS = { "I+": "Impatto positivo", "I-": "Impatto negativo", "R": "Rischio", "O": "Opportunità" };
const TIPO_COLORS = { "I+": "bg-teal-100 text-teal-800", "I-": "bg-red-100 text-red-800", "R": "bg-orange-100 text-orange-800", "O": "bg-blue-100 text-blue-800" };

export default function Form02B() {
  const [iros, setIros] = useState(irosAcme.map(iro => ({
    ...iro,
    score_impatto: iro.score_impatto,
    score_finanziario: iro.score_finanziario,
    materiale_impatto: iro.materiale_impatto,
    materiale_fin: iro.materiale_fin,
  })));
  const [soglia_impatto, setSogliaImpatto] = useState(3.0);
  const [soglia_fin, setSogliaFin] = useState(8.0);
  const [note, setNote] = useState("La soglia di materialità è stata definita tenendo conto delle best practice GRI e delle indicazioni ESRS. La doppia materialità richiede la valutazione sia della prospettiva di impatto (scala, scopo, irrimediabilità) che finanziaria (probabilità, magnitudine).");

  const setIro = (i, k, v) => setIros(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });

  // Ricalcola materialità in base alle soglie
  const irosCalcolati = iros.map(iro => ({
    ...iro,
    materiale_impatto: iro.score_impatto >= soglia_impatto,
    materiale_fin: iro.score_finanziario >= soglia_fin,
    categoria: iro.score_impatto >= soglia_impatto && iro.score_finanziario >= soglia_fin ? "DOPPIA"
      : iro.score_impatto >= soglia_impatto ? "SOLO_IMPATTO"
      : iro.score_finanziario >= soglia_fin ? "SOLO_FINANZIARIA"
      : "NON_MATERIALE",
  }));

  const materiali = irosCalcolati.filter(i => i.materiale_impatto || i.materiale_fin).length;
  const doppia = irosCalcolati.filter(i => i.categoria === "DOPPIA").length;

  const CAT_COLORS = {
    DOPPIA: "bg-teal-100 text-teal-800 border-teal-200",
    SOLO_IMPATTO: "bg-blue-100 text-blue-800 border-blue-200",
    SOLO_FINANZIARIA: "bg-purple-100 text-purple-800 border-purple-200",
    NON_MATERIALE: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <FormWrapper
      formCode="FORM-02B"
      title="Valutazione IRO — Doppia Materialità"
      subtitle="Assessment Impatti, Rischi e Opportunità per prospettiva di impatto e finanziaria"
      meta={{ "Fase": "PROC-02.2", "Resp.": "Consulente Senior", "Standard": "ESRS 1 / GRI 3-2", "Output": "Lista IRO valutati con score" }}
      ruleBox="🎯 Doppia Materialità ESRS: valutare ogni IRO sia dalla prospettiva di IMPATTO (scala, scopo, irrimediabilità) che FINANZIARIA (probabilità, magnitudine). Entrambe le soglie sono configurabili."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* SOGLIE */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
        <div>
          <label className="text-xs font-medium block mb-1">Soglia materialità — Impatto (scala 1–5): <span className="font-bold text-primary">{soglia_impatto}</span></label>
          <input type="range" min={1} max={5} step={0.1} value={soglia_impatto} onChange={e => setSogliaImpatto(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>5</span></div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Soglia materialità — Finanziaria (scala 1–20): <span className="font-bold text-primary">{soglia_fin}</span></label>
          <input type="range" min={1} max={20} step={0.5} value={soglia_fin} onChange={e => setSogliaFin(Number(e.target.value))} className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>20</span></div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "IRO totali", value: iros.length, color: "text-foreground" },
          { label: "Materiali totali", value: materiali, color: "text-primary" },
          { label: "Doppia materialità", value: doppia, color: "text-teal-700" },
          { label: "Non materiali", value: iros.length - materiali, color: "text-muted-foreground" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* TABELLA IRO */}
      {AREE.map(area => (
        <FormSection key={area} title={`${area} — ${AREA_LABELS[area]}`} cols={1}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                  <th className="text-left px-3 py-2">ID</th>
                  <th className="text-left px-3 py-2">Tema IRO</th>
                  <th className="px-3 py-2 text-center">Tipo</th>
                  <th className="px-3 py-2 text-center">Score Impatto</th>
                  <th className="px-3 py-2 text-center">Score Fin.</th>
                  <th className="px-3 py-2 text-center">Categoria</th>
                </tr>
              </thead>
              <tbody>
                {irosCalcolati.filter(iro => iro.area === area).map((iro, i) => {
                  const globalIdx = iros.findIndex(r => r.id === iro.id);
                  return (
                    <tr key={iro.id} className={cn("border-t border-border hover:bg-muted/20", iro.categoria === "NON_MATERIALE" && "opacity-60")}>
                      <td className="px-3 py-2 font-mono font-bold">{iro.id}</td>
                      <td className="px-3 py-2 font-medium">{iro.tema}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={cn("px-1.5 py-0.5 rounded-full text-xs font-medium border-0", TIPO_COLORS[iro.tipo])}>{iro.tipo}</span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input type="number" step={0.1} min={0} max={5} value={iro.score_impatto} onChange={e => setIro(globalIdx, "score_impatto", Number(e.target.value))}
                          className={cn("w-16 text-center border rounded px-1 py-0.5 font-bold", iro.materiale_impatto ? "border-teal-400 bg-teal-50 text-teal-800" : "border-border bg-background")} />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input type="number" step={0.1} min={0} max={20} value={iro.score_finanziario} onChange={e => setIro(globalIdx, "score_finanziario", Number(e.target.value))}
                          className={cn("w-16 text-center border rounded px-1 py-0.5 font-bold", iro.materiale_fin ? "border-purple-400 bg-purple-50 text-purple-800" : "border-border bg-background")} />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", CAT_COLORS[iro.categoria])}>
                          {iro.categoria.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </FormSection>
      ))}

      <FormSection title="Note metodologiche" cols={1}>
        <Field label="Criteri e motivazione soglie adottate">
          <Textarea value={note} onChange={setNote} rows={3} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}