import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";

const ESITI = ["OK", "KO", "N/A"];

export default function Form00F({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "00F");

  const rows = d?.kyc_rows ?? [];
  const setRow = (i, k, v) => {
    const n = [...rows];
    n[i] = { ...n[i], [k]: v };
    updateField("kyc_rows", n);
  };

  const okCount = rows.filter(r => r.esito === "OK").length;
  const koCount = rows.filter(r => r.esito === "KO").length;

  return (
    <FormWrapper
      formCode="FORM-00F"
      title="KYC / Adeguata Verifica Cliente"
      subtitle="Verifica da completare prima della firma del contratto — documentazione da allegare al fascicolo"
      meta={{ "Fase": "Pre-contratto", "Resp.": "Consulente Senior ESG", "Input": "FORM-00C esito GO", "Timing": "Prima di FORM-00E", "Output": "Fascicolo KYC firmato" }}
      ruleBox="📌 Da completare prima della firma del contratto. Allegare la documentazione verificata al fascicolo cliente."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >

      <FormSection title="Tabella Verifiche KYC — 10 controlli" cols={1}>
        <div className="flex gap-4 mb-3 text-sm">
          <span className="text-green-700 font-semibold">✓ OK: {okCount}</span>
          <span className="text-red-700 font-semibold">✗ KO: {koCount}</span>
          <span className="text-gray-500">N/A: {rows.filter(r => r.esito === "N/A").length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold">
                <th className="text-left px-3 py-2 w-8">#</th>
                <th className="text-left px-3 py-2 w-[35%]">Verifica</th>
                <th className="px-2 py-2 text-center">OK</th>
                <th className="px-2 py-2 text-center">KO</th>
                <th className="px-2 py-2 text-center">N/A</th>
                <th className="px-3 py-2 text-left">Data</th>
                <th className="px-3 py-2 text-left">Fonte utilizzata</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={cn("border-t border-border hover:bg-muted/20", row.esito === "KO" && "bg-red-50/50")}>
                  <td className="px-3 py-2 text-xs text-muted-foreground font-mono">{i + 1}</td>
                  <td className="px-3 py-2">{row.verifica}</td>
                  {ESITI.map(esito => (
                    <td key={esito} className="px-2 py-2 text-center">
                      <input
                        type="radio"
                        name={`kyc_esito_${i}`}
                        value={esito}
                        checked={row.esito === esito}
                        onChange={() => setRow(i, "esito", esito)}
                        className="accent-primary"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={row.data || ""}
                      onChange={e => setRow(i, "data", e.target.value)}
                      className="w-36 border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={row.fonte || ""}
                      onChange={e => setRow(i, "fonte", e.target.value)}
                      placeholder="Fonte / link documento"
                      className="w-full border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="Esito finale KYC" cols={1}>
        <Field label="Esito KYC complessivo">
          <div className="space-y-2">
            {[
              { v: "APPROVATO", label: "✅ APPROVATO — Nessuna criticità rilevata — Procedi con firma contratto" },
              { v: "APPROVATO_RISERVA", label: "⚠ APPROVATO CON RISERVA — Criticità minori, documentate" },
              { v: "SOSPESO", label: "⏸ SOSPESO — Richiede approfondimento" },
              { v: "RESPINTO", label: "🛑 RESPINTO — Criticità gravi — No-Go definitivo" },
            ].map(opt => (
              <label key={opt.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="kyc_esito_finale" value={opt.v} checked={d?.esito_finale === opt.v} onChange={() => updateField("esito_finale", opt.v)} className="accent-primary" />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Note e motivazione" span={2}>
          <Textarea value={d?.note_motivazione} onChange={v => updateField("note_motivazione", v)} rows={3} placeholder="Spiegare eventuali criticità riscontrate e decisione adottata..." />
        </Field>
        <Field label="Verificato da">
          <Input value={d?.verificato_da} onChange={v => updateField("verificato_da", v)} />
        </Field>
        <Field label="Data verifica">
          <Input type="date" value={d?.data_verifica} onChange={v => updateField("data_verifica", v)} />
        </Field>
      </FormSection>

    </FormWrapper>
  );
}
