import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select, RadioGroup, CheckboxGroup } from "@/components/common/FormWrapper";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const INITIAL = acmeFormData["00A"] ?? {};
const STORAGE_KEY = "esg_engagement_ESG-2025-ACM-001_form_00A";

export default function Form00A() {
  const [d, setD] = useState(INITIAL);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));

  return (
    <FormWrapper
      formCode="FORM-00A"
      title="Primo Contatto"
      subtitle="Scheda di primo contatto commerciale — compilare entro 4 ore lavorative dalla ricezione"
      meta={{
        "Fase": "0.1 – 0.2",
        "Input": "Chiamata / email / form contatto",
        "Resp.": "Consulente assegnato",
        "Timing": "Entro 4h lavorative",
        "Output": "Scheda CRM — stato LEAD"
      }}
      ruleBox="📌 Istruzione operativa: Compilare entro 4 ore lavorative dalla ricezione. Annotare verbatim la descrizione della necessità espressa dal contatto. Aprire scheda CRM con stato LEAD — In valutazione."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >

      {/* SEZIONE 1 */}
      <FormSection title="Sezione 1 — Dati del contatto / Canale">
        <Field label="Data primo contatto" required>
          <Input type="date" value={d.data_primo_contatto} onChange={v => set("data_primo_contatto", v)} />
        </Field>
        <Field label="Ora primo contatto">
          <Input type="text" value={d.ora_primo_contatto} onChange={v => set("ora_primo_contatto", v)} placeholder="es. 14:30" />
        </Field>
        <Field label="Canale di provenienza" required>
          <Select
            value={d.canale}
            onChange={v => set("canale", v)}
            placeholder="Seleziona canale"
            options={[
              "Sito web / Form",
              "Email diretta",
              "Telefono / WhatsApp",
              "Passaparola / Referral",
              "LinkedIn / Social",
              "Evento / Convegno",
              "Outbound / Cold"
            ]}
          />
        </Field>
        <Field label="Consulente assegnato" required>
          <Input value={d.consulente_assegnato} onChange={v => set("consulente_assegnato", v)} placeholder="Nome consulente" />
        </Field>
        <Field label="Descrizione richiesta (verbatim, così come espressa)" required span={2}>
          <Textarea value={d.descrizione_richiesta} onChange={v => set("descrizione_richiesta", v)} rows={3} placeholder="Trascrivi esattamente le parole del contatto..." />
        </Field>
      </FormSection>

      {/* SEZIONE 2 */}
      <FormSection title="Sezione 2 — Dati azienda">
        <Field label="Ragione sociale" required span={2}>
          <Input value={d.ragione_sociale} onChange={v => set("ragione_sociale", v)} placeholder="Es. Acme Manufacturing S.p.A." />
        </Field>
        <Field label="P.IVA / C.F.">
          <Input value={d.piva} onChange={v => set("piva", v)} placeholder="01234567890" className="font-mono" />
        </Field>
        <Field label="Sede legale">
          <Input value={d.sede} onChange={v => set("sede", v)} placeholder="Via Roma 1, 20121 Milano MI" />
        </Field>
        <Field label="Settore di attività">
          <Input value={d.settore} onChange={v => set("settore", v)} placeholder="Es. Automotive, Chimica, GDO..." />
        </Field>
        <Field label="Codice ATECO">
          <Input value={d.ateco} onChange={v => set("ateco", v)} placeholder="Es. 29.10" />
        </Field>
        <Field label="N. dipendenti">
          <Input type="number" value={d.dipendenti} onChange={v => set("dipendenti", v)} placeholder="250" />
        </Field>
        <Field label="Fatturato annuo (€)" hint="Importo orientativo, anche range">
          <Input value={d.fatturato} onChange={v => set("fatturato", v)} placeholder="es. 5.000.000" />
        </Field>
        <Field label="Sito web">
          <Input type="url" value={d.sito_web} onChange={v => set("sito_web", v)} placeholder="https://www.azienda.it" />
        </Field>
        <Field label="Quotazione">
          <RadioGroup
            value={d.quotazione}
            onChange={v => set("quotazione", v)}
            options={["Sì — specificare", "No", "Partecipata pubblica"]}
          />
        </Field>
        <Field label="Dettaglio quotazione (se Sì)">
          <Input value={d.quotazione_note} onChange={v => set("quotazione_note", v)} placeholder="Es. Borsa Italiana — segmento STAR" />
        </Field>
      </FormSection>

      {/* SEZIONE 3 */}
      <FormSection title="Sezione 3 — Referente aziendale">
        <Field label="Nome e cognome" required>
          <Input value={d.ref_nome} onChange={v => set("ref_nome", v)} placeholder="Mario Rossi" />
        </Field>
        <Field label="Ruolo / Funzione">
          <Input value={d.ref_ruolo} onChange={v => set("ref_ruolo", v)} placeholder="CEO, CFO, CSO..." />
        </Field>
        <Field label="Email aziendale" required>
          <Input type="email" value={d.ref_email} onChange={v => set("ref_email", v)} placeholder="mario.rossi@azienda.it" />
        </Field>
        <Field label="Telefono diretto">
          <Input type="tel" value={d.ref_telefono} onChange={v => set("ref_telefono", v)} placeholder="+39 02 1234567" />
        </Field>
        <Field label="Autonomia decisionale" span={2}>
          <RadioGroup
            value={d.ref_autonomia}
            onChange={v => set("ref_autonomia", v)}
            options={["Sì, piena autonomia", "Sì, parziale", "No — decide altri"]}
          />
        </Field>
        <Field label="Se parziale/no — specificare decisore" span={2}>
          <Input value={d.ref_autonomia_note} onChange={v => set("ref_autonomia_note", v)} placeholder="Nome e ruolo del decisore finale" />
        </Field>
      </FormSection>

      {/* SEZIONE 4 */}
      <FormSection title="Sezione 4 — Natura della richiesta" cols={1}>
        <Field label="Servizi richiesti (seleziona tutti applicabili)">
          <CheckboxGroup
            values={d.servizi_richiesti || []}
            onChange={v => set("servizi_richiesti", v)}
            cols={2}
            options={[
              "Implementazione sistema ESG completo",
              "Bilancio di Sostenibilità (GRI)",
              "Bilancio CSRD / ESRS",
              "Analisi di materialità",
              "Gap Analysis ESG",
              "ESG Rating & Benchmark",
              "Formazione ESG",
              "Supporto normativo (CSRD, Tassonomia UE)",
              "Altro"
            ]}
          />
        </Field>
        <Field label="Altro — specificare">
          <Input value={d.servizi_altro} onChange={v => set("servizi_altro", v)} placeholder="Descrivi il servizio richiesto" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <Field label="Motivazione (Perché ora?)">
            <Input value={d.motivazione} onChange={v => set("motivazione", v)} placeholder="Requisiti cliente, normativa, bando..." />
          </Field>
          <Field label="Timeline desiderata">
            <Input value={d.timeline} onChange={v => set("timeline", v)} placeholder="es. Bilancio entro settembre 2025" />
          </Field>
          <Field label="Budget indicativo (€)">
            <Input value={d.budget_indicativo} onChange={v => set("budget_indicativo", v)} placeholder="es. 30.000 – 50.000" />
          </Field>
        </div>
      </FormSection>

      {/* SEZIONE 5 */}
      <FormSection title="Sezione 5 — Valutazione immediata del consulente">
        <Field label="Interesse percepito">
          <Select
            value={d.interesse_percepito}
            onChange={v => set("interesse_percepito", v)}
            placeholder="Seleziona"
            options={["Alto", "Medio", "Basso", "Non valutabile"]}
          />
        </Field>
        <Field label="Maturità ESG percepita">
          <Select
            value={d.maturita_esg}
            onChange={v => set("maturita_esg", v)}
            placeholder="Seleziona"
            options={["Avanzata", "Intermedia", "Base", "Assente"]}
          />
        </Field>
        <Field label="Urgenza dichiarata">
          <Select
            value={d.urgenza}
            onChange={v => set("urgenza", v)}
            placeholder="Seleziona"
            options={["Alta", "Media", "Bassa"]}
          />
        </Field>
        <Field label="Prossimi passi concordati">
          <Input value={d.prossimi_passi} onChange={v => set("prossimi_passi", v)} placeholder="es. Inviare FORM-00B, fissare call" />
        </Field>
        <Field label="Data follow-up programmata">
          <Input type="date" value={d.data_follow_up} onChange={v => set("data_follow_up", v)} />
        </Field>
        <Field label="Note interne (non condividere con il cliente)" span={2}>
          <Textarea value={d.note_interne} onChange={v => set("note_interne", v)} rows={3} placeholder="Osservazioni riservate sul contatto..." />
        </Field>
      </FormSection>

    </FormWrapper>
  );
}