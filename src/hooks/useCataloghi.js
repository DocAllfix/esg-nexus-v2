import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

// catalogo_iro and kpi_definizioni are read-only for any authenticated user
// (RLS: catalog_read policy). No mutations exposed — these tables are
// seeded by migrations and should only be modified via versioned SQL.

export function useCatalogoIro() {
  return useQuery({
    queryKey: ['catalogo_iro'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('catalogo_iro')
        .select('*')
        .order('codice', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 30,
  });
}

export function useKpiDefinizioni() {
  return useQuery({
    queryKey: ['kpi_definizioni'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_definizioni')
        .select('*')
        .order('area', { ascending: true })
        .order('code', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 30,
  });
}
