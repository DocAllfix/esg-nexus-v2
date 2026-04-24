import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

export function useKpiValori(engagementId) {
  return useQuery({
    queryKey: ['kpi_valori', engagementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_valori')
        .select('*')
        .eq('engagement_id', engagementId)
        .order('area', { ascending: true });
      if (error) throw error;
      const rows = data ?? [];
      const byArea = rows.reduce((acc, r) => {
        const key = r.area ?? 'X';
        if (!acc[key]) acc[key] = [];
        acc[key].push(r);
        return acc;
      }, {});
      return { rows, byArea };
    },
    enabled: !!engagementId,
  });
}

export function useKpiDefinizioni() {
  return useQuery({
    queryKey: ['kpi_definizioni'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_definizioni')
        .select('*')
        .order('area', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpsertKpiValore(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase
        .from('kpi_valori')
        .upsert(
          { ...payload, engagement_id: engagementId },
          { onConflict: 'engagement_id,kpi_code,anno' }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['kpi_valori', engagementId] }),
  });
}

export function useDeleteKpiValore(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('kpi_valori').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['kpi_valori', engagementId] }),
  });
}
