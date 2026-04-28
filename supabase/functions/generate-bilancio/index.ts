// deno-lint-ignore-file no-explicit-any
// generate-bilancio
// ─────────────────
// Edge Function chiamata dal wizard "Genera Bilancio" del frontend.
// Carica tutti i dati dell'engagement, applica gli override del wizard,
// renderizza un HTML standalone del bilancio e lo salva nel bucket
// `bilanci`. Inserisce/aggiorna una riga in tabella `bilanci`.
//
// Input  (JSON body): { engagementId: uuid, versione: string }
// Output (JSON):       record bilancio creato/aggiornato

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ─── 15 capitoli del bilancio ──────────────────────────────────────
const CHAPTERS = [
  { id: "lettera",     title: "Lettera agli stakeholder" },
  { id: "profilo",     title: "Profilo dell'organizzazione" },
  { id: "governance",  title: "Governance della sostenibilità" },
  { id: "strategia",   title: "Strategia, modello di business e contesto" },
  { id: "materialita", title: "Analisi di materialità" },
  { id: "stakeholder", title: "Coinvolgimento degli stakeholder" },
  { id: "clima",       title: "Cambiamento climatico ed energia" },
  { id: "risorse",     title: "Acqua, rifiuti ed economia circolare" },
  { id: "persone",     title: "Le nostre persone" },
  { id: "catena",      title: "Catena del valore e fornitori" },
  { id: "condotta",    title: "Etica, anticorruzione e governance condotta" },
  { id: "piano",       title: "Piano di azione ESG e obiettivi" },
  { id: "kpi",         title: "Tabella riassuntiva KPI" },
  { id: "metodologia", title: "Nota metodologica" },
  { id: "index",       title: "GRI Content Index / ESRS Datapoint Index" },
];

const GRI_DISCLOSURES = [
  { code: "2-1", title: "Dettagli organizzativi", chapter: "profilo" },
  { code: "2-2", title: "Entità incluse nel reporting", chapter: "metodologia" },
  { code: "2-3", title: "Periodo di rendicontazione", chapter: "metodologia" },
  { code: "2-4", title: "Riformulazione di informazioni", chapter: "metodologia" },
  { code: "2-5", title: "Assurance esterna", chapter: "metodologia" },
  { code: "2-6", title: "Attività, catena del valore", chapter: "profilo" },
  { code: "2-7", title: "Dipendenti", chapter: "persone" },
  { code: "2-9", title: "Struttura governance", chapter: "governance" },
  { code: "2-12", title: "Ruolo organo di governo", chapter: "governance" },
  { code: "2-13", title: "Delega responsabilità", chapter: "governance" },
  { code: "2-14", title: "Ruolo nel reporting", chapter: "governance" },
  { code: "2-22", title: "Strategia di sviluppo", chapter: "strategia" },
  { code: "2-23", title: "Impegni di policy", chapter: "strategia" },
  { code: "2-24", title: "Integrazione policy", chapter: "strategia" },
  { code: "2-29", title: "Engagement stakeholder", chapter: "stakeholder" },
  { code: "3-1", title: "Processo determinazione temi", chapter: "materialita" },
  { code: "3-2", title: "Lista temi materiali", chapter: "materialita" },
  { code: "3-3", title: "Gestione temi materiali", chapter: "materialita" },
  { code: "204", title: "Pratiche approvvigionamento", chapter: "catena" },
  { code: "205", title: "Anticorruzione", chapter: "condotta" },
  { code: "206", title: "Comportamento anticoncorrenziale", chapter: "condotta" },
  { code: "207", title: "Imposte", chapter: "condotta" },
  { code: "302", title: "Energia", chapter: "clima" },
  { code: "303", title: "Acqua e scarichi", chapter: "risorse" },
  { code: "305", title: "Emissioni GHG", chapter: "clima" },
  { code: "306", title: "Rifiuti", chapter: "risorse" },
  { code: "308", title: "Valutazione amb. fornitori", chapter: "catena" },
  { code: "401", title: "Occupazione", chapter: "persone" },
  { code: "403", title: "Salute e sicurezza", chapter: "persone" },
  { code: "404", title: "Formazione", chapter: "persone" },
  { code: "405", title: "Diversità e pari opportunità", chapter: "persone" },
  { code: "414", title: "Valutazione soc. fornitori", chapter: "catena" },
  { code: "418", title: "Privacy clienti", chapter: "condotta" },
];

const ESRS_DATAPOINTS = [
  { code: "ESRS 2 BP-1", title: "Basi per la preparazione", area: "Generale" },
  { code: "ESRS 2 BP-2", title: "Disclosure circostanze specifiche", area: "Generale" },
  { code: "ESRS 2 GOV-1", title: "Ruolo organi amministrazione", area: "Governance" },
  { code: "ESRS 2 GOV-2", title: "Informazioni agli organi", area: "Governance" },
  { code: "ESRS 2 GOV-3", title: "Performance ESG in remunerazione", area: "Governance" },
  { code: "ESRS 2 SBM-1", title: "Strategia, modello di business", area: "Strategia" },
  { code: "ESRS 2 SBM-2", title: "Interessi stakeholder", area: "Strategia" },
  { code: "ESRS 2 SBM-3", title: "IRO materiali e business", area: "Strategia" },
  { code: "ESRS 2 IRO-1", title: "Processo identificazione IRO", area: "Materialità" },
  { code: "ESRS 2 IRO-2", title: "Disclosure coperte", area: "Materialità" },
  { code: "ESRS E1", title: "Cambiamento climatico", area: "Ambiente" },
  { code: "ESRS E3", title: "Risorse idriche", area: "Ambiente" },
  { code: "ESRS E5", title: "Economia circolare", area: "Ambiente" },
  { code: "ESRS S1", title: "Forza lavoro propria", area: "Sociale" },
  { code: "ESRS S2", title: "Lavoratori catena valore", area: "Sociale" },
  { code: "ESRS G1", title: "Condotta aziendale", area: "Governance" },
];

// ─── KPI maps (ID tecnico → semantic) ───────────────────────────────
const KPI_S_BY_SEMANTIC: Record<string, string> = {
  headcount: "s01", donne_percentuale: "s02", donne_management: "s03", donne_csuite: "s04",
  turnover: "s10", tasso_frequenza: "s15", tasso_gravita: "s18", ore_formazione: "s23",
  fornitori_totali: "s33", fornitori_valutati: "s34", fornitori_qualificati: "s35",
  gender_pay_gap_jr: "s30",
};
const KPI_E_BY_SEMANTIC: Record<string, string> = {
  energia_totale: "e01", rinnovabile: "e04", prelievo_idrico: "e11",
  rifiuti_totali: "e14", rifiuti_recupero: "e16",
};
const KPI_G_BY_SEMANTIC: Record<string, string> = {
  cda_membri: "g01", cda_indipendenti: "g02", cda_donne: "g03", cda_riunioni: "g04",
  modello_231: "g06", whistleblowing_segn: "g08", data_breach: "g10",
  sanzioni_n: "g11", imposte_pagate: "g13", anticorruzione_train: "g16",
  ceo_remunerazione_esg: "g17",
};

