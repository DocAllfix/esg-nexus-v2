-- ═══════════════════════════════════════════════════════════════════
-- ESG NEXUS — Enable Realtime (Fix ARCH-003)
-- ═══════════════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE engagements;
ALTER PUBLICATION supabase_realtime ADD TABLE scadenze;
ALTER PUBLICATION supabase_realtime ADD TABLE azioni_giorno;
ALTER PUBLICATION supabase_realtime ADD TABLE eventi_log;
