-- ═══════════════════════════════════════════════════════════════════
-- ESG NEXUS — Migration 00009: Tabella bilanci + Storage bucket
-- ─────────────────────────────────────────────────────────────────────
-- Persistenza versioni del Bilancio di Sostenibilità generate per ogni
-- engagement. Il file (HTML/PDF/DOCX) finisce in Supabase Storage.
-- Allineata ai pattern esistenti: RLS via_eng, trigger updated_at.
-- Framework values allineati a engagements.standard.
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE bilanci (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id          uuid NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  versione               text NOT NULL DEFAULT 'R1',           -- R1, R2, R3, R4 ...
  framework              text NOT NULL CHECK (framework IN ('GRI', 'CSRD_ESRS', 'ENTRAMBI')),
  stato                  text NOT NULL DEFAULT 'BOZZA'
                           CHECK (stato IN ('BOZZA', 'GENERAZIONE_IN_CORSO', 'REVISIONE', 'APPROVATO', 'PUBBLICATO')),
  generated_at           timestamptz,
  generated_by_user_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  pdf_path               text,
  html_path              text,
  docx_path              text,
  copertura_gri          integer CHECK (copertura_gri BETWEEN 0 AND 100),
  copertura_esrs         integer CHECK (copertura_esrs BETWEEN 0 AND 100),
  capitoli_inclusi       text[],
  warnings               jsonb NOT NULL DEFAULT '[]',
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (engagement_id, versione)
);
CREATE INDEX idx_bilanci_eng ON bilanci(engagement_id);

-- Trigger updated_at — pattern identico a 00005_triggers.sql
CREATE TRIGGER set_updated_at_bilanci
  BEFORE UPDATE ON bilanci
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS — pattern via_eng (identico ad altre 9 tabelle figlie)
ALTER TABLE bilanci ENABLE ROW LEVEL SECURITY;
CREATE POLICY via_eng ON bilanci FOR ALL
  USING (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = bilanci.engagement_id AND engagements.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM engagements WHERE engagements.id = bilanci.engagement_id AND engagements.user_id = auth.uid()));

-- ─── STORAGE BUCKET 'bilanci' ───────────────────────────────────────
-- Path convention: {engagement_id}/{versione}/{file}
-- Solo l'owner dell'engagement può read/write.
INSERT INTO storage.buckets (id, name, public)
VALUES ('bilanci', 'bilanci', false)
ON CONFLICT (id) DO NOTHING;

-- Policies sullo Storage object level:
-- la prima cartella del path è l'engagement_id (UUID).
-- Confronto: storage.foldername(name) restituisce array, [1] è la prima.
CREATE POLICY "bilanci_read_own"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'bilanci'
    AND EXISTS (
      SELECT 1 FROM engagements
      WHERE engagements.id::text = (storage.foldername(name))[1]
        AND engagements.user_id = auth.uid()
    )
  );

CREATE POLICY "bilanci_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'bilanci'
    AND EXISTS (
      SELECT 1 FROM engagements
      WHERE engagements.id::text = (storage.foldername(name))[1]
        AND engagements.user_id = auth.uid()
    )
  );

CREATE POLICY "bilanci_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'bilanci'
    AND EXISTS (
      SELECT 1 FROM engagements
      WHERE engagements.id::text = (storage.foldername(name))[1]
        AND engagements.user_id = auth.uid()
    )
  );

CREATE POLICY "bilanci_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'bilanci'
    AND EXISTS (
      SELECT 1 FROM engagements
      WHERE engagements.id::text = (storage.foldername(name))[1]
        AND engagements.user_id = auth.uid()
    )
  );