function readKpi(kpiData: any, reverseMap: Record<string, string>, semantic: string): any {
  if (!kpiData) return null;
  const id = reverseMap[semantic];
  if (!id) return null;
  const v = kpiData[id]?.N;
  return v === "" || v === null || v === undefined ? null : v;
}

function sumGhgArray(arr: any): string | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  let total = 0;
  for (const r of arr) {
    const v = Number(r.emissioni);
    if (Number.isFinite(v)) total += v;
  }
  return total > 0 ? total.toFixed(2) : null;
}

const F = (n: any) => {
  if (n === null || n === undefined || n === "") return "—";
  const num = Number(n);
  return Number.isFinite(num)
    ? num.toLocaleString("it-IT", { maximumFractionDigits: 2 })
    : String(n);
};

// ─── Atom extractors (versione TypeScript del lib/bilancio/extractors.js) ──
function atom(ctx: any) {
  return {
    ragioneSociale: () =>
      ctx.cliente?.ragione_sociale || ctx.forms?.["01B"]?.ragione_sociale || ctx.engagement?.codice_progetto,
    settore: () => ctx.cliente?.settore || ctx.forms?.["01B"]?.settore,
    ateco: () => ctx.cliente?.ateco || ctx.forms?.["01B"]?.ateco,
    dipendenti: () => readKpi(ctx.forms?.["04D"]?.kpi_data, KPI_S_BY_SEMANTIC, "headcount") || ctx.cliente?.dipendenti,
    fatturato: () => ctx.cliente?.fatturato_eur || ctx.forms?.["01C"]?.fatturato,
    sediOperative: () => ctx.forms?.["01C"]?.sedi || ctx.forms?.["04A"]?.perimetro_geografico || ctx.cliente?.indirizzo,
    modelloBusiness: () => ctx.forms?.["01C"]?.modello || ctx.forms?.["01C"]?.descrizione_attivita,
    perimetroOrganizzativo: () => ctx.forms?.["04A"]?.perimetro || ctx.forms?.["04A"]?.perimetro_organizzativo,
    periodoRendicontazione: () => ctx.forms?.["04A"]?.periodo || `1 gennaio – 31 dicembre ${ctx.engagement?.anno_rendicontazione ?? ""}`,
    riformulazioni: () => ctx.forms?.["04F"]?.riformulazioni,
    assurance: () => ctx.forms?.["06A"]?.assurance || ctx.forms?.["06D"]?.assurance,
    visioneEsg: () => ctx.forms?.["05A"]?.vision || ctx.forms?.["05A"]?.visione,
    missionEsg: () => ctx.forms?.["05A"]?.mission_esg,
    pilastriStrategici: () => {
      const p = ctx.forms?.["05A"]?.pilastri;
      if (!Array.isArray(p) || p.length === 0) return null;
      return p.filter((x: any) => x.impegno).map((x: any) => `${x.key}: ${x.impegno}`).join("\n");
    },
    policyImpegni: () => ctx.forms?.["05A"]?.policy || ctx.forms?.["05B"]?.policy,
    integrazionePolicy: () => ctx.forms?.["05B"]?.integrazione,
    governancePiano: () => ctx.forms?.["05F"]?.governance_piano,
    delegaResponsabilita: () => ctx.forms?.["05F"]?.delega,
    governanceReport: () => ctx.forms?.["05F"]?.governance_report,
    metodoMaterialita: () => ctx.forms?.["02C"]?.metodologia || ctx.forms?.["02D"]?.approccio,
    temiMateriali: () => {
      if (!Array.isArray(ctx.iro) || ctx.iro.length === 0) return null;
      const m = ctx.iro.filter((i: any) => i.incluso !== false);
      if (m.length === 0) return null;
      return m.map((i: any) => `${i.codice ? `[${i.codice}] ` : ""}${i.tema}`).join("; ");
    },
    engagementStakeholder: () => {
      const mappa = ctx.forms?.["02B"]?.mappa_stakeholder;
      const interna = ctx.forms?.["02E"]?.risposte;
      const esterna = ctx.forms?.["02F"]?.risposte;
      const parts: string[] = [];
      if (mappa) parts.push(`Mappa: ${mappa}`);
      if (interna) parts.push(`Interno: ${interna}`);
      if (esterna) parts.push(`Esterno: ${esterna}`);
      return parts.length ? parts.join(" · ") : null;
    },
    socKpi: (sem: string) => readKpi(ctx.forms?.["04D"]?.kpi_data, KPI_S_BY_SEMANTIC, sem),
    envKpi: (sem: string) => readKpi(ctx.forms?.["04C"]?.kpi_data, KPI_E_BY_SEMANTIC, sem),
    govKpi: (sem: string) => readKpi(ctx.forms?.["04E"]?.kpi_data, KPI_G_BY_SEMANTIC, sem),
    scope1Total: () => sumGhgArray(ctx.forms?.["04B"]?.scope1),
    scope2MbTotal: () => sumGhgArray(ctx.forms?.["04B"]?.scope2_mb),
    scope3Total: () => sumGhgArray(ctx.forms?.["04B"]?.scope3),
    pianoObiettivi: () => ctx.forms?.["05B"]?.obiettivi_smart || ctx.forms?.["05C"]?.target,
    pianoOrizzonte: () => ctx.forms?.["05A"]?.orizzonte || ctx.forms?.["05E"]?.periodo_piano,
    pianoBudget: () => ctx.forms?.["05E"]?.budget,
  };
}

