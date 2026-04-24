import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select } from "@/components/common/FormWrapper";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const STORAGE_KEY = "esg_form_01F";
const INITIAL = acmeFormData["01F"] ?? {};

export default function Form01F() {
  const [d, setD] = useState(INITIAL);
  const [riunioni, setRiunioni] = useState(INITIAL.riunioni || []);
  const [reportistica, setReportistica] = useState(INITIAL.reportistica || []);
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));

  return (
    <FormWrapper
      formCode="FORM-01F"
      title="Piano di Comunicazione"
      subtitle="Governance della comunicazione e del reporting interno di progetto"
      meta={{ "Fase": "PROC-01.6", "Resp.": "Project Manager", "Output": "Piano comunicazione attivato" }}
      ruleBox="📢 Definire e comunicare il piano di reporting a tutti gli stakeholder entro il kick-off. Rispettare le scadenze dei report per mantenere fiducia del cliente."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >
      <FormSection title="Impostazioni generali">
        <Field label="Frequenza status report">
          <Select value={d.frequenza_report} onChange={v => set("frequenza_report", v)} options={["settimanale", "bisettimanale", "mensile", "ad hoc"]} />
        </Field>
        <Field label="Canale di comunicazione principale">
          <Input value={d.canale_principale} onChange={v => set("canale_principale", v)} />
        </Field>
        <Field label="Piattaforma di progetto">
          <Input value={d.piattaforma} onChange={v => set("piattaforma", v)} />
        </Field>
      </FormSection>

      <FormSection title="Piano riunioni" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-3 py-2">Tipo riunione</th>
                <th className="text-left px-3 py-2">Frequenza</th>
                <th className="text-left px-3 py-2">Partecipanti</th>
                <th className="text-left px-3 py-2">Formato</th>
              </tr>
            </thead>
            <tbody>
              {riunioni.map((r, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/20">
                  <td className="px-3 py-2 font-medium">{r.tipo}</td>
                  <td className="px-3 py-2">
                    <select value={r.freq} onChange={e => { const n = [...riunioni]; n[i] = { ...n[i], freq: e.target.value }; setRiunioni(n); }} className="border border-border rounded px-2 py-1 text-xs bg-background">
                      {["Settimanale", "Bisettimanale", "Mensile", "Ad hoc (pre-milestone)"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input value={r.partecipanti} onChange={e => { const n = [...riunioni]; n[i] = { ...n[i], partecipanti: e.target.value }; setRiunioni(n); }} className="w-full border border-border rounded px-2 py-1 text-xs bg-background" />
                  </td>
                  <td className="px-3 py-2">
                    <select value={r.formato} onChange={e => { const n = [...riunioni]; n[i] = { ...n[i], formato: e.target.value }; setRiunioni(n); }} className="border border-border rounded px-2 py-1 text-xs bg-background">
                      {["Presenza", "MS Teams", "Presenza / VC", "Videoconferenza"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="Piano reportistica" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold uppercase tracking-wider">
                <th className="text-left px-3 py-2">Documento</th>
                <th className="text-left px-3 py-2">Destinatario</th>
                <th className="text-left px-3 py-2">Formato</th>
              </tr>
            </thead>
            <tbody>
              {reportistica.map((r, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/20">
                  <td className="px-3 py-2 font-medium">{r.documento}</td>
                  <td className="px-3 py-2">
                    <input value={r.destinatario} onChange={e => { const n = [...reportistica]; n[i] = { ...n[i], destinatario: e.target.value }; setReportistica(n); }} className="w-full border border-border rounded px-2 py-1 text-xs bg-background" />
                  </td>
                  <td className="px-3 py-2">
                    <input value={r.formato} onChange={e => { const n = [...reportistica]; n[i] = { ...n[i], formato: e.target.value }; setReportistica(n); }} className="w-full border border-border rounded px-2 py-1 text-xs bg-background" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="Procedura di escalation" cols={1}>
        <Field label="Procedura in caso di criticità bloccante">
          <Textarea value={d.escalation_procedure} onChange={v => set("escalation_procedure", v)} rows={3} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}