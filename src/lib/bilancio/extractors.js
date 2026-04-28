/**
 * Extractors — pure functions che leggono il `ctx` dell'engagement
 * e producono i valori per ogni disclosure GRI / datapoint ESRS.
 *
 * Tutto è pure, zero side effect, totalmente testabile in isolamento.
 *
 * Il ctx ha questa forma:
 *   {
 *     engagement: { ... },
 *     cliente:    { ragione_sociale, settore, ateco, dipendenti, fatturato_eur, ... },
 *     forms:      { '01B': {...}, '01C': {...}, '04A': {...}, ...},
 *     iro:        [ { codice, tema, area, materialita_impatto, materialita_finanziaria, ... } ]
 *   }
 */

import {
  KPI_S, KPI_E, KPI_G,
  KPI_S_BY_SEMANTIC, KPI_E_BY_SEMANTIC, KPI_G_BY_SEMANTIC,
  readKpi,
  GRI_DISCLOSURES, ESRS_DATAPOINTS,
} from "./fieldMaps";

// ─── Helpers di lettura sicura ──────────────────────────────────────
function nonEmpty(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return true;
}

const fmtNumber = (n) => {
  if (n === null || n === undefined || n === "") return null;
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return num.toLocaleString("it-IT", { maximumFractionDigits: 2 });
};

// Somma il campo .emissioni da un array di voci GHG (Form04B)
function sumGhgArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const total = arr.reduce((s, r) => {
    const v = Number(r.emissioni);
    return s + (Number.isFinite(v) ? v : 0);
  }, 0);
  return total > 0 ? total.toFixed(2) : null;
}

// ─── Estrazioni semantiche di alto livello ──────────────────────────
// Ogni "estrattore atomico" è una piccola funzione chiamabile dai
// bigger extractors GRI/ESRS e dal generatore di capitoli.

