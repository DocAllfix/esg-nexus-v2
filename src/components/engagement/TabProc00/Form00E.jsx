import { useState, useMemo } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select, CheckboxGroup } from "@/components/common/FormWrapper";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const STORAGE_KEY = "esg_engagement_ESG-2025-ACM-001_form_00E";
const INITIAL = acmeFormData["00E"] ?? {};

export default function Form00E() {
  const [d, setD] = useState(INITIAL);
  const [piano, setPiano] = useState(INITIAL.piano || []);
  const [eco, setEco] = useState(INITIAL.economics || {});
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));
  const setEcoRow = (k, v) => setEco(prev => ({ ...prev, [k]: Number(v) || 0 }));
  const setPianoRow = (i, k, v) => setPiano(prev => { const n = [...prev]; n[i] = { ...n[i], [k]: v }; return n; });

  const { subtotale, iva, totale } = useMemo(() => {
    const sub = Object.values(eco).reduce((a, b) => a + (Number(b) || 0), 0);
    return { subtotale: sub, iva: sub * 0.22, totale: sub * 1.22 };
  }, [eco]);

  const fmt = (n) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

  return (
    <FormWrapper
      formCode="FORM-00E"
      title="Offerta Commerciale"
      subtitle="Da redigere solo dopo esito GO (FORM-00C) e KYC approvato (FORM-00F)"
      meta={{ "Fase": "0.7", "Resp.": "Consulente Senior + Partner", "Input": "FORM-00C GO + FORM-00F APPROVATO", "Timing": "Entro 5 giorni da GO", "Output": "Offerta firmata" }}
      ruleBox="📌 Da redigere solo dopo esito GO (FORM-00C) e KYC approvato (FORM-00F). Personalizzare sul contesto emerso in FORM-00A e 00B."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >

      {/* INTESTAZIONE */}
      <FormSection title="Intestazione offerta">
        <Field label="N. offerta" required>
          <Input value={d.num_offerta} onChange={v => set("num_offerta", v)} placeholder="OFF-2024-001" className="font-mono" />
        </Field>
        <Field label="Data emissione">
          <Input type="date" value={d.data_emissione} onChange={v => set("data_emissione", v)} />
        </Field>
        <Field label="Cliente" required>
          <Input value={d.cliente} onChange={v => set("cliente", v)} />
        </Field>
        <Field label="P.IVA Cliente">
          <Input value={d.piva} onChange={v => set("piva", v)} className="font-mono" />
        </Field>
        <Field label="Referente cliente">
          <Input value={d.referente} onChange={v => set("referente", v)} />
        </Field>
        <Field label="Validità offerta (giorni)">
          <Input type="number" value={d.validita_gg} onChange={v => set("validita_gg", v)} placeholder="30" />
        </Field>
      </FormSection>

      {/* OGGETTO */}
      <FormSection title="Oggetto e contesto" cols={1}>
        <Field label="Descrizione dell'esigenza del cliente">
          <Textarea value={d.descrizione_esigenza} onChange={v => set("descrizione_esigenza", v)} rows={4} placeholder="Descrivi il contesto e le necessità specifiche del cliente..." />
        </Field>
      </FormSection>

      {/* SERVIZI */}
      <FormSection title="Servizi inclusi — Perimetro" cols={1}>
        <Field label="Seleziona tutti i servizi compresi nell'offerta">
          <CheckboxGroup
            values={d.servizi_inclusi || []}
            onChange={v => set("servizi_inclusi", v)}
            cols={2}
            options={[
              "Analisi di materialità (stakeholder mapping + questionari + mappa)",
              "Gap Analysis ESG completa (E + S + G)",
              "Raccolta e validazione dati ESG (tutte le aree materiali)",
              "Redazione Bilancio di Sostenibilità (GRI Standards 2021)",
              "Conformità CSRD / ESRS (dichiarazione di conformità)",
              "Piano di Azione ESG (roadmap strategica 3-5 anni)",
              "Formazione interna",
              "ESG Rating & Benchmark di settore",
              "Supporto presentazione CdA",
              "Altro"
            ]}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="N. sessioni di formazione incluse">
            <Input type="number" value={d.formazione_sessioni} onChange={v => set("formazione_sessioni", v)} placeholder="0" />
          </Field>
          <Field label="Altro servizio — specificare">
            <Input value={d.altro_servizio} onChange={v => set("altro_servizio", v)} />
          </Field>
        </div>
        <Field label="Esclusioni esplicite dal perimetro" span={2}>
          <Textarea value={d.esclusioni} onChange={v => set("esclusioni", v)} rows={2} placeholder="Es. Assurance di terza parte, certificazioni..." />
        </Field>
      </FormSection>

      {/* PIANO DI PROGETTO */}
      <FormSection title="Piano di progetto di massima" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold">
                <th className="text-left px-3 py-2 w-[25%]">Fase</th>
                <th className="px-3 py-2 text-center">Inizio</th>
                <th className="px-3 py-2 text-center">Fine</th>
                <th className="text-left px-3 py-2">Deliverable principale</th>
              </tr>
            </thead>
            <tbody>
              {piano.map((row, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/20">
                  <td className="px-3 py-2 text-sm font-medium">{row.fase}</td>
                  <td className="px-3 py-2">
                    <input type="date" value={row.inizio || ""} onChange={e => setPianoRow(i, "inizio", e.target.value)} className="w-36 border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="date" value={row.fine || ""} onChange={e => setPianoRow(i, "fine", e.target.value)} className="w-36 border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="text" value={row.deliverable || ""} onChange={e => setPianoRow(i, "deliverable", e.target.value)} placeholder="Output atteso" className="w-full border border-border rounded px-2 py-1 text-xs bg-background focus:outline-none" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      {/* CORRISPETTIVO ECONOMICO */}
      <FormSection title="Corrispettivo economico" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-xs font-semibold">
                <th className="text-left px-4 py-2">Voce di costo</th>
                <th className="px-4 py-2 text-right">Importo (€)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: "consulenza_esg", label: "Consulenza ESG forfettaria" },
                { key: "raccolta_ghg", label: "Raccolta dati GHG" },
                { key: "formazione", label: "Formazione (n. sessioni × prezzo)" },
                { key: "validazione_assurance", label: "Validazione / Assurance" },
                { key: "altri_servizi", label: "Altri servizi" },
              ].map(row => (
                <tr key={row.key} className="border-t border-border hover:bg-muted/20">
                  <td className="px-4 py-2">{row.label}</td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      value={eco[row.key] ?? ""}
                      onChange={e => setEcoRow(row.key, e.target.value)}
                      placeholder="0"
                      className="w-36 border border-border rounded px-2 py-1 text-sm bg-background focus:outline-none text-right"
                    />
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-border bg-muted/40">
                <td className="px-4 py-2 font-semibold">Subtotale</td>
                <td className="px-4 py-2 text-right font-semibold font-mono">{fmt(subtotale)}</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2 text-muted-foreground">IVA 22%</td>
                <td className="px-4 py-2 text-right font-mono text-muted-foreground">{fmt(iva)}</td>
              </tr>
              <tr className="border-t-2 border-border bg-primary/5">
                <td className="px-4 py-2 font-bold text-lg">TOTALE</td>
                <td className="px-4 py-2 text-right font-bold text-lg font-mono text-primary">{fmt(totale)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormSection>

      {/* MODALITÀ DI PAGAMENTO */}
      <FormSection title="Modalità di pagamento">
        <Field label="Modalità">
          <Select
            value={d.modalita_pagamento}
            onChange={v => set("modalita_pagamento", v)}
            placeholder="Seleziona"
            options={[
              "30% firma / 40% metà / 30% consegna",
              "50% firma / 50% consegna",
              "100% a consegna",
              "Altra"
            ]}
          />
        </Field>
        <Field label="Scadenza fatture">
          <Input value={d.scadenza_fatture} onChange={v => set("scadenza_fatture", v)} placeholder="Es. 30 giorni d.f.f.m." />
        </Field>
        <Field label="Metodo di pagamento">
          <Select
            value={d.metodo_pagamento}
            onChange={v => set("metodo_pagamento", v)}
            options={["Bonifico IBAN", "Altro"]}
          />
        </Field>
        <Field label="IBAN">
          <Input value={d.iban} onChange={v => set("iban", v)} className="font-mono" placeholder="IT60 X054 2811 1010 0000 0123 456" />
        </Field>
        <Field label="Note economiche" span={2}>
          <Textarea value={d.note_economiche} onChange={v => set("note_economiche", v)} rows={2} />
        </Field>
      </FormSection>

      {/* ACCETTAZIONE */}
      <FormSection title="Accettazione e firme">
        <Field label="Firma consulente">
          <Input value={d.firma_consulente} onChange={v => set("firma_consulente", v)} />
        </Field>
        <Field label="Data">
          <Input type="date" value={d.firma_consulente_data} onChange={v => set("firma_consulente_data", v)} />
        </Field>
        <Field label="Firma cliente">
          <Input value={d.firma_cliente} onChange={v => set("firma_cliente", v)} />
        </Field>
        <Field label="Data firma cliente">
          <Input type="date" value={d.firma_cliente_data} onChange={v => set("firma_cliente_data", v)} />
        </Field>
        <Field label="Stato offerta" span={2}>
          <div className="flex flex-wrap gap-4">
            {["bozza", "inviata", "in_negoziazione", "accettata", "rifiutata"].map(s => (
              <label key={s} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="stato_offerta" value={s} checked={d.stato_offerta === s} onChange={() => set("stato_offerta", s)} className="accent-primary" />
                <span className="text-sm capitalize">{s.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </Field>
      </FormSection>

    </FormWrapper>
  );
}