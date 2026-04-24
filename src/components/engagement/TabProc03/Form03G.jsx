import { useState } from "react";
import FormWrapper, { FormSection, Field, Textarea } from "@/components/common/FormWrapper";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_03G";

const AREE_DIAGNOSI = [
  {
    area: "E", label: "Ambiente", score: 2.9, livello: "MEDIO",
    gap_critici: 1, gap_alti: 1, gap_medi: 2,
    top_gap: [
      { cod: "GAP-E01", priorita: "CRITICA", titolo: "Piano transizione climatica assente" },
      { cod: "GAP-E02", priorita: "ALTA", titolo: "Scope 3 non misurato" },
      { cod: "GAP-E03", priorita: "MEDIA", titolo: "Intensità energetica non monitorata" },
    ],
    punti_forza: ["ISO 14001 certificato e operativo", "Dati Scope 1 completi e validati", "100% energia elettrica da fonti rinnovabili (EAC/GO)", "Sistema gestione rifiuti strutturato con alta % riciclo"],
    commento: "Il profilo ambientale di Acme mostra buone pratiche operative (ISO 14001, energia rinnovabile) ma manca della visione strategica richiesta da ESRS: assenza di un piano di transizione Net Zero, Scope 3 non misurato e nessun target SBTi. Il gap di strategia climatica è il principale rischio reputazionale e di conformità.",
  },
  {
    area: "S", label: "Sociale", score: 2.8, livello: "MEDIO",
    gap_critici: 1, gap_alti: 2, gap_medi: 1,
    top_gap: [
      { cod: "GAP-S01", priorita: "CRITICA", titolo: "Policy D&I non formalizzata" },
      { cod: "GAP-S02", priorita: "ALTA", titolo: "Gender pay gap non calcolato" },
      { cod: "GAP-S03", priorita: "ALTA", titolo: "Supply chain ESG non strutturata" },
    ],
    punti_forza: ["ISO 45001 — gestione SSL solida", "TRIR 1.8 (inferiore media settoriale)", "Piano formativo strutturato (24.5 ore/dip)", "Basso turnover (8.7%)"],
    commento: "Il sociale di Acme ha una base solida su SSL e formazione, ma evidenzia gap rilevanti sul fronte D&I e supply chain — le due aree a maggiore pressione normativa ESRS. La supply chain è il gap più strategico: i fornitori Tier 1 richiedono già requisiti ESG minimi (Stellantis). Urgente strutturare un processo di valutazione.",
  },
  {
    area: "G", label: "Governance", score: 2.5, livello: "MEDIO",
    gap_critici: 1, gap_alti: 2, gap_medi: 0,
    top_gap: [
      { cod: "GAP-G01", priorita: "CRITICA", titolo: "Whistleblowing non attivato — rischio legale" },
      { cod: "GAP-G02", priorita: "ALTA", titolo: "Codice etico obsoleto" },
      { cod: "GAP-G03", priorita: "ALTA", titolo: "Prima rendicontazione ESG — nessun processo strutturato" },
    ],
    punti_forza: ["CdA con 57% membri indipendenti", "Nessuna segnalazione anti-corruzione nel 2024", "Buona trasparenza su composizione governance", "Lobbying e donazioni non problematici"],
    commento: "La governance presenta i gap più urgenti da un punto di vista legale: il canale whistleblowing è obbligatorio dal D.Lgs. 24/2023 (rischio sanzione fino a 50.000€). Il codice etico del 2019 va aggiornato. Il gap ESG reporting è il naturale motore del presente engagement.",
  },
];

const RADAR_DATA = [
  { subject: "Inventario GHG", E: 3.2, S: null, G: null },
  { subject: "Strategia clima", E: 1.5, S: null, G: null },
  { subject: "Energia", E: 3.5, S: null, G: null },
  { subject: "SSL", E: null, S: 4.2, G: null },
  { subject: "D&I", E: null, S: 2.0, G: null },
  { subject: "Supply chain", E: null, S: 1.5, G: null },
  { subject: "Anti-corruzione", E: null, S: null, G: 2.0 },
  { subject: "Whistleblowing", E: null, S: null, G: 1.0 },
  { subject: "Reporting ESG", E: null, S: null, G: 1.5 },
];

const LEVEL_COLORS = { BUONO: "text-green-700 bg-green-50 border-green-200", MEDIO: "text-amber-700 bg-amber-50 border-amber-300", CRITICO: "text-red-700 bg-red-50 border-red-300" };
const PRIO_BADGE = { CRITICA: "bg-red-100 text-red-800", ALTA: "bg-orange-100 text-orange-800", MEDIA: "bg-yellow-100 text-yellow-800" };

