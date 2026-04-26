-- ═══════════════════════════════════════════════════════════════════
-- ESG NEXUS — Storage buckets + RLS policies
--   - engagement-docs : private, owner via engagement.user_id, path = {user_id}/{engagement_id}/...
--   - avatars         : public-read, owner per-user, path = {user_id}/...
--   - exports         : private, owner per-user, path = {user_id}/...
-- ═══════════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('engagement-docs', 'engagement-docs', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

-- ─── engagement-docs policies ────────────────────────────────────────
-- Path convention: {auth.uid()}/{engagement_id}/{filename}
-- Validates that the first path segment matches the caller's auth.uid()
-- AND that the engagement is owned by the caller.

DROP POLICY IF EXISTS "engagement_docs_select" ON storage.objects;
CREATE POLICY "engagement_docs_select" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'engagement-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM engagements
      WHERE engagements.id::text = (storage.foldername(name))[2]
        AND engagements.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "engagement_docs_insert" ON storage.objects;
CREATE POLICY "engagement_docs_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'engagement-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM engagements
      WHERE engagements.id::text = (storage.foldername(name))[2]
        AND engagements.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "engagement_docs_update" ON storage.objects;
CREATE POLICY "engagement_docs_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'engagement-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "engagement_docs_delete" ON storage.objects;
CREATE POLICY "engagement_docs_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'engagement-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─── avatars policies ────────────────────────────────────────────────
-- Public read; authenticated users may upload only under their own folder.

DROP POLICY IF EXISTS "avatars_public_select" ON storage.objects;
CREATE POLICY "avatars_public_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_owner_insert" ON storage.objects;
CREATE POLICY "avatars_owner_insert" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "avatars_owner_update" ON storage.objects;
CREATE POLICY "avatars_owner_update" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
CREATE POLICY "avatars_owner_delete" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─── exports policies ────────────────────────────────────────────────
-- Private, per-user folder.

DROP POLICY IF EXISTS "exports_owner_all" ON storage.objects;
CREATE POLICY "exports_owner_all" ON storage.objects FOR ALL
  USING (
    bucket_id = 'exports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'exports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
