import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { useState } from "react";
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

export default function Form02F({ eng }) {
  const [risposte, setRisposte] = useState(() =>
    Object.fromEntries(TEMI_EXT.map((_, i) => [`tema_${i}`, ["", "", "", "", ""]]))
  );
  const [data, setData] = useState({
    codice_progetto: eng?.project_code || "",
    cliente: eng?.cliente_nome || "",
    totale_invitati: "",
    totale_risposte: "",
    tasso_risposta: "",
    periodo: "",
    seg_clienti: "",
    seg_fornitori: "",
    seg_finanziari: "",
    seg_comunita: "",
    seg_pa: "",
    seg_ong: "",
    req_futuri: "",
    rinuncia: "",
    maggiore_impegno: "",
    valutazione: "",
    elaborato_da: "",
    data_elaborazione: "",
  });

  const set = (k) => (v) => setData(prev => ({ ...prev, [k]: v }));

  const calcolaMedia = (risposteArr) => {
    let sum = 0, tot = 0;
    risposteArr.forEach((v, idx) => {
      const n = parseInt(v);
      if (!isNaN(n) && n > 0) { sum += (idx + 1) * n; tot += n; }
    });
    return tot > 0 ? (sum / tot).toFixed(2) : "—";
  };

  return (
    <FormWrapper
      formCode="FORM-02F"
      title="Questionario Stakeholder Esterni — Dati aggregati"
      subtitle="12 temi ESG · Target ≥15% risposte · Clienti/Fornitori/Banche/Comunità"
      meta={{
        Fase: "Fase 2.5",
        Input: "FORM-02B · Lista contatti stakeholder esterni",
        Responsabile: "Analista ESG",
        Timing: "Survey aperta 10-15 gg lavorativi",
        Output: "Dati aggregati · Input per FORM-02G",
      }}
      ruleBox={<><strong>Questionario per stakeholder esterni:</strong> clienti, fornitori, banche, investitori, comunità, ONG. Inserire numero di risposte per livello di rilevanza (1-5) per ogni tema.</>}
      storageKey={`form02f_${eng?.id}`}
    >
      <FormSection title="Identificazione e contatori" cols={3}>
        <Field label="Codice progetto"><Input value={data.codice_progetto} onChange={set("codice_progetto")} /></Field>
        <Field label="Cliente"><Input value={data.cliente} onChange={set("cliente")} /></Field>
        <Field label="Periodo survey"><Input value={data.periodo} onChange={set("periodo")} placeholder="es. 10 mar — 25 mar 2026" /></Field>
        <Field label="Totale invitati"><Input type="number" value={data.totale_invitati} onChange={set("totale_invitati")} /></Field>
        <Field label="Totale risposte"><Input type="number" value={data.totale_risposte} onChange={set("totale_risposte")} /></Field>
        <Field label="Tasso risposta (%)"><Input value={data.tasso_risposta} onChange={set("tasso_risposta")} /></Field>
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
          <Field key={k} label={l}><Input type="number" value={data[k]} onChange={set(k)} /></Field>
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
                const arr = risposte[`tema_${i}`] || ["","","","",""];
                const media = calcolaMedia(arr);
                const mediaNum = parseFloat(media);
                return (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-3 py-2 text-foreground">{tema}</td>
                    {[0,1,2,3,4].map(j => (
                      <td key={j} className="px-2 py-2 text-center">
                        <input
                          type="number"
                          min="0"
                          value={arr[j]}
                          onChange={e => {
                            const newArr = [...arr];
                            newArr[j] = e.target.value;
                            setRisposte(prev => ({ ...prev, [`tema_${i}`]: newArr }));
                          }}
                          className="w-14 border border-border rounded px-1.5 py-0.5 text-center text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                          placeholder="0"
                        />
                      </td>
                    ))}
                    <td className={cn("px-3 py-2 text-center font-bold tabular-nums",
                      !isNaN(mediaNum) ? mediaNum >= 3.5 ? "text-green-700 dark:text-green-400" : mediaNum >= 2.5 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground" : "text-muted-foreground"
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
          <Textarea value={data.req_futuri} onChange={set("req_futuri")} rows={3} />
        </Field>
        <Field label="Stakeholder che hanno rinunciato a collaborare per motivi ESG">
          <Textarea value={data.rinuncia} onChange={set("rinuncia")} rows={2} />
        </Field>
        <Field label="Tema su cui ci si aspetta maggiore impegno nei prossimi 3 anni">
          <Textarea value={data.maggiore_impegno} onChange={set("maggiore_impegno")} rows={3} />
        </Field>
        <Field label="Valutazione complessiva attuale impegno ESG (sintesi)">
          <Textarea value={data.valutazione} onChange={set("valutazione")} rows={2} />
        </Field>
      </FormSection>

      <FormSection title="Elaborazione" cols={2}>
        <Field label="Elaborato da"><Input value={data.elaborato_da} onChange={set("elaborato_da")} /></Field>
        <Field label="Data elaborazione"><Input type="date" value={data.data_elaborazione} onChange={set("data_elaborazione")} /></Field>
      </FormSection>
    </FormWrapper>
  );
}