// ─── GRI extractors ─────────────────────────────────────────────────
function griExtractors(ctx: any) {
  const a = atom(ctx);
  return {
    "2-1": () => a.ragioneSociale() && a.settore() ? `${a.ragioneSociale()} — ${a.settore()}` : a.ragioneSociale(),
    "2-2": () => a.perimetroOrganizzativo(),
    "2-3": () => a.periodoRendicontazione(),
    "2-4": () => a.riformulazioni(),
    "2-5": () => a.assurance(),
    "2-6": () => a.modelloBusiness(),
    "2-7": () => {
      const h = a.dipendenti(); const p = a.socKpi("donne_percentuale");
      if (!h) return null;
      return p ? `${F(h)} dipendenti, di cui ${p}% donne` : `${F(h)} dipendenti`;
    },
    "2-9": () => {
      const m = a.govKpi("cda_membri"); const i = a.govKpi("cda_indipendenti");
      if (!m) return null;
      return i ? `CdA: ${m} membri, ${i}% indipendenti` : `CdA: ${m} membri`;
    },
    "2-12": () => a.governancePiano(),
    "2-13": () => a.delegaResponsabilita(),
    "2-14": () => a.governanceReport(),
    "2-22": () => a.visioneEsg(),
    "2-23": () => a.policyImpegni(),
    "2-24": () => a.integrazionePolicy(),
    "2-29": () => a.engagementStakeholder(),
    "3-1": () => a.metodoMaterialita(),
    "3-2": () => a.temiMateriali(),
    "3-3": () => a.integrazionePolicy() || a.pianoObiettivi(),
    "204": () => {
      const t = a.socKpi("fornitori_totali"); const v = a.socKpi("fornitori_valutati");
      if (!t && !v) return null;
      return [t && `${t} fornitori`, v && `${v} valutati ESG`].filter(Boolean).join("; ");
    },
    "205": () => {
      const tr = a.govKpi("anticorruzione_train");
      return tr ? `${tr}% formati anticorruzione` : ctx.forms?.["04E"]?.anticorruzione || null;
    },
    "206": () => ctx.forms?.["04E"]?.antitrust || a.govKpi("sanzioni_n"),
    "207": () => {
      const i = a.govKpi("imposte_pagate");
      return i ? `Imposte: ${F(i)} €` : ctx.forms?.["04E"]?.tax;
    },
    "302": () => {
      const t = a.envKpi("energia_totale"); const r = a.envKpi("rinnovabile");
      if (!t && !r) return null;
      return [t && `Energia: ${F(t)} GJ`, r && `Rinnovabile: ${r}%`].filter(Boolean).join("; ");
    },
    "303": () => {
      const v = a.envKpi("prelievo_idrico");
      return v ? `Prelievo: ${F(v)} m³` : null;
    },
    "305": () => {
      const s1 = a.scope1Total(); const s2 = a.scope2MbTotal(); const s3 = a.scope3Total();
      if (!s1 && !s2 && !s3) return null;
      return [s1 && `S1: ${s1}`, s2 && `S2: ${s2}`, s3 && `S3: ${s3}`].filter(Boolean).join("; ") + " tCO2e";
    },
    "306": () => {
      const t = a.envKpi("rifiuti_totali"); const r = a.envKpi("rifiuti_recupero");
      if (!t && !r) return null;
      return [t && `${F(t)} kg`, r && `${r}% recupero`].filter(Boolean).join("; ");
    },
    "308": () => {
      const v = a.socKpi("fornitori_valutati");
      return v ? `${v} fornitori valutati ambientali` : null;
    },
    "401": () => {
      const t = a.socKpi("turnover");
      return t ? `Turnover: ${t}%` : null;
    },
    "403": () => {
      const tf = a.socKpi("tasso_frequenza"); const tg = a.socKpi("tasso_gravita");
      if (!tf && !tg) return null;
      return [tf && `TF: ${tf}`, tg && `TG: ${tg}`].filter(Boolean).join("; ");
    },
    "404": () => {
      const o = a.socKpi("ore_formazione");
      return o ? `Ore form. pro-capite: ${o}` : null;
    },
    "405": () => {
      const f = a.socKpi("donne_percentuale"); const m = a.socKpi("donne_management");
      if (!f && !m) return null;
      return [f && `${f}% donne`, m && `${m}% donne mgmt`].filter(Boolean).join("; ");
    },
    "414": () => {
      const v = a.socKpi("fornitori_valutati");
      return v ? `${v} valutati sociale` : null;
    },
    "418": () => {
      const b = a.govKpi("data_breach");
      return b ? `Data breach: ${b}` : ctx.forms?.["04E"]?.privacy || null;
    },
  };
}

function esrsExtractors(ctx: any) {
  const a = atom(ctx);
  const g = griExtractors(ctx);
  return {
    "ESRS 2 BP-1": () => a.perimetroOrganizzativo(),
    "ESRS 2 BP-2": () => a.riformulazioni(),
    "ESRS 2 GOV-1": () => g["2-9"](),
    "ESRS 2 GOV-2": () => a.governanceReport(),
    "ESRS 2 GOV-3": () => {
      const v = a.govKpi("ceo_remunerazione_esg");
      return v ? `${v}% remun. CEO ESG-linked` : null;
    },
    "ESRS 2 SBM-1": () => a.modelloBusiness() || a.visioneEsg(),
    "ESRS 2 SBM-2": () => a.engagementStakeholder(),
    "ESRS 2 SBM-3": () => a.temiMateriali(),
    "ESRS 2 IRO-1": () => a.metodoMaterialita(),
    "ESRS 2 IRO-2": () => a.temiMateriali(),
    "ESRS E1": () => g["305"]() || g["302"](),
    "ESRS E3": () => g["303"](),
    "ESRS E5": () => g["306"](),
    "ESRS S1": () => g["2-7"](),
    "ESRS S2": () => g["414"]() || g["204"](),
    "ESRS G1": () => g["205"](),
  };
}

