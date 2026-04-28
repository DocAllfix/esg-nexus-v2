/**
 * Calcola la copertura del bilancio (% disclosure GRI/ESRS coperte)
 * e produce la lista warnings strutturata per il gate di validazione.
 */

import { GRI_DISCLOSURES, ESRS_DATAPOINTS } from "./fieldMaps";
import { extractAllGri, extractAllEsrs, atom } from "./extractors";

export function isFilled(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return true;
}

/**
 * Calcola la % di disclosure coperte (con extractor che torna valore non-null).
 * Tiene conto degli override manuali (form 08C/08D).
 */
export function computeCoverage(ctx, overridesGri = {}, overridesEsrs = {}) {
  const griValues = extractAllGri(ctx);
  const esrsValues = extractAllEsrs(ctx);

  const griCovered = GRI_DISCLOSURES.filter((g) => {
    return isFilled(overridesGri[g.code]) || isFilled(griValues[g.code]);
  }).length;

  const esrsCovered = ESRS_DATAPOINTS.filter((e) => {
    return isFilled(overridesEsrs[e.code]) || isFilled(esrsValues[e.code]);
  }).length;

  return {
    gri:  Math.round((griCovered / GRI_DISCLOSURES.length) * 100),
    esrs: Math.round((esrsCovered / ESRS_DATAPOINTS.length) * 100),
    griCovered,
    griTotal: GRI_DISCLOSURES.length,
    esrsCovered,
    esrsTotal: ESRS_DATAPOINTS.length,
    griValues,
    esrsValues,
  };
}

/**
 * Genera la lista di warnings/errori per il pre-generazione gate.
 * Severity: "error" (blocca capitolo), "warning" (parziale), "info" (cosmetico).
 */
export function computeWarnings(ctx, overridesGri = {}, overridesEsrs = {}) {
  const warnings = [];
  const cov = computeCoverage(ctx, overridesGri, overridesEsrs);

  // ERRORS — bloccanti per i capitoli relativi
  if (!atom.ragioneSociale(ctx)) {
    warnings.push({
      code: "RAGIONE_SOCIALE_MISSING",
      severity: "error",
      chapter: "profilo",
      message: "Ragione sociale del cliente non trovata",
    });
  }
  if (!atom.visioneEsg(ctx)) {
    warnings.push({
      code: "VISIONE_MISSING",
      severity: "error",
      chapter: "strategia",
      message: "Vision ESG non definita (Form05A)",
    });
  }
  if (!ctx.iro || ctx.iro.length === 0) {
    warnings.push({
      code: "IRO_VUOTO",
      severity: "error",
      chapter: "materialita",
      message: "Nessun IRO materiale trovato (Form02B mancante)",
    });
  } else if (ctx.iro.length < 3) {
    warnings.push({
      code: "IRO_INSUFFICIENTI",
      severity: "warning",
      chapter: "materialita",
      message: `Solo ${ctx.iro.length} IRO presenti — la matrice di materialità richiede tipicamente almeno 5-10 temi`,
    });
  }

  // WARNINGS — parziali
  if (!atom.scope1Total(ctx)) {
    warnings.push({
      code: "SCOPE1_MISSING",
      severity: "warning",
      chapter: "clima",
      message: "Inventario Scope 1 non disponibile (Form04B)",
    });
  }
  if (!atom.scope2MbTotal(ctx)) {
    warnings.push({
      code: "SCOPE2_MISSING",
      severity: "warning",
      chapter: "clima",
      message: "Inventario Scope 2 (market-based) non disponibile (Form04B)",
    });
  }
  if (!atom.scope3Total(ctx)) {
    warnings.push({
      code: "SCOPE3_MISSING",
      severity: "info",
      chapter: "clima",
      message: "Scope 3 non disponibile — opzionale ma raccomandato per CSRD",
    });
  }
  if (!atom.dipendenti(ctx)) {
    warnings.push({
      code: "HEADCOUNT_MISSING",
      severity: "warning",
      chapter: "persone",
      message: "Headcount totale non valorizzato (Form04D s01)",
    });
  }
  if (!atom.govKpi(ctx, "cda_membri")) {
    warnings.push({
      code: "CDA_MISSING",
      severity: "warning",
      chapter: "governance",
      message: "Composizione CdA non valorizzata (Form04E)",
    });
  }

  // INFO — copertura sotto soglia raccomandata
  if (cov.gri < 50) {
    warnings.push({
      code: "COPERTURA_GRI_BASSA",
      severity: "info",
      chapter: "metodologia",
      message: `Copertura GRI ${cov.gri}% (raccomandato ≥ 70%)`,
    });
  }
  if (cov.esrs < 50) {
    warnings.push({
      code: "COPERTURA_ESRS_BASSA",
      severity: "info",
      chapter: "metodologia",
      message: `Copertura ESRS ${cov.esrs}% (raccomandato ≥ 70%)`,
    });
  }

  return { warnings, coverage: cov };
}
