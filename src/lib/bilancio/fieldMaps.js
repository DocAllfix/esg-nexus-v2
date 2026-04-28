/**
 * Field maps per il Generatore Bilancio.
 *
 * Centralizza in UN UNICO POSTO la traduzione tra:
 *  - chiavi tecniche dei form (s01, e02, g03, scope1[], pilastri...)
 *  - chiavi semantiche degli standard (GRI 2-7, ESRS S1, etc.)
 *
 * Questo è il punto di contatto tra il dominio dati ESG Nexus
 * e gli standard internazionali di rendicontazione.
 *
 * Quando aggiungi un KPI o cambia un nome di chiave nei form,
 * aggiorna QUI il mapping. Nessun altro file ha dipendenze dirette
 * sui nomi delle chiavi.
 */

// ─── KPI mapping: ID tecnico → semantica ────────────────────────────
// Estratti da Form04C (E), Form04D (S), Form04E (G).
// La proprietà `.N` dell'oggetto kpi_data[id] contiene il valore
// dell'anno corrente; `.N1` l'anno precedente.

export const KPI_S = {
  // Occupazione
  s01: { semantic: "headcount",                label: "Dipendenti totali (FTE)" },
  s02: { semantic: "donne_percentuale",        label: "% donne sul totale" },
  s03: { semantic: "donne_management",         label: "% donne in posizioni manageriali" },
  s04: { semantic: "donne_csuite",             label: "% donne in C-suite" },
  s05: { semantic: "tempo_indeterminato",      label: "Dipendenti tempo indeterminato" },
  s06: { semantic: "tempo_determinato",        label: "Dipendenti tempo determinato" },
  s07: { semantic: "part_time",                label: "Dipendenti part-time" },
  s08: { semantic: "nuove_assunzioni",         label: "Nuove assunzioni totali" },
  s09: { semantic: "cessazioni_volontarie",    label: "Cessazioni volontarie" },
  s10: { semantic: "turnover",                 label: "Tasso turnover totale" },
  s11: { semantic: "lavoratori_disabili",      label: "Lavoratori con disabilità" },
  s12: { semantic: "interinali",               label: "Lavoratori interinali" },
  // Salute & sicurezza
  s13: { semantic: "ore_lavorate",             label: "Ore lavorate totali" },
  s14: { semantic: "infortuni_n",              label: "N. infortuni" },
  s15: { semantic: "tasso_frequenza",          label: "Tasso Frequenza (TF)" },
  s16: { semantic: "infortuni_assenza",        label: "N. infortuni con assenza > 1gg" },
  s17: { semantic: "giorni_persi",             label: "Giorni persi per infortuni" },
  s18: { semantic: "tasso_gravita",            label: "Tasso Gravità (TG)" },
  s19: { semantic: "malattie_professionali",   label: "Malattie professionali" },
  s20: { semantic: "tasso_assenteismo",        label: "Tasso assenteismo" },
  s21: { semantic: "infortuni_mortali",        label: "Infortuni mortali" },
  // Formazione
  s22: { semantic: "ore_formazione_totali",    label: "Ore formazione totali" },
  s23: { semantic: "ore_formazione",           label: "Ore formazione pro-capite" },
  s24: { semantic: "ore_formazione_donne",     label: "Ore formazione pro-capite donne" },
  s25: { semantic: "ore_formazione_uomini",    label: "Ore formazione pro-capite uomini" },
  s26: { semantic: "spesa_formazione",         label: "Spesa formazione (€)" },
  s27: { semantic: "perc_dipendenti_formati",  label: "% dipendenti formati" },
  // Remunerazione
  s28: { semantic: "retribuzione_donne",       label: "Retribuzione lorda media (F)" },
  s29: { semantic: "retribuzione_uomini",      label: "Retribuzione lorda media (M)" },
  s30: { semantic: "gender_pay_gap_jr",        label: "Gender pay gap junior" },
  s31: { semantic: "gender_pay_gap_sr",        label: "Gender pay gap senior" },
  s32: { semantic: "ceo_pay_ratio",            label: "CEO pay ratio" },
  // Supply chain
  s33: { semantic: "fornitori_totali",         label: "N. fornitori totali" },
  s34: { semantic: "fornitori_valutati",       label: "N. fornitori valutati ESG" },
  s35: { semantic: "fornitori_qualificati",    label: "N. fornitori qualificati ESG" },
  s36: { semantic: "investimenti_comunita",    label: "Investimenti comunità (€)" },
  s37: { semantic: "reclami_ricevuti",         label: "Reclami clienti ricevuti" },
  s38: { semantic: "reclami_risolti",          label: "Reclami clienti risolti" },
};

