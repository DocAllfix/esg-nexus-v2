import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

const nextCodice = (existing) => {
  const nums = (existing ?? [])
    .map((r) => r.codice)
    .filter((c) => typeof c === 'string' && /^R\d+$/.test(c))
    .map((c) => parseInt(c.slice(1), 10));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `R${String(next).padStart(2, '0')}`;
};

export function useRischi(engagementId) {
  return useQuery({
    queryKey: ['rischi', engagementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rischi')
        .select('*')
        .eq('engagement_id', engagementId)
        .order('score', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!engagementId,
  });
}

export function useCreateRischio(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data: existing, error: selErr } = await supabase
        .from('rischi')
        .select('codice')
        .eq('engagement_id', engagementId);
      if (selErr) throw selErr;

      const codice = nextCodice(existing);
      const { data, error } = await supabase
        .from('rischi')
        .insert({ ...payload, engagement_id: engagementId, codice })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['rischi', engagementId] }),
  });
}

export function useUpdateRischio(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data, error } = await supabase
        .from('rischi')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['rischi', engagementId] }),
  });
}

export function useDeleteRischio(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('rischi').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['rischi', engagementId] }),
  });
}
