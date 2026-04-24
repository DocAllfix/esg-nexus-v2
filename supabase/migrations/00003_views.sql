-- ═══════════════════════════════════════════════════════════════════
-- ESG NEXUS — Views
-- ═══════════════════════════════════════════════════════════════════

-- ─── v_engagement_summary ────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_engagement_summary AS
SELECT
  e.id,
  e.user_id,
  e.codice_progetto,
  e.anno_rendicontazione,
  e.standard,
  e.stato,
  e.progresso,
  e.data_avvio,
  e.data_fine_prevista,
  e.budget_contrattuale,
  c.ragione_sociale AS cliente_nome,
  c.settore         AS cliente_settore,
  COUNT(DISTINCT fd.id) FILTER (WHERE fd.status = 'completato') AS form_completati,
  COUNT(DISTINCT fd.id)                                          AS form_totali,
  COUNT(DISTINCT s.id)  FILTER (WHERE s.stato = 'pending' AND s.data_scadenza <= CURRENT_DATE + 14) AS scadenze_imminenti
FROM engagements e
JOIN clienti c ON c.id = e.cliente_id
LEFT JOIN form_data fd ON fd.engagement_id = e.id
LEFT JOIN scadenze s   ON s.engagement_id  = e.id
GROUP BY e.id, c.ragione_sociale, c.settore;

-- ─── v_ghg_totali ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_ghg_totali AS
SELECT
  engagement_id,
  scope,
  SUM(co2e_tonnellate) AS totale_co2e_t,
  COUNT(*)             AS num_voci
FROM ghg_voci
WHERE co2e_tonnellate IS NOT NULL
GROUP BY engagement_id, scope;

-- ─── v_kpi_dashboard ─────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_kpi_dashboard AS
SELECT
  engagement_id,
  area,
  COUNT(*)                                                      AS num_kpi,
  COUNT(*) FILTER (WHERE valore_attuale IS NOT NULL)            AS kpi_compilati,
  COUNT(*) FILTER (WHERE valore_target IS NOT NULL
                     AND valore_attuale IS NOT NULL
                     AND valore_attuale >= valore_target)       AS kpi_target_raggiunti
FROM kpi_valori
GROUP BY engagement_id, area;

-- ─── v_fatturato_annuo ───────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_fatturato_annuo AS
SELECT
  e.user_id,
  EXTRACT(YEAR FROM f.data_fattura)::integer AS anno,
  SUM(f.importo_cent) / 100.0               AS fatturato_eur,
  COUNT(DISTINCT e.id)                       AS num_engagement
FROM fatturazioni f
JOIN engagements e ON e.id = f.engagement_id
WHERE f.stato IN ('emessa', 'pagata')
  AND f.data_fattura IS NOT NULL
GROUP BY e.user_id, EXTRACT(YEAR FROM f.data_fattura);