export const KPI_E = {
  // Energia
  e01: { semantic: "energia_totale",           label: "Consumo energetico totale (GJ)" },
  e02: { semantic: "energia_elettrica",        label: "Consumo elettrico" },
  e03: { semantic: "energia_termica",          label: "Consumo termico" },
  e04: { semantic: "rinnovabile",              label: "Quota rinnovabile" },
  e05: { semantic: "intensita_energetica",     label: "Intensità energetica" },
  // GHG (sintesi — il dettaglio per voce sta in Form04B JSONB scope1[]/scope2_mb[]/scope3[])
  e06: { semantic: "scope1_totale",            label: "Emissioni Scope 1 (tCO2e)" },
  e07: { semantic: "scope2_mb_totale",         label: "Emissioni Scope 2 market-based" },
  e08: { semantic: "scope2_lb_totale",         label: "Emissioni Scope 2 location-based" },
  e09: { semantic: "scope3_totale",            label: "Emissioni Scope 3" },
  e10: { semantic: "intensita_carbonica",      label: "Intensità carbonica" },
  // Acqua
  e11: { semantic: "prelievo_idrico",          label: "Prelievo idrico totale (m³)" },
  e12: { semantic: "scarichi_idrici",          label: "Scarichi idrici" },
  e13: { semantic: "ricircolo_acqua",          label: "Ricircolo acqua" },
  // Rifiuti
  e14: { semantic: "rifiuti_totali",           label: "Rifiuti totali (kg)" },
  e15: { semantic: "rifiuti_pericolosi",       label: "Rifiuti pericolosi" },
  e16: { semantic: "rifiuti_recupero",         label: "Quota recupero" },
  e17: { semantic: "rifiuti_smaltimento",      label: "Quota smaltimento" },
  // Materiali
  e18: { semantic: "materiali_riciclati",      label: "Materiali riciclati in input" },
  e19: { semantic: "imballaggi_riciclabili",   label: "Imballaggi riciclabili" },
  e20: { semantic: "biodiversita_aree",        label: "Aree protette adiacenti" },
};

export const KPI_G = {
  g01: { semantic: "cda_membri",               label: "N. membri CdA" },
  g02: { semantic: "cda_indipendenti",         label: "% consiglieri indipendenti" },
  g03: { semantic: "cda_donne",                label: "% consiglieri donne" },
  g04: { semantic: "cda_riunioni",             label: "N. riunioni CdA" },
  g05: { semantic: "cda_eta_media",            label: "Età media consiglieri" },
  g06: { semantic: "modello_231",              label: "Modello 231 adottato" },
  g07: { semantic: "odv_riunioni",             label: "N. riunioni OdV" },
  g08: { semantic: "whistleblowing_segn",      label: "Segnalazioni whistleblowing" },
  g09: { semantic: "whistleblowing_chiuse",    label: "Segnalazioni chiuse/risolte" },
  g10: { semantic: "data_breach",              label: "Data breach" },
  g11: { semantic: "sanzioni_n",               label: "N. sanzioni ricevute" },
  g12: { semantic: "sanzioni_importo",         label: "Importo sanzioni (€)" },
  g13: { semantic: "imposte_pagate",           label: "Imposte pagate (€)" },
  g14: { semantic: "tax_rate",                 label: "Tax rate effettivo" },
  g15: { semantic: "compliance_audit",         label: "Audit compliance condotti" },
  g16: { semantic: "anticorruzione_train",     label: "Dipendenti formati anticorruzione (%)" },
  g17: { semantic: "ceo_remunerazione_esg",    label: "% remunerazione CEO legata a ESG" },
};

// Reverse lookup: dato il nome semantico, trova l'ID tecnico.
function buildReverse(map) {
  const r = {};
  for (const [id, def] of Object.entries(map)) r[def.semantic] = id;
  return r;
}
export const KPI_S_BY_SEMANTIC = buildReverse(KPI_S);
export const KPI_E_BY_SEMANTIC = buildReverse(KPI_E);
export const KPI_G_BY_SEMANTIC = buildReverse(KPI_G);

/**
 * Helper: legge un KPI semantico dal kpi_data di un form.
 * @param {object} kpiData - contenuto di form_data.data.kpi_data
 * @param {object} reverseMap - es. KPI_S_BY_SEMANTIC
 * @param {string} semanticName - es. "headcount"
 * @returns {string|null} valore N (anno corrente) o null
 */
export function readKpi(kpiData, reverseMap, semanticName) {
  if (!kpiData) return null;
  const id = reverseMap[semanticName];
  if (!id) return null;
  const v = kpiData[id]?.N;
  return v === "" || v === null || v === undefined ? null : v;
}

// ─── GRI Disclosures (33) — definizione + extractor ──────────────────
// Ogni extractor riceve `ctx` (vedi extractors.js loadContext) e ritorna
// stringa, oggetto serializzabile o null. Un extractor null = "Mancante".