export const atom = {
  // PROFILO ORGANIZZAZIONE (PROC-00/01 + clienti)
  ragioneSociale: (ctx) =>
    ctx.cliente?.ragione_sociale ||
    ctx.forms?.["01B"]?.ragione_sociale ||
    ctx.engagement?.codice_progetto ||
    null,
  settore: (ctx) =>
    ctx.cliente?.settore ||
    ctx.forms?.["01B"]?.settore ||
    null,
  ateco: (ctx) =>
    ctx.cliente?.ateco ||
    ctx.forms?.["01B"]?.ateco ||
    null,
  dipendenti: (ctx) => {
    // priorità: KPI s01 (più recente, validato) > clienti.dipendenti
    const fromKpi = readKpi(ctx.forms?.["04D"]?.kpi_data, KPI_S_BY_SEMANTIC, "headcount");
    return fromKpi || ctx.cliente?.dipendenti || null;
  },
  fatturato: (ctx) =>
    ctx.cliente?.fatturato_eur ||
    ctx.forms?.["01C"]?.fatturato ||
    null,
  sediOperative: (ctx) =>
    ctx.forms?.["01C"]?.sedi ||
    ctx.forms?.["01C"]?.sede_legale ||
    ctx.forms?.["04A"]?.perimetro_geografico ||
    ctx.cliente?.indirizzo ||
    null,
  modelloBusiness: (ctx) =>
    ctx.forms?.["01C"]?.modello ||
    ctx.forms?.["01C"]?.descrizione_attivita ||
    null,
  catenaValore: (ctx) =>
    ctx.forms?.["01C"]?.catena_valore ||
    ctx.forms?.["01C"]?.modello ||
    null,

  // METODOLOGIA (PROC-04:04A + 04F)
  perimetroOrganizzativo: (ctx) =>
    ctx.forms?.["04A"]?.perimetro ||
    ctx.forms?.["04A"]?.perimetro_organizzativo ||
    ctx.forms?.["04A"]?.sedi_incluse ||
    null,
  periodoRendicontazione: (ctx) =>
    ctx.forms?.["04A"]?.periodo ||
    `1 gennaio – 31 dicembre ${ctx.engagement?.anno_rendicontazione ?? ""}`,
  riformulazioni: (ctx) =>
    ctx.forms?.["04F"]?.riformulazioni ||
    ctx.forms?.["04F"]?.note_riformulazioni ||
    null,
  assurance: (ctx) =>
    ctx.forms?.["06A"]?.assurance ||
    ctx.forms?.["06D"]?.assurance ||
    ctx.forms?.["06A"]?.tipo_assurance ||
    null,

  // STRATEGIA (PROC-05:05A,05B)
  visioneEsg: (ctx) =>
    ctx.forms?.["05A"]?.vision ||
    ctx.forms?.["05A"]?.visione ||
    ctx.forms?.["05A"]?.statement ||
    null,
  missionEsg: (ctx) =>
    ctx.forms?.["05A"]?.mission_esg ||
    ctx.forms?.["05A"]?.mission ||
    null,
  pilastriStrategici: (ctx) => {
    const p = ctx.forms?.["05A"]?.pilastri;
    if (!Array.isArray(p) || p.length === 0) return null;
    return p
      .filter((x) => nonEmpty(x.impegno))
      .map((x) => `${x.key} (${x.label || x.key}): ${x.impegno}`)
      .join("\n");
  },
  policyImpegni: (ctx) =>
    ctx.forms?.["05A"]?.policy ||
    ctx.forms?.["05B"]?.policy ||
    null,
  integrazionePolicy: (ctx) =>
    ctx.forms?.["05B"]?.integrazione ||
    ctx.forms?.["05B"]?.integrazione_policy ||
    null,
  governancePiano: (ctx) =>
    ctx.forms?.["05F"]?.governance_piano ||
    ctx.forms?.["05F"]?.ruolo_cda ||
    null,
  delegaResponsabilita: (ctx) =>
    ctx.forms?.["05F"]?.delega ||
    ctx.forms?.["05F"]?.responsabili ||
    null,
  governanceReport: (ctx) =>
    ctx.forms?.["05F"]?.governance_report ||
    ctx.forms?.["05F"]?.approvazione_report ||
    null,

  // MATERIALITÀ (PROC-02 + tabella iro_engagement)
  metodoMaterialita: (ctx) =>
    ctx.forms?.["02C"]?.metodologia ||
    ctx.forms?.["02D"]?.approccio ||
    ctx.forms?.["02C"]?.iro_metodo ||
    null,
  temiMateriali: (ctx) => {
    if (!Array.isArray(ctx.iro) || ctx.iro.length === 0) return null;
    // Filtra solo i materiali (entrambe le materialità sopra soglia, oppure incluso)
    const materiali = ctx.iro.filter((i) => i.incluso !== false);
    if (materiali.length === 0) return null;
    return materiali.map((i) => `${i.codice ? `[${i.codice}] ` : ""}${i.tema}`).join("; ");
  },
  iroDettaglio: (ctx) => {
    if (!Array.isArray(ctx.iro)) return null;
    return ctx.iro.filter((i) => i.incluso !== false);
  },
  engagementStakeholder: (ctx) => {
    const mappa = ctx.forms?.["02B"]?.mappa_stakeholder ||
                  ctx.forms?.["02B"]?.categorie ||
                  ctx.forms?.["02B"]?.stakeholder;
    const interna = ctx.forms?.["02E"]?.risposte ||
                    ctx.forms?.["02E"]?.dipendenti_coinvolti;
    const esterna = ctx.forms?.["02F"]?.risposte ||
                    ctx.forms?.["02F"]?.clienti_coinvolti;
    const parts = [];
    if (mappa) parts.push(`Mappa stakeholder: ${mappa}`);
    if (interna) parts.push(`Engagement interno: ${interna}`);
    if (esterna) parts.push(`Engagement esterno: ${esterna}`);
    return parts.length ? parts.join(" · ") : null;
  },

  // KPI SOCIALI (Form04D)
  socKpi: (ctx, semantic) =>
    readKpi(ctx.forms?.["04D"]?.kpi_data, KPI_S_BY_SEMANTIC, semantic),

  // KPI AMBIENTALI (Form04C)
  envKpi: (ctx, semantic) =>
    readKpi(ctx.forms?.["04C"]?.kpi_data, KPI_E_BY_SEMANTIC, semantic),

  // KPI GOVERNANCE (Form04E)
  govKpi: (ctx, semantic) =>
    readKpi(ctx.forms?.["04E"]?.kpi_data, KPI_G_BY_SEMANTIC, semantic),

  // GHG (Form04B) — somme dagli array per scope
  scope1Total: (ctx) => sumGhgArray(ctx.forms?.["04B"]?.scope1),
  scope2MbTotal: (ctx) => sumGhgArray(ctx.forms?.["04B"]?.scope2_mb),
  scope2LbTotal: (ctx) => sumGhgArray(ctx.forms?.["04B"]?.scope2_lb),
  scope3Total: (ctx) => sumGhgArray(ctx.forms?.["04B"]?.scope3),

  // PIANO ESG (PROC-05)
  pianoObiettivi: (ctx) =>
    ctx.forms?.["05B"]?.obiettivi_smart ||
    ctx.forms?.["05C"]?.target ||
    ctx.forms?.["05B"]?.obiettivi ||
    null,
  pianoOrizzonte: (ctx) =>
    ctx.forms?.["05A"]?.orizzonte ||
    ctx.forms?.["05E"]?.periodo_piano ||
    ctx.forms?.["05E"]?.roadmap ||
    null,
  pianoBudget: (ctx) =>
    ctx.forms?.["05E"]?.budget ||
    ctx.forms?.["05E"]?.capex_opex ||
    null,
};

