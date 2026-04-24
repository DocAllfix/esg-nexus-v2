import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select } from "@/components/common/FormWrapper";
import { CheckCircle2, Circle, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const STORAGE_KEY = "esg_form_01B";
const INITIAL = acmeFormData["01B"] ?? {};

export default function Form01B() {
  const [d, setD] = useState(INITIAL);
  const [presentiCliente, setPresentiCliente] = useState(INITIAL.presenti_cliente || []);
  const [presentiStudio, setPresentiStudio] = useState(INITIAL.presenti_studio || []);
  const [agenda, setAgenda] = useState(INITIAL.agenda_punti || []);
  const [actions, setActions] = useState(INITIAL.action_items || []);
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));

  const toggleAgenda = (i) => setAgenda(p => { const n = [...p]; n[i] = { ...n[i], completato: !n[i].completato }; return n; });
  const toggleAction = (i) => setActions(p => { const n = [...p]; n[i] = { ...n[i], stato: n[i].stato === "fatto" ? "aperto" : "fatto" }; return n; });

  return (
    <FormWrapper
      formCode="FORM-01B"
      title="Verbale Kick-off Meeting"
      subtitle="Documento ufficiale della riunione di avvio progetto"
      meta={{ "Fase": "PROC-01.2", "Resp.": "Project Manager", "Input": "Contratto validato (01A)", "Output": "Verbale firmato da entrambe le parti" }}
      ruleBox="📋 Compilare durante o immediatamente dopo il kick-off. Inviare verbale firmato entro 48h dal meeting."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >
      <FormSection title="Dettagli riunione">
        <Field label="Data kick-off" required>
          <Input type="date" value={d.data_kickoff} onChange={v => set("data_kickoff", v)} />
        </Field>
        <Field label="Ora">
          <Input type="time" value={d.ora_kickoff} onChange={v => set("ora_kickoff", v)} />
        </Field>
        <Field label="Luogo">
          <Input value={d.luogo} onChange={v => set("luogo", v)} />
        </Field>
        <Field label="Modalità">
          <Select value={d.modalita} onChange={v => set("modalita", v)} options={["Presenza", "Videoconferenza", "Ibrido"]} />
        </Field>
        <Field label="Durata (ore)">
          <Input type="number" value={d.durata_ore} onChange={v => set("durata_ore", v)} />
        </Field>
      </FormSection>

      {/* PARTECIPANTI CLIENTE */}
      <FormSection title="Partecipanti — Cliente" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-3 py-2">Nome</th>
                <th className="text-left px-3 py-2">Ruolo</th>
                <th className="text-left px-3 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {presentiCliente.map((p, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2"><input className="w-full border border-border rounded px-2 py-1 text-xs bg-background" value={p.nome} onChange={e => { const n = [...presentiCliente]; n[i] = { ...n[i], nome: e.target.value }; setPresentiCliente(n); }} /></td>
                  <td className="px-3 py-2"><input className="w-full border border-border rounded px-2 py-1 text-xs bg-background" value={p.ruolo} onChange={e => { const n = [...presentiCliente]; n[i] = { ...n[i], ruolo: e.target.value }; setPresentiCliente(n); }} /></td>
                  <td className="px-3 py-2"><input className="w-full border border-border rounded px-2 py-1 text-xs bg-background font-mono" value={p.email} onChange={e => { const n = [...presentiCliente]; n[i] = { ...n[i], email: e.target.value }; setPresentiCliente(n); }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setPresentiCliente(p => [...p, { nome: "", ruolo: "", email: "" }])} className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Plus size={12} /> Aggiungi partecipante
          </button>
        </div>
      </FormSection>

      {/* AGENDA */}
      <FormSection title="Agenda" cols={1}>
        <div className="space-y-2">
          {agenda.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/10 hover:bg-muted/20">
              <button onClick={() => toggleAgenda(i)}>
                {item.completato
                  ? <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                  : <Circle size={18} className="text-muted-foreground shrink-0" />
                }
              </button>
              <span className={cn("text-sm flex-1", item.completato && "line-through text-muted-foreground")}>{item.punto}</span>
            </div>
          ))}
        </div>
      </FormSection>

      {/* DECISIONI */}
      <FormSection title="Decisioni prese" cols={1}>
        <Field label="Sintesi decisioni e accordi">
          <Textarea value={d.decisioni} onChange={v => set("decisioni", v)} rows={4} />
        </Field>
      </FormSection>

      {/* ACTION ITEMS */}
      <FormSection title="Action items" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="px-3 py-2 text-center w-10">✓</th>
                <th className="text-left px-3 py-2">Azione</th>
                <th className="text-left px-3 py-2">Responsabile</th>
                <th className="text-left px-3 py-2">Scadenza</th>
                <th className="text-left px-3 py-2">Stato</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((a, i) => (
                <tr key={i} className={cn("border-t border-border", a.stato === "fatto" && "bg-green-50/50")}>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => toggleAction(i)}>
                      {a.stato === "fatto"
                        ? <CheckCircle2 size={16} className="text-green-600" />
                        : <Circle size={16} className="text-muted-foreground" />
                      }
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <input value={a.azione} onChange={e => { const n = [...actions]; n[i] = { ...n[i], azione: e.target.value }; setActions(n); }} className="w-full border border-border rounded px-2 py-1 text-xs bg-background" />
                  </td>
                  <td className="px-3 py-2">
                    <input value={a.responsabile} onChange={e => { const n = [...actions]; n[i] = { ...n[i], responsabile: e.target.value }; setActions(n); }} className="w-36 border border-border rounded px-2 py-1 text-xs bg-background" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="date" value={a.scadenza} onChange={e => { const n = [...actions]; n[i] = { ...n[i], scadenza: e.target.value }; setActions(n); }} className="border border-border rounded px-2 py-1 text-xs bg-background" />
                  </td>
                  <td className="px-3 py-2">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", a.stato === "fatto" ? "bg-green-100 text-green-800 border-green-200" : "bg-amber-100 text-amber-800 border-amber-200")}>
                      {a.stato}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setActions(p => [...p, { azione: "", responsabile: "", scadenza: "", stato: "aperto" }])} className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Plus size={12} /> Aggiungi action item
          </button>
        </div>
      </FormSection>

      <FormSection title="Note" cols={1}>
        <Field label="Note aggiuntive e osservazioni">
          <Textarea value={d.note} onChange={v => set("note", v)} rows={2} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}