export const GRI_DISCLOSURES = [
  { code: "2-1",  title: "Dettagli organizzativi",                       chapter: "profilo" },
  { code: "2-2",  title: "Entità incluse nel reporting",                 chapter: "metodologia" },
  { code: "2-3",  title: "Periodo di rendicontazione",                   chapter: "metodologia" },
  { code: "2-4",  title: "Riformulazione di informazioni",               chapter: "metodologia" },
  { code: "2-5",  title: "Assurance esterna",                            chapter: "metodologia" },
  { code: "2-6",  title: "Attività, catena del valore",                  chapter: "profilo" },
  { code: "2-7",  title: "Dipendenti",                                   chapter: "persone" },
  { code: "2-9",  title: "Struttura e composizione governance",          chapter: "governance" },
  { code: "2-12", title: "Ruolo del massimo organo di governo",          chapter: "governance" },
  { code: "2-13", title: "Delega responsabilità impatti",                chapter: "governance" },
  { code: "2-14", title: "Ruolo nel reporting di sostenibilità",         chapter: "governance" },
  { code: "2-22", title: "Dichiarazione strategia di sviluppo",          chapter: "strategia" },
  { code: "2-23", title: "Impegni di policy",                            chapter: "strategia" },
  { code: "2-24", title: "Integrazione impegni di policy",               chapter: "strategia" },
  { code: "2-29", title: "Approccio engagement stakeholder",             chapter: "stakeholder" },
  { code: "3-1",  title: "Processo determinazione temi",                 chapter: "materialita" },
  { code: "3-2",  title: "Lista dei temi materiali",                     chapter: "materialita" },
  { code: "3-3",  title: "Gestione dei temi materiali",                  chapter: "materialita" },
  { code: "204",  title: "Pratiche di approvvigionamento",               chapter: "catena" },
  { code: "205",  title: "Anticorruzione",                               chapter: "condotta" },
  { code: "206",  title: "Comportamento anticoncorrenziale",             chapter: "condotta" },
  { code: "207",  title: "Imposte",                                      chapter: "condotta" },
  { code: "302",  title: "Energia",                                      chapter: "clima" },
  { code: "303",  title: "Acqua e scarichi idrici",                      chapter: "risorse" },
  { code: "305",  title: "Emissioni GHG",                                chapter: "clima" },
  { code: "306",  title: "Rifiuti",                                      chapter: "risorse" },
  { code: "308",  title: "Valutazione ambientale fornitori",             chapter: "catena" },
  { code: "401",  title: "Occupazione",                                  chapter: "persone" },
  { code: "403",  title: "Salute e sicurezza sul lavoro",                chapter: "persone" },
  { code: "404",  title: "Formazione e istruzione",                      chapter: "persone" },
  { code: "405",  title: "Diversità e pari opportunità",                 chapter: "persone" },
  { code: "414",  title: "Valutazione sociale dei fornitori",            chapter: "catena" },
  { code: "418",  title: "Privacy dei clienti",                          chapter: "condotta" },
];

// ─── ESRS Datapoints (16) — definizione ─────────────────────────────
export const ESRS_DATAPOINTS = [
  { code: "ESRS 2 BP-1",  title: "Basi per la preparazione",                        area: "Generale",   chapter: "metodologia" },
  { code: "ESRS 2 BP-2",  title: "Disclosure su circostanze specifiche",            area: "Generale",   chapter: "metodologia" },
  { code: "ESRS 2 GOV-1", title: "Ruolo organi di amministrazione",                 area: "Governance", chapter: "governance" },
  { code: "ESRS 2 GOV-2", title: "Informazioni fornite agli organi",                area: "Governance", chapter: "governance" },
  { code: "ESRS 2 GOV-3", title: "Integrazione performance ESG in remunerazione",   area: "Governance", chapter: "governance" },
  { code: "ESRS 2 SBM-1", title: "Strategia, modello di business",                  area: "Strategia",  chapter: "strategia" },
  { code: "ESRS 2 SBM-2", title: "Interessi e opinioni stakeholder",                area: "Strategia",  chapter: "stakeholder" },
  { code: "ESRS 2 SBM-3", title: "IRO materiali e modello di business",             area: "Strategia",  chapter: "materialita" },
  { code: "ESRS 2 IRO-1", title: "Processo identificazione IRO materiali",          area: "Materialità", chapter: "materialita" },
  { code: "ESRS 2 IRO-2", title: "Disclosure coperte dal report",                   area: "Materialità", chapter: "materialita" },
  { code: "ESRS E1",      title: "Cambiamento climatico",                           area: "Ambiente",   chapter: "clima" },
  { code: "ESRS E3",      title: "Risorse idriche e marine",                        area: "Ambiente",   chapter: "risorse" },
  { code: "ESRS E5",      title: "Uso risorse ed economia circolare",               area: "Ambiente",   chapter: "risorse" },
  { code: "ESRS S1",      title: "Forza lavoro propria",                            area: "Sociale",    chapter: "persone" },
  { code: "ESRS S2",      title: "Lavoratori catena del valore",                    area: "Sociale",    chapter: "catena" },
  { code: "ESRS G1",      title: "Condotta aziendale",                              area: "Governance", chapter: "condotta" },
];

// ─── 15 capitoli del bilancio ───────────────────────────────────────
export const CHAPTERS = [
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
