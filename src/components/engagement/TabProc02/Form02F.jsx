import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";

const TEMI_EXT = [
  "Riduzione impatto climatico e emissioni CO₂",
  "Efficienza energetica ed energie rinnovabili",
  "Economia circolare e gestione rifiuti",
  "Tutela dell'acqua e delle risorse naturali",
  "Rispetto e dignità dei lavoratori (salute, salari equi)",
  "Parità di genere e inclusione",
  "Rispetto dei diritti umani nella filiera",
  "Impatto positivo sulle comunità locali",
  "Trasparenza e correttezza nei rapporti commerciali",
  "Protezione dati personali e cybersecurity",
  "Politiche anticorruzione e governance etica",
  "Qualità e sicurezza dei prodotti/servizi offerti",
];

const LIVELLI = ["1 — Per niente", "2 — Poco", "3 — Abbastanza", "4 — Molto", "5 — Fondamentale"];

const DEFAULT_RISPOSTE = Object.fromEntries(TEMI_EXT.map((_, i) => [`tema_${i}`, ["", "", "", "", ""]]));

const calcolaMedia = (risposteArr) => {
  let sum = 0, tot = 0;
  risposteArr.forEach((v, idx) => {
    const n = parseInt(v);
    if (!isNaN(n) && n > 0) { sum += (idx + 1) * n; tot += n; }
  });
  return tot > 0 ? (sum / tot).toFixed(2) : "—";
};

export default function Form02F({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "02F");

  const risposte = d?.risposte ?? DEFAULT_RISPOSTE;

  return (
    <FormWrapper
      formCode="FORM-02F"
      title="Questionario Stakeholder Esterni — Dati aggregati"
      subtitle="12 temi ESG · Target ≥15% risposte · Clienti/Fornitori/Banche/Comunità"
      meta={{
        "Fase": "Fase 2.5",
        "Input": "FORM-02B · Lista contatti stakeholder esterni",
        "Resp.": "Analista ESG",
        "Timing": "Survey aperta 10-15 gg lavorativi",
        "Output": "Dati aggregati · Input per FORM-02G",
      }}
      ruleBox={<><strong>Questionario per stakeholder esterni:</strong> clienti, fornitori, banche, investitori, comunità, ONG. Inserire numero di risposte per livello di rilevanza (1-5) per ogni tema.</>}
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <FormSection title="Identificazione e contatori" cols={3}>
        <Field label="Codice progetto"><Input value={d?.codice_progetto} onChange={v => updateField("codice_progetto", v)} /></Field>
        <Field label="Cliente"><Input value={d?.cliente} onChange={v => updateField("cliente", v)} /></Field>
        <Field label="Periodo survey"><Input value={d?.periodo} onChange={v => updateField("periodo", v)} placeholder="es. 10 mar — 25 mar 2026" /></Field>
        <Field label="Totale invitati"><Input type="number" value={d?.totale_invitati} onChange={v => updateField("totale_invitati", v)} /></Field>
        <Field label="Totale risposte"><Input type="number" value={d?.totale_risposte} onChange={v => updateField("totale_risposte", v)} /></Field>
        <Field label="Tasso risposta (%)"><Input value={d?.tasso_risposta} onChange={v => updateField("tasso_risposta", v)} /></Field>
      </FormSection>

      <FormSection title="Segmentazione per tipologia stakeholder" cols={3}>
        {[
          ["seg_clienti", "Risposte da Clienti"],
          ["seg_fornitori", "Risposte da Fornitori"],
          ["seg_finanziari", "Risposte da Banche/Investitori"],
          ["seg_comunita", "Risposte da Comunità/Associaz."],
          ["seg_pa", "Risposte da PA/Regolatori"],
          ["seg_ong", "Risposte da ONG"],
        ].map(([k, l]) => (
          <Field key={k} label={l}><Input type="number" value={d?.[k]} onChange={v => updateField(k, v)} /></Field>
        ))}
      </FormSection>

      <FormSection title="Aspettative ESG — risposte aggregate per tema" cols={1}>
        <div className="bg-muted/20 border border-border/60 rounded-lg px-3 py-2 text-xs text-muted-foreground mb-3">
          Per ogni tema inserire il <strong className="text-foreground">numero di risposte</strong> ricevute per ogni livello di rilevanza (1-5). La media ponderata è calcolata automaticamente.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground min-w-[240px]">Tema ESG</th>
                {LIVELLI.map(l => (
                  <th key={l} className="px-2 py-2.5 text-center font-semibold text-muted-foreground w-20 text-[10px] whitespace-nowrap">{l}</th>
                ))}
                <th className="px-3 py-2.5 text-center font-semibold text-muted-foreground w-16">Media</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TEMI_EXT.map((tema, i) => {
                const arr = risposte[`tema_${i}`] || ["", "", "", "", ""];
                const media = calcolaMedia(arr);
                const mediaNum = parseFloat(media);
                return (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-3 py-2 text-foreground">{tema}</td>
                    {[0, 1, 2, 3, 4].map(j => (
                      <td key={j} className="px-2 py-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={arr[j]}
                          onChange={e => {
                            const newArr = [...arr];
                            newArr[j] = e.target.value;
                            updateField("risposte", { ...risposte, [`tema_${i}`]: newArr });
                          }}
                          className="w-14 border border-border rounded px-1.5 py-0.5 text-center text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                          placeholder="0"
                        />
                      </td>
                    ))}
                    <td className={cn("px-3 py-2 text-center font-bold tabular-nums",
                      !isNaN(mediaNum) ? mediaNum >= 3.5 ? "text-green-700" : mediaNum >= 2.5 ? "text-amber-600" : "text-muted-foreground" : "text-muted-foreground"
                    )}>
                      {media}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="Sintesi domande qualitative aperte" cols={1}>
        <Field label="Requisiti ESG che gli stakeholder richiedono/richiederanno (sintesi)">
          <Textarea value={d?.req_futuri} onChange={v => updateField("req_futuri", v)} rows={3} />
        </Field>
        <Field label="Stakeholder che hanno rinunciato a collaborare per motivi ESG">
          <Textarea value={d?.rinuncia} onChange={v => updateField("rinuncia", v)} rows={2} />
        </Field>
        <Field label="Tema su cui ci si aspetta maggiore impegno nei prossimi 3 anni">
          <Textarea value={d?.maggiore_impegno} onChange={v => updateField("maggiore_impegno", v)} rows={3} />
        </Field>
        <Field label="Valutazione complessiva attuale impegno ESG (sintesi)">
          <Textarea value={d?.valutazione} onChange={v => updateField("valutazione", v)} rows={2} />
        </Field>
      </FormSection>

      <FormSection title="Elaborazione" cols={2}>
        <Field label="Elaborato da"><Input value={d?.elaborato_da} onChange={v => updateField("elaborato_da", v)} /></Field>
        <Field label="Data elaborazione"><Input type="date" value={d?.data_elaborazione} onChange={v => updateField("data_elaborazione", v)} /></Field>
      </FormSection>
    </FormWrapper>
  );
}