const BAR_DATA = AREE_DIAGNOSI.map(a => ({ area: `Area ${a.area}`, score: a.score, fill: a.area === "E" ? "#10B981" : a.area === "S" ? "#6366F1" : "#8B5CF6" }));

export default function Form03G() {
  const [sintesi, setSintesi] = useState("Acme Manufacturing S.p.A. presenta un profilo ESG di maturità MEDIA (score medio 2.7/5) coerente con una realtà manifatturiera SME alla prima esperienza di rendicontazione strutturata. Punti di forza riconoscibili su SSL, gestione rifiuti ed energia rinnovabile. Gap prioritari su transizione climatica, D&I, supply chain e whistleblowing. Il presente engagement consentirà di colmare i gap critici entro la pubblicazione del bilancio di sostenibilità (Q4 2025).");
  const [raccomandazioni, setRaccomandazioni] = useState("1. Attivare canale whistleblowing entro 60 giorni (obbligo legale D.Lgs. 24/2023)\n2. Sviluppare piano di transizione climatica con target SBTi — priorità strategica\n3. Calcolare Scope 3 completo per FY2025 (commissioning survey fornitori)\n4. Formalizzare Policy D&I con target e piano di azioni affirmative\n5. Strutturare processo di audit supply chain ESG su top-30 fornitori\n6. Aggiornare codice etico con sezione anti-corruzione esplicita");

  const scoreGlobale = (AREE_DIAGNOSI.reduce((a, d) => a + d.score, 0) / AREE_DIAGNOSI.length).toFixed(1);
  const totGapCritici = AREE_DIAGNOSI.reduce((a, d) => a + d.gap_critici, 0);
  const totGapAlti = AREE_DIAGNOSI.reduce((a, d) => a + d.gap_alti, 0);

  return (
    <FormWrapper
      formCode="FORM-03G"
      title="Report di Diagnosi ESG"
      subtitle="Dashboard dei gap, scoring per area e raccomandazioni prioritarie"
      meta={{ "Fase": "PROC-03.7", "Resp.": "Partner — Elena Mancini", "Output": "Report Diagnosi approvato — Avvio PROC-04" }}
      ruleBox="📊 Report finale della Gap Analysis. Presentare al management prima dell'avvio PROC-04."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* SCORE GLOBALE */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Score globale ESG", value: `${scoreGlobale}/5`, color: "text-amber-700" },
          { label: "Gap critici totali", value: totGapCritici, color: "text-red-600" },
          { label: "Gap alti totali", value: totGapAlti, color: "text-orange-600" },
          { label: "Livello maturità", value: "MEDIO", color: "text-amber-700" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* BAR CHART SCORE */}
      <FormSection title="Score per area E / S / G" cols={1}>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BAR_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="area" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}/5`, "Score"]} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {BAR_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </FormSection>

      {/* SCHEDE AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {AREE_DIAGNOSI.map(a => (
          <div key={a.area} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Area {a.area}</p>
                <p className="text-lg font-bold">{a.label}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{a.score}<span className="text-sm font-normal text-muted-foreground">/5</span></p>
                <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", LEVEL_COLORS[a.livello])}>{a.livello}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Top gap:</p>
              <div className="space-y-1.5">
                {a.top_gap.map(g => (
                  <div key={g.cod} className="flex items-start gap-2">
                    <AlertCircle size={12} className={cn("shrink-0 mt-0.5", g.priorita === "CRITICA" ? "text-red-500" : "text-orange-400")} />
                    <div>
                      <span className={cn("text-xs font-medium px-1 rounded mr-1", PRIO_BADGE[g.priorita])}>{g.priorita}</span>
                      <span className="text-xs text-muted-foreground">{g.titolo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Punti di forza:</p>
              <ul className="space-y-1">
                {a.punti_forza.map((pf, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <TrendingUp size={11} className="text-green-600 shrink-0 mt-0.5" />
                    <span className="text-xs">{pf}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{a.commento}</p>
          </div>
        ))}
      </div>

      <FormSection title="Sintesi diagnostica e raccomandazioni" cols={1}>
        <Field label="Sintesi del profilo ESG e conclusioni dell'audit">
          <Textarea value={sintesi} onChange={setSintesi} rows={4} />
        </Field>
        <Field label="Raccomandazioni prioritarie (action list)">
          <Textarea value={raccomandazioni} onChange={setRaccomandazioni} rows={6} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}