// ─── Estrattori GRI (33) ────────────────────────────────────────────
// Restituiscono un valore (string|number|object|array) o null se "Mancante".

export const GRI_EXTRACTORS = {
  "2-1":  (ctx) => atom.ragioneSociale(ctx) && atom.settore(ctx)
                    ? `${atom.ragioneSociale(ctx)} — ${atom.settore(ctx)}${atom.ateco(ctx) ? ` (ATECO ${atom.ateco(ctx)})` : ""}`
                    : atom.ragioneSociale(ctx),
  "2-2":  (ctx) => atom.perimetroOrganizzativo(ctx),
  "2-3":  (ctx) => atom.periodoRendicontazione(ctx),
  "2-4":  (ctx) => atom.riformulazioni(ctx),
  "2-5":  (ctx) => atom.assurance(ctx),
  "2-6":  (ctx) => atom.catenaValore(ctx) || atom.modelloBusiness(ctx),
  "2-7":  (ctx) => {
    const head = atom.dipendenti(ctx);
    const perc = atom.socKpi(ctx, "donne_percentuale");
    if (!head) return null;
    return perc ? `${fmtNumber(head)} dipendenti totali, di cui ${perc}% donne` : `${fmtNumber(head)} dipendenti`;
  },
  "2-9":  (ctx) => {
    const m = atom.govKpi(ctx, "cda_membri");
    const ind = atom.govKpi(ctx, "cda_indipendenti");
    if (!m) return null;
    return ind ? `CdA composto da ${m} membri, di cui ${ind}% indipendenti` : `CdA: ${m} membri`;
  },
  "2-12": (ctx) => atom.governancePiano(ctx),
  "2-13": (ctx) => atom.delegaResponsabilita(ctx),
  "2-14": (ctx) => atom.governanceReport(ctx),
  "2-22": (ctx) => atom.visioneEsg(ctx),
  "2-23": (ctx) => atom.policyImpegni(ctx),
  "2-24": (ctx) => atom.integrazionePolicy(ctx),
  "2-29": (ctx) => atom.engagementStakeholder(ctx),
  "3-1":  (ctx) => atom.metodoMaterialita(ctx),
  "3-2":  (ctx) => atom.temiMateriali(ctx),
  "3-3":  (ctx) => atom.integrazionePolicy(ctx) || atom.pianoObiettivi(ctx),
  "204":  (ctx) => {
    const tot = atom.socKpi(ctx, "fornitori_totali");
    const val = atom.socKpi(ctx, "fornitori_valutati");
    if (!tot && !val) return null;
    return [tot && `${tot} fornitori totali`, val && `${val} valutati su criteri ESG`].filter(Boolean).join("; ");
  },
  "205":  (ctx) => {
    const tr = atom.govKpi(ctx, "anticorruzione_train");
    return tr ? `${tr}% dipendenti formati anticorruzione` : ctx.forms?.["04E"]?.anticorruzione || null;
  },
  "206":  (ctx) => ctx.forms?.["04E"]?.antitrust || atom.govKpi(ctx, "sanzioni_n"),
  "207":  (ctx) => {
    const imp = atom.govKpi(ctx, "imposte_pagate");
    return imp ? `Imposte pagate: ${fmtNumber(imp)} €` : ctx.forms?.["04E"]?.tax;
  },
  "302":  (ctx) => {
    const tot = atom.envKpi(ctx, "energia_totale");
    const ren = atom.envKpi(ctx, "rinnovabile");
    if (!tot && !ren) return null;
    return [tot && `Consumo energetico: ${fmtNumber(tot)} GJ`, ren && `Quota rinnovabile: ${ren}%`].filter(Boolean).join("; ");
  },
  "303":  (ctx) => {
    const v = atom.envKpi(ctx, "prelievo_idrico");
    return v ? `Prelievo idrico: ${fmtNumber(v)} m³` : null;
  },
  "305":  (ctx) => {
    const s1 = atom.scope1Total(ctx);
    const s2 = atom.scope2MbTotal(ctx);
    const s3 = atom.scope3Total(ctx);
    if (!s1 && !s2 && !s3) return null;
    return [
      s1 && `Scope 1: ${s1} tCO2e`,
      s2 && `Scope 2 (mb): ${s2} tCO2e`,
      s3 && `Scope 3: ${s3} tCO2e`,
    ].filter(Boolean).join("; ");
  },
  "306":  (ctx) => {
    const tot = atom.envKpi(ctx, "rifiuti_totali");
    const rec = atom.envKpi(ctx, "rifiuti_recupero");
    if (!tot && !rec) return null;
    return [tot && `Rifiuti totali: ${fmtNumber(tot)} kg`, rec && `Quota recupero: ${rec}%`].filter(Boolean).join("; ");
  },
  "308":  (ctx) => {
    const v = atom.socKpi(ctx, "fornitori_valutati");
    return v ? `${v} fornitori valutati su criteri ambientali` : null;
  },
  "401":  (ctx) => {
    const turn = atom.socKpi(ctx, "turnover");
    const ass = atom.socKpi(ctx, "nuove_assunzioni");
    if (!turn && !ass) return null;
    return [ass && `Nuove assunzioni: ${ass}`, turn && `Turnover: ${turn}%`].filter(Boolean).join("; ");
  },
  "403":  (ctx) => {
    const tf = atom.socKpi(ctx, "tasso_frequenza");
    const tg = atom.socKpi(ctx, "tasso_gravita");
    if (!tf && !tg) return null;
    return [tf && `TF: ${tf}`, tg && `TG: ${tg}`].filter(Boolean).join("; ");
  },
  "404":  (ctx) => {
    const ore = atom.socKpi(ctx, "ore_formazione");
    return ore ? `Ore formazione pro-capite: ${ore}` : null;
  },
  "405":  (ctx) => {
    const f = atom.socKpi(ctx, "donne_percentuale");
    const m = atom.socKpi(ctx, "donne_management");
    if (!f && !m) return null;
    return [f && `% donne totali: ${f}`, m && `% donne management: ${m}`].filter(Boolean).join("; ");
  },
  "414":  (ctx) => {
    const v = atom.socKpi(ctx, "fornitori_valutati");
    return v ? `${v} fornitori valutati su criteri sociali` : null;
  },
  "418":  (ctx) => {
    const breach = atom.govKpi(ctx, "data_breach");
    return breach ? `Data breach: ${breach}` : ctx.forms?.["04E"]?.privacy || null;
  },
};

