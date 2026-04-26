import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

export function useIroEngagement(engagementId) {
  return useQuery({
    queryKey: ['iro_engagement', engagementId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('iro_engagement')
        .select('*')
        .eq('engagement_id', engagementId)
        .order('area')
        .order('codice');
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!engagementId,
  });
}

export function useAddIroFromCatalog(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (catalogItems) => {
      const rows = catalogItems.map(item => ({
        engagement_id: engagementId,
        catalogo_iro_id: item.id,
        codice: item.codice,
        tema: item.tema,
        area: item.area,
        tipo: item.tipo,
        materialita_impatto: null,
        materialita_finanziaria: null,
        incluso: true,
      }));
      const { error } = await supabase.from('iro_engagement').insert(rows);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['iro_engagement', engagementId] }),
  });
}

export function useUpdateIroScore(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, field, value }) => {
      const { error } = await supabase
        .from('iro_engagement')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['iro_engagement', engagementId] }),
  });
}

export function useDeleteIro(engagementId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('iro_engagement').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['iro_engagement', engagementId] }),
  });
}
