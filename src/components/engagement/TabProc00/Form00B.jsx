import FormWrapper, { FormSection, Field, Input, Textarea, CheckboxGroup, RadioGroup } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";

const TABLE_D1_ROWS = [
  "N. dipendenti per genere/contratto",
  "Tasso di turnover (%)",
  "Ore di formazione per dipendente",
  "Tasso di frequenza infortuni (TF)",
  "Indice di gravità infortuni (TG)",
  "Gender pay gap (%M/F)",
  "N. assunzioni e cessazioni",
  "Tasso di assenteismo (%)"
];

export default function Form00B({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "00B");

  const d1 = d?.d1_table ?? TABLE_D1_ROWS.map(() => "");
  const setD1Row = (i, v) => {
    const n = [...d1];
    n[i] = v;
    updateField("d1_table", n);
  };

  return (
    <FormWrapper
      formCode="FORM-00B"
      title="Questionario di Pre-Qualifica"
      subtitle="Raccolta strutturata di informazioni strategiche, operative e di contesto ESG dell'azienda"
      meta={{
        "Fase": "0.3",
        "Input": "FORM-00A compilato",
        "Resp.": "Referente cliente (compilato da cliente)",
        "Timing": "Entro 5 giorni dalla ricezione del link",
        "Output": "Profilo ESG sintetico per scoring"
      }}
      ruleBox="📋 Il questionario va inviato al referente cliente via email con link. Spiegare che le risposte sono riservate e utilizzate esclusivamente per configurare la proposta di consulenza."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >

      {/* BLOCCO A — Contesto strategico */}
      <FormSection title="Blocco A — Contesto strategico ESG" cols={1}>
        <Field label="A1. Precedenti esperienze di rendicontazione ESG / sostenibilità" span={2}>
          <Textarea value={d?.A1_precedenti} onChange={v => updateField("A1_precedenti", v)} rows={3} placeholder="Descrivere eventuali bilanci, report, certificazioni o rating ESG già ottenuti..." />
        </Field>
        <Field label="A2. Standard già utilizzati (se applicabili)">
          <CheckboxGroup
            values={d?.A2_standard || []}
            onChange={v => updateField("A2_standard", v)}
            cols={2}
            options={[
              "GRI Standards",
              "CSRD / ESRS",
              "SA8000",
              "ISO 14001",
              "ISO 45001",
              "Carbon Disclosure Project (CDP)",
              "TCFD",
              "UN SDGs",
              "Nessuno"
            ]}
          />
        </Field>
        <Field label="A3. Principali obiettivi del progetto ESG" span={2}>
          <CheckboxGroup
            values={d?.A3_obiettivi || []}
            onChange={v => updateField("A3_obiettivi", v)}
            cols={2}
            options={[
              "Requisiti clienti OEM",
              "Accesso a finanziamenti/bandi ESG",
              "Miglioramento rating ESG / scoring banche",
              "Rendicontazione obbligatoria CSRD",
              "Comunicazione esterna / reputazione",
              "Attrarre talenti / employer branding",
              "Riduzione costi operativi (energia, rifiuti)",
              "Pressione investitori",
              "Richiesta del CdA",
              "Altro"
            ]}
          />
        </Field>
        <Field label="A4. Chi è il principale sponsor del progetto?" span={2}>
          <Input value={d?.A4_sponsor} onChange={v => updateField("A4_sponsor", v)} placeholder="Nome, ruolo e livello gerarchico dello sponsor" />
        </Field>
        <Field label="A5. Orizzonte temporale del progetto" span={2}>
          <RadioGroup
            value={d?.A5_orizzonte}
            onChange={v => updateField("A5_orizzonte", v)}
            options={[
              "Urgente: pubblicazione entro 6 mesi",
              "Breve: pubblicazione entro settembre 2025",
              "Medio: 1-2 anni",
              "Lungo: oltre 2 anni"
            ]}
          />
        </Field>
      </FormSection>

      {/* BLOCCO B — Dati energia */}
      <FormSection title="Blocco B — Disponibilità dati energia" cols={1}>
        <p className="text-xs text-muted-foreground -mt-2 mb-2">Selezionare le voci applicabili per i consumi energetici dell'azienda.</p>
        <Field label="B1. Dati energetici disponibili (seleziona tutti applicabili)">
          <CheckboxGroup
            values={d?.B1_e_energia || []}
            onChange={v => updateField("B1_e_energia", v)}
            cols={2}
            options={[
              "Bollette gas (completo)",
              "Bollette gas (parziale — anni mancanti)",
              "Bollette elettricità (completo)",
              "Bollette elettricità (parziale)",
              "Bollette carburanti flotta (completo)",
              "Bollette carburanti flotta (parziale)",
              "Dati teleriscaldamento",
              "Dati energia autoprodotta (FV/eolico)",
              "Nessun dato disponibile"
            ]}
          />
        </Field>
        <Field label="B2. Sistemi di monitoraggio energia attivi" span={2}>
          <Textarea value={d?.B2_sistemi_energia} onChange={v => updateField("B2_sistemi_energia", v)} rows={2} placeholder="Descrivere eventuali contatori, sistemi BMS, ISO 50001, SCADA..." />
        </Field>
      </FormSection>

      {/* BLOCCO C — Emissioni GHG */}
      <FormSection title="Blocco C — Emissioni GHG" cols={1}>
        <Field label="C1. Disponibilità dati GHG per vettore energetico">
          <CheckboxGroup
            values={d?.C1_e_emissioni || []}
            onChange={v => updateField("C1_e_emissioni", v)}
            cols={2}
            options={[
              "Dati gas naturale disponibili (archivio storico 3 anni)",
              "Dati gas naturale disponibili (solo anno corrente)",
              "Dati elettricità acquistata disponibili",
              "Dati gasolio/benzina disponibili",
              "Dati gas refrigeranti disponibili",
              "Dati processi speciali disponibili",
              "Nessun dato GHG disponibile"
            ]}
          />
        </Field>
        <Field label="C2. Vettori energetici presenti in azienda">
          <CheckboxGroup
            values={d?.C2_vettori || []}
            onChange={v => updateField("C2_vettori", v)}
            cols={2}
            options={[
              "Gas naturale (Smc)",
              "Gasolio / carburanti (litri)",
              "Benzina (litri)",
              "GPL (litri)",
              "Energia elettrica acquistata (kWh)",
              "Energie rinnovabili autoprodotte (kWh)",
              "Teleriscaldamento / altri vettori",
              "Gas refrigeranti (R134a, R410a, ecc.)"
            ]}
          />
        </Field>
        <Field label="C3. Acque e rifiuti — disponibilità dati">
          <CheckboxGroup
            values={d?.C3_acque_rifiuti || []}
            onChange={v => updateField("C3_acque_rifiuti", v)}
            cols={2}
            options={[
              "I consumi idrici non sono monitorati",
              "I consumi idrici sono misurati annualmente",
              "I rifiuti sono pesati e classificati per tipologia",
              "Registro MUD aggiornato annualmente",
              "Target di riduzione rifiuti formalizzati"
            ]}
          />
        </Field>
      </FormSection>

      {/* BLOCCO D — Dati sociali */}
      <FormSection title="Blocco D — Dati sociali (S)" cols={1}>
        <Field label="D1. Disponibilità dati HR — per ogni indicatore selezionare il livello">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted text-xs font-semibold">
                  <th className="text-left px-4 py-2 w-1/2">Indicatore</th>
                  <th className="px-3 py-2 text-center">Disponibile</th>
                  <th className="px-3 py-2 text-center">Parziale</th>
                  <th className="px-3 py-2 text-center">Assente</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_D1_ROWS.map((row, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-2">{row}</td>
                    {["Disponibile", "Parziale", "Assente"].map(opt => (
                      <td key={opt} className="px-3 py-2 text-center">
                        <input
                          type="radio"
                          name={`d1_${i}`}
                          value={opt}
                          checked={d1[i] === opt}
                          onChange={() => setD1Row(i, opt)}
                          className="accent-primary"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Field>
        <Field label="D2. Politiche sociali adottate">
          <CheckboxGroup
            values={d?.D2_politiche || []}
            onChange={v => updateField("D2_politiche", v)}
            cols={2}
            options={[
              "Codice Etico approvato dal CdA",
              "Politica di Salute e Sicurezza (DVR aggiornato)",
              "Politica di Diversity, Equity & Inclusion",
              "Politica di Smart Working / flessibilità",
              "Piano di welfare aziendale strutturato",
              "Codice di condotta fornitori con criteri sociali",
              "Politica di work-life balance",
              "Procedura segnalazione molestie/discriminazioni"
            ]}
          />
        </Field>
      </FormSection>

      {/* BLOCCO E — Governance */}
      <FormSection title="Blocco E — Governance (G)" cols={1}>
        <Field label="E1. Struttura di governance">
          <CheckboxGroup
            values={d?.E1_governance || []}
            onChange={v => updateField("E1_governance", v)}
            cols={2}
            options={[
              "CdA / organo di governo presente e formalizzato",
              "Almeno 1/3 di consiglieri indipendenti",
              "Comitato Audit istituito",
              "Comitato Sostenibilità / ESG Committee istituito",
              "Remunerazione dei vertici collegata a KPI ESG",
              "Separazione ruoli Chairman/CEO"
            ]}
          />
        </Field>
        <Field label="E2. Compliance e controlli">
          <CheckboxGroup
            values={d?.E2_compliance || []}
            onChange={v => updateField("E2_compliance", v)}
            cols={2}
            options={[
              "Modello Organizzativo ex D.Lgs. 231/2001 adottato",
              "OdV (Organismo di Vigilanza) nominato",
              "Canale di whistleblowing attivo e accessibile",
              "Politica anticorruzione formalizzata",
              "DPO nominato (GDPR)",
              "Procedura gestione conflitti di interesse",
              "Politica fiscale responsabile dichiarata"
            ]}
          />
        </Field>
      </FormSection>

      {/* BLOCCO F — Progetto e fattibilità */}
      <FormSection title="Blocco F — Progetto e fattibilità" cols={1}>
        <Field label="F1. Livello di sponsorship del vertice aziendale">
          <RadioGroup
            value={d?.F1_sponsor}
            onChange={v => updateField("F1_sponsor", v)}
            options={[
              "Sì, CEO/AD è sponsor diretto",
              "Sì, con delega a direttore funzionale",
              "Parzialmente — interesse limitato al livello operativo",
              "No — è un'iniziativa bottom-up"
            ]}
          />
        </Field>
        <Field label="F2. Budget disponibile per il progetto">
          <CheckboxGroup
            values={d?.F2_budget || []}
            onChange={v => updateField("F2_budget", v)}
            cols={2}
            options={["< €5.000", "€5.000 – €15.000", "€15.000 – €30.000", "€30.000 – €60.000", "€60.000 – €100.000", "> €100.000", "Budget non ancora definito"]}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="F3. Prima pubblicazione desiderata">
            <input type="date" value={d?.F3_pubblicazione || ""} onChange={e => updateField("F3_pubblicazione", e.target.value)} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </Field>
          <Field label="Anno di rendicontazione">
            <Input value={d?.F3_anno_rendicontazione} onChange={v => updateField("F3_anno_rendicontazione", v)} placeholder="Es. 2024" />
          </Field>
          <div />
        </div>
        <Field label="F3. Vincoli esterni (assemblea azionisti, board, scadenze, gare)" span={2}>
          <Textarea value={d?.F3_vincoli} onChange={v => updateField("F3_vincoli", v)} rows={2} />
        </Field>
      </FormSection>

      {/* Dati compilatore */}
      <FormSection title="Dati del compilatore">
        <Field label="Nome e cognome">
          <Input value={d?.comp_nome} onChange={v => updateField("comp_nome", v)} placeholder="Nome Cognome" />
        </Field>
        <Field label="Funzione aziendale">
          <Input value={d?.comp_funzione} onChange={v => updateField("comp_funzione", v)} placeholder="CFO, HR Director, ecc." />
        </Field>
        <Field label="Email">
          <Input type="email" value={d?.comp_email} onChange={v => updateField("comp_email", v)} placeholder="nome@azienda.it" />
        </Field>
        <Field label="Data compilazione">
          <Input type="date" value={d?.comp_data} onChange={v => updateField("comp_data", v)} />
        </Field>
      </FormSection>

    </FormWrapper>
  );
}