// ─── Estrattori ESRS (16) ───────────────────────────────────────────
export const ESRS_EXTRACTORS = {
  "ESRS 2 BP-1":  (ctx) => atom.perimetroOrganizzativo(ctx),
  "ESRS 2 BP-2":  (ctx) => atom.riformulazioni(ctx),
  "ESRS 2 GOV-1": (ctx) => GRI_EXTRACTORS["2-9"](ctx),
  "ESRS 2 GOV-2": (ctx) => atom.governanceReport(ctx),
  "ESRS 2 GOV-3": (ctx) => {
    const v = atom.govKpi(ctx, "ceo_remunerazione_esg");
    return v ? `${v}% remunerazione CEO legata a ESG` : null;
  },
  "ESRS 2 SBM-1": (ctx) => atom.modelloBusiness(ctx) || atom.visioneEsg(ctx),
  "ESRS 2 SBM-2": (ctx) => atom.engagementStakeholder(ctx),
  "ESRS 2 SBM-3": (ctx) => atom.temiMateriali(ctx),
  "ESRS 2 IRO-1": (ctx) => atom.metodoMaterialita(ctx),
  "ESRS 2 IRO-2": (ctx) => atom.temiMateriali(ctx),
  "ESRS E1":      (ctx) => GRI_EXTRACTORS["305"](ctx) || GRI_EXTRACTORS["302"](ctx),
  "ESRS E3":      (ctx) => GRI_EXTRACTORS["303"](ctx),
  "ESRS E5":      (ctx) => GRI_EXTRACTORS["306"](ctx),
  "ESRS S1":      (ctx) => GRI_EXTRACTORS["2-7"](ctx),
  "ESRS S2":      (ctx) => GRI_EXTRACTORS["414"](ctx) || GRI_EXTRACTORS["204"](ctx),
  "ESRS G1":      (ctx) => GRI_EXTRACTORS["205"](ctx),
};

