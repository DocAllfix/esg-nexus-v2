import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AREE = ["E", "S", "G"];
const AREA_COLORS = { E: "border-green-200 bg-green-50/30", S: "border-blue-200 bg-blue-50/30", G: "border-purple-200 bg-purple-50/30" };
const AREA_DOT = { E: "bg-green-500", S: "bg-blue-500", G: "bg-purple-500" };
const PRIORITA = ["Alta", "Media", "Bassa"];
const PRIORITA_COLORS = { Alta: "bg-red-100 text-red-800", Media: "bg-amber-100 text-amber-800", Bassa: "bg-gray-100 text-gray-600" };
const ORIZZONTI = ["Breve (0-1a)", "Medio (1-3a)", "Lungo (3-5a)"];

export default function Form05B({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "05B");

  const obiettivi = d?.obiettivi ?? [];
  const setRow = (i, k, v) => { const n = [...obiettivi]; n[i] = { ...n[i], [k]: v }; updateField("obiettivi", n); };
  const remove = (id) => updateField("obiettivi", obiettivi.filter(o => o.id !== id));
  const add = () => updateField("obiettivi", [...obiettivi, {
    id: Date.now(), area: "E", codice: `OBJ-${Date.now()}`, titolo: "", descrizione: "",
    iro_ref: "", kpi_ref: "", orizzonte: "Breve (0-1a)", priorita: "Media", resp: "", scadenza: ""
  }]);

  return (
    <FormWrapper
      formCode="FORM-05B"
      title="Obiettivi SMART ESG"
      subtitle="Definizione obiettivi Specifici, Misurabili, Achievable, Rilevanti, Temporali"
      meta={{ "Fase": "PROC-05.2", "Resp.": "Consulente Senior", "Output": "Registro obiettivi SMART approvato" }}
      ruleBox="Ogni obiettivo deve essere SMART: collegato a un IRO materiale, a un KPI misurabile, con scadenza definita e responsabile chiaro."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-3 gap-3">
        {AREE.map(a => {
          const count = obiettivi.filter(o => o.area === a).length;
          return (
            <div key={a} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
              <p className={cn("text-2xl font-bold", a === "E" ? "text-green-700" : a === "S" ? "text-blue-700" : "text-purple-700")}>{count}</p>
              <p className="text-xs text-muted-foreground">Obiettivi Area {a}</p>
            </div>
          );
        })}
      </div>

      <FormSection title="Obiettivi SMART" cols={1}>
        <div className="space-y-3">
          {obiettivi.map((obj, i) => (
            <div key={obj.id} className={cn("rounded-xl border-2 p-4 space-y-3", AREA_COLORS[obj.area] || "border-border")}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  <div className={cn("w-3 h-3 rounded-full shrink-0", AREA_DOT[obj.area] || "bg-gray-400")} />
                  <span className="font-mono text-xs text-muted-foreground font-bold">{obj.codice}</span>
                  <select value={obj.area} onChange={e => setRow(i, "area", e.target.value)} className="border border-border rounded px-1.5 py-0.5 text-xs bg-background font-bold">
                    {AREE.map(a => <option key={a}>{a}</option>)}
                  </select>
                  <select value={obj.priorita} onChange={e => setRow(i, "priorita", e.target.value)} className={cn("border-0 rounded px-1.5 py-0.5 text-xs font-medium", PRIORITA_COLORS[obj.priorita] || "bg-gray-100")}>
                    {PRIORITA.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <select value={obj.orizzonte} onChange={e => setRow(i, "orizzonte", e.target.value)} className="border border-border rounded px-1.5 py-0.5 text-xs bg-background">
                    {ORIZZONTI.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button onClick={() => remove(obj.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={13} /></button>
              </div>
              <input value={obj.titolo} onChange={e => setRow(i, "titolo", e.target.value)} placeholder="Titolo obiettivo" className="w-full font-semibold text-sm border border-border rounded px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
              <textarea value={obj.descrizione} onChange={e => setRow(i, "descrizione", e.target.value)} rows={2} placeholder="Descrizione SMART dell'obiettivo..." className="w-full border border-border rounded px-2 py-1 text-xs bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring" />
              <div className="flex gap-3 text-xs flex-wrap">
                <label className="flex items-center gap-1 text-muted-foreground">IRO ref: <input value={obj.iro_ref || ""} onChange={e => setRow(i, "iro_ref", e.target.value)} className="border border-border rounded px-1.5 py-0.5 bg-background w-28 font-mono focus:outline-none" /></label>
                <label className="flex items-center gap-1 text-muted-foreground">KPI ref: <input value={obj.kpi_ref || ""} onChange={e => setRow(i, "kpi_ref", e.target.value)} className="border border-border rounded px-1.5 py-0.5 bg-background w-24 font-mono focus:outline-none" /></label>
                <label className="flex items-center gap-1 text-muted-foreground">Resp: <input value={obj.resp || ""} onChange={e => setRow(i, "resp", e.target.value)} className="border border-border rounded px-1.5 py-0.5 bg-background w-36 focus:outline-none" /></label>
                <label className="flex items-center gap-1 text-muted-foreground">Scadenza: <input type="date" value={obj.scadenza || ""} onChange={e => setRow(i, "scadenza", e.target.value)} className="border border-border rounded px-1.5 py-0.5 bg-background focus:outline-none" /></label>
              </div>
            </div>
          ))}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi obiettivo
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}
