-- ═══════════════════════════════════════════════════════════════════
-- ESG NEXUS — Auto-generate codice_progetto on engagement INSERT
--
-- Format: ESG-{anno_rendicontazione}-{SIGLA_3CHARS_CLIENTE}-{NNN}
-- Example: ESG-2026-ACM-001
--
-- Race-safe via pg_advisory_xact_lock keyed on the prefix hash.
-- Two concurrent inserts with the same (anno, sigla) pair serialize
-- on the lock; different pairs proceed in parallel.
--
-- The function is SECURITY DEFINER + SET search_path = '' to:
--   - bypass RLS when reading clienti (caller may be authenticated role
--     which already has SELECT but we want explicit, predictable behavior)
--   - mitigate search_path injection
--
-- Caller can bypass auto-gen by setting NEW.codice_progetto explicitly
-- (e.g. for data migration / import).
-- ═══════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.generate_codice_progetto()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_sigla  text;
  v_prefix text;
  v_max    int;
BEGIN
  IF NEW.codice_progetto IS NOT NULL AND NEW.codice_progetto <> '' THEN
    RETURN NEW;
  END IF;

  SELECT UPPER(LPAD(LEFT(REGEXP_REPLACE(ragione_sociale, '[^a-zA-Z]', '', 'g'), 3), 3, 'X'))
    INTO v_sigla
    FROM public.clienti
   WHERE id = NEW.cliente_id;

  IF v_sigla IS NULL THEN
    RAISE EXCEPTION 'generate_codice_progetto: cliente not found for id %', NEW.cliente_id;
  END IF;

  v_prefix := 'ESG-' || NEW.anno_rendicontazione || '-' || v_sigla || '-';

  -- Serialize concurrent inserts that would compete for the same prefix.
  -- Lock is held until end of transaction.
  PERFORM pg_advisory_xact_lock(hashtextextended(v_prefix, 0));

  SELECT COALESCE(
           MAX(NULLIF(REGEXP_REPLACE(SUBSTRING(codice_progetto FROM LENGTH(v_prefix) + 1), '\D', '', 'g'), '')::int),
           0
         )
    INTO v_max
    FROM public.engagements
   WHERE codice_progetto LIKE v_prefix || '%';

  NEW.codice_progetto := v_prefix || LPAD((v_max + 1)::text, 3, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS engagements_auto_codice ON public.engagements;
CREATE TRIGGER engagements_auto_codice
  BEFORE INSERT ON public.engagements
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_codice_progetto();

-- Backfill missing FK indexes flagged by audit
CREATE INDEX IF NOT EXISTS idx_iro_engagement_catalogo ON public.iro_engagement(catalogo_iro_id);
CREATE INDEX IF NOT EXISTS idx_azioni_giorno_eng       ON public.azioni_giorno(engagement_id);
