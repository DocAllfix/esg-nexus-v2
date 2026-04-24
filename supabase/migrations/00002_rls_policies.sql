-- ═══════════════════════════════════════════════════════════════════
-- ESG NEXUS — RLS Policies (17 tables, ZERO delegations)
-- Fix SEC-004: explicit RLS on ALL tables
-- Fix REM-002: added 6 missing tables (scadenze, azioni_giorno,
--              eventi_log, milestone, capitoli_bilancio, fatturazioni)
-- ═══════════════════════════════════════════════════════════════════

-- ─── users_profile ───────────────────────────────────────────────────────────
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_select ON users_profile FOR SELECT USING (id = auth.uid());
CREATE POLICY owner_update ON users_profile FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ─── clienti ─────────────────────────────────────────────────────────────────
ALTER TABLE clienti ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_all ON clienti FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ─── contatti_cliente (via clienti) ──────────────────────────────────────────
ALTER TABLE contatti_cliente ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_cliente ON contatti_cliente FOR ALL
  USING (EXISTS (SELECT 1 FROM clienti WHERE clienti.id = contatti_cliente.cliente_id AND clienti.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM clienti WHERE clienti.id = contatti_cliente.cliente_id AND clienti.user_id = auth.uid()));

-- ─── engagements ─────────────────────────────────────────────────────────────
ALTER TABLE engagements ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_all ON engagements FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ─── engagement_fasi (via engagements) ───────────────────────────────────────
ALTER TABLE engagement_fasi ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON engagement_fasi FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = engagement_fasi.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = engagement_fasi.engagement_id AND engagements.user_id = auth.uid()));

-- ─── form_data (via engagements) ─────────────────────────────────────────────
ALTER TABLE form_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON form_data FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = form_data.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = form_data.engagement_id AND engagements.user_id = auth.uid()));

-- ─── rischi (has user_id) ────────────────────────────────────────────────────
ALTER TABLE rischi ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_all ON rischi FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ─── catalogo_iro (read-only catalog) ────────────────────────────────────────
ALTER TABLE catalogo_iro ENABLE ROW LEVEL SECURITY;
CREATE POLICY catalog_read ON catalogo_iro FOR SELECT USING (auth.role() = 'authenticated');

-- ─── iro_engagement (via engagements) ────────────────────────────────────────
ALTER TABLE iro_engagement ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON iro_engagement FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = iro_engagement.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = iro_engagement.engagement_id AND engagements.user_id = auth.uid()));

-- ─── ghg_voci (via engagements) ──────────────────────────────────────────────
ALTER TABLE ghg_voci ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON ghg_voci FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = ghg_voci.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = ghg_voci.engagement_id AND engagements.user_id = auth.uid()));

-- ─── kpi_valori (via engagements) ────────────────────────────────────────────
ALTER TABLE kpi_valori ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON kpi_valori FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = kpi_valori.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = kpi_valori.engagement_id AND engagements.user_id = auth.uid()));

-- ═══ FIX REM-002: 6 tabelle mancanti — ora ESPLICITE ════════════════════════

-- ─── scadenze (via engagements) ──────────────────────────────────────────────
ALTER TABLE scadenze ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON scadenze FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = scadenze.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = scadenze.engagement_id AND engagements.user_id = auth.uid()));

-- ─── azioni_giorno (has user_id) ─────────────────────────────────────────────
ALTER TABLE azioni_giorno ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_all ON azioni_giorno FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ─── eventi_log (has user_id) ────────────────────────────────────────────────
ALTER TABLE eventi_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_all ON eventi_log FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ─── milestone (via engagements) ─────────────────────────────────────────────
ALTER TABLE milestone ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON milestone FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = milestone.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = milestone.engagement_id AND engagements.user_id = auth.uid()));

-- ─── capitoli_bilancio (via engagements) ─────────────────────────────────────
ALTER TABLE capitoli_bilancio ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON capitoli_bilancio FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = capitoli_bilancio.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = capitoli_bilancio.engagement_id AND engagements.user_id = auth.uid()));

-- ─── fatturazioni (via engagements) ──────────────────────────────────────────
ALTER TABLE fatturazioni ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON fatturazioni FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = fatturazioni.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = fatturazioni.engagement_id AND engagements.user_id = auth.uid()));

-- ─── kpi_definizioni (read-only catalog) ─────────────────────────────────────
ALTER TABLE kpi_definizioni ENABLE ROW LEVEL SECURITY;
CREATE POLICY catalog_read ON kpi_definizioni FOR SELECT USING (auth.role() = 'authenticated');
