import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

const FASI_TEMPLATE = [
  { proc_code: 'PROC-00', label: 'Acquisizione' },
  { proc_code: 'PROC-01', label: 'Avvio' },
  { proc_code: 'PROC-02', label: 'Materialità' },
  { proc_code: 'PROC-03', label: 'Gap Analysis' },
  { proc_code: 'PROC-04', label: 'Dati GHG' },
  { proc_code: 'PROC-05', label: 'Piano Azione' },
  { proc_code: 'PROC-06', label: 'Bilancio' },
  { proc_code: 'PROC-07', label: 'Chiusura' },
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
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const userId = userData.user?.id;
      if (!userId) throw new Error('Utente non autenticato');

      const { data: eng, error } = await supabase
        .from('engagements')
        .insert({ ...payload, user_id: userId })
        .select()
        .single();
      if (error) throw error;

      const fasi = FASI_TEMPLATE.map((f) => ({
        engagement_id: eng.id,
        proc_code: f.proc_code,
        label: f.label,
        stato: 'non_iniziata',
      }));
      const { error: fasiError } = await supabase
        .from('engagement_fasi')
        .insert(fasi);
      if (fasiError) throw fasiError;

      return eng;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['engagements'] });
      qc.invalidateQueries({ queryKey: ['engagements_with_fasi'] });
    },
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