// ─── Generatori bozze capitoli ─────────────────────────────────────
function generateChapters(ctx: any, ident: any): Record<string, string> {
  const a = atom(ctx);
  const denom = ident.denominazione || a.ragioneSociale() || "L'organizzazione";
  const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione || "—";

  const out: Record<string, string> = {};

  out.lettera = `Cari stakeholder,

sono lieto di presentarvi il Bilancio di Sostenibilità ${anno} di ${denom}, frutto di un percorso strutturato di analisi, raccolta dati e definizione strategica condotto secondo gli standard internazionali di rendicontazione.

${a.visioneEsg() ? "La nostra visione di sostenibilità: " + a.visioneEsg() : "Il documento descrive il nostro impegno in ambito ambientale, sociale e di governance."}

Buona lettura.

Il Presidente / CEO`;

  // PROFILO
  let p = `${denom} è un'organizzazione`;
  if (a.settore()) p += ` attiva nel settore ${a.settore()}`;
  if (a.ateco()) p += ` (ATECO ${a.ateco()})`;
  p += `.`;
  if (a.sediOperative()) p += `\n\n**Perimetro operativo:** ${a.sediOperative()}.`;
  if (a.dipendenti()) p += ` Al 31 dicembre ${anno} contava **${F(a.dipendenti())} dipendenti**.`;
  if (a.fatturato()) p += ` Fatturato ${anno}: **${F(a.fatturato())} €**.`;
  out.profilo = p;

  // GOVERNANCE
  let gv = `La governance della sostenibilità di ${denom} integra i temi ESG nelle decisioni strategiche.`;
  const m = a.govKpi("cda_membri"); const ind = a.govKpi("cda_indipendenti"); const dn = a.govKpi("cda_donne");
  const riun = a.govKpi("cda_riunioni"); const mod = ctx.forms?.["04E"]?.modello_231 || a.govKpi("modello_231");
  if (m) {
    gv += `\n\n**Composizione CdA ${anno}:** ${m} consiglieri`;
    if (ind) gv += `, ${ind}% indipendenti`;
    if (dn) gv += `, presenza femminile ${dn}%`;
    gv += `.`;
  }
  if (riun) gv += ` CdA riunito ${riun} volte nel ${anno}.`;
  if (mod) gv += `\n\n**Modello 231:** ${typeof mod === "boolean" ? "adottato" : mod}.`;
  out.governance = gv;

  // STRATEGIA
  let st = `La strategia di sostenibilità di ${denom} integra ambiente, valore sociale e governance trasparente.`;
  if (a.visioneEsg()) st += `\n\n**Vision ESG:** ${a.visioneEsg()}`;
  if (a.missionEsg()) st += `\n\n**Mission:** ${a.missionEsg()}`;
  if (a.pilastriStrategici()) st += `\n\n**Pilastri strategici:**\n${a.pilastriStrategici()}`;
  if (a.policyImpegni()) st += `\n\n**Policy:** ${a.policyImpegni()}`;
  out.strategia = st;

  // MATERIALITÀ
  let mt = `L'analisi di materialità di ${denom} è stata condotta secondo l'approccio della **doppia materialità** (ESRS).`;
  if (a.metodoMaterialita()) mt += `\n\n**Metodologia:** ${a.metodoMaterialita()}`;
  if (a.engagementStakeholder()) mt += `\n\n**Engagement:** ${a.engagementStakeholder()}`;
  if (a.temiMateriali()) mt += `\n\n**Temi materiali:**\n${a.temiMateriali()}`;
  out.materialita = mt;

  // STAKEHOLDER
  out.stakeholder = `${denom} ha mappato i propri stakeholder secondo criteri di influenza e dipendenza, in linea con AA1000.${a.engagementStakeholder() ? "\n\n" + a.engagementStakeholder() : ""}`;

  // CLIMA
  let cl = `${denom} monitora le emissioni GHG secondo il **GHG Protocol Corporate Standard**.`;
  const s1 = a.scope1Total(); const s2 = a.scope2MbTotal(); const s3 = a.scope3Total();
  if (s1 || s2 || s3) {
    cl += `\n\n**Inventario emissioni ${anno} (tCO2e):**`;
    if (s1) cl += `\n- Scope 1: **${s1}**`;
    if (s2) cl += `\n- Scope 2 mb: **${s2}**`;
    if (s3) cl += `\n- Scope 3: **${s3}**`;
  }
  if (a.envKpi("energia_totale")) cl += `\n\n**Consumi energetici ${anno}:** ${F(a.envKpi("energia_totale"))} GJ`;
  if (a.envKpi("rinnovabile")) cl += `\n**Quota rinnovabile:** ${a.envKpi("rinnovabile")}%`;
  out.clima = cl;

  // RISORSE
  let rs = `Le politiche di ${denom} sull'uso efficiente delle risorse seguono il principio gerarchico **prevenzione-riduzione-riuso-riciclo-smaltimento**.`;
  if (a.envKpi("prelievo_idrico")) rs += `\n\n**Acqua:** prelievo ${anno} ${F(a.envKpi("prelievo_idrico"))} m³.`;
  const rt = a.envKpi("rifiuti_totali"); const rec = a.envKpi("rifiuti_recupero");
  if (rt) {
    rs += `\n\n**Rifiuti ${anno}:** ${F(rt)} kg`;
    if (rec) rs += `, di cui inviati a recupero ${rec}%`;
    rs += `.`;
  }
  out.risorse = rs;

  // PERSONE
  let pr = `Le persone sono il primo asset di ${denom}.`;
  pr += `\n\n**Composizione organico ${anno}:**`;
  if (a.dipendenti()) pr += `\n- Dipendenti totali: **${F(a.dipendenti())}**`;
  if (a.socKpi("donne_percentuale")) pr += `\n- Quota femminile: **${a.socKpi("donne_percentuale")}%**`;
  if (a.socKpi("ore_formazione")) pr += `\n- Ore formazione pro-capite: **${a.socKpi("ore_formazione")}**`;
  if (a.socKpi("tasso_frequenza") || a.socKpi("tasso_gravita")) {
    pr += `\n\n**Salute e sicurezza:**`;
    if (a.socKpi("tasso_frequenza")) pr += `\n- Tasso Frequenza: ${a.socKpi("tasso_frequenza")}`;
    if (a.socKpi("tasso_gravita")) pr += `\n- Tasso Gravità: ${a.socKpi("tasso_gravita")}`;
  }
  if (a.socKpi("turnover")) pr += `\n\n**Turnover ${anno}:** ${a.socKpi("turnover")}%`;
  out.persone = pr;

  // CATENA
  let ca = `${denom} promuove pratiche di **approvvigionamento responsabile** e applica criteri ESG nella selezione fornitori.`;
  if (a.socKpi("fornitori_totali")) ca += `\n\n**Fornitori ${anno}:** ${a.socKpi("fornitori_totali")} totali`;
  if (a.socKpi("fornitori_valutati")) ca += `, di cui ${a.socKpi("fornitori_valutati")} valutati ESG`;
  if (a.socKpi("fornitori_qualificati")) ca += `, ${a.socKpi("fornitori_qualificati")} qualificati`;
  ca += `.`;
  out.catena = ca;

  // CONDOTTA
  let cd = `**Integrità e trasparenza** sono pilastri della cultura aziendale di ${denom}.`;
  if (a.govKpi("modello_231") || ctx.forms?.["04E"]?.modello_231) cd += `\n\n**Modello 231 adottato.**`;
  if (a.govKpi("whistleblowing_segn")) cd += `\n**Whistleblowing ${anno}:** ${a.govKpi("whistleblowing_segn")} segnalazioni.`;
  if (a.govKpi("sanzioni_n")) cd += `\n**Sanzioni ${anno}:** ${a.govKpi("sanzioni_n")}.`;
  if (a.govKpi("data_breach")) cd += `\n**Data breach:** ${a.govKpi("data_breach")}.`;
  if (a.govKpi("imposte_pagate")) cd += `\n**Imposte ${anno}:** ${F(a.govKpi("imposte_pagate"))} €.`;
  out.condotta = cd;

  // PIANO
  let pn = `Il **Piano di Azione ESG** di ${denom} definisce obiettivi e roadmap delle iniziative.`;
  if (a.pianoOrizzonte()) pn += `\n\n**Orizzonte:** ${a.pianoOrizzonte()}`;
  if (a.pianoObiettivi()) pn += `\n\n**Obiettivi SMART:** ${a.pianoObiettivi()}`;
  if (a.pianoBudget()) pn += `\n\n**Budget:** ${a.pianoBudget()}`;
  out.piano = pn;

  // METODOLOGIA
  const fw = ident.framework || ctx.engagement?.standard;
  const fwLabel = fw === "ENTRAMBI" ? "GRI Standards e ESRS / CSRD" : fw === "CSRD_ESRS" ? "ESRS / CSRD" : "GRI Standards";
  let mo = `Bilancio redatto secondo gli standard **${fwLabel}**.`;
  mo += `\n\n**Periodo:** ${a.periodoRendicontazione()}.`;
  if (a.perimetroOrganizzativo()) mo += `\n**Perimetro:** ${a.perimetroOrganizzativo()}.`;
  mo += `\n\n**Metodologia di calcolo:** dati raccolti dai sistemi gestionali interni. Emissioni GHG calcolate secondo GHG Protocol con fattori ufficiali (ISPRA, DEFRA, IEA).`;
  mo += `\n\n**Punto di contatto:** ${ident.contatto || "Sustainability Manager"}.`;
  out.metodologia = mo;

  return out;
}

