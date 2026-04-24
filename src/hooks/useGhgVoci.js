import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

export function useGhgVoci(engagementId) {
  return useQuery({
    queryKey: ['ghg_voci', engagementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ghg_voci')
        .select('*')
        .eq('engagement_id', engagementId)
        .order('scope', { ascending: true });
      if (error) throw error;
      const rows = data ?? [];
      const byScope = rows.reduce((acc, r) => {
        const key = String(r.scope);
        if (!acc[key]) acc[key] = [];
        acc[key].push(r);
        return acc;
      }, {});
      return { rows, byScope };
    },
    enabled: !!engagementId,
  });
}

export function useCreateGhgVoce(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase
        .from('ghg_voci')
        .insert({ ...payload, engagement_id: engagementId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ghg_voci', engagementId] });
      qc.invalidateQueries({ queryKey: ['ghg_totali', engagementId] });
    },
  });
}

export function useUpdateGhgVoce(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data, error } = await supabase
        .from('ghg_voci')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ghg_voci', engagementId] });
      qc.invalidateQueries({ queryKey: ['ghg_totali', engagementId] });
    },
  });
}

export function useDeleteGhgVoce(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('ghg_voci').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ghg_voci', engagementId] });
      qc.invalidateQueries({ queryKey: ['ghg_totali', engagementId] });
    },
  });
}

export function useGhgTotali(engagementId) {
  return useQuery({
    queryKey: ['ghg_totali', engagementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_ghg_totali')
        .select('*')
        .eq('engagement_id', engagementId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!engagementId,
  });
}
