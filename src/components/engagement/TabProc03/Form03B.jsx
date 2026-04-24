import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { CheckCircle2, Circle, AlertCircle, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATI = ["ricevuto", "parziale", "mancante", "attesa"];
const STATO_CONFIG = {
  ricevuto: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  parziale: { color: "bg-amber-100 text-amber-800", icon: AlertCircle },
  mancante: { color: "bg-red-100 text-red-800", icon: AlertCircle },
  attesa: { color: "bg-blue-100 text-blue-800", icon: Circle },
};
const AREA_COLORS = { E: "text-green-700 bg-green-50", S: "text-blue-700 bg-blue-50", G: "text-purple-700 bg-purple-50" };

export default function Form03B({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "03B");

  const docs = d?.docs ?? [];

  const setRow = (i, k, v) => { const n = [...docs]; n[i] = { ...n[i], [k]: v }; updateField("docs", n); };
  const remove = (i) => updateField("docs", docs.filter((_, idx) => idx !== i));
  const add = () => updateField("docs", [...docs, { id: Date.now(), area: "E", documento: "", resp_cliente: "", richiesto_il: "", ricevuto_il: "", stato: "attesa", note: "" }]);

  const ricevuti = docs.filter(d => d.stato === "ricevuto").length;
  const mancanti = docs.filter(d => d.stato === "mancante").length;
  const parziali = docs.filter(d => d.stato === "parziale").length;

  return (
    <FormWrapper
      formCode="FORM-03B"
      title="Richiesta Documenti Audit"
      subtitle="Elenco documenti richiesti al cliente per la Gap Analysis"
      meta={{ "Fase": "PROC-03.2", "Resp.": "Consulente Senior", "Output": "Dossier documentale completo" }}
      ruleBox="Tracciare lo stato di ricezione di ogni documento richiesto. I documenti mancanti configurano gap documentali che saranno riportati nella diagnosi."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Totali richiesti", value: docs.length, color: "text-foreground" },
          { label: "Ricevuti", value: ricevuti, color: "text-green-700" },
          { label: "Parziali", value: parziali, color: "text-amber-600" },
          { label: "Mancanti", value: mancanti, color: "text-red-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Documenti richiesti" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="px-3 py-2 text-center w-12">Area</th>
                <th className="text-left px-3 py-2">Documento</th>
                <th className="px-3 py-2 text-center w-24">Resp. Cliente</th>
                <th className="px-3 py-2 text-center w-24">Richiesto il</th>
                <th className="px-3 py-2 text-center w-24">Ricevuto il</th>
                <th className="px-3 py-2 text-center w-24">Stato</th>
                <th className="text-left px-3 py-2">Note</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc, i) => {
                const cfg = STATO_CONFIG[doc.stato] || STATO_CONFIG.attesa;
                return (
                  <tr key={doc.id ?? i} className={cn("border-t border-border hover:bg-muted/20", doc.stato === "mancante" && "bg-red-50/20")}>
                    <td className="px-3 py-2 text-center">
                      <span className={cn("px-1.5 py-0.5 rounded text-xs font-bold", AREA_COLORS[doc.area] || "bg-muted text-foreground")}>{doc.area}</span>
                    </td>
                    <td className="px-3 py-2"><input value={doc.documento} onChange={e => setRow(i, "documento", e.target.value)} className="w-full bg-transparent border-0 text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" /></td>
                    <td className="px-3 py-2 text-center"><input value={doc.resp_cliente} onChange={e => setRow(i, "resp_cliente", e.target.value)} className="w-full bg-transparent border-0 text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" /></td>
                    <td className="px-3 py-2 text-center"><input type="date" value={doc.richiesto_il} onChange={e => setRow(i, "richiesto_il", e.target.value)} className="bg-transparent border-0 text-xs focus:outline-none" /></td>
                    <td className="px-3 py-2 text-center"><input type="date" value={doc.ricevuto_il} onChange={e => setRow(i, "ricevuto_il", e.target.value)} className="bg-transparent border-0 text-xs focus:outline-none" /></td>
                    <td className="px-3 py-2 text-center">
                      <select value={doc.stato} onChange={e => setRow(i, "stato", e.target.value)} className={cn("rounded px-1.5 py-0.5 text-xs font-medium border-0", cfg.color)}>
                        {STATI.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2"><input value={doc.note} onChange={e => setRow(i, "note", e.target.value)} className="w-full bg-transparent border-0 text-xs focus:outline-none focus:ring-1 focus:ring-ring rounded px-1" /></td>
                    <td className="px-3 py-2"><button onClick={() => remove(i)} className="text-muted-foreground hover:text-red-500"><Trash2 size={12} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
          <Plus size={14} /> Aggiungi documento
        </button>
      </FormSection>
    </FormWrapper>
  );
}
