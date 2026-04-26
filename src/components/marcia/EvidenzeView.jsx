import { cn } from "@/lib/utils";
import { useFormData } from "@/hooks/useFormData";

const EVIDENZE_PER_SETT = [
  {
    sett: "Sett. 1-2",
    proc: "PROC-01 Avvio",
    items: [
      "Contratto di consulenza firmato",
      "Offerta commerciale accettata (FORM-00E firmato)",
      "Elenco dipendenti per genere e tipologia contrattuale (ultimo anno)",
      "Organigramma aziendale aggiornato",
      "Statuto societario e visura camerale recente",
      "Composizione CdA e curricula consiglieri",
    ],
  },
  {
    sett: "Sett. 3-4",
    proc: "PROC-02 Materialità",
    items: [
      "Codice ATECO e settore di appartenenza",
      "Elenco clienti top 10 (fatturato)",
      "Elenco fornitori top 20 (valore acquisto)",
      "Elenco banche e istituti finanziatori",
      "Elenco RSU/RLS e rappresentanti sindacali",
      "Lista associazioni di categoria di appartenenza",
    ],
  },
  {
    sett: "Sett. 4-6",
    proc: "PROC-02 Materialità",
    items: [
      "Risk register aziendale (se esistente)",
      "Relazione sulla gestione ultimo bilancio d'esercizio",
      "Eventuali contenziosi o sanzioni ricevuti ultimi 3 anni",
      "Incidenti ambientali o sociali ultimi 3 anni",
      "Questionari stakeholder interni compilati",
      "Questionari stakeholder esterni compilati",
    ],
  },
  {
    sett: "Sett. 7-9",
    proc: "PROC-03 Gap Analysis",
    items: [
      "DVR (Documento Valutazione Rischi) aggiornato",
      "Registro infortuni ultimi 3 anni (INAIL)",
      "Politica ambientale (se esistente)",
      "Certificazioni ISO 14001, ISO 45001, SA8000 (se applicabili)",
      "Bollette energia elettrica 12 mesi",
      "Fatture gas naturale 12 mesi",
      "MUD (Modello Unico di Dichiarazione Ambientale)",
      "Modello 231 e mappatura processi sensibili",
      "Codice Etico approvato",
      "Politica anticorruzione",
      "Verbali CdA ultimi 2 anni",
    ],
  },
  {
    sett: "Sett. 10-13",
    proc: "PROC-04 Raccolta Dati",
    items: [
      "Consumi energia elettrica (kWh) per 12 mesi",
      "Consumi gas naturale (m³) per 12 mesi",
      "Consumi carburanti autotrazione (litri) per 12 mesi",
      "Consumi idrici (m³) per 12 mesi",
      "Produzione rifiuti per tipologia (kg/anno)",
      "Dati HR: turnover, assenteismo, ore formazione",
      "Gender pay gap aggregato",
      "Struttura retributiva aggregata per inquadramento",
      "Payroll aggregato (senza dati nominativi)",
      "Registro MUD aggiornato",
    ],
  },
  {
    sett: "Sett. 12-17",
    proc: "PROC-05 Piano ESG + PROC-06 Bilancio",
    items: [
      "Lettera CEO/Amministratore Delegato firmata originale",
      "Approvazione roadmap ESG da parte del CdA (verbale)",
      "GRI Content Index bozza",
      "ESRS Content Index bozza",
      "Dataset finale frozen (FORM-04F firmato)",
      "Nota metodologica calcolo GHG",
      "Bollette originali 12 mesi (per assurance)",
    ],
  },
  {
    sett: "Sett. 24-26",
    proc: "PROC-06 Bilancio — Assurance",
    items: [
      "Attestazione di verifica (limited assurance) emessa dal verificatore",
      "Delibera CdA approvazione Bilancio di Sostenibilità",
      "URL pubblicazione sul sito web",
      "Comunicato stampa di pubblicazione",
      "Deposito GRI Database (ricevuta)",
      "Deposito CSRD/CCIAA (se obbligatorio)",
    ],
  },
];

const totalItems = EVIDENZE_PER_SETT.reduce((acc, s) => acc + s.items.length, 0);

export default function EvidenzeView({ engagementId }) {
  const { data: d, updateField } = useFormData(engagementId, "EVIDENZE");
  const checked = d?.checked ?? {};

  const toggle = (settIdx, itemIdx) => {
    const key = `${settIdx}-${itemIdx}`;
    updateField("checked", { ...checked, [key]: !checked[key] });
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">📎 Evidenze per Settimana — Checklist documenti da richiedere al cliente</p>
        <p className="text-xs text-muted-foreground">Spunta le evidenze man mano che vengono raccolte · {checkedCount}/{totalItems} raccolte</p>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.round((checkedCount / totalItems) * 100)}%` }} />
        </div>
      </div>

      {/* Evidenze per settimana */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {EVIDENZE_PER_SETT.map((block, si) => (
          <div key={si} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/20">
              <p className="text-xs font-bold text-foreground">{block.sett}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{block.proc}</p>
            </div>
            <div className="p-3 space-y-1.5">
              {block.items.map((item, ii) => {
                const key = `${si}-${ii}`;
                const isChecked = !!checked[key];
                return (
                  <label key={ii} className="flex items-start gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => toggle(si, ii)}
                      className={cn(
                        "mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                        isChecked ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"
                      )}
                    >
                      {isChecked && <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1 3L3 5.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className={cn("text-xs leading-snug", isChecked ? "line-through text-muted-foreground" : "text-foreground")}>
                      {item}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
