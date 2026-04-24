import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIPI = ["Anomalia dati", "Dato mancante", "Discrepanza storica", "Fonte non verificata", "Calcolo errato"];
const STATI_ANO = ["Aperta", "In risoluzione", "Risolta", "Accettata con nota"];
const STATO_COLORS = { Aperta: "bg-red-100 text-red-800", "In risoluzione": "bg-amber-100 text-amber-800", Risolta: "bg-green-100 text-green-800", "Accettata con nota": "bg-blue-100 text-blue-800" };

export default function Form04F({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "04F");

  const anomalie = d?.anomalie ?? [];

  const setRow = (i, k, v) => { const n = [...anomalie]; n[i] = { ...n[i], [k]: v }; updateField("anomalie", n); };
  const remove = (id) => updateField("anomalie", anomalie.filter(a => a.id !== id));
  const add = () => updateField("anomalie", [...anomalie, { id: Date.now(), area: "E", kpi_ref: "", tipo: "Anomalia dati", descrizione: "", impatto: "", azione: "", resp: "", stato: "Aperta", note_risoluzione: "" }]);

  const aperte = anomalie.filter(a => a.stato === "Aperta" || a.stato === "In risoluzione").length;
  const risolte = anomalie.filter(a => a.stato === "Risolta" || a.stato === "Accettata con nota").length;

  return (
    <FormWrapper
      formCode="FORM-04F"
      title="Validazione e Gestione Anomalie"
      subtitle="Registro delle anomalie sui dati con piano di risoluzione"
      meta={{ "Fase": "PROC-04.6", "Resp.": "Analista ESG Senior", "Output": "Anomalie risolte — Freeze autorizzato" }}
      ruleBox={aperte > 0 ? `${aperte} anomalie non ancora risolte. Risolvere prima del freeze dataset (FORM-04G).` : "Tutte le anomalie risolte — freeze dataset autorizzato."}
      ruleBoxType={aperte > 0 ? "warning" : "success"}
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Anomalie totali", value: anomalie.length, color: "text-foreground" },
          { label: "Aperte / In risoluzione", value: aperte, color: aperte > 0 ? "text-red-600" : "text-green-700" },
          { label: "Risolte / Accettate", value: risolte, color: "text-green-700" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Registro anomalie" cols={1}>
        <div className="space-y-3">
          {anomalie.map((ano, i) => (
            <div key={ano.id ?? i} className={cn("rounded-lg border p-4 space-y-3",
              ano.stato === "Aperta" ? "border-red-300 bg-red-50/20" :
              ano.stato === "In risoluzione" ? "border-amber-300 bg-amber-50/10" :
              "border-green-200 bg-green-50/10"
            )}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", STATO_COLORS[ano.stato] || "bg-gray-100")}>{ano.stato}</span>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded font-bold">Area {ano.area}</span>
                  <input value={ano.kpi_ref || ""} onChange={e => setRow(i, "kpi_ref", e.target.value)} className="text-xs font-mono border border-border rounded px-1.5 py-0.5 bg-background w-36" placeholder="KPI ref..." />
                  <select value={ano.tipo || "Anomalia dati"} onChange={e => setRow(i, "tipo", e.target.value)} className="border border-border rounded px-1.5 py-0.5 text-xs bg-background">
                    {TIPI.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select value={ano.stato || "Aperta"} onChange={e => setRow(i, "stato", e.target.value)}
                    className={cn("border border-border rounded px-2 py-0.5 text-xs font-medium", STATO_COLORS[ano.stato] || "bg-gray-100")}>
                    {STATI_ANO.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => remove(ano.id ?? i)} className="text-muted-foreground hover:text-red-500"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Descrizione anomalia</label>
                  <textarea value={ano.descrizione || ""} onChange={e => setRow(i, "descrizione", e.target.value)} rows={2} className="w-full mt-0.5 border border-border rounded px-2 py-1 text-xs bg-background resize-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Impatto sulla qualità del dato</label>
                  <textarea value={ano.impatto || ""} onChange={e => setRow(i, "impatto", e.target.value)} rows={2} className="w-full mt-0.5 border border-border rounded px-2 py-1 text-xs bg-background resize-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Azione di risoluzione</label>
                  <textarea value={ano.azione || ""} onChange={e => setRow(i, "azione", e.target.value)} rows={2} className="w-full mt-0.5 border border-border rounded px-2 py-1 text-xs bg-background resize-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Note risoluzione / esito</label>
                  <textarea value={ano.note_risoluzione || ""} onChange={e => setRow(i, "note_risoluzione", e.target.value)} rows={2} placeholder="Vuoto se ancora aperta..." className="w-full mt-0.5 border border-border rounded px-2 py-1 text-xs bg-background resize-none" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Resp.:</span>
                <input value={ano.resp || ""} onChange={e => setRow(i, "resp", e.target.value)} className="border border-border rounded px-2 py-0.5 bg-background text-xs" />
              </div>
            </div>
          ))}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi anomalia
          </button>
        </div>
      </FormSection>

      <FormSection title="Policy di gestione anomalie" cols={1}>
        <Field label="Note generali e criteri di accettazione anomalie residue">
          <Textarea value={d?.nota} onChange={v => updateField("nota", v)} rows={2} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
