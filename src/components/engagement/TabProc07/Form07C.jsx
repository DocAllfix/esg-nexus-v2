import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_07C";

const SERVIZI_RINNOVO = [
  { id: "s1", nome: "Aggiornamento bilancio GRI/ESRS FY2025", categoria: "core", prezzo: 9000, obbligatorio: true, descrizione: "Rendicontazione annuale conforme GRI Standards e CSRD/ESRS, comprensiva di tutti i capitoli del bilancio." },
  { id: "s2", nome: "Monitoraggio KPI ESG trimestrale", categoria: "core", prezzo: 4500, obbligatorio: true, descrizione: "Raccolta, validazione e reporting trimestrale dei KPI E/S/G con dashboard di monitoraggio." },
  { id: "s3", nome: "Supporto assurance limited", categoria: "core", prezzo: 3000, obbligatorio: true, descrizione: "Coordinamento con ente di assurance, preparazione documentazione e gestione osservazioni." },
  { id: "s4", nome: "GHG Inventory aggiornamento Scope 1-2-3", categoria: "addon", prezzo: 3500, obbligatorio: false, descrizione: "Aggiornamento inventario emissioni con dataset verificato e analisi trend rispetto anno precedente." },
  { id: "s5", nome: "Comunicazione ESG (social + investor deck)", categoria: "addon", prezzo: 4500, obbligatorio: false, descrizione: "Produzione materiali di comunicazione ESG: sintesi bilancio, infografiche, presentazione investors." },
  { id: "s6", nome: "Gap Analysis CSRD aggiornamento", categoria: "addon", prezzo: 5000, obbligatorio: false, descrizione: "Verifica allineamento ai nuovi requisiti ESRS con aggiornamento piano di conformità." },
  { id: "s7", nome: "Stakeholder engagement panel", categoria: "addon", prezzo: 2500, obbligatorio: false, descrizione: "Organizzazione e facilitazione di 1 panel stakeholder multi-categoria (durata 3h, report incluso)." },
  { id: "s8", nome: "Training ESG management (4h)", categoria: "addon", prezzo: 2000, obbligatorio: false, descrizione: "Workshop formativo per management e CdA su temi CSRD, doppia materialità e metriche ESG." },
  { id: "s9", nome: "Revisione piano di azione ESG", categoria: "addon", prezzo: 3000, obbligatorio: false, descrizione: "Aggiornamento iniziative, target e roadmap ESG sulla base dei risultati FY2024 e nuovi obiettivi." },
  { id: "s10", nome: "Supporto rating ESG (Ecovadis / MSCI)", categoria: "addon", prezzo: 6000, obbligatorio: false, descrizione: "Preparazione e accompagnamento nel processo di rating ESG da parte di agenzie esterne." },
];

export default function Form07C() {
  const [servizi, setServizi] = useState(SERVIZI_RINNOVO.map(s => ({ ...s, selezionato: s.obbligatorio || ["s4","s5"].includes(s.id) })));
  const [sconto, setSconto] = useState(5);
  const [note_offerta, setNoteOfferta] = useState("Proposta valida 30 giorni dalla data di emissione. Sconto fedeltà del 5% applicato in virtù del rapporto consolidato e del NPS 9 ottenuto nel progetto FY2024. Possibilità di rate semestrali senza maggiorazioni.");
  const [data_invio, setDataInvio] = useState("2025-11-25");
  const [inviata, setInviata] = useState(false);

  const toggle = (id) => setServizi(p => p.map(s => s.id === id && !s.obbligatorio ? { ...s, selezionato: !s.selezionato } : s));

  const lordo = servizi.filter(s => s.selezionato).reduce((sum, s) => sum + s.prezzo, 0);
  const scontato = Math.round(lordo * (1 - sconto / 100));
  const core = servizi.filter(s => s.categoria === "core");
  const addon = servizi.filter(s => s.categoria === "addon");

  return (
    <FormWrapper
      formCode="FORM-07C"
      title="Proposta di Rinnovo Annuale"
      subtitle="Configurazione servizi, calcolo importo e invio proposta per FY2025"
      meta={{ "Imponibile": `€ ${scontato.toLocaleString("it-IT")}`, "Sconto": `${sconto}%`, "Servizi selezionati": servizi.filter(s => s.selezionato).length }}
      ruleBox="💼 La proposta va inviata entro 30 giorni dalla pubblicazione del bilancio, quando la percezione di valore è massima. NPS ≥ 9 = cliente Reference."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* RIEPILOGO FINANZIARIO */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Totale proposta FY2025</p>
          <p className="text-4xl font-bold text-primary">€ {scontato.toLocaleString("it-IT")}<span className="text-lg font-normal text-muted-foreground"> + IVA</span></p>
          {sconto > 0 && <p className="text-xs text-muted-foreground mt-1">Listino: € {lordo.toLocaleString("it-IT")} · Sconto fedeltà {sconto}%</p>}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground">Sconto fedeltà:</label>
          <div className="flex items-center gap-1">
            <input type="number" min={0} max={30} value={sconto} onChange={e => setSconto(Number(e.target.value))} className="w-14 border border-border rounded px-2 py-1.5 text-sm text-center bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
            <span className="text-sm font-medium">%</span>
          </div>
        </div>
      </div>

      {/* SERVIZI CORE */}
      <FormSection title="Servizi inclusi (obbligatori)" cols={1}>
        <div className="space-y-2">
          {core.map(s => (
            <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
              <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{s.nome}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.descrizione}</p>
              </div>
              <span className="text-sm font-bold text-primary shrink-0">€ {s.prezzo.toLocaleString("it-IT")}</span>
            </div>
          ))}
        </div>
      </FormSection>

      {/* SERVIZI ADD-ON */}
      <FormSection title="Servizi opzionali (add-on)" cols={1}>
        <div className="space-y-2">
          {addon.map(s => (
            <div key={s.id} onClick={() => toggle(s.id)} className={cn("flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all", s.selezionato ? "border-primary bg-primary/5" : "border-border hover:bg-muted/20")}>
              <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors", s.selezionato ? "bg-primary border-primary" : "border-muted-foreground")}>
                {s.selezionato && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{s.nome}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.descrizione}</p>
              </div>
              <span className={cn("text-sm font-semibold shrink-0", s.selezionato ? "text-primary" : "text-muted-foreground")}>€ {s.prezzo.toLocaleString("it-IT")}</span>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Invio proposta">
        <Field label="Data invio prevista">
          <input type="date" value={data_invio} onChange={e => setDataInvio(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </Field>
        <Field label="Note all'offerta" span={2}>
          <Textarea value={note_offerta} onChange={setNoteOfferta} rows={2} />
        </Field>
        <div className="sm:col-span-2 flex gap-3">
          <button onClick={() => {}} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">Salva bozza PDF</button>
          <button onClick={() => setInviata(true)} className={cn("flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors", inviata ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
            {inviata ? "✅ Proposta inviata" : "Invia al cliente"}
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}