// ─── Funzioni "extract all" ─────────────────────────────────────────
/** Mappa tutte le 33 GRI → { code: value|null } */
export function extractAllGri(ctx) {
  const out = {};
  for (const g of GRI_DISCLOSURES) {
    const fn = GRI_EXTRACTORS[g.code];
    out[g.code] = fn ? fn(ctx) : null;
  }
  return out;
}

/** Mappa tutti i 16 ESRS → { code: value|null } */
export function extractAllEsrs(ctx) {
  const out = {};
  for (const e of ESRS_DATAPOINTS) {
    const fn = ESRS_EXTRACTORS[e.code];
    out[e.code] = fn ? fn(ctx) : null;
  }
  return out;
}

// ─── Loader: costruisce ctx leggendo da Supabase ────────────────────
// Usato sia dal frontend (via supabase client) che dall'Edge Function (admin).
//
// Riceve un client Supabase e l'engagementId. Restituisce ctx pronto.
export async function loadEngagementContext(supabase, engagementId) {
  const [engRes, formsRes, iroRes] = await Promise.all([
    supabase
      .from("engagements")
      .select("*, clienti(*)")
      .eq("id", engagementId)
      .maybeSingle(),
    supabase
      .from("form_data")
      .select("form_code, status, data")
      .eq("engagement_id", engagementId),
    supabase
      .from("iro_engagement")
      .select("*")
      .eq("engagement_id", engagementId)
      .order("area")
      .order("codice"),
  ]);

  if (engRes.error) throw engRes.error;
  if (formsRes.error) throw formsRes.error;
  if (iroRes.error) throw iroRes.error;

  const engagement = engRes.data;
  const cliente = engagement?.clienti ?? null;

  const forms = {};
  for (const f of formsRes.data ?? []) {
    forms[f.form_code] = f.data ?? {};
  }

  return {
    engagement,
    cliente,
    forms,
    iro: iroRes.data ?? [],
  };
}
