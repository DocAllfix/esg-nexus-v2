import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

export function useScadenze(engagementId) {
  return useQuery({
    queryKey: ['scadenze', engagementId ?? 'all'],
    queryFn: async () => {
      let q = supabase
        .from('scadenze')
        .select('*')
        .order('data_scadenza', { ascending: true });
      if (engagementId) q = q.eq('engagement_id', engagementId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useScadenzeImminenti() {
  return useQuery({
    queryKey: ['scadenze_imminenti'],
    queryFn: async () => {
      const today = new Date();
      const in14 = new Date();
      in14.setDate(today.getDate() + 14);
      const toISO = (d) => d.toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from('scadenze')
        .select('*, engagements(codice_progetto, clienti(ragione_sociale))')
        .eq('stato', 'pending')
        .gte('data_scadenza', toISO(today))
        .lte('data_scadenza', toISO(in14))
        .order('data_scadenza', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateScadenza() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase
        .from('scadenze')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['scadenze'] });
      qc.invalidateQueries({ queryKey: ['scadenze_imminenti'] });
    },
  });
}

export function useCompleteScadenza() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('scadenze')
        .update({ stato: 'completata' })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['scadenze'] });
      qc.invalidateQueries({ queryKey: ['scadenze_imminenti'] });
    },
  });
}

export function useDeleteScadenza() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('scadenze').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['scadenze'] });
      qc.invalidateQueries({ queryKey: ['scadenze_imminenti'] });
    },
  });
}
