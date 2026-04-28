/**
 * Generatore di bozze per i capitoli del bilancio.
 *
 * Per ogni capitolo CHAPTERS, una funzione che produce una bozza
 * narrativa basata sui dati estratti dal ctx.
 *
 * Output: stringa Markdown-light (paragrafi separati da \n\n,
 * **bold** supportato dal renderer in BilancioPreview).
 *
 * Se il capitolo è già stato editato manualmente dall'utente
 * (form_data 08F[chapterId].body), il suo testo override sostituisce
 * questa bozza al momento del rendering.
 */

import { atom } from "./extractors";

// Sostituisce {{denominazione}}, {{anno_N}}, {{periodo}}, {{contatto}}
export function fillPlaceholders(text, ctx, identificazione = {}) {
  if (!text) return "";
  const denom = identificazione.denominazione || atom.ragioneSociale(ctx) || "L'organizzazione";
  const anno  = identificazione.anno_rendicontazione || ctx.engagement?.anno_rendicontazione || "—";
  const periodo = identificazione.periodo || atom.periodoRendicontazione(ctx);
  const codice = identificazione.codice_bilancio || ctx.engagement?.codice_progetto || "";
  const contatto = identificazione.contatto || "Sustainability Manager";
  return text
    .replace(/\{\{denominazione\}\}/g, denom)
    .replace(/\{\{anno_N\}\}/g, anno)
    .replace(/\{\{periodo\}\}/g, periodo)
    .replace(/\{\{codice_bilancio\}\}/g, codice)
    .replace(/\{\{contatto\}\}/g, contatto);
}

const F = (n) => Number(n).toLocaleString("it-IT", { maximumFractionDigits: 2 });

