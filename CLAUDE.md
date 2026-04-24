# CLAUDE.md — ESG Nexus Project Configuration v3.0

## Project Overview

ESG Nexus is a sustainability reporting management tool built with React + Supabase.

Stack: React 18 + Vite, Supabase (PostgreSQL, Auth, Realtime, Edge Functions, Storage),
TanStack Query v5, shadcn/ui + Tailwind, Recharts, React Router v6, zod.

## Architecture Rules

- NEVER import from @/mock/ — all data comes from Supabase via hooks in src/hooks/
- NEVER use localStorage for form data — use useFormData hook with Supabase persistence
- NEVER expose service_role key in code or migrations — use anon key + RLS only
- ALWAYS use optional chaining (?.) when accessing nested data from hooks
- ALWAYS add loading/error states: if (isLoading) return <Skeleton />; if (error) return <ErrorState />
- ALWAYS wrap pages with <DataGuard data={data} isLoading={isLoading} error={error}>

## RLS Policy Pattern

For tables with user_id column:

  ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
  CREATE POLICY owner_select ON table_name FOR SELECT USING (user_id = auth.uid());
  CREATE POLICY owner_insert ON table_name FOR INSERT WITH CHECK (user_id = auth.uid());
  CREATE POLICY owner_update ON table_name FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  CREATE POLICY owner_delete ON table_name FOR DELETE USING (user_id = auth.uid());

For child tables (join to parent with user_id):

  CREATE POLICY child_all ON child_table FOR ALL
    USING (EXISTS (SELECT 1 FROM parent_table WHERE parent_table.id = child_table.parent_id AND parent_table.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM parent_table WHERE parent_table.id = child_table.parent_id AND parent_table.user_id = auth.uid()));

For reference/catalog tables (read-only for all authenticated):

  CREATE POLICY catalog_read ON catalog_table FOR SELECT USING (auth.role() = 'authenticated');

## Hook Pattern

Every hook in src/hooks/ follows this structure:

  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { supabase } from '@/api/supabaseClient';

  export function useEntity(id?) {
    return useQuery({ queryKey: ['entity', id], queryFn: async () => { ... } });
  }

## Form Component Pattern

Every Form component (Form00A through Form07G):

  1. Accepts { engagementId } as prop
  2. Uses: const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, 'XXA');
  3. Renders FormWrapper with status, onStatusChange, onSave, isSaving props
  4. Uses d?.fieldName (optional chaining) for all data access
  5. Uses onChange={v => updateField('fieldName', v)} for all mutations

## TabProc Index Pattern

Each TabProc index (TabProc00/ through TabProc07/):

  1. Accepts { engagementId } as prop
  2. Uses: const { statuses, progresso } = useFormStatuses(engagementId, 'PROC-XX');
  3. Passes engagementId to each child form component

## File Structure

  src/api/supabaseClient.js    — Supabase client (throws on missing env)
  src/hooks/                    — All data access hooks
  src/schemas/                  — Zod validation schemas
  src/pages/                    — Route-level components
  src/components/engagement/    — TabProc and Form components
  src/components/common/        — DataGuard, FormWrapper, etc.
  supabase/migrations/          — SQL migration files (6 files)
  supabase/functions/           — Edge Functions

## Commit Convention: feat|fix|refactor|chore(scope): description

## Validation: Use zod schemas. Validate before Supabase upsert. Show inline errors.
