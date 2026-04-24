import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const AREE_COLORS = { E: "bg-green-100 text-green-800", S: "bg-blue-100 text-blue-800", G: "bg-purple-100 text-purple-800" };
const STATI = ["Non avviata", "In corso", "Completata", "Sospesa"];
const STATI_COLORS = { "Non avviata": "bg-gray-100 text-gray-600", "In corso": "bg-amber-100 text-amber-800", "Completata": "bg-green-100 text-green-800", "Sospesa": "bg-red-100 text-red-800" };
const ORIZZONTI = ["B", "M", "L"];
const PRIORITA = ["Alta", "Media", "Bassa"];

export default function Form05D({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "05D");
  const [expanded, setExpanded] = useState({});
  const [filterArea, setFilterArea] = useState("TUTTI");
  const [filterStato, setFilterStato] = useState("TUTTI");

  const iniziative = d?.iniziative ?? [];
  const toggleExp = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));
  const setRow = (id, k, v) => updateField("iniziative", iniziative.map(ini => ini.id === id ? { ...ini, [k]: v } : ini));
  const remove = (id) => updateField("iniziative", iniziative.filter(ini => ini.id !== id));
  const add = () => updateField("iniziative", [...iniziative, {
    id: `INI-${Date.now()}`, titolo: "", area: "E", orizzonte: "B", owner: "", priorita: "Media",
    gap_ref: "", obj_ref: "", progress: 0, stato: "Non avviata", budget_y1: 0, budget_y2: 0,
    budget_y3: 0, tipo: "OpEx", descrizione: "", kpi_impatto: "", data_avvio: "", data_fine: ""
  }]);

  const filtered = iniziative.filter(ini =>
    (filterArea === "TUTTI" || ini.area === filterArea) &&
    (filterStato === "TUTTI" || ini.stato === filterStato)
  );
  const totBudget = iniziative.reduce((s, i) => s + (i.budget_y1 || 0) + (i.budget_y2 || 0) + (i.budget_y3 || 0), 0);
  const avgProgress = iniziative.length > 0 ? Math.round(iniziative.reduce((s, i) => s + (i.progress || 0), 0) / iniziative.length) : 0;

  return (
    <FormWrapper
      formCode="FORM-05D"
      title="Catalogo Iniziative ESG"
      subtitle="Registro completo delle iniziative con budget, responsabili e avanzamento"
      meta={{ "Fase": "PROC-05.4", "Resp.": "Consulente Senior", "Output": "Piano azione approvato" }}
      ruleBox="Ogni iniziativa deve essere collegata a un gap (FORM-03F) o a un obiettivo SMART (FORM-05B). Il budget alimenta il piano economico (FORM-05E)."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Iniziative totali", value: iniziative.length, color: "text-foreground" },
          { label: "In corso", value: iniziative.filter(i => i.stato === "In corso").length, color: "text-amber-600" },
          { label: "Budget totale 3Y", value: `€${(totBudget / 1000).toFixed(0)}k`, color: "text-primary" },
          { label: "% avanz. medio", value: `${avgProgress}%`, color: "text-green-700" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground self-center">Area:</span>
        {["TUTTI", "E", "S", "G"].map(a => (
          <button key={a} onClick={() => setFilterArea(a)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filterArea === a ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{a}</button>
        ))}
        <span className="text-xs text-muted-foreground self-center ml-2">Stato:</span>
        {["TUTTI", ...STATI].map(s => (
          <button key={s} onClick={() => setFilterStato(s)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filterStato === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{s}</button>
        ))}
      </div>

      <FormSection title={`Iniziative (${filtered.length})`} cols={1}>
        <div className="space-y-2">
          {filtered.map(ini => (
            <div key={ini.id} className="rounded-lg border border-border overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-card cursor-pointer hover:bg-muted/20" onClick={() => toggleExp(ini.id)}>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold", AREE_COLORS[ini.area] || "bg-gray-100 text-gray-700")}>{ini.area}</span>
                <span className="font-mono text-xs text-muted-foreground font-bold">{ini.id}</span>
                <span className="flex-1 text-sm font-medium truncate">{ini.titolo || "Nuova iniziativa"}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", STATI_COLORS[ini.stato] || "bg-gray-100")}>{ini.stato}</span>
                <div className="flex items-center gap-1 w-20">
                  <div className="flex-1 h-1.5 bg-muted rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${ini.progress || 0}%` }} /></div>
                  <span className="text-xs text-muted-foreground w-8">{ini.progress || 0}%</span>
                </div>
                {expanded[ini.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
              {expanded[ini.id] && (
                <div className="px-4 py-4 border-t border-border bg-muted/5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div><label className="text-xs text-muted-foreground">Titolo</label><input value={ini.titolo || ""} onChange={e => setRow(ini.id, "titolo", e.target.value)} className="w-full mt-0.5 border border-border rounded px-2 py-1 text-sm bg-background font-medium focus:outline-none focus:ring-1 focus:ring-ring" /></div>
                    <div className="flex gap-2">
                      {[["area", ["E","S","G"]], ["orizzonte", ORIZZONTI], ["priorita", PRIORITA], ["stato", STATI], ["tipo", ["OpEx","CapEx"]]].map(([k, opts]) => (
                        <div key={k} className="flex-1"><label className="text-xs text-muted-foreground capitalize">{k}</label>
                          <select value={ini[k] || opts[0]} onChange={e => setRow(ini.id, k, e.target.value)} className="w-full mt-0.5 border border-border rounded px-1.5 py-1 text-xs bg-background focus:outline-none">
                            {opts.map(o => <option key={o}>{o}</option>)}
                          </select></div>
                      ))}
                    </div>
                  </div>
                  <div><label className="text-xs text-muted-foreground">Descrizione</label><textarea value={ini.descrizione || ""} onChange={e => setRow(ini.id, "descrizione", e.target.value)} rows={2} className="w-full mt-0.5 border border-border rounded px-2 py-1 text-xs bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring" /></div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[["owner","Owner"],["gap_ref","Gap ref"],["obj_ref","Obj ref"],["kpi_impatto","KPI impatto"]].map(([k,l]) => (
                      <div key={k}><label className="text-muted-foreground">{l}</label><input value={ini[k] || ""} onChange={e => setRow(ini.id, k, e.target.value)} className="w-full mt-0.5 border border-border rounded px-2 py-0.5 bg-background focus:outline-none" /></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {[["data_avvio","Avvio","date"],["data_fine","Fine","date"],["budget_y1","Budget Y1","number"],["budget_y2","Budget Y2","number"],["budget_y3","Budget Y3","number"]].map(([k,l,t]) => (
                      <div key={k}><label className="text-muted-foreground">{l}</label><input type={t} value={ini[k] ?? ""} onChange={e => setRow(ini.id, k, t === "number" ? Number(e.target.value) : e.target.value)} className="w-full mt-0.5 border border-border rounded px-2 py-0.5 bg-background focus:outline-none" /></div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-muted-foreground">Avanzamento:</label>
                    <input type="range" min={0} max={100} value={ini.progress || 0} onChange={e => setRow(ini.id, "progress", Number(e.target.value))} className="flex-1 accent-primary" />
                    <span className="text-xs font-bold w-8">{ini.progress || 0}%</span>
                    <button onClick={() => remove(ini.id)} className="text-muted-foreground hover:text-red-500 ml-2"><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi iniziativa
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}
