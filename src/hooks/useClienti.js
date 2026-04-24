import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

export function useClienti() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['clienti'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clienti')
        .select('*')
        .order('ragione_sociale', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase
        .from('clienti')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clienti'] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data, error } = await supabase
        .from('clienti')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['clienti'] });
      qc.invalidateQueries({ queryKey: ['cliente', vars.id] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('clienti').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clienti'] }),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    create,
    update,
    remove,
  };
}

export function useCliente(id) {
  return useQuery({
    queryKey: ['cliente', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clienti')
        .select('*, contatti_cliente(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