// ─── Helpers HTML ──────────────────────────────────────────────────
const escHtml = (s: any): string => {
  if (s === null || s === undefined) return "";
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c] as string));
};

function fillPlaceholders(text: string, ctx: any, ident: any): string {
  if (!text) return "";
  const a = atom(ctx);
  const denom = ident.denominazione || a.ragioneSociale() || "L'organizzazione";
  const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione || "—";
  const periodo = ident.periodo || a.periodoRendicontazione();
  const codice = ident.codice_bilancio || ctx.engagement?.codice_progetto || "";
  const contatto = ident.contatto || "Sustainability Manager";
  return text
    .replace(/\{\{denominazione\}\}/g, denom)
    .replace(/\{\{anno_N\}\}/g, String(anno))
    .replace(/\{\{periodo\}\}/g, periodo)
    .replace(/\{\{codice_bilancio\}\}/g, codice)
    .replace(/\{\{contatto\}\}/g, contatto);
}

function paragraphsToHtml(text: string): string {
  if (!text) return "";
  return text.split(/\n\n+/).map((p) => {
    let h = escHtml(p);
    h = h.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    h = h.replace(/\n- ([^\n]+)/g, '<br><span style="padding-left:1em">• $1</span>');
    h = h.replace(/\n/g, "<br>");
    return `<p>${h}</p>`;
  }).join("");
}

// ─── Render HTML ───────────────────────────────────────────────────
function renderKpiTable(ctx: any, anno: any): string {
  const a = atom(ctx);
  const rows = [
    { area: "Sociale", label: "Dipendenti totali", v: a.dipendenti() },
    { area: "Sociale", label: "Quota femminile", v: a.socKpi("donne_percentuale"), u: "%" },
    { area: "Sociale", label: "Ore formazione pro-capite", v: a.socKpi("ore_formazione") },
    { area: "Sociale", label: "TF infortuni", v: a.socKpi("tasso_frequenza") },
    { area: "Sociale", label: "TG infortuni", v: a.socKpi("tasso_gravita") },
    { area: "Sociale", label: "Turnover", v: a.socKpi("turnover"), u: "%" },
    { area: "Ambiente", label: "Energia totale", v: a.envKpi("energia_totale"), u: "GJ" },
    { area: "Ambiente", label: "Rinnovabile", v: a.envKpi("rinnovabile"), u: "%" },
    { area: "Ambiente", label: "Scope 1", v: a.scope1Total(), u: "tCO2e" },
    { area: "Ambiente", label: "Scope 2 (mb)", v: a.scope2MbTotal(), u: "tCO2e" },
    { area: "Ambiente", label: "Scope 3", v: a.scope3Total(), u: "tCO2e" },
    { area: "Ambiente", label: "Prelievo idrico", v: a.envKpi("prelievo_idrico"), u: "m³" },
    { area: "Ambiente", label: "Rifiuti totali", v: a.envKpi("rifiuti_totali"), u: "kg" },
    { area: "Governance", label: "Riunioni CdA", v: a.govKpi("cda_riunioni") },
    { area: "Governance", label: "Sanzioni", v: a.govKpi("sanzioni_n") },
    { area: "Governance", label: "Imposte pagate", v: a.govKpi("imposte_pagate"), u: "€" },
  ].filter((r) => r.v !== null && r.v !== undefined && r.v !== "");
  if (rows.length === 0) return `<p><em>[Nessun KPI valorizzato]</em></p>`;
  let h = `<table><thead><tr><th>Area</th><th>KPI</th><th>${escHtml(anno)}</th></tr></thead><tbody>`;
  for (const r of rows) {
    h += `<tr><td>${escHtml(r.area)}</td><td>${escHtml(r.label)}</td><td>${escHtml(r.v)}${r.u ? " " + escHtml(r.u) : ""}</td></tr>`;
  }
  h += `</tbody></table>`;
  return h;
}

