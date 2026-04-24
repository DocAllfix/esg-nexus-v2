-- ═══════════════════════════════════════════════════════════════════
-- ESG NEXUS — Triggers
-- ═══════════════════════════════════════════════════════════════════

-- ─── Auto-create users_profile on new auth user ───────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users_profile (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Auto-update updated_at timestamp ────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_clienti
  BEFORE UPDATE ON clienti
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_engagements
  BEFORE UPDATE ON engagements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_engagement_fasi
  BEFORE UPDATE ON engagement_fasi
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_form_data
  BEFORE UPDATE ON form_data
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_rischi
  BEFORE UPDATE ON rischi
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_iro_engagement
  BEFORE UPDATE ON iro_engagement
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_ghg_voci
  BEFORE UPDATE ON ghg_voci
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_kpi_valori
  BEFORE UPDATE ON kpi_valori
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_scadenze
  BEFORE UPDATE ON scadenze
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_azioni_giorno
  BEFORE UPDATE ON azioni_giorno
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_milestone
  BEFORE UPDATE ON milestone
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_capitoli_bilancio
  BEFORE UPDATE ON capitoli_bilancio
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_fatturazioni
  BEFORE UPDATE ON fatturazioni
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_users_profile
  BEFORE UPDATE ON users_profile
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
