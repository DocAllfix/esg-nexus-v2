import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select } from "@/components/common/FormWrapper";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_07D";

const TIPI_AZIONE = ["Call di follow-up", "Email", "Meeting", "Demo nuovo servizio", "Revisione proposta", "Firma contratto"];
const STATI_AZ = ["Da fare", "In corso", "Completata", "Annullata"];
const STATI_COLORS = { "Da fare": "bg-gray-100 text-gray-600", "In corso": "bg-amber-100 text-amber-700", "Completata": "bg-green-100 text-green-700", "Annullata": "bg-red-100 text-red-700" };

const INITIAL_AZIONI = [
  { id: 1, tipo: "Call di follow-up", data: "2025-12-05", resp: "Elena Mancini", contatto: "Laura Rossi", note: "Discussione esito NPS e raccolta feedback esteso. Presentare proposta rinnovo.", stato: "Completata" },
  { id: 2, tipo: "Email", data: "2025-12-08", resp: "Elena Mancini", contatto: "Marco Bianchi", note: "Invio formale proposta rinnovo FY2025 con PDF offerta allegato.", stato: "In corso" },
  { id: 3, tipo: "Meeting", data: "2025-12-15", resp: "Elena Mancini", contatto: "Marco Bianchi / CFO", note: "Revisione proposta rinnovo e negoziazione eventuali add-on.", stato: "Da fare" },
  { id: 4, tipo: "Firma contratto", data: "2025-12-20", resp: "Partner ESG", contatto: "CEO Acme", note: "Firma contratto FY2025 presso sede cliente o mediante firma digitale.", stato: "Da fare" },
];

export default function Form07D() {
  const [azioni, setAzioni] = useState(INITIAL_AZIONI);
  const [note_gen, setNoteGen] = useState("Cliente molto soddisfatto (NPS 9). Laura Rossi ha espresso interesse per il servizio di rating ESG (EcoVadis). Verificare disponibilità budget Q1 2026. Marco Bianchi chiede sconto fedeltà esteso al 10% in caso di firma entro fine anno.");

  const setRow = (id, k, v) => setAzioni(p => p.map(a => a.id === id ? { ...a, [k]: v } : a));
  const add = () => setAzioni(p => [...p, { id: Date.now(), tipo: "Call di follow-up", data: "", resp: "", contatto: "", note: "", stato: "Da fare" }]);

  const completate = azioni.filter(a => a.stato === "Completata").length;
  const daFare = azioni.filter(a => a.stato === "Da fare").length;

  return (
    <FormWrapper
      formCode="FORM-07D"
      title="Follow-up 30 Giorni Post-Consegna"
      subtitle="Tracciamento azioni di follow-up per fidelizzazione e conversione rinnovo"
      meta={{ "Azioni totali": azioni.length, "Completate": completate, "Da fare": daFare }}
      ruleBox="📞 Il follow-up entro 30 giorni dalla consegna aumenta il tasso di rinnovo del 40%. Documentare ogni interazione con il cliente."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Completate", value: completate, color: "text-green-700" },
          { label: "Da fare", value: daFare, color: "text-amber-600" },
          { label: "In corso", value: azioni.filter(a => a.stato === "In corso").length, color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Piano azioni follow-up" cols={1}>
        <div className="space-y-2">
          {azioni.map((a, i) => (
            <div key={a.id} className={cn("rounded-lg border p-3 space-y-2", a.stato === "Completata" ? "border-green-200 bg-green-50/20" : "border-border")}>
              <div className="flex items-center gap-2 flex-wrap">
                {a.stato === "Completata" ? <CheckCircle2 size={14} className="text-green-600" /> : <Circle size={14} className="text-muted-foreground" />}
                <select value={a.tipo} onChange={e => setRow(a.id, "tipo", e.target.value)} className="border border-border rounded px-2 py-0.5 text-xs bg-background font-medium">
                  {TIPI_AZIONE.map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="date" value={a.data} onChange={e => setRow(a.id, "data", e.target.value)} className="border border-border rounded px-2 py-0.5 text-xs bg-background" />
                <input value={a.resp} onChange={e => setRow(a.id, "resp", e.target.value)} placeholder="Responsabile" className="border border-border rounded px-2 py-0.5 text-xs bg-background" />
                <input value={a.contatto} onChange={e => setRow(a.id, "contatto", e.target.value)} placeholder="Contatto cliente" className="border border-border rounded px-2 py-0.5 text-xs bg-background" />
                <select value={a.stato} onChange={e => setRow(a.id, "stato", e.target.value)} className={cn("text-xs rounded border-0 px-1.5 py-0.5 font-medium ml-auto", STATI_COLORS[a.stato])}>
                  {STATI_AZ.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <input value={a.note} onChange={e => setRow(a.id, "note", e.target.value)} placeholder="Note sull'azione..." className="w-full text-xs border border-border rounded px-2 py-1 bg-background" />
            </div>
          ))}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi azione
          </button>
        </div>
      </FormSection>

      <FormSection title="Note generali follow-up" cols={1}>
        <Field label="Osservazioni e opportunità identificate">
          <Textarea value={note_gen} onChange={setNoteGen} rows={3} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}