import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

const FASI_TEMPLATE = [
  { codice: 'PROC-00', label: 'Acquisizione', ordine: 0 },
  { codice: 'PROC-01', label: 'Avvio', ordine: 1 },
  { codice: 'PROC-02', label: 'Materialità', ordine: 2 },
  { codice: 'PROC-03', label: 'Gap Analysis', ordine: 3 },
  { codice: 'PROC-04', label: 'Dati GHG', ordine: 4 },
  { codice: 'PROC-05', label: 'Piano Azione', ordine: 5 },
  { codice: 'PROC-06', label: 'Bilancio', ordine: 6 },
  { codice: 'PROC-07', label: 'Chiusura', ordine: 7 },
];

export function useEngagements() {
  return useQuery({
    queryKey: ['engagements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagements')
        .select('*, clienti(ragione_sociale, settore)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useEngagement(id) {
  return useQuery({
    queryKey: ['engagement', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagements')
        .select('*, clienti(*), engagement_fasi(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data: eng, error } = await supabase
        .from('engagements')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;

      const fasi = FASI_TEMPLATE.map((f) => ({
        engagement_id: eng.id,
        codice: f.codice,
        label: f.label,
        ordine: f.ordine,
        stato: 'non_iniziato',
      }));
      const { error: fasiError } = await supabase
        .from('engagement_fasi')
        .insert(fasi);
      if (fasiError) throw fasiError;

      return eng;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['engagements'] }),
  });
}

export function useUpdateEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data, error } = await supabase
        .from('engagements')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['engagements'] });
      qc.invalidateQueries({ queryKey: ['engagement', vars.id] });
    },
  });
}

export function useDeleteEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('engagements').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['engagements'] }),
  });
}