function renderHtmlBilancio(ctx: any, ident: any, capitoliInclusi: string[], chapterOverrides: any, overridesGri: any, overridesEsrs: any): string {
  const a = atom(ctx);
  const denom = ident.denominazione || a.ragioneSociale() || "—";
  const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione || "—";
  const periodo = ident.periodo || a.periodoRendicontazione();
  const codice = ident.codice_bilancio || ctx.engagement?.codice_progetto || "";
  const fw = ident.framework || ctx.engagement?.standard;
  const fwLabel = fw === "ENTRAMBI" ? "GRI Standards e ESRS / CSRD" : fw === "CSRD_ESRS" ? "ESRS / CSRD" : "GRI Standards";

  const drafts = generateChapters(ctx, ident);
  const griExt = griExtractors(ctx);
  const esrsExt = esrsExtractors(ctx);

  const visibleChapters = CHAPTERS.filter((c) => capitoliInclusi.length === 0 || capitoliInclusi.includes(c.id));

  let body = `
    <div style="text-align:center; padding:60px 0;">
      ${codice ? `<p style="font-size:11px; color:#888; letter-spacing:3px;">${escHtml(codice)}</p>` : ""}
      <h1 style="font-size:32pt; color:#964900; margin-top:20px;">Bilancio di Sostenibilità</h1>
      <h1 style="font-size:24pt; color:#b85c00; margin-top:0;">${escHtml(anno)}</h1>
      <p style="font-size:18pt; color:#1a2332; margin-top:30px; font-weight:bold;">${escHtml(denom)}</p>
      ${periodo ? `<p style="font-size:12pt; color:#666; margin-top:10px;">Periodo: ${escHtml(periodo)}</p>` : ""}
      ${ident.note_copertina ? `<p style="font-size:11pt; color:#666; margin-top:30px; max-width:480px; margin-left:auto; margin-right:auto;">${escHtml(ident.note_copertina)}</p>` : ""}
      <p style="margin-top:40px; font-size:11pt; color:#964900;">${escHtml(fwLabel)}</p>
    </div>
    <hr style="margin:40px 0; border:none; border-top:2px solid #b85c00;">
  `;

  body += `<h2 style="color:#964900;">Indice</h2><ol>`;
  for (const c of visibleChapters) body += `<li>${escHtml(c.title)}</li>`;
  body += `</ol>`;

  for (let i = 0; i < visibleChapters.length; i++) {
    const ch = visibleChapters[i];
    const num = String(i + 1).padStart(2, "0");
    const ov = chapterOverrides?.[ch.id] || {};
    const title = ov.title || ch.title;
    const abstract = ov.abstract;

    body += `<h2 style="color:#964900; page-break-before:auto;">${num}. ${escHtml(fillPlaceholders(title, ctx, ident))}</h2>`;

    if (abstract) {
      body += `<p style="border-left:4px solid #b85c00; padding-left:16px; font-style:italic; color:#555; background:#faf8f4; padding:8px 16px;">${escHtml(fillPlaceholders(abstract, ctx, ident))}</p>`;
    }

    if (ch.id === "kpi") {
      body += renderKpiTable(ctx, anno);
    } else if (ch.id === "index") {
      if (fw === "ENTRAMBI" || fw === "GRI") {
        body += `<h3 style="color:#00549f;">GRI Content Index</h3>`;
        body += `<p>Dichiarazione di utilizzo: <strong>${escHtml(denom)}</strong> ha rendicontato in conformità con i GRI Standards per il periodo ${escHtml(periodo)}.</p>`;
        body += `<table><thead><tr><th>Disclosure</th><th>Titolo</th><th>Cap.</th><th>Note / Valore</th></tr></thead><tbody>`;
        for (const g of GRI_DISCLOSURES) {
          const v = overridesGri?.[g.code] || (griExt as any)[g.code]?.();
          const note = v ? String(v).slice(0, 200) : "—";
          body += `<tr><td>GRI ${escHtml(g.code)}</td><td>${escHtml(g.title)}</td><td>${escHtml(g.chapter)}</td><td>${escHtml(note)}</td></tr>`;
        }
        body += `</tbody></table>`;
      }
      if (fw === "ENTRAMBI" || fw === "CSRD_ESRS") {
        body += `<h3 style="color:#00853e;">ESRS Datapoint Index</h3>`;
        body += `<table><thead><tr><th>Datapoint</th><th>Titolo</th><th>Area</th><th>Valore</th></tr></thead><tbody>`;
        for (const e of ESRS_DATAPOINTS) {
          const v = overridesEsrs?.[e.code] || (esrsExt as any)[e.code]?.();
          const note = v ? String(v).slice(0, 160) : "—";
          body += `<tr><td>${escHtml(e.code)}</td><td>${escHtml(e.title)}</td><td>${escHtml(e.area)}</td><td>${escHtml(note)}</td></tr>`;
        }
        body += `</tbody></table>`;
      }
    } else {
      // Use override body or auto-generated draft
      let txt = ov.body && ov.body.trim() ? ov.body : drafts[ch.id];
      if (txt) {
        txt = fillPlaceholders(txt, ctx, ident);
        body += paragraphsToHtml(txt);
      } else {
        body += `<p style="color:#856404; background:#fff3cd; padding:8px 12px; font-size:11px;">[Capitolo da compilare]</p>`;
      }
    }
  }

  body += `<hr style="margin-top:40px; border:none; border-top:1px solid #ddd;">`;
  body += `<p style="text-align:center; font-size:10pt; color:#888; margin-top:14px;">${escHtml(denom)} · Bilancio di Sostenibilità ${escHtml(anno)} · ${escHtml(codice)}<br>Generato con ESG Nexus — ${new Date().toLocaleDateString("it-IT")}</p>`;

  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, "Times New Roman", serif; color: #2c3e50; line-height: 1.65; padding: 40px; max-width: 880px; margin: 0 auto; background: white; }
    h1 { font-size: 26pt; color: #964900; margin-bottom: 6px; }
    h2 { font-size: 16pt; color: #964900; margin-top: 26px; margin-bottom: 10px; border-bottom: 2px solid #f0e2d4; padding-bottom: 4px; }
    h3 { font-size: 13pt; color: #1a2332; margin-top: 18px; margin-bottom: 6px; }
    p { margin-bottom: 10px; text-align: justify; font-size: 11pt; }
    table { width: 100%; border-collapse: collapse; font-size: 10pt; margin: 12px 0; font-family: -apple-system, sans-serif; }
    table th, table td { border: 1px solid #d0d4d9; padding: 6px 8px; text-align: left; }
    table th { background: #faf8f4; font-weight: 700; color: #964900; }
    @page { size: A4; margin: 2.5cm 2cm; }
    @media print { body { padding: 0; } h2 { page-break-before: auto; } }
  `;

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Bilancio di Sostenibilità ${escHtml(anno)} · ${escHtml(denom)}</title>
<style>${css}</style>
</head>
<body>${body}</body>
</html>`;
}

// ─── Render KPI table per Word (markup HTML4 minimale) ──────────────
function renderKpiTableForDoc(ctx: any, anno: any): string {
  const a = atom(ctx);
  const rows = [
    { area: "Sociale", label: "Dipendenti totali", v: a.dipendenti() },
    { area: "Sociale", label: "Quota femminile", v: a.socKpi("donne_percentuale"), u: "%" },
    { area: "Sociale", label: "Ore formazione pro-capite", v: a.socKpi("ore_formazione") },
    { area: "Sociale", label: "TF infortuni", v: a.socKpi("tasso_frequenza") },
    { area: "Sociale", label: "TG infortuni", v: a.socKpi("tasso_gravita") },
    { area: "Sociale", label: "Turnover", v: a.socKpi("turnover"), u: "%" },
    { area: "Ambiente", label: "Energia totale", v: a.envKpi("energia_totale"), u: "GJ" },
    { area: "Ambiente", label: "Rinnovabile", v: a.envKpi("rinnovabile"), u: "%" },
    { area: "Ambiente", label: "Scope 1", v: a.scope1Total(), u: "tCO2e" },
    { area: "Ambiente", label: "Scope 2 (mb)", v: a.scope2MbTotal(), u: "tCO2e" },
    { area: "Ambiente", label: "Scope 3", v: a.scope3Total(), u: "tCO2e" },
    { area: "Ambiente", label: "Prelievo idrico", v: a.envKpi("prelievo_idrico"), u: "m³" },
    { area: "Ambiente", label: "Rifiuti totali", v: a.envKpi("rifiuti_totali"), u: "kg" },
    { area: "Governance", label: "Riunioni CdA", v: a.govKpi("cda_riunioni") },
    { area: "Governance", label: "Sanzioni", v: a.govKpi("sanzioni_n") },
    { area: "Governance", label: "Imposte pagate", v: a.govKpi("imposte_pagate"), u: "€" },
  ].filter((r) => r.v !== null && r.v !== undefined && r.v !== "");
  if (rows.length === 0) return `<p><em>[Nessun KPI valorizzato]</em></p>`;
  let h = `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%; font-size:10pt; font-family:Calibri,Arial,sans-serif;">`;
  h += `<tr style="background:#faf8f4;"><th align="left">Area</th><th align="left">KPI</th><th align="right">${escHtml(anno)}</th></tr>`;
  for (const r of rows) {
    h += `<tr><td>${escHtml(r.area)}</td><td>${escHtml(r.label)}</td><td align="right">${escHtml(r.v)}${r.u ? " " + escHtml(r.u) : ""}</td></tr>`;
  }
  h += `</table>`;
  return h;
}

// ─── Render DOC: documento Word-nativo ─────────────────────────────
// Genera markup HTML4 + Word XML namespaces. Word lo apre come .doc nativo
// con paginazione corretta (page-break tra capitoli) e formattazione fedele
// all'anteprima del bilancio.
function renderDocBilancio(ctx: any, ident: any, capitoliInclusi: string[], chapterOverrides: any, overridesGri: any, overridesEsrs: any): string {
  const a = atom(ctx);
  const denom = ident.denominazione || a.ragioneSociale() || "—";
  const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione || "—";
  const periodo = ident.periodo || a.periodoRendicontazione();
  const codice = ident.codice_bilancio || ctx.engagement?.codice_progetto || "";
  const fw = ident.framework || ctx.engagement?.standard;
  const fwLabel = fw === "ENTRAMBI" ? "GRI Standards e ESRS / CSRD" : fw === "CSRD_ESRS" ? "ESRS / CSRD" : "GRI Standards";

  const drafts = generateChapters(ctx, ident);
  const griExt = griExtractors(ctx);
  const esrsExt = esrsExtractors(ctx);

  const visibleChapters = CHAPTERS.filter((c) => capitoliInclusi.length === 0 || capitoliInclusi.includes(c.id));

  // Page break Word-compatible
  const PB = `<br clear="all" style="mso-special-character:line-break;page-break-before:always;" />`;

  let body = "";

  // === COPERTINA ===
  body += `<div style="text-align:center; padding-top:120pt;">`;
  if (codice) body += `<p style="font-size:11pt; color:#888888; letter-spacing:3pt; margin-bottom:30pt;">${escHtml(codice)}</p>`;
  body += `<p style="font-size:32pt; color:#964900; font-weight:bold; margin-bottom:6pt;">Bilancio di Sostenibilità</p>`;
  body += `<p style="font-size:24pt; color:#b85c00; font-weight:bold; margin-top:0; margin-bottom:36pt;">${escHtml(anno)}</p>`;
  body += `<p style="font-size:18pt; color:#1a2332; font-weight:bold; margin-bottom:18pt;">${escHtml(denom)}</p>`;
  if (periodo) body += `<p style="font-size:12pt; color:#666666; margin-bottom:18pt;">Periodo: ${escHtml(periodo)}</p>`;
  if (ident.note_copertina) body += `<p style="font-size:11pt; color:#666666; margin-top:24pt;">${escHtml(ident.note_copertina)}</p>`;
  body += `<p style="margin-top:54pt; font-size:11pt; color:#964900; font-weight:bold;">${escHtml(fwLabel)}</p>`;
  body += `</div>`;
  body += PB;

  // === INDICE ===
  body += `<h1 style="font-size:18pt; color:#964900; margin-bottom:14pt;">Indice</h1>`;
  body += `<ol style="font-size:11pt; line-height:1.8;">`;
  for (const c of visibleChapters) body += `<li style="margin-bottom:4pt;">${escHtml(c.title)}</li>`;
  body += `</ol>`;
  body += PB;

  // === CAPITOLI ===
  for (let i = 0; i < visibleChapters.length; i++) {
    const ch = visibleChapters[i];
    const num = String(i + 1).padStart(2, "0");
    const ov = chapterOverrides?.[ch.id] || {};
    const title = ov.title || ch.title;
    const abstract = ov.abstract;

    if (i > 0) body += PB;

    body += `<h1 style="font-size:18pt; color:#964900; margin-bottom:12pt; padding-bottom:4pt; border-bottom:1pt solid #f0e2d4;">${num}. ${escHtml(fillPlaceholders(title, ctx, ident))}</h1>`;

    if (abstract) {
      body += `<table border="0" cellpadding="10" cellspacing="0" style="margin-bottom:12pt; background:#faf8f4; width:100%;"><tr><td style="border-left:4pt solid #b85c00;"><i style="color:#555555; font-size:11pt;">${escHtml(fillPlaceholders(abstract, ctx, ident))}</i></td></tr></table>`;
    }

    if (ch.id === "kpi") {
      body += renderKpiTableForDoc(ctx, anno);
    } else if (ch.id === "index") {
      if (fw === "ENTRAMBI" || fw === "GRI") {
        body += `<h2 style="font-size:14pt; color:#00549f; margin-top:18pt; margin-bottom:8pt;">GRI Content Index</h2>`;
        body += `<p style="font-size:10pt; margin-bottom:10pt;">Dichiarazione di utilizzo: <b>${escHtml(denom)}</b> ha rendicontato in conformità con i GRI Standards per il periodo ${escHtml(periodo)}.</p>`;
        body += `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%; font-size:10pt; font-family:Calibri,Arial,sans-serif;">`;
        body += `<tr style="background:#faf8f4;"><th align="left">Disclosure</th><th align="left">Titolo</th><th align="left">Cap.</th><th align="left">Note / Valore</th></tr>`;
        for (const g of GRI_DISCLOSURES) {
          const v = overridesGri?.[g.code] || (griExt as any)[g.code]?.();
          body += `<tr><td>GRI ${escHtml(g.code)}</td><td>${escHtml(g.title)}</td><td>${escHtml(g.chapter)}</td><td>${escHtml(v ? String(v).slice(0, 200) : "—")}</td></tr>`;
        }
        body += `</table>`;
      }
      if (fw === "ENTRAMBI" || fw === "CSRD_ESRS") {
        body += `<h2 style="font-size:14pt; color:#00853e; margin-top:18pt; margin-bottom:8pt;">ESRS Datapoint Index</h2>`;
        body += `<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%; font-size:10pt; font-family:Calibri,Arial,sans-serif;">`;
        body += `<tr style="background:#faf8f4;"><th align="left">Datapoint</th><th align="left">Titolo</th><th align="left">Area</th><th align="left">Valore</th></tr>`;
        for (const e of ESRS_DATAPOINTS) {
          const v = overridesEsrs?.[e.code] || (esrsExt as any)[e.code]?.();
          body += `<tr><td>${escHtml(e.code)}</td><td>${escHtml(e.title)}</td><td>${escHtml(e.area)}</td><td>${escHtml(v ? String(v).slice(0, 160) : "—")}</td></tr>`;
        }
        body += `</table>`;
      }
    } else {
      let txt = ov.body && ov.body.trim() ? ov.body : drafts[ch.id];
      if (txt) {
        txt = fillPlaceholders(txt, ctx, ident);
        for (const para of txt.split(/\n\n+/)) {
          let h = escHtml(para);
          h = h.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
          h = h.replace(/\n- ([^\n]+)/g, "<br>&nbsp;&nbsp;&nbsp;&bull; $1");
          h = h.replace(/\n/g, "<br>");
          body += `<p style="font-size:11pt; text-align:justify; margin-bottom:10pt; line-height:1.5;">${h}</p>`;
        }
      } else {
        body += `<p style="color:#856404; background:#fff3cd; padding:8pt 12pt; font-size:10pt;"><i>[Capitolo da compilare]</i></p>`;
      }
    }
  }

  // === FOOTER ===
  body += `<br><br>`;
  body += `<hr style="border:none; border-top:1pt solid #cccccc;">`;
  body += `<p style="text-align:center; font-size:9pt; color:#888888; margin-top:8pt;">${escHtml(denom)} · Bilancio di Sostenibilità ${escHtml(anno)} · ${escHtml(codice)}<br>Generato con ESG Nexus — ${new Date().toLocaleDateString("it-IT")}</p>`;

  // Word XML wrapper
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Bilancio Sostenibilità ${escHtml(anno)} · ${escHtml(denom)}</title>
<!--[if gte mso 9]><xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml><![endif]-->
<style>
@page { size: A4; margin: 2.5cm 2cm; }
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #2c3e50; }
h1, h2, h3 { font-family: Calibri, Arial, sans-serif; }
table { border-collapse: collapse; }
</style>
</head>
<body>${body}</body>
</html>`;
}

function isFilled(v: any): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function computeCoverage(ctx: any, overridesGri: any, overridesEsrs: any) {
  const griExt = griExtractors(ctx);
  const esrsExt = esrsExtractors(ctx);
  const griCovered = GRI_DISCLOSURES.filter((g) => isFilled(overridesGri?.[g.code]) || isFilled((griExt as any)[g.code]?.())).length;
  const esrsCovered = ESRS_DATAPOINTS.filter((e) => isFilled(overridesEsrs?.[e.code]) || isFilled((esrsExt as any)[e.code]?.())).length;
  return {
    gri: Math.round((griCovered / GRI_DISCLOSURES.length) * 100),
    esrs: Math.round((esrsCovered / ESRS_DATAPOINTS.length) * 100),
  };
}

function computeWarnings(ctx: any) {
  const a = atom(ctx);
  const w: any[] = [];
  if (!a.ragioneSociale()) w.push({ code: "RAGIONE_SOCIALE_MISSING", severity: "error", chapter: "profilo", message: "Ragione sociale mancante" });
  if (!a.visioneEsg()) w.push({ code: "VISIONE_MISSING", severity: "error", chapter: "strategia", message: "Vision ESG non definita" });
  if (!ctx.iro || ctx.iro.length === 0) w.push({ code: "IRO_VUOTO", severity: "error", chapter: "materialita", message: "Nessun IRO" });
  if (!a.scope1Total()) w.push({ code: "SCOPE1_MISSING", severity: "warning", chapter: "clima", message: "Scope 1 mancante" });
  if (!a.scope2MbTotal()) w.push({ code: "SCOPE2_MISSING", severity: "warning", chapter: "clima", message: "Scope 2 mancante" });
  if (!a.dipendenti()) w.push({ code: "HEADCOUNT_MISSING", severity: "warning", chapter: "persone", message: "Headcount mancante" });
  return w;
}

// ─── Loader ────────────────────────────────────────────────────────
async function loadCtx(engagementId: string) {
  const [engRes, formsRes, iroRes] = await Promise.all([
    admin.from("engagements").select("*, clienti(*)").eq("id", engagementId).maybeSingle(),
    admin.from("form_data").select("form_code, status, data").eq("engagement_id", engagementId),
    admin.from("iro_engagement").select("*").eq("engagement_id", engagementId),
  ]);
  if (engRes.error) throw engRes.error;
  if (formsRes.error) throw formsRes.error;
  if (iroRes.error) throw iroRes.error;
  const forms: Record<string, any> = {};
  for (const f of formsRes.data ?? []) forms[f.form_code] = f.data ?? {};
  return {
    engagement: engRes.data,
    cliente: engRes.data?.clienti ?? null,
    forms,
    iro: iroRes.data ?? [],
  };
}

// ─── Main handler ──────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { engagementId, versione } = await req.json();
    if (!engagementId || !versione) {
      return new Response(JSON.stringify({ error: "engagementId e versione sono richiesti" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Identifica l'utente che ha invocato (per generated_by_user_id)
    const authHeader = req.headers.get("Authorization") ?? "";
    let userId: string | null = null;
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: userRes } = await admin.auth.getUser(token);
      userId = userRes?.user?.id ?? null;
    }

    // 1) Carica ctx
    const ctx = await loadCtx(engagementId);
    if (!ctx.engagement) {
      return new Response(JSON.stringify({ error: "Engagement non trovato" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2) Estrai override e configurazioni dal form_data 08X
    const ident = ctx.forms["08A"] ?? {};
    const griOverrides = ctx.forms["08C"] ?? {};
    const esrsOverrides = ctx.forms["08D"] ?? {};
    const includeMap = ctx.forms["08E"] ?? {};
    const chapterOverrides = ctx.forms["08F"] ?? {};

    const capitoliInclusi = CHAPTERS.filter((c) => includeMap[c.id] !== false).map((c) => c.id);
    const framework = ident.framework || ctx.engagement.standard;

    // 3) Inserisci/aggiorna riga bilanci con stato GENERAZIONE_IN_CORSO
    const { data: existing } = await admin
      .from("bilanci")
      .select("id")
      .eq("engagement_id", engagementId)
      .eq("versione", versione)
      .maybeSingle();

    let bilancioId: string;
    if (existing) {
      bilancioId = existing.id;
      await admin.from("bilanci").update({
        stato: "GENERAZIONE_IN_CORSO",
        framework,
        generated_by_user_id: userId,
      }).eq("id", bilancioId);
    } else {
      const { data: created, error: createErr } = await admin.from("bilanci").insert({
        engagement_id: engagementId,
        versione,
        framework,
        stato: "GENERAZIONE_IN_CORSO",
        generated_by_user_id: userId,
        capitoli_inclusi: capitoliInclusi,
      }).select("id").single();
      if (createErr) throw createErr;
      bilancioId = created.id;
    }

    // 4) Genera HTML + DOC (Word HTML wrapper)
    const html = renderHtmlBilancio(ctx, ident, capitoliInclusi, chapterOverrides, griOverrides, esrsOverrides);
    const doc  = renderDocBilancio(ctx, ident, capitoliInclusi, chapterOverrides, griOverrides, esrsOverrides);
    const coverage = computeCoverage(ctx, griOverrides, esrsOverrides);
    const warnings = computeWarnings(ctx);

    // 5) Upload paralleli a Storage: {engagementId}/{versione}/bilancio.{html,doc}
    const htmlPath = `${engagementId}/${versione}/bilancio.html`;
    const docPath  = `${engagementId}/${versione}/bilancio.doc`;
    // Il PDF è generato lato client da html2pdf, NON viene salvato in Storage.

    const [htmlUpload, docUpload] = await Promise.all([
      admin.storage.from("bilanci").upload(
        htmlPath,
        new Blob([html], { type: "text/html;charset=utf-8" }),
        { upsert: true, contentType: "text/html" }
      ),
      admin.storage.from("bilanci").upload(
        docPath,
        new Blob([doc], { type: "application/msword" }),
        { upsert: true, contentType: "application/msword" }
      ),
    ]);
    if (htmlUpload.error) throw htmlUpload.error;
    if (docUpload.error) throw docUpload.error;

    // 6) Aggiorna riga bilanci con i path e i metadati
    const { data: finalBilancio, error: updateErr } = await admin
      .from("bilanci")
      .update({
        stato: "BOZZA",
        generated_at: new Date().toISOString(),
        html_path: htmlPath,
        docx_path: docPath,
        copertura_gri: coverage.gri,
        copertura_esrs: coverage.esrs,
        capitoli_inclusi: capitoliInclusi,
        warnings,
      })
      .eq("id", bilancioId)
      .select()
      .single();
    if (updateErr) throw updateErr;

    return new Response(JSON.stringify(finalBilancio), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("generate-bilancio error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