const CHAPTER_GENERATORS = {
  lettera: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione;
    const visione = atom.visioneEsg(ctx);
    return `Cari stakeholder,

sono lieto di presentarvi il Bilancio di Sostenibilità ${anno} di ${denom}, frutto di un percorso strutturato di analisi, raccolta dati e definizione strategica condotto secondo gli standard internazionali di rendicontazione.

${visione
  ? "La nostra visione di sostenibilità: " + visione
  : "Il documento descrive il nostro impegno in ambito ambientale, sociale e di governance, con dati misurati e validati."}

Buona lettura.

Il Presidente / CEO`;
  },

  profilo: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione;
    const settore = atom.settore(ctx);
    const ateco = atom.ateco(ctx);
    const sedi = atom.sediOperative(ctx);
    const dip = atom.dipendenti(ctx);
    const fatt = atom.fatturato(ctx);
    const fw = ctx.engagement?.standard;
    const fwLabel = fw === "ENTRAMBI" ? "GRI Standards e ESRS" : fw === "CSRD_ESRS" ? "ESRS / CSRD" : "GRI Standards";

    let txt = `${denom} è un'organizzazione`;
    if (settore) txt += ` attiva nel settore ${settore}`;
    if (ateco) txt += ` (ATECO ${ateco})`;
    txt += `.`;
    if (sedi) txt += `\n\n**Perimetro operativo:** ${sedi}.`;
    if (dip) txt += ` Al 31 dicembre ${anno} l'organizzazione contava **${F(dip)} dipendenti**.`;
    if (fatt) txt += ` Il fatturato di esercizio ${anno} è stato pari a **${F(fatt)} €**.`;
    txt += `\n\nQuesto bilancio descrive l'impatto di ${denom} nell'ambito della sostenibilità ambientale, sociale e di governance, secondo il framework ${fwLabel}.`;
    return txt;
  },

  governance: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione;
    const m = atom.govKpi(ctx, "cda_membri");
    const ind = atom.govKpi(ctx, "cda_indipendenti");
    const donne = atom.govKpi(ctx, "cda_donne");
    const riun = atom.govKpi(ctx, "cda_riunioni");
    const mod231 = atom.govKpi(ctx, "modello_231") || ctx.forms?.["04E"]?.modello_231;

    let txt = `La governance della sostenibilità di ${denom} è strutturata per garantire l'integrazione dei temi ESG nelle decisioni strategiche.`;
    if (m) {
      txt += `\n\n**Composizione CdA ${anno}:** ${m} consiglieri`;
      if (ind) txt += `, di cui ${ind}% indipendenti`;
      if (donne) txt += `, presenza femminile pari al ${donne}%`;
      txt += `.`;
    }
    if (riun) txt += ` Nel ${anno} il CdA si è riunito **${riun} volte**.`;
    if (mod231) {
      txt += `\n\n**Modello 231:** ${mod231 === true ? "adottato" : mod231}. Organismo di Vigilanza con riporto diretto al CdA.`;
    }
    txt += `\n\nLa responsabilità degli aspetti ESG è coordinata da un Sustainability Manager interno che relaziona periodicamente al top management e supporta il CdA nell'approvazione del Piano di Azione ESG e del presente Bilancio.`;
    return txt;
  },

  strategia: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const visione = atom.visioneEsg(ctx);
    const mission = atom.missionEsg(ctx);
    const pilastri = atom.pilastriStrategici(ctx);
    const policy = atom.policyImpegni(ctx);
    const integr = atom.integrazionePolicy(ctx);

    let txt = `La strategia di sostenibilità di ${denom} integra responsabilità ambientale, valore sociale e governance trasparente nel modello di business.`;
    if (visione) txt += `\n\n**Vision ESG:** ${visione}`;
    if (mission) txt += `\n\n**Mission ESG:** ${mission}`;
    if (pilastri) txt += `\n\n**Pilastri strategici:**\n${pilastri}`;
    if (policy) txt += `\n\n**Impegni di policy:** ${policy}`;
    if (integr) txt += `\n\n**Integrazione operativa:** ${integr}`;
    return txt;
  },

  materialita: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const metodo = atom.metodoMaterialita(ctx);
    const temi = atom.temiMateriali(ctx);
    const stake = atom.engagementStakeholder(ctx);

    let txt = `L'analisi di materialità di ${denom} è stata condotta secondo l'approccio della **doppia materialità** (ESRS) — considerando sia gli impatti dell'organizzazione sull'ambiente e sulle persone, sia gli impatti finanziari di rischi e opportunità ESG.`;
    if (metodo) txt += `\n\n**Metodologia:** ${metodo}`;
    if (stake) txt += `\n\n**Coinvolgimento stakeholder:** ${stake}`;
    if (temi) txt += `\n\n**Temi materiali identificati:**\n${temi}`;
    return txt;
  },

  stakeholder: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione;
    const mappa = ctx.forms?.["02B"]?.mappa_stakeholder;
    const interna = ctx.forms?.["02E"]?.risposte;
    const esterna = ctx.forms?.["02F"]?.risposte;

    let txt = `${denom} ha identificato e mappato i propri stakeholder secondo criteri di influenza e dipendenza, in linea con l'AA1000 Stakeholder Engagement Standard.`;
    if (mappa) txt += `\n\n**Categorie di stakeholder identificate:** ${mappa}`;
    if (interna || esterna) {
      txt += `\n\n**Engagement ${anno}:**`;
      if (interna) txt += `\n- Stakeholder interni: ${interna}`;
      if (esterna) txt += `\n- Stakeholder esterni: ${esterna}`;
    }
    return txt;
  },

  clima: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione;
    const s1 = atom.scope1Total(ctx);
    const s2 = atom.scope2MbTotal(ctx);
    const s3 = atom.scope3Total(ctx);
    const energia = atom.envKpi(ctx, "energia_totale");
    const ren = atom.envKpi(ctx, "rinnovabile");

    let txt = `${denom} monitora le proprie emissioni di gas serra (GHG) secondo il **GHG Protocol Corporate Standard** e calcola annualmente le emissioni Scope 1, 2 e 3 rilevanti.`;
    if (s1 || s2 || s3) {
      txt += `\n\n**Inventario emissioni ${anno} (tCO2e):**`;
      if (s1) txt += `\n- Scope 1 (combustione diretta, fuggitive): **${s1}**`;
      if (s2) txt += `\n- Scope 2 (energia elettrica acquistata, market-based): **${s2}**`;
      if (s3) txt += `\n- Scope 3 (catena del valore): **${s3}**`;
    }
    if (energia) txt += `\n\n**Consumi energetici ${anno}:** ${F(energia)} GJ`;
    if (ren) txt += `\n**Quota da fonti rinnovabili:** ${ren}%`;
    return txt;
  },

  risorse: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione;
    const acqua = atom.envKpi(ctx, "prelievo_idrico");
    const rifiuti = atom.envKpi(ctx, "rifiuti_totali");
    const recupero = atom.envKpi(ctx, "rifiuti_recupero");

    let txt = `Le politiche di ${denom} sull'uso efficiente delle risorse e sull'economia circolare seguono il principio gerarchico della **prevenzione, riduzione, riuso, riciclo e smaltimento**.`;
    if (acqua) txt += `\n\n**Acqua:** prelievo idrico ${anno} pari a ${F(acqua)} m³.`;
    if (rifiuti) {
      txt += `\n\n**Rifiuti ${anno}:** produzione totale **${F(rifiuti)} kg**`;
      if (recupero) txt += `, di cui inviati a recupero il ${recupero}%`;
      txt += `.`;
    }
    return txt;
  },

  persone: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione;
    const head = atom.dipendenti(ctx);
    const donne = atom.socKpi(ctx, "donne_percentuale");
    const formaz = atom.socKpi(ctx, "ore_formazione");
    const tf = atom.socKpi(ctx, "tasso_frequenza");
    const tg = atom.socKpi(ctx, "tasso_gravita");
    const turn = atom.socKpi(ctx, "turnover");
    const gpgJr = atom.socKpi(ctx, "gender_pay_gap_jr");

    let txt = `Le persone sono il primo asset di ${denom}. Le politiche HR si fondano su **rispetto dei diritti**, **parità di genere**, **formazione continua** e **tutela della salute e sicurezza**.`;
    txt += `\n\n**Composizione organico ${anno}:**`;
    if (head) txt += `\n- Dipendenti totali: **${F(head)}**`;
    if (donne) txt += `\n- Quota femminile: **${donne}%**`;
    if (formaz) txt += `\n- Ore di formazione pro-capite: **${formaz}**`;
    if (tf || tg) {
      txt += `\n\n**Salute e sicurezza:**`;
      if (tf) txt += `\n- Tasso di Frequenza infortuni: ${tf}`;
      if (tg) txt += `\n- Tasso di Gravità: ${tg}`;
    }
    if (turn) txt += `\n\n**Turnover ${anno}:** ${turn}%`;
    if (gpgJr) txt += `\n**Gender pay gap (livello junior):** ${gpgJr}%`;
    return txt;
  },

  catena: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione;
    const tot = atom.socKpi(ctx, "fornitori_totali");
    const val = atom.socKpi(ctx, "fornitori_valutati");
    const qual = atom.socKpi(ctx, "fornitori_qualificati");

    let txt = `${denom} promuove pratiche di **approvvigionamento responsabile** e applica criteri ESG nella selezione e valutazione dei fornitori.`;
    if (tot) txt += `\n\n**Base fornitori ${anno}:** ${tot} fornitori totali.`;
    if (val) txt += ` Valutati con criteri ESG: ${val}`;
    if (qual) txt += `, qualificati: ${qual}`;
    if (val) txt += `.`;
    return txt;
  },

  condotta: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const anno = ident.anno_rendicontazione || ctx.engagement?.anno_rendicontazione;
    const mod231 = ctx.forms?.["04E"]?.modello_231 || atom.govKpi(ctx, "modello_231");
    const ws = atom.govKpi(ctx, "whistleblowing_segn");
    const sanz = atom.govKpi(ctx, "sanzioni_n");
    const breach = atom.govKpi(ctx, "data_breach");
    const tax = atom.govKpi(ctx, "imposte_pagate");

    let txt = `**Integrità e trasparenza** sono pilastri della cultura aziendale di ${denom}.`;
    if (mod231) txt += `\n\n**Modello 231:** ${typeof mod231 === "boolean" ? "adottato" : mod231}.`;
    if (ws) txt += `\n**Sistema whistleblowing ${anno}:** ${ws} segnalazioni ricevute.`;
    if (sanz) txt += `\n**Sanzioni ${anno}:** ${sanz}.`;
    if (breach) txt += `\n**Data breach ${anno}:** ${breach}.`;
    if (tax) txt += `\n**Imposte ${anno}:** ${F(tax)} €.`;
    return txt;
  },

  piano: (ctx, ident) => {
    const denom = ident.denominazione || atom.ragioneSociale(ctx);
    const obj = atom.pianoObiettivi(ctx);
    const oriz = atom.pianoOrizzonte(ctx);
    const budget = atom.pianoBudget(ctx);

    let txt = `Il **Piano di Azione ESG** di ${denom} definisce gli obiettivi quantitativi e qualitativi di sostenibilità e la roadmap delle iniziative per raggiungerli.`;
    if (oriz) txt += `\n\n**Orizzonte temporale del Piano:** ${oriz}`;
    if (obj) txt += `\n\n**Obiettivi SMART:** ${obj}`;
    if (budget) txt += `\n\n**Budget ESG:** ${budget}`;
    return txt;
  },

  kpi: () => null, // generato come tabella in BilancioPreview, non come testo

  metodologia: (ctx, ident) => {
    const periodo = atom.periodoRendicontazione(ctx);
    const perimetro = atom.perimetroOrganizzativo(ctx);
    const fw = ctx.engagement?.standard;
    const fwLabel = fw === "ENTRAMBI" ? "GRI Standards e ESRS / CSRD" : fw === "CSRD_ESRS" ? "ESRS / CSRD" : "GRI Standards";
    const contatto = ident.contatto || "Sustainability Manager";

    let txt = `Il presente Bilancio di Sostenibilità è stato redatto secondo gli standard **${fwLabel}**.`;
    txt += `\n\n**Periodo di rendicontazione:** ${periodo}.`;
    if (perimetro) txt += `\n**Perimetro:** ${perimetro}.`;
    txt += `\n\n**Metodologia di calcolo:** i dati quantitativi sono stati raccolti dai sistemi gestionali interni (HR, contabilità energetica, gestione rifiuti, payroll, registro infortuni). Le emissioni GHG sono calcolate secondo il GHG Protocol Corporate Standard utilizzando fattori di emissione ufficiali (ISPRA, DEFRA, IEA).`;
    txt += `\n\n**Validazione interna:** il dataset è stato sottoposto a controlli di completezza, plausibilità e coerenza interna prima del data freeze.`;
    txt += `\n\n**Punto di contatto:** ${contatto}.`;
    return txt;
  },

  index: () => null, // generato come tabella GRI/ESRS in BilancioPreview
};

/**
 * Genera la bozza testuale di un capitolo.
 * @param {string} chapterId
 * @param {object} ctx
 * @param {object} ident - dati di identificazione (form 08A)
 * @returns {string|null}
 */
export function generateChapterDraft(chapterId, ctx, ident = {}) {
  const fn = CHAPTER_GENERATORS[chapterId];
  if (!fn) return null;
  try {
    return fn(ctx, ident);
  } catch (e) {
    console.error(`generateChapterDraft(${chapterId}) error:`, e);
    return null;
  }
}

/**
 * Risolve il body finale di un capitolo: override > bozza auto.
 * @param {string} chapterId
 * @param {object} chapterOverrides - form_data 08F
 * @param {object} ctx
 * @param {object} ident
 */
export function resolveChapterBody(chapterId, chapterOverrides, ctx, ident = {}) {
  const override = chapterOverrides?.[chapterId]?.body;
  if (override && override.trim()) {
    return fillPlaceholders(override, ctx, ident);
  }
  const draft = generateChapterDraft(chapterId, ctx, ident);
  return draft ? fillPlaceholders(draft, ctx, ident) : null